<script setup lang="ts">
defineProps<{
  title: string;
  content: string;
  subContent: string;
}>();
</script>

<template>
  <div class="bg-white mx-4 mt-4 p-4 rounded-xl shadow-md">
    <h3 class="text-sm font-semibold mb-1">{{ title }}</h3>
    <p class="text-sm">{{ content }}</p>
    <p class="text-xs text-gray-500">{{ subContent }}</p>
  </div>
</template>
