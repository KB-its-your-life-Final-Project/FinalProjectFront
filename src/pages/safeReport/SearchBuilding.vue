<script setup lang="ts">
import { ref, onMounted, computed } from "vue";
import { safeReportStore } from "@/stores/safeReportStore";
import ModalForm from "@/components/common/ModalForm.vue";
import SearchAddressLayer from "@/components/common/SearchAddressLayer.vue";

const store = safeReportStore();
const emit = defineEmits(["update", "next", "prev"]);

const buildingName = ref(store.formData.buildingName);
const roadAddress = ref(store.formData.roadAddress);
const jibunAddress = ref(store.formData.jibunAddress);
const dongName = ref(store.formData.dongName);
const lat = ref<number>(store.formData.lat || 0);
const lng = ref<number>(store.formData.lng || 0);
const naverReady = ref(false);
const showAddressLayer = ref(false);
const showBuildingNotFoundModal = ref(false);
const showBuildingNameInputModal = ref(false);
const buildingNameInput = ref(''); // 건물명 입력값

// 버튼 활성화 상태 디버깅
const isButtonEnabled = computed(() => {
  const hasBuildingName = buildingName.value?.trim();
  const hasRoadAddress = roadAddress.value?.trim();
  const hasJibunAddress = jibunAddress.value?.trim();


  // 모든 필수 주소 정보가 있어야 활성화
  return hasBuildingName && hasRoadAddress && hasJibunAddress;
});

// Naver Maps API 호출
onMounted(() => {
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

  if (!window.naver?.maps) {
    const naverScript = document.createElement("script");
    naverScript.src =
      "https://oapi.map.naver.com/openapi/v3/maps.js?ncpKeyId=55s76chbvh&submodules=geocoder";
    naverScript.async = true;
    naverScript.onload = () => {
      naverReady.value = true;
    };
    document.head.appendChild(naverScript);
  } else {
    naverReady.value = true;
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

// 건물명 입력 처리
function handleBuildingNameSubmit() {
  if (buildingNameInput.value.trim()) {
    const inputBuildingName = buildingNameInput.value.trim();
    buildingName.value = inputBuildingName;

    // store 업데이트 (위도/경도는 빈 상태로)
    store.updateFormData({
      buildingName: inputBuildingName,
      roadAddress: roadAddress.value,
      jibunAddress: jibunAddress.value,
      dongName: dongName.value,
      lat: undefined, // 위도 초기화
      lng: undefined  // 경도 초기화
    });

    // store에서 업데이트된 값으로 동기화
    buildingName.value = store.formData.buildingName || inputBuildingName;

    showBuildingNameInputModal.value = false;
    buildingNameInput.value = ''; // 입력값 초기화

    // 다음 화면으로 이동
    next();
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

    console.log("✅ 위도:", latVal, "경도:", lngVal);

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

    <!-- 건물명 입력 모달 -->
    <ModalForm
      v-if="showBuildingNameInputModal"
      title="건물을 찾을 수 없습니다."
      :handle-confirm="() => {
        if (buildingNameInput.value.trim()) {
          handleBuildingNameSubmit();
          return { success: true, message: '' };
        } else {
          return { success: false, message: '건물명을 입력해주세요.' };
        }
      }"
      @close="showBuildingNameInputModal = false"
    >
      <div class="text-center">
        <!-- <div class="mb-4">
          <svg class="mx-auto h-12 w-12 text-kb-yellow" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z" />
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 5a2 2 0 012-2h4a2 2 0 012 2v2H8V5z" />
          </svg>
        </div> -->
        <p class="text-medium text-kb-ui-02">
          건물명을 입력해주세요.<br>
          입력하신 건물명으로 안심 진단을 진행합니다.
        </p>
        <input
          v-model="buildingNameInput"
          type="text"
          placeholder="건물명을 입력하세요"
          class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-kb-yellow focus:border-transparent mt-4"
          @keyup.enter="handleBuildingNameSubmit"
        />
      </div>
    </ModalForm>

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
