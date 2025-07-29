<script setup lang="ts">
import { useRouter } from "vue-router";
import { computed, ref, onMounted } from "vue"; // onMounted 추가
import { safeReportStore } from "@/stores/safeReportStore";
import axios from "axios";
import ModalForm from "@/components/common/ModalForm.vue";

interface ResultData {
  dealAmount: number;
  buildYear: number;
  reverse_rental_ratio: number;
  score: number;
}

const store = safeReportStore();

// 구조분해할당 제거 - 반응성 유지
const router = useRouter();
const showModal_financial = ref(false);
const showModal_building = ref(false);
const showNoDataModal = ref(false); // 데이터 없음 모달 추가
const isLoading = ref(true); // 로딩 상태 추가

// dealAmount가 0인지 체크하는 computed
const isNoData = computed(() => {
  return store.resultData?.dealAmount === 0;
});

const gradeText = computed(() => {
  if (!store.resultData || typeof store.resultData.score !== "number") return "-";
  if (store.resultData.score >= 8) return "위험";
  if (store.resultData.score >= 5) return "주의";
  if (store.resultData.score >= 3) return "안전";
  return "매우 안전";
});

const gradeColor = computed(() => {
  if (!store.resultData || typeof store.resultData.score !== "number") {
    return {
      bg: "bg-gray-100",
      text: "text-gray-400",
      label: "-",
    };
  }
  if (store.resultData.score >= 8) {
    return {
      bg: "bg-red-100",
      text: "text-red-600",
      label: "위험",
    };
  } else if (store.resultData.score >= 5) {
    return {
      bg: "bg-orange-100",
      text: "text-orange-500",
      label: "주의",
    };
  } else if (store.resultData.score >= 3) {
    return {
      bg: "bg-yellow-100",
      text: "text-yellow-600",
      label: "안전",
    };
  } else {
    return {
      bg: "bg-blue-100",
      text: "text-blue-600",
      label: "매우 안전",
    };
  }
});

const riskText = computed(() => {
  if (gradeText.value === "위험" || gradeText.value === "주의") {
    return "보증금 회수에 대한 리스크가 있습니다.";
  } else if (gradeText.value === "안전" || gradeText.value === "매우 안전") {
    return "보증금 회수에 대한 리스크가 없습니다.";
  }
  return "";
});

onMounted(async () => {
  // 이전 데이터 초기화
  store.updateResultData(null);
  store.updateViolationStatus(null);
  store.updateFloorAndPurposeList(null);
  isLoading.value = true;

  try {
    console.log("보낼 데이터", { ...store.formData });
    const response = await axios.post("/api/report/requestData", { ...store.formData });
    console.log("서버 응답:", response.data);

    // 새로운 업데이트 메서드 사용
    store.updateResultData(response.data.data.rentalRatioAndBuildyear);

    // 새로운 구조에 맞게 수정
    if (response.data.data.violationStatus) {
      store.updateViolationStatusVO(response.data.data.violationStatus);
    }

    if (response.data.data.floorAndPurposeList) {
      store.updateFloorAndPurposeList(response.data.data.floorAndPurposeList);
    }

    // dealAmount가 0인지 체크
    if (response.data.data.rentalRatioAndBuildyear?.dealAmount === 0) {
      showNoDataModal.value = true;
    }

    console.log("저장된 resultData:", store.resultData);
    console.log("저장된 violationStatus:", store.violationStatus);
    console.log("저장된 floorAndPurposeList:", store.floorAndPurposeList);
    console.log("resultData.score:", store.resultData?.score);
    console.log("resultData.buildYear:", store.resultData?.buildYear);

    isLoading.value = false;
  } catch (error) {
    console.error("전송 실패: ", error);
    isLoading.value = false;
  }
});

// 기존 함수들은 그대로 유지
function goHome() {
  router.push({ name: "homeMain" });
}
function goToKB() {
  window.open("https://m.naver.com/");
}

// 박스2(불법건축물) 색상 및 텍스트 동적 처리
const illegalBox = computed(() => {
  const status = store.violationStatus;
  // 조회 불가
  if (status === null || status === undefined) {
    return {
      bg: 'bg-gray-200',
      text: 'text-gray-500',
      label: '조회 불가',
    };
  }
  // 위험 (위반건축물)
  if (status === '위반건축물') {
    return {
      bg: 'bg-red-100',
      text: 'text-red-600',
      label: '있음',
    };
  }
  // 안전 (빈 문자열이거나 다른 값)
  return {
    bg: 'bg-green-100',
    text: 'text-green-700',
    label: '없음',
  };
});
</script>

<template>
  <div v-if="isLoading" class="flex flex-col items-center justify-center min-h-screen">
    <div class="text-center">
      <!-- 로딩 스피너 -->
      <div
        class="animate-spin rounded-full h-16 w-16 border-b-2 border-kb-yellow mx-auto mb-4"
      ></div>

      <!-- 로딩 메시지 -->
      <h2 class="text-xl font-pretendard-bold text-kb-ui-01 mb-2">레포트를 생성 중입니다</h2>
      <p class="text-kb-ui-05 text-sm">잠시만 기다려주세요...</p>
    </div>
  </div>
  <div v-else>
    <!-- 회색 처리된 메인 컨텐츠 -->
    <div :class="{ 'opacity-50 pointer-events-none': isNoData }">
      <section class="flex flex-col gap-9 items-center mt">
        <div class="text-center font-pretendard-bold text-lg foont-semibold">
          {{ store.formData.buildingName }}의 안심 진단 리포트입니다.
        </div>
        <div
          class="w-32 h-32 rounded-full flex flex-col items-center justify-center shadow-md"
          :class="gradeColor.bg"
        >
          <div class="flex flex-col items-center">
            <font-awesome-icon
              :icon="['fas', 'shield-halved']"
              class="mb-1 text-4xl"
              :class="gradeColor.text"
            />
            <span class="text-xl font-bold" :class="gradeColor.text">
              {{ store.resultData?.score ?? "-" }}<span class="text-sm">/10</span>
            </span>
          </div>
        </div>
        <div
          class="w-20 h-10 rounded-full flex items-center justify-center mt-2"
          :class="gradeColor.bg"
          style="margin-top: -1.5rem"
        >
          <span class="text-base font-semibold" :class="gradeColor.text">{{ gradeText }}</span>
        </div>
      </section>

      <section class="flex justify-center gap-4 px-4 mt-6 text-center text-xs font-medium">
        <!--    박스1-->
        <div
          class="flex flex-col items-center justify-center w-32 h-24 rounded"
          :class="gradeColor.bg"
        >
          <svg class="w-8 h-8 mb-1" fill="currentColor" viewBox="0 0 20 20" :class="gradeColor.text">
            <path
              d="M8.257 3.099c.765-1.36 2.72-1.36 3.485 0l6.518 11.597c.75 1.336-.213 2.998-1.742 2.998H3.48c-1.529 0-2.492-1.662-1.742-2.998L8.257 3.1zM11 13a1 1 0 10-2 0 1 1 0 002 0zm-1-2a1 1 0 01-1-1V7a1 1 0 012 0v3a1 1 0 01-1 1z"
            />
          </svg>
          <span :class="gradeColor.text" class="text-md">깡통전세</span>
          <span class="text-[11px]" :class="gradeColor.text">{{ gradeText }}</span>
        </div>

              <!-- 박스 2 -->
      <div
        class="flex flex-col items-center justify-center w-32 h-24 rounded"
        :class="illegalBox.bg"
      >
        <svg class="w-8 h-8 mb-1" fill="currentColor" viewBox="0 0 20 20" :class="illegalBox.text">
          <path
            d="M3 2a1 1 0 011-1h12a1 1 0 011 1v15h-5v-4H8v4H3V2zm2 3v2h2V5H5zm0 4v2h2V9H5zm0 4v2h2v-2H5zm4-8v2h2V5H9zm0 4v2h2V9H9zm0 4v2h2v-2H9zm4-8v2h2V5h-2zm0 4v2h2V9h-2zm0 4v2h2v-2h-2z"
          />
        </svg>
        <span class="text-md" :class="illegalBox.text">불법건축물</span>
        <span class="text-[11px]" :class="illegalBox.text">{{ illegalBox.label }}</span>
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
      <p>
        000님의 예산 금액 {{ store.formData.budget }} 만원에 기반하여 분석한 결과는 다음과
        같습니다.
      </p>
              <p class="mt-4">
          {{ store.formData.buildingName }}의 최근 거래 가격은
          {{ store.resultData?.dealAmount }}만원 입니다. 이에 따라 역전세율은
          {{
            store.resultData?.reverse_rental_ratio != null &&
            !isNaN(Number(store.resultData.reverse_rental_ratio))
              ? Number(store.resultData.reverse_rental_ratio).toFixed(2)
              : "-"
          }}%이며 깡통 전세 위험 점수는 {{ store.resultData?.score }}/10점 입니다. 이 수치는
                    <span :class="gradeColor.text + ' font-bold'">{{ gradeText }}</span> 구간으로 평가되며
          <span :class="gradeColor.text + ' font-bold'">{{ riskText }}</span>
        </p>
    </ModalForm>

    <!-- 건축물 정보 모달 -->
    <ModalForm
      v-if="showModal_building"
      title="건축물 정보"
      :handle-confirm="() => ({ success: true, message: '확인되었습니다.' })"
      @close="showModal_building = false"
    >
              <p>
          <span :class="store.violationStatus === '위반건축물' ? 'text-red-600 font-extrabold' : 'text-green-600 font-extrabold'">
            위반 건축물 여부: {{ store.violationStatus === '위반건축물' ? '위반 건축물' : '정상 건축물' }}
          </span>
          <hr />
        </p>
        <p class="mt-2">
          각 층의 용도는 다음과 같습니다. <span class="text-red-600 font-semibold">주거용이 아닌 층의 경우 거래에 조심하세요!</span>
        </p>
      <div v-if="store.floorAndPurposeList && store.floorAndPurposeList.length" class="mt-4">
        <div v-for="(info, idx) in store.floorAndPurposeList" :key="idx" class="mb-2">
          {{ info.resFloor }}의 용도: {{ info.resUseType }}
          <span class="text-sm text-gray-500">({{ info.resStructure }}, {{ info.resArea }}㎡)</span>
        </div>
      </div>
      <div v-else class="mt-4 text-gray-500">
        건축물 정보가 없습니다.
      </div>
    </ModalForm>

    <!-- 데이터 없음 모달 -->
    <div
      v-if="showNoDataModal"
      class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
    >
      <div class="rounded-lg shadow-lg p-6 w-80 bg-white">
        <div class="text-center">
          <div class="mb-4">
            <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6-4h6m2 5.291A7.962 7.962 0 0112 15c-2.34 0-4.47-.881-6.08-2.33" />
            </svg>
          </div>
          <h3 class="text-lg font-medium text-gray-900 mb-2">
            데이터 없음
          </h3>
          <p class="text-sm text-gray-500 mb-6">
            해당 건물에 대한 매매 거래 내역이 존재하지 않아<br>
            안심 레포트를 제공할 수 없습니다.
          </p>
          <button
            @click="goHome"
            class="w-full bg-kb-yellow text-kb-ui-01 py-3 rounded-lg text-lg font-semibold"
          >
            확인
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
<style scoped></style>
