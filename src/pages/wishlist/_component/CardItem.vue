<script lang="ts" setup>
defineProps<{
  apt: {
    name: string;
    address: string;
    price: string | number;
  };
}>();
</script>
<template>
  <div class="max-w-[180px] rounded-lg border border-gray-300 shadow-md bg-kb-ui-11 cursor-pointer">
    <div class="h-30 w-full bg-kb-ui-08">
      {{ apt.name }}
    </div>
    <div class="p-3">
      <div class="text-xs text-kb-ui-05">{{ apt.address }}</div>
      <div class="mt-1 text-md font-pretendard-bold">{{ apt.price }}</div>
    </div>
  </div>
</template>
