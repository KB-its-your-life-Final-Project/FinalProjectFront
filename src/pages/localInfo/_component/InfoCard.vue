<script setup lang="ts">
import type { InfoCardType } from "@/pages/localInfo/_component/InfoCard.ts";

defineProps<{
  info: InfoCardType;
}>();
</script>

<template>
  <div
    class="flex flex-col bg-kb-ui-11 rounded-xl border-1 border-blue-200 shadow-md p-4 gap-5 min-h-[10.625rem]"
  >
    <!-- 상단: 타이틀 & 아이콘 -->
    <div class="flex items-center justify-between px-4 mt-4">
      <div class="font-pretendard-bold text-xl text-kb-ui-01">{{ info.title }}</div>
      <div class="rounded-xl w-10 h-10 flex items-center justify-center">
        <font-awesome-icon :icon="info.icon" class="text-[20px] text-blue-900" />
      </div>
    </div>
    <!-- 본문: 값/설명 -->
    <div class="flex items-center justify-between flex-col gap-10">
      <div class="font-pretendard-bold text-3xl text-kb-ui-02">{{ info.value }}</div>
      <div class="w-full bg-kb-ui-08 rounded-xl border-2 border-kb-ui-08 text-center text-kb-ui-04">
        {{ info.description }}
      </div>
    </div>
  </div>
</template>
