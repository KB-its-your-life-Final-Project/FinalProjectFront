<template>
  <div class="flex items-start bg-white rounded-xl shadow-md p-4 mb-4">
    <div class="flex-shrink-0 mr-3">

    <font-awesome-icon :icon="icon" class="text-2xl" />
    </div>
    <div class="flex-grow">
      <p class="font-bold text-sm">{{ title }}</p>
      <p class="text-xs text-gray-500 mt-1">{{ content }}</p>
    </div>
    <div class="ml-4 text-xs text-gray-400 whitespace-nowrap">{{ timeAgo }}</div>
  </div>
</template>

<script setup lang="ts">
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';

defineProps<{
  icon: string;  // e.g., ['fas', 'bell']
  title: string;
  content: string;
  timeAgo: string;
}>();
</script>
