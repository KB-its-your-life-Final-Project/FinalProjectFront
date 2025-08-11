<script setup lang="ts">
import { ref, onMounted, watch, nextTick } from "vue";
import { useHomeStore } from "@/stores/homeStore";
import SearchAddressLayer from "@/components/common/SearchAddressLayer.vue";

// store 초기화
const homeStore = useHomeStore();

const props = withDefaults(defineProps<{
  initialAddress?: {
    roadAddress?: string;
    jibunAddress?: string;
    buildingName?: string;
    dongName?: string;
    buildingNumber?: string;
    umdNm?: string;
    jibunAddr?: string;
  };
}>(), {
  initialAddress: undefined
});

// 주소 데이터 - ref로 변경하고 watch로 homeStore 변경 감지
const roadAddress = ref(homeStore.homeInfo.addressInfo.roadAddress);

// homeStore의 roadAddress 변경을 감지하여 ref 업데이트
watch(() => homeStore.homeInfo.addressInfo.roadAddress, (newValue: string) => {
  roadAddress.value = newValue;
}, { immediate: true });
const jibunAddress = ref("");
const buildingName = ref("");
const dongName = ref("");
const dongNo = ref("");
const umdNm = ref("");
const jibunAddr = ref("");

// 기존 주소 정보로 초기화
onMounted(() => {
  if (props.initialAddress) {
    // homeStore에 이미 저장된 도로명주소가 있으면 사용
    const savedRoadAddress = homeStore.homeInfo.addressInfo.roadAddress;

    // 모든 주소 정보 설정 (도로명주소 포함)
    roadAddress.value = props.initialAddress.roadAddress || "";
    jibunAddress.value = props.initialAddress.jibunAddr || "";
    buildingName.value = props.initialAddress.buildingName || "";
    dongName.value = props.initialAddress.umdNm || "";
    dongNo.value = props.initialAddress.buildingNumber || "";
    umdNm.value = props.initialAddress.umdNm || "";
    jibunAddr.value = props.initialAddress.jibunAddr || "";

    // buildingNumber가 있으면 building-number-changed 이벤트 발생
    if (props.initialAddress.buildingNumber) {
      emit('building-number-changed', props.initialAddress.buildingNumber);
    }
  }
});
// 주소 찾기 레이어 표시 여부
const showPostcode = ref(false);

// 주소 찾기 버튼 클릭
function openPostcode() {
  showPostcode.value = true;
}

const emit = defineEmits<{
  "address-selected": [address: string];
  "building-number-changed": [buildingNumber: string];
  "address-info-updated": [addressData: {
    roadAddress: string;
    jibunAddress: string;
    buildingName: string;
    dongName: string;
    buildingNumber: string;
    umdNm?: string;
    jibunAddr?: string;
  }];
}>();

async function onAddressSelected(
  payload: Partial<{
    roadAddress: string;
    jibunAddress: string;
    buildingName: string;
    dongName: string;
    umdNm?: string;
    jibunAddr?: string;
  }>,
) {

  // 새로운 주소를 선택했으므로 기존 건물 정보 초기화 (도로명주소 포함)
  roadAddress.value = payload.roadAddress || "";
  jibunAddress.value = payload.jibunAddr || "";
  buildingName.value = payload.buildingName || "";
  dongName.value = payload.umdNm || "";
  umdNm.value = payload.umdNm || "";
  jibunAddr.value = payload.jibunAddr || "";

  // 새로운 주소를 선택했으므로 건물동 번호는 유지 (사용자 입력값 보존)
  // dongNo.value = ""; // 이 줄 제거 - 동 번호 초기화하지 않음

  // 부모 컴포넌트로 지번주소 전달
  if (jibunAddress.value) {
    emit("address-selected", jibunAddress.value);
  }

  // homeStore에 모든 주소 정보 업데이트 (도로명주소 포함)
  const updateData = {
    roadAddress: payload.roadAddress || "",
    jibunAddress: jibunAddress.value,
    buildingName: buildingName.value,
    dongName: dongName.value,
    buildingNumber: dongNo.value, // 현재 입력된 동 번호 사용
    umdNm: umdNm.value,
    jibunAddr: jibunAddr.value
  };
  homeStore.updateAddressInfo(updateData);

  // UI 업데이트를 보장하기 위해 nextTick 사용
  await nextTick();

  emit("address-info-updated", {
    roadAddress: payload.roadAddress || "",
    jibunAddress: jibunAddress.value,
    buildingName: buildingName.value,
    dongName: dongName.value,
    buildingNumber: dongNo.value, // 현재 입력된 동 번호 사용
    umdNm: umdNm.value,
    jibunAddr: jibunAddr.value
  });
}

// 동 번호 입력 시 처리
function handleDongNoInput() {

  // 부모 컴포넌트로 동 번호 변경 알림
  emit('building-number-changed', dongNo.value);

  // homeStore의 buildingNumber 업데이트
  homeStore.updateBuildingNumber(dongNo.value);

  // address-info-updated 이벤트 발생
  emit("address-info-updated", {
    roadAddress: roadAddress.value,
    jibunAddress: jibunAddress.value,
    buildingName: buildingName.value,
    dongName: dongName.value,
    buildingNumber: dongNo.value,
    umdNm: umdNm.value,
    jibunAddr: jibunAddr.value
  });
}
</script>

<template>
  <div class="border border-gray-300 mt-4 rounded-md space-y-2">
    <input :value="roadAddress" placeholder="도로명주소" class="p-2 w-full" readonly />
    <input
      v-model="jibunAddress"
      placeholder="지번주소"
      class="p-2 w-full border-t border-gray-300"
      readonly
    />
    <div class="flex border-t border-gray-300">
      <input
        v-model="umdNm"
        placeholder="법정동명"
        class="p-2 w-full border-r border-gray-300"
        readonly
      />

      <input v-model="buildingName" placeholder="건물명" class="p-2 w-full" readonly />
    </div>

    <div class="relative">
      <input
        v-model="dongNo"
        placeholder="동 입력(예: 204동)"
        class="p-2 w-full border-t border-gray-300"
        @input="handleDongNoInput"
      />
      <button
        @click="openPostcode"
        class="absolute right-0 top-0 h-full px-4 bg-kb-yellow-positive text-white rounded-r"
      >
        주소 찾기
      </button>
    </div>
  </div>

  <!-- 주소 검색 레이어 컴포넌트 -->
  <SearchAddressLayer
    :visible="showPostcode"
    @close="showPostcode = false"
    @complete="onAddressSelected"
  />
</template>
