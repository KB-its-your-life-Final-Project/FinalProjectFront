<script lang="ts" setup>
import { formatAmount } from "@/utils/numberUtils";
const props = defineProps<{
  title: string;
  amount: number | undefined;
  rent?: number | undefined;
}>();
</script>

<template>
  <div class="flex justify-between">
    <div class="text-sm">{{ title }}</div>
    <div class="text-sm">
      {{ formatAmount(amount) }} <span v-if="rent">/ {{ formatAmount(rent) }}</span>
    </div>
  </div>
</template>
