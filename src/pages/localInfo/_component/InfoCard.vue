<script setup lang="ts">
import type { InfoCardType } from "@/components/localinfo/InfoCard.ts";

defineProps<{
  info: InfoCardType;
}>();
</script>

<template>
  <div
    class="flex flex-col items-start p-4 rounded-xl border-2 border-kb-yellow bg-white shadow-sm min-w-[120px] min-h-[90px]"
  >
    <div class="flex items-center mb-2">
      <font-awesome-icon :icon="info.icon" class="text-kb-yellow text-xl mr-2" />
      <span class="font-pretendard-semibold text-sm text-kb-ui-01">{{ info.title }}</span>
    </div>
    <div class="font-pretendard-bold text-2xl mb-1 text-kb-ui-01">{{ info.value }}</div>
    <div class="text-xs text-kb-ui-05 font-pretendard-regular">{{ info.description }}</div>
  </div>
</template>
