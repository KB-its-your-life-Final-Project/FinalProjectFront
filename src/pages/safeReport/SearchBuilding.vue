<script setup lang="ts">
import { ref, onMounted, computed } from "vue";
import { safeReportStore } from "@/stores/safeReportStore";
import { useRouter } from "vue-router";
import ButtonnModal from "@/components/common/modal/ButtonnModal.vue";
import SearchAddressLayer from "@/components/common/SearchAddressLayer.vue";
import SelectAddressPage from "@/components/common/SelectAddressPage.vue";
import mapUtil from "@/utils/naverMap/naverMap";
import { SafeReportStep } from "./types";
import { Api } from "@/api/autoLoad/Api";

const store = safeReportStore();
const router = useRouter();
const api = new Api();
const emit = defineEmits(["update", "next", "prev"]);

const buildingName = ref(store.formData.buildingName);
const roadAddress = ref(store.formData.roadAddress);
const jibunAddress = ref(store.formData.jibunAddress);
const dongName = ref(store.formData.dongName);
const lat = ref<number>(store.formData.lat || 0);
const lng = ref<number>(store.formData.lng || 0);
const naverReady = ref(false);
const showAddressLayer = ref(false);
const showBuildingNameInputModal = ref(false);
const showBuildingNotFoundPage = ref(false);

// 버튼 활성화 상태 디버깅
const isButtonEnabled = computed(() => {
  const hasBuildingName = buildingName.value?.trim();
  const hasRoadAddress = roadAddress.value?.trim();
  const hasJibunAddress = jibunAddress.value?.trim();

  // 모든 필수 주소 정보가 있어야 활성화
  return hasBuildingName && hasRoadAddress && hasJibunAddress;
});

// Naver Maps API 호출
onMounted(async () => {
  // 검색바 초기화 (store에 값이 있으면 유지)
  if (!store.formData.buildingName) {
    buildingName.value = "";
  }
  if (!store.formData.roadAddress) {
    roadAddress.value = "";
  }
  if (!store.formData.jibunAddress) {
    jibunAddress.value = "";
  }
  if (!store.formData.dongName) {
    dongName.value = "";
  }
  if (!store.formData.lat) {
    lat.value = 0;
  }
  if (!store.formData.lng) {
    lng.value = 0;
  }

  // Naver Maps API 로드
  try {
    await mapUtil.loadNaverMapScript();
    naverReady.value = true;
  } catch (error) {
    console.error("네이버 지도 API 로드 실패:", error);
  }
});

function search() {
  showAddressLayer.value = true;
}

// 주소 선택 완료 핸들러
function handleAddressComplete(payload: {
  roadAddress?: string;
  jibunAddress?: string;
  buildingName?: string;
  dongName?: string;
}) {
  // 건물명이 없으면 건물명 입력 모달 표시
  if (!payload.buildingName || payload.buildingName.trim() === "") {
    showBuildingNameInputModal.value = true;
    return;
  }

  // 주소 정보 업데이트 (SearchAddressLayer에서 이미 auto 주소 처리됨)
  roadAddress.value = payload.roadAddress || "";
  jibunAddress.value = payload.jibunAddress || "";
  buildingName.value = payload.buildingName || "";
  dongName.value = payload.dongName || "";

  // store 업데이트
  store.updateFormData({
    roadAddress: roadAddress.value,
    jibunAddress: jibunAddress.value,
    buildingName: buildingName.value,
    dongName: dongName.value,
  });

  // 좌표 변환
  if (roadAddress.value && naverReady.value && jibunAddress.value) {
    searchAddressToCoordinate(jibunAddress.value);
  }
}

// 주소 레이어 닫기 핸들러
function handleAddressLayerClose() {
  showAddressLayer.value = false;
  // 주소 선택 없이 닫으면 초기화
  if (!buildingName.value?.trim()) {
    resetFormData();
  }
}

function searchAddressToCoordinate(address: string) {
  if (!window.naver?.maps?.Service) {
    alert("네이버 지도 API가 아직 로드되지 않았습니다.");
    return;
  }

  naver.maps.Service.geocode({ query: address }, function (status, response) {
    if (status !== naver.maps.Service.Status.OK) {
      alert("주소를 좌표로 변환하는 데 실패했습니다.");
      return;
    }

    const result = response.v2;
    if (result.meta.totalCount === 0) {
      alert("DB에 해당하는 주소 데이터가 없습니다.");
      return;
    }

    const { x, y } = result.addresses[0];
    const latVal = parseFloat(y);
    const lngVal = parseFloat(x);

    store.updateFormData({
      lat: latVal,
      lng: lngVal,
    });
  });
}

function next() {
  emit("next");
}

function resetFormData() {
  // store 초기화
  store.resetStore();

  // 로컬 ref들도 초기화
  buildingName.value = "";
  roadAddress.value = "";
  jibunAddress.value = "";
  dongName.value = "";
  lat.value = 0;
  lng.value = 0;
}

// 주소 선택 페이지 이벤트 핸들러
function handleAddressSelected(addressData: {
  sido: string | undefined;
  sigugun: string | undefined;
  dong: string | undefined;
  buildingName: string | undefined;
  fullAddress: string;
  sidoCd: string | undefined;
  sggCd: string | undefined;
  umdCd: string | undefined;
  latitude: number | undefined;
  longitude: number | undefined;
  jibunAddr: string | undefined;
}) {
  // 선택된 건물명 설정
  buildingName.value = addressData.buildingName || addressData.fullAddress;

  // 주소 정보 설정 (jibunAddr 우선, 없으면 fullAddress 사용)
  const addressToUse = addressData.jibunAddr || addressData.fullAddress;
  roadAddress.value = addressToUse;
  jibunAddress.value = addressToUse;

  // store 업데이트 (위도/경도 포함)
  store.updateFormData({
    buildingName: buildingName.value,
    roadAddress: roadAddress.value,
    jibunAddress: addressToUse,
    dongName: addressData.dong || "",
    lat: addressData.latitude, // 서버에서 받은 위도
    lng: addressData.longitude, // 서버에서 받은 경도
  });

  showBuildingNotFoundPage.value = false;

  // 다음 화면으로 이동
  next();
}

// 내가 살고 있는 집으로 조회하기
async function handleMyHomeSearch() {
  try {
    // 백엔드에서 직접 사용자의 등록된 집 정보 가져오기
    const response = await api.getHomeInfoUsingGet("");

    if (response.data?.success && response.data?.data) {
      const homeInfo = response.data.data;

      // 위도/경도로 정확한 주소 정보 검색
      if (homeInfo.latitude && homeInfo.longitude) {
        const latlng = new naver.maps.LatLng(homeInfo.latitude, homeInfo.longitude);
        const addressInfo = await mapUtil.searchCoordinateToAddress(latlng);

        // safeReport store에 정확한 주소 정보 저장
        store.updateFormData({
          buildingName: homeInfo.buildingName || "",
          roadAddress: addressInfo.roadAddress || "",
          jibunAddress: addressInfo.jibunAddress || "",
          dongName: homeInfo.umdNm || "",
          lat: homeInfo.latitude,
          lng: homeInfo.longitude,
        });

        // 예산 정보도 저장 (보증금 또는 전세금)
        if (homeInfo.rentType === 1) {
          // 전세
          store.updateFormData({
            budget: homeInfo.jeonseAmount || 0,
          });
        } else {
          // 월세 (보증금만)
          store.updateFormData({
            budget: homeInfo.monthlyDeposit || 0,
          });
        }

        // 안심레포트 결과 페이지로 이동
        store.goToStep(SafeReportStep.RESULT);
      } else {
        console.warn("위도/경도 정보가 없습니다.");
        // 위도/경도가 없는 경우 마이페이지로 이동
        router.push({ name: "mypage" });
      }
    } else {
      // 집 정보가 없는 경우: 마이페이지 집 등록으로 이동
      router.push({ name: "mypage" });
    }
  } catch (error) {
    console.error("집 정보 조회 실패:", error);
    // 에러 발생 시 마이페이지로 이동
    router.push({ name: "mypage" });
  }
}
</script>

<template>
  <div class="relative flex flex-col flex-1 px-6 gap-6">
    <div>
      <h1 class="text-2xl font-pretendard-bold mb-1">진단받고자 하는 곳이 어디인가요?</h1>
      <p class="text-kb-ui-05">건물명을 입력해주세요.</p>
    </div>

    <div class="w-full max-w-lg mx-auto flex gap-4 items-center space-x-2">
      <input
        v-model="buildingName"
        type="text"
        placeholder="주소 찾기로 입력"
        class="flex-1 border accent-kb-ui-05 rounded-full py-2 pl-4 focus:outline-none"
        readonly
        @click="search"
      />
      <button
        @click="search"
        class="px-4 py-2 border accent-kb-ui-05 rounded-full text-kb-ui-03 disabled:opacity-50"
      >
        주소 찾기
      </button>
    </div>

    <!-- 원하는 단지가 안나온다면 링크 -->
    <div class="w-full max-w-lg mx-auto flex justify-end">
      <button
        @click="showBuildingNotFoundPage = true"
        class="text-sm text-kb-ui-05 hover:text-kb-ui-03 transition-colors cursor-pointer"
      >
        원하는 단지가 안나온다면? >
      </button>
    </div>

    <!-- 내가 살고 있는 집 확인하기 버튼 -->
    <div class="w-full max-w-lg mx-auto flex justify-end">
      <button
        @click="handleMyHomeSearch"
        class="px-4 py-2 bg-kb-yellow-positive text-white rounded-full font-medium hover:bg-kb-yellow transition-colors shadow-sm"
      >
        내가 살고 있는 집 확인하기
      </button>
    </div>

    <!-- 주소 검색 레이어 -->
    <teleport to="body">
      <SearchAddressLayer
        :visible="showAddressLayer"
        :return-fields="['roadAddress', 'jibunAddress', 'buildingName', 'dongName']"
        :fullscreen="true"
        @complete="handleAddressComplete"
        @close="handleAddressLayerClose"
      />
    </teleport>

    <!-- 주소 선택 페이지 -->
    <SelectAddressPage
      v-if="showBuildingNotFoundPage"
      @go-back="showBuildingNotFoundPage = false"
      @address-selected="handleAddressSelected"
    />

    <div class="fixed z-0 inset-x-0 bottom-6 flex justify-end px-6 pb-24">
      <button
        @click="next"
        :disabled="!isButtonEnabled"
        class="px-4 py-2 bg-kb-yellow rounded text-kb-ui-11 disabled:opacity-50"
      >
        다음
      </button>
    </div>

    <!-- 건물 없음 모달 -->
    <ButtonnModal
      v-if="showBuildingNameInputModal"
      title="건물을 찾을 수 없습니다."
      :handle-confirm="() => ({ success: true, message: '' })"
      @close="showBuildingNameInputModal = false"
    >
      <div class="text-center">
        <p class="text-medium text-kb-ui-02">
          검색하신 주소에 해당하는 건물 정보가 없습니다.<br />
          다시 검색해주세요.
        </p>
      </div>
      <div class="mt-8 p-4 bg-gray-50 rounded-lg">
        <h3 class="text-sm font-medium text-gray-800 mb-2">💡 도움말</h3>
        <ul class="text-sm text-gray-600 space-y-1 text-left">
          <li>• 정확한 도로명 주소를 입력해보세요</li>
          <li>• 건물명 대신 동/호수로 검색해보세요</li>
          <li>• 새로 지어진 건물은 등록이 지연될 수 있습니다</li>
        </ul>
      </div>
    </ButtonnModal>
  </div>
</template>

<style scoped></style>
