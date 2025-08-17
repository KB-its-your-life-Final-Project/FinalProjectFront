<!--
FilterNav 컴포넌트

1. 두 그룹 필터 버튼(거래 유형, 매물 유형)을 화면 상단에 네비게이션 형태로 제공
2. saleOptions: 거래 유형 옵션 배열, propertyOptions: 매물 유형 옵션 배열
3. 선택된 옵션은 각각 saleType, propertyType으로 바인딩
4. 버튼 클릭 시 update 이벤트 발생하여 부모 컴포넌트에서 값 갱신 가능
-->
<script setup lang="ts">
import { defineEmits, defineProps } from "vue";

const props = defineProps<{
  saleOptions: string[];
  propertyOptions: string[];
  saleType: string;
  propertyType: string;
}>();

const emit = defineEmits<{
  (e: "update:saleType", value: string): void;
  (e: "update:propertyType", value: string): void;
}>();

function selectSale(opt: string) {
  emit("update:saleType", opt);
}

function selectProperty(opt: string) {
  emit("update:propertyType", opt);
}
</script>

<template>
  <!-- 2) 두 그룹 필터 네비 -->
  <nav
    class="flex flex-row flex-nowrap items-center justify-center gap-x-2 sm:gap-x-4 bg-white border-b border-gray-200 shadow-sm py-2 px-2 sm:px-4 overflow-x-auto whitespace-nowrap"
  >
    <div class="flex bg-gray-200 rounded-full p-0.5 sm:p-1">
      <button
        v-for="opt in saleOptions"
        :key="opt"
        @click="selectSale(opt)"
        class="px-2 sm:px-3 py-0.5 sm:py-1 text-xs sm:text-sm font-medium rounded-full transition whitespace-nowrap"
        :class="opt === saleType ? 'bg-white text-gray-900' : 'text-gray-600 hover:bg-gray-300'"
      >
        {{ opt }}
      </button>
    </div>

    <!--    <div class="h-6 w-px bg-gray-300 mx-2"></div>-->

    <div class="flex bg-gray-200 rounded-full p-0.5 sm:p-1">
      <button
        v-for="opt in propertyOptions"
        :key="opt"
        @click="selectProperty(opt)"
        class="px-2 sm:px-3 py-0.5 sm:py-1 text-xs sm:text-sm font-medium rounded-full transition whitespace-nowrap"
        :class="opt === propertyType ? 'bg-white text-gray-900' : 'text-gray-600 hover:bg-gray-300'"
      >
        {{ opt }}
      </button>
    </div>
  </nav>
</template>

<style scoped></style>
