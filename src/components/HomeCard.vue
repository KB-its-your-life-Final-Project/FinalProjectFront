<script setup lang="ts">
defineProps<{
  title: string;
  desc: string;
  icon: string;
}>();
</script>

<template>
  <div class="bg-white rounded-xl shadow-md p-4 flex flex-col items-start justify-between h-full">
    <div class="text-2xl mb-2">{{ icon }}</div>
    <div class="text-base font-semibold">{{ title }}</div>
    <div class="text-sm text-gray-500">{{ desc }}</div>
  </div>
</template>
