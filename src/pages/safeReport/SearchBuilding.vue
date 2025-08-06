<script setup lang="ts">
import { ref, onMounted, computed } from "vue";
import { safeReportStore } from "@/stores/safeReportStore";
import ModalForm from "@/components/common/ModalForm.vue";
import SearchAddressLayer from "@/components/common/SearchAddressLayer.vue";
import mapUtil from "@/utils/naverMap/naverMap";

const store = safeReportStore();
const emit = defineEmits(["update", "next", "prev"]);

const buildingName = ref(store.formData.buildingName);
const roadAddress = ref(store.formData.roadAddress);
const jibunAddress = ref(store.formData.jibunAddress);
const dongName = ref(store.formData.dongName);
const lat = ref<number>(store.formData.lat || 0);
const lng = ref<number>(store.formData.lng || 0);
const showAddressLayer = ref(false);
const showBuildingNotFoundModal = ref(false);

// 버튼 활성화 상태 디버깅
const isButtonEnabled = computed(() => {
  const hasBuildingName = buildingName.value?.trim();
  const hasRoadAddress = roadAddress.value?.trim();
  const hasJibunAddress = jibunAddress.value?.trim();


  // 모든 필수 주소 정보가 있어야 활성화
  return hasBuildingName && hasRoadAddress && hasJibunAddress;
});

// 컴포넌트 초기화
onMounted(async () => {
  // 검색바 초기화
  buildingName.value = "";
  roadAddress.value = "";
  jibunAddress.value = "";
  dongName.value = "";
  lat.value = 0;
  lng.value = 0;

  // Naver Maps API 로드
  try {
    await mapUtil.loadNaverMapScript();
  } catch (error) {
    console.error('네이버 지도 API 로드 실패:', error);
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
  console.log("전체 주소 데이터:", payload);

  // 건물명이 없으면 모달 표시
  if (!payload.buildingName || payload.buildingName.trim() === "") {
    showBuildingNotFoundModal.value = true;
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
  if (roadAddress.value && jibunAddress.value) {
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

async function searchAddressToCoordinate(address: string) {
  try {
    const result = await mapUtil.searchAddressToCoordinate(address);
    console.log("✅ 위도:", result.latlng.lat(), "경도:", result.latlng.lng());

    store.updateFormData({
      lat: result.latlng.lat(),
      lng: result.latlng.lng(),
    });
  } catch (error) {
    console.error("주소를 좌표로 변환하는 데 실패했습니다:", error);
    alert("주소를 좌표로 변환하는 데 실패했습니다.");
  }
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
    <ModalForm
      v-if="showBuildingNotFoundModal"
      title="건물 정보 없음"
      :handle-confirm="() => ({ success: true, message: '확인되었습니다.' })"
      @close="showBuildingNotFoundModal = false"
    >
      <div class="text-center">
        <p class="text-gray-600">
          해당 주소에 건물이 없습니다.<br>
          다른 주소를 선택해주세요.
        </p>
      </div>
    </ModalForm>
  </div>
</template>

<style scoped></style>
