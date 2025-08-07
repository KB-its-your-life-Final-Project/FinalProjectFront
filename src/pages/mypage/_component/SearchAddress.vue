<script setup lang="ts">
import { ref } from "vue";
import PostcodeLayer from "@/components/common/SearchAddressLayer.vue";

// 주소 데이터
const roadAddress = ref("");
const jibunAddress = ref("");
const buildingName = ref("");
const dongName = ref("");
const dongNo = ref("");
// 주소 찾기 레이어 표시 여부
const showPostcode = ref(false);

// 주소 찾기 버튼 클릭
function openPostcode() {
  showPostcode.value = true;
}

const emit = defineEmits<{
  'address-selected': [address: string]
  'building-number-changed': [buildingNumber: string]
}>();

function onAddressSelected(
  payload: Partial<{
    roadAddress: string;
    jibunAddress: string;
    buildingName: string;
    dongName: string;
  }>,
) {
  // 자동 주소 처리 (SearchAddressLayer.vue와 동일한 로직)
  roadAddress.value = payload.roadAddress || "";
  jibunAddress.value = payload.jibunAddress || "";
  buildingName.value = payload.buildingName || "";
  dongName.value = payload.dongName || "";

  // 부모 컴포넌트로 지번주소 전달
  if (jibunAddress.value) {
    emit('address-selected', jibunAddress.value);
  }
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
        v-model="dongName"
        placeholder="법정동명"
        class="p-2 w-full border-r border-gray-300"
        readonly
      />

      <input v-model="buildingName" placeholder="건물명" class="p-2 w-full pr-28" readonly />
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
