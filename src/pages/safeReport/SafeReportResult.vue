<script setup lang="ts">
import { useRouter } from "vue-router";
import { computed, ref, onMounted } from "vue";
import { safeReportStore } from "@/stores/safeReportStore";
import ModalForm from "@/components/common/ModalForm.vue";
import ToolTip from "@/components/common/ToolTip.vue";
import Header from "@/components/layout/header/Header.vue";
import { mainRouteName } from "@/router/mainRoute";
import { useGradeCalculation } from "./composables/useGradeCalculation";
import { useTotalGradeCalculation } from "./composables/useTotalGradeCalculation";
import { useModalState } from "./composables/useModalState";
import { useIllegalBuildingStatus } from "./composables/useIllegalBuildingStatus";
import { SafeReportService } from "./services/safeReportService";
import { getFloorLabel } from "./composables/floorUtils";

const store = safeReportStore();
const emit = defineEmits(["update", "next", "prev"]);
const router = useRouter();

// 독립적인 페이지로 접근했는지 확인 (라우터를 통해 직접 접근)
const isStandalonePage = computed(() => {
  return router.currentRoute.value.name === "safeReportResult";
});

// 모달 상태 관리
const {
  showModal_financial,
  showModal_building,
  showNoDataModal,
  showNoBuildingDataModal,
  showHighRatioModal,
  resetModals,
  openNoDataModal,
  closeNoDataModal,
  openNoBuildingDataModal,
  closeNoBuildingDataModal,
  openHighRatioModal,
  closeHighRatioModal,
} = useModalState();

const isLoading = ref(true); // 로딩 상태

// 등급 계산 (깡통전세 점수 기반)
const { gradeText, gradeColor, riskText } = useGradeCalculation(() => store.resultData);

// 전체 등급 계산 (totalScore 기반)
const { totalGradeText, totalGradeColor } = useTotalGradeCalculation(() => store.safeReportData);

// 불법건축물 상태 계산
const { illegalBox } = useIllegalBuildingStatus(() => store.violationStatus);

onMounted(async () => {
  // 모달 상태 초기화
  resetModals();
  isLoading.value = true;

  // localStorage에서 데이터 확인
  const fromRecentReports = localStorage.getItem("fromRecentReports");

  if (fromRecentReports === "true") {
    // 최근 본 레포트에서 온 경우
    await loadSavedReportData();
  } else {
    // 일반적인 안심 진단 플로우 - 서버에 API 요청
    await loadReportFromAPI();
  }
});

// 저장된 리포트 데이터 로드
async function loadSavedReportData() {
  try {
    const savedData = SafeReportService.loadSavedReportData();
    if (!savedData) {
      console.error("저장된 데이터가 없습니다.");
      isLoading.value = false;
      return;
    }

    // store 초기화 (이전 데이터 제거)
    store.resetStore();

    // localStorage에서 건물 정보 로드
    const buildingInfo = SafeReportService.loadBuildingInfo();
    store.updateFormData(buildingInfo);

    // 전체 SafeReport 데이터 저장 (SafeReportResponseDto 형태로 변환)
    store.updateSafeReportData({
      rentalRatioAndBuildyear: savedData.rentalRatioAndBuildyear || undefined,
      violationStatus: savedData.violationStatus,
      floorAndPurposeList: savedData.floorAndPurposeList,
      totalScore: savedData.rentalRatioAndBuildyear?.score, // score를 totalScore로
    });

    // 전달받은 데이터로 store 업데이트
    store.updateResultData(savedData.rentalRatioAndBuildyear);

    if (savedData.violationStatus) {
      store.updateViolationStatusVO(savedData.violationStatus);
    }

    if (savedData.floorAndPurposeList) {
      store.updateFloorAndPurposeList(savedData.floorAndPurposeList);
    }

    // 데이터 유효성 검사 및 모달 표시
    const validation = SafeReportService.validateReportData(savedData);
    if (validation.hasNoData) {
      openNoDataModal();
    }
    if (validation.hasHighRatio) {
      openHighRatioModal();
    }

    // 건축물 정보가 없는 경우 모달 표시
    if (!savedData.floorAndPurposeList || savedData.floorAndPurposeList.length === 0) {
      openNoBuildingDataModal();
    }

    // localStorage 정리
    SafeReportService.clearLocalStorage();

    isLoading.value = false;
  } catch (error) {
    console.error("저장된 데이터 로드 실패:", error);
    isLoading.value = false;
  }
}

// API에서 리포트 데이터 로드
async function loadReportFromAPI() {
  try {
    const requestDto = store.createRequestDto();
    const reportData = await SafeReportService.generateSafeReport(requestDto);

    // 전체 SafeReport 데이터 저장 (SafeReportResponseDto 형태로 변환)
    store.updateSafeReportData({
      rentalRatioAndBuildyear: reportData.rentalRatioAndBuildyear || undefined,
      violationStatus: reportData.violationStatus,
      floorAndPurposeList: reportData.floorAndPurposeList,
      totalScore: reportData.rentalRatioAndBuildyear?.score, // score를 totalScore로 매핑
    });

    // 개별 데이터 업데이트
    store.updateResultData(reportData.rentalRatioAndBuildyear);

    if (reportData.violationStatus) {
      store.updateViolationStatusVO(reportData.violationStatus);
    }

    if (reportData.floorAndPurposeList) {
      store.updateFloorAndPurposeList(reportData.floorAndPurposeList);
    }

    // 데이터 유효성 검사 및 모달 표시
    const validation = SafeReportService.validateReportData(reportData);
    if (validation.hasNoData) {
      openNoDataModal();
    }
    if (validation.hasHighRatio) {
      openHighRatioModal();
    }

    // 건축물 정보가 없는 경우 모달 표시
    if (!reportData.floorAndPurposeList || reportData.floorAndPurposeList.length === 0) {
      openNoBuildingDataModal();
    }

    isLoading.value = false;
  } catch (error) {
    console.error("전송 실패: ", error);
    isLoading.value = false;
  }
}

// resUseType이 빈 문자열이 아닌 항목만 필터링
const filteredFloorAndPurposeList = computed(() => {
  if (!store.floorAndPurposeList) return [];
  return store.floorAndPurposeList.filter(
    (info) => info.resUseType && info.resUseType.trim() !== "",
  );
});

// 층별 용도 펼침/접힘 상태
const showFloorDetails = ref(false);

function goHome() {
  store.resetStore();
  router.push({ name: "homeMain" });
}

function goToSelectBudget() {
  // 예산만 초기화하고 건물 정보는 유지
  store.updateFormData({ budget: undefined });
  store.updateResultData(null);
  emit("prev");
}

function goToKB() {
  window.open("https://m.naver.com/");
}
</script>

<template>
  <!-- 독립적인 페이지로 접근했을 때만 헤더 표시 -->
  <Header v-if="isStandalonePage" :headerShowtype="mainRouteName.safeReportResult">
    <div class="mt-23">
      <img
        src="@/assets/imgs/safereport.png"
        alt="AI 안심 진단 리포트"
        class="absolute right-1 top-13/20 -translate-y-1/2 h-30"
        style="z-index: 1"
      />
    </div>
  </Header>

  <div v-if="isLoading" class="flex flex-col items-center justify-center min-h-screen">
    <div class="text-center">
      <div
        class="animate-spin rounded-full h-16 w-16 border-b-2 border-kb-yellow mx-auto mb-4"
      ></div>

      <h2 class="text-xl font-pretendard-bold text-kb-ui-01 mb-2">레포트를 생성 중입니다</h2>
      <p class="text-kb-ui-05 text-sm">잠시만 기다려주세요...</p>
    </div>
  </div>
  <div v-else>
    <!-- 메인 컨텐츠 -->
    <div>
      <section class="flex flex-col gap-9 items-center" :class="isStandalonePage ? 'mt-6' : 'mt'">
        <div class="text-center font-pretendard-bold text-xl font-medium">
          {{ store.formData.buildingName }}의 안심 진단 리포트입니다.
        </div>
        <div
          class="w-32 h-32 rounded-full flex flex-col items-center justify-center shadow-md"
          :class="totalGradeColor.bg"
        >
          <div class="flex flex-col items-center">
            <font-awesome-icon
              :icon="['fas', 'shield-halved']"
              class="mb-1 text-4xl"
              :class="totalGradeColor.text"
            />
            <span class="text-xl font-bold" :class="totalGradeColor.text">
              {{ store.safeReportData?.totalScore ?? "-" }}<span class="text-base">/10</span>
            </span>
          </div>
        </div>
        <div
          class="w-20 h-10 rounded-full flex items-center justify-center mt-2"
          :class="totalGradeColor.bg"
          style="margin-top: -1.5rem"
        >
          <span class="text-base font-semibold" :class="totalGradeColor.text">{{
            totalGradeText
          }}</span>
        </div>
      </section>

      <section class="flex justify-center gap-4 px-4 mt-6 text-center text-xs font-medium">
        <!--    박스1-->
        <div class="relative">
          <!-- 툴팁을 박스 바깥 좌측 상단에 배치 -->
          <div class="absolute -top-2 -left-2 z-10">
            <ToolTip>
              깡통전세란 전세가와 매매가가 비슷한 주택을 의미합니다. 깡통 전세의 경우우 전세 계약이
              만료된 후 세입자가<span class="text-error font-semibold"
                >전세 보증금을 돌려받기 어려울 수 있습니다.</span
              >
            </ToolTip>
          </div>

          <div
            class="flex flex-col items-center justify-center w-32 h-24 rounded"
            :class="gradeColor.bg"
          >
            <svg
              class="w-8 h-8 mb-1"
              fill="currentColor"
              viewBox="0 0 20 20"
              :class="gradeColor.text"
            >
              <path
                d="M8.257 3.099c.765-1.36 2.72-1.36 3.485 0l6.518 11.597c.75 1.336-.213 2.998-1.742 2.998H3.48c-1.529 0-2.492-1.662-1.742-2.998L8.257 3.1zM11 13a1 1 0 10-2 0 1 1 0 002 0zm-1-2a1 1 0 01-1-1V7a1 1 0 012 0v3a1 1 0 01-1 1z"
              />
            </svg>
            <span :class="gradeColor.text" class="text-base font-semibold">깡통전세</span>
            <span class="text-[11px] font-semibold" :class="gradeColor.text">{{ gradeText }}</span>
          </div>
        </div>

        <!-- 박스 2 -->
        <div
          class="flex flex-col items-center justify-center w-32 h-24 rounded"
          :class="illegalBox.bg"
        >
          <svg
            class="w-8 h-8 mb-1"
            fill="currentColor"
            viewBox="0 0 20 20"
            :class="illegalBox.text"
          >
            <path
              d="M3 2a1 1 0 011-1h12a1 1 0 011 1v15h-5v-4H8v4H3V2zm2 3v2h2V5H5zm0 4v2h2V9H5zm0 4v2h2v-2H5zm4-8v2h2V5H9zm0 4v2h2V9H9zm0 4v2h2v-2H9zm4-8v2h2V5h-2zm0 4v2h2V9h-2zm0 4v2h2v-2h-2z"
            />
          </svg>
          <span class="text-base font-semibold" :class="illegalBox.text">불법건축물</span>
          <span class="text-[11px] font-semibold" :class="illegalBox.text">{{
            illegalBox.label
          }}</span>
        </div>
      </section>

      <div class="text-base font-semibold text-left px-4 mt-6 mb-2">상세 분석 결과</div>
      <section class="px-4 mt-6 flex flex-col gap-3 text-sm">
        <div
          class="border rounded-lg px-4 py-5 flex justify-between items-center shadow-sm bg-kb-ui-11"
        >
          <span class="text-lg">재정적 안전성 분석</span>
          <font-awesome-icon
            :icon="['fas', 'fa-angle-right']"
            class="cursor-pointer"
            @click.stop="showModal_financial = true"
          />
        </div>
        <div
          class="border rounded-lg px-4 py-5 flex justify-between items-center shadow-sm bg-kb-ui-11"
        >
          <span class="text-lg">건축물 정보</span>
          <font-awesome-icon
            :icon="['fas', 'fa-angle-right']"
            class="cursor-pointer"
            @click.stop="showModal_building = true"
          />
        </div>
      </section>

      <div class="px-4 mt-8 flex flex-col gap-2">
        <button
          @click="goHome"
          class="w-full bg-kb-yellow text-kb-ui-01 py-3 rounded-lg text-lg font-semibold"
        >
          확인
        </button>
        <button
          @click="goToKB"
          class="w-full bg-kb-yellow text-kb-ui-01 py-3 rounded-lg text-lg font-semibold"
        >
          KB 금융 상품 안내
        </button>
      </div>
    </div>

    <!-- 재정적 안전성 분석 모달 -->
    <ModalForm
      v-if="showModal_financial"
      title="재정적 안전성 분석"
      :handle-confirm="() => ({ success: true, message: '확인되었습니다.' })"
      @close="showModal_financial = false"
    >
      <div v-if="store.resultData?.dealAmount === 0">
        <p class="text-center text-kb-ui-02">
          해당 건물은 매매 거래 내역이 존재하지 않아<br />
          재정적 안전성 분석 정보를 제공할 수 없습니다.
        </p>
      </div>
      <div v-else>
        <p>예산 금액 {{ store.formData.budget }}만원에 기반하여 분석한 결과는 다음과 같습니다.</p>
        <p class="mt-4">
          {{ store.formData.buildingName }}의 최근 거래 가격은
          {{ store.resultData?.dealAmount }}만원 입니다. 이에 따라 역전세율은
          {{
            store.resultData?.reverseRentalRatio != null &&
            !isNaN(Number(store.resultData.reverseRentalRatio))
              ? Number(store.resultData.reverseRentalRatio).toFixed(2)
              : "-"
          }}%이며 깡통 전세 위험 점수는 {{ store.resultData?.score }}/10점 입니다. 이 수치는
          <span :class="gradeColor.text + ' font-bold'">{{ gradeText }}</span> 구간으로 평가되며
          <span :class="gradeColor.text + ' font-bold'">{{ riskText }}</span>
        </p>
      </div>
    </ModalForm>

    <!-- 건축물 정보 모달 -->
    <ModalForm
      v-if="showModal_building"
      title="건축물 정보"
      :handle-confirm="() => ({ success: true, message: '확인되었습니다.' })"
      @close="
        () => {
          showModal_building = false;
          showFloorDetails = false;
        }
      "
    >
      <div v-if="store.floorAndPurposeList && store.floorAndPurposeList.length">
        <!-- 위반건축물 여부 섹션 -->
        <div class="flex justify-between items-center py-3 border-b border-kb-ui-09">
          <span class="text-kb-ui-02 font-medium">위반건축물등록여부</span>
          <span
            :class="
              store.violationStatus === '위반건축물'
                ? 'text-error font-semibold'
                : 'text-positive font-semibold'
            "
          >
            {{ store.violationStatus === "위반건축물" ? "위반건축물" : "정상건축물" }}
          </span>
        </div>

        <!-- 건축년도 섹션 -->
        <div class="flex justify-between items-center py-3 border-b border-kb-ui-09">
          <span class="text-kb-ui-02 font-medium">건축년도</span>
          <span class="text-positive font-semibold">
            {{ store.resultData?.buildYear ? `${store.resultData.buildYear}년` : "정보 없음" }}
          </span>
        </div>

        <!-- 층별 용도 섹션 -->
        <div class="py-3">
          <div
            class="flex justify-between items-center cursor-pointer"
            @click="showFloorDetails = !showFloorDetails"
          >
            <span class="text-ui-02 font-medium">층별 용도</span>
            <div class="flex items-center">
              <span class="text-positive font-semibold mr-2">
                {{
                  filteredFloorAndPurposeList.length > 0
                    ? `${filteredFloorAndPurposeList.length}개 층`
                    : "정보 없음"
                }}
              </span>
              <font-awesome-icon
                :icon="['fas', 'chevron-down']"
                class="text-kb-ui-05 transition-transform duration-200"
                :class="{ 'rotate-180': showFloorDetails }"
              />
            </div>
          </div>

          <!-- 펼쳐진 층별 용도 상세 정보 -->
          <div v-if="showFloorDetails" class="mt-3 pl-4 border-l-2 border-kb-ui-09">
            <div class="flex items-center mb-3">
              <span class="text-sm text-kb-ui-02">층별 용도 정보</span>
              <div class="ml-2 relative">
                <ToolTip>
                  <div class="max-w-[180px] text-xs">
                    주거용이 아닌 층의 경우 전입 신고를 못 하거나 확정일자를 받을 수 없습니다.
                    <span class="text-error font-semibold"
                      >주택임대차보호법 적용에서도 제외될 가능성이 높으니 거래에 조심하세요!</span
                    >
                  </div>
                </ToolTip>
              </div>
            </div>
            <div v-if="filteredFloorAndPurposeList.length > 0">
              <div
                v-for="(info, idx) in filteredFloorAndPurposeList"
                :key="idx"
                class="mb-2 text-sm"
              >
                <span class="font-medium">{{ getFloorLabel(info.resFloor) }}:</span>
                <span class="text-kb-ui-02">{{
                  info.resUseType?.endsWith("(") ? info.resUseType.slice(0, -1) : info.resUseType
                }}</span>
              </div>
            </div>
            <div v-else class="text-center text-kb-ui-02 text-sm">층별 용도 정보가 없습니다.</div>
          </div>
        </div>
      </div>
      <div v-else class="text-center text-kb-ui-02">건축물 정보가 없습니다.</div>
    </ModalForm>

    <!-- 매매 거래 내역역 없음 모달 -->
    <ModalForm
      v-if="showNoDataModal"
      title="매매 거래 내역 없음"
      :handle-confirm="() => ({ success: true, message: '' })"
      @close="closeNoDataModal"
    >
      <div class="text-center">
        <div class="mb-4">
          <svg
            class="mx-auto h-12 w-12 text-kb-ui-05"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6-4h6m2 5.291A7.962 7.962 0 0112 15c-2.34 0-4.47-.881-6.08-2.33"
            />
          </svg>
        </div>
        <p class="text-medium text-kb-ui-02">
          해당 건물은 매매 거래 내역이 존재하지 않습니다.<br />
          건축물 정보만을 기반으로 산출한 안심 점수입니다.<br />
          참고 바랍니다.
        </p>
      </div>
    </ModalForm>

    <!-- 건축물 정보 없음 모달 -->
    <ModalForm
      v-if="showNoBuildingDataModal"
      title="건축물 정보 없음"
      :handle-confirm="() => ({ success: true, message: '' })"
      @close="closeNoBuildingDataModal"
    >
      <div class="text-center">
        <div class="mb-4">
          <svg
            class="mx-auto h-12 w-12 text-kb-ui-05"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6-4h6m2 5.291A7.962 7.962 0 0112 15c-2.34 0-4.47-.881-6.08-2.33"
            />
          </svg>
        </div>
        <p class="text-medium text-kb-ui-02">
          해당 건물은 건축물 대장 정보가 없습니다.<br />
          거래 내역 정보만을 기반으로 산출한 안심 점수입니다.<br />
          참고 바랍니다.
        </p>
      </div>
    </ModalForm>

    <!-- 전세가율 높음 모달 -->
    <ModalForm
      v-if="showHighRatioModal"
      title="전세가율 초과"
      :has-confirm-btn="false"
      :handle-confirm="() => ({ success: true, message: '' })"
      @close="closeHighRatioModal"
    >
      <div class="text-center">
        <div class="mb-4">
          <svg
            class="mx-auto h-12 w-12 text-orange-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
            />
          </svg>
        </div>
        <p class="text-sm text-kb-ui-04 mb-6">
          전세가율이 100%를 초과했습니다.<br />
          입력하신 예산 금액이 현실적인지 다시 확인해 주세요.
        </p>
        <button
          @click="goToSelectBudget"
          class="w-full bg-kb-yellow text-kb-ui-01 py-3 rounded-lg text-lg font-semibold"
        >
          예산 재입력
        </button>
      </div>
    </ModalForm>
  </div>
</template>
<style scoped></style>
