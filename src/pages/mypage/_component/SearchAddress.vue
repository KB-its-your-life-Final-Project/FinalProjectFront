<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useHomeStore } from "@/stores/homeStore";
import PostcodeLayer from "@/components/common/SearchAddressLayer.vue";

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

// 주소 데이터
const roadAddress = ref("");
const jibunAddress = ref("");
const buildingName = ref("");
const dongName = ref("");
const dongNo = ref("");
const umdNm = ref("");
const jibunAddr = ref("");

// 기존 주소 정보로 초기화 (기존 기능에 영향 없음)
onMounted(() => {

  if (props.initialAddress) {
    console.log("초기 주소 정보:", props.initialAddress);

    // 모든 주소 정보 설정
    roadAddress.value = props.initialAddress.roadAddress || "";
    jibunAddress.value = props.initialAddress.jibunAddr || "";
    buildingName.value = props.initialAddress.buildingName || "";
    dongName.value = props.initialAddress.umdNm || "";
    dongNo.value = props.initialAddress.buildingNumber || "";
    umdNm.value = props.initialAddress.umdNm || "";
    jibunAddr.value = props.initialAddress.jibunAddr || "";

    console.log("설정된 값들:", {
      roadAddress: roadAddress.value,
      jibunAddress: jibunAddress.value,
      buildingName: buildingName.value,
      dongName: dongName.value,
      dongNo: dongNo.value,
      umdNm: umdNm.value,
      jibunAddr: jibunAddr.value
    });

    // buildingNumber가 있으면 building-number-changed 이벤트 발생
    if (props.initialAddress.buildingNumber) {
      emit('building-number-changed', props.initialAddress.buildingNumber);
    }
  } else {
    console.log("initialAddress가 없습니다");
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

function onAddressSelected(
  payload: Partial<{
    roadAddress: string;
    jibunAddress: string;
    buildingName: string;
    dongName: string;
    umdNm?: string;
    jibunAddr?: string;
  }>,
) {
  // 새로운 주소를 선택했으므로 기존 건물 정보 초기화
  roadAddress.value = payload.roadAddress || "";
  jibunAddress.value = payload.jibunAddr || "";
  buildingName.value = payload.buildingName || "";
  dongName.value = payload.umdNm || "";
  umdNm.value = payload.umdNm || "";
  jibunAddr.value = payload.jibunAddr || "";

  // 새로운 주소를 선택했으므로 건물동 번호도 초기화
  dongNo.value = "";

  // 부모 컴포넌트로 지번주소 전달
  if (jibunAddress.value) {
    emit("address-selected", jibunAddress.value);
  }

  homeStore.updateAddressInfo({
    roadAddress: roadAddress.value,
    jibunAddress: jibunAddress.value,
    buildingName: buildingName.value,
    dongName: dongName.value,
    buildingNumber: "",
    umdNm: umdNm.value,
    jibunAddr: jibunAddr.value
  });

  emit("address-info-updated", {
    roadAddress: roadAddress.value,
    jibunAddress: jibunAddress.value,
    buildingName: buildingName.value,
    dongName: dongName.value,
    buildingNumber: "", // 새로운 주소 선택 시 건물동 번호 초기화
    umdNm: umdNm.value,
    jibunAddr: jibunAddr.value
  });
}
</script>

<template>
  <div class="border border-gray-300 mt-4 rounded-md space-y-2">
    <input v-model="roadAddress" placeholder="도로명주소" class="p-2 w-full" readonly />
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
        @input="emit('building-number-changed', dongNo)"
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
  <PostcodeLayer
    :visible="showPostcode"
    @close="showPostcode = false"
    @complete="onAddressSelected"
  />
</template>
