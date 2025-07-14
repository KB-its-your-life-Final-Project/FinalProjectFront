<script setup lang="ts">
import { defineEmits, defineProps } from 'vue';

const props = defineProps<{
  tabs: { label: string; value: string }[];
  activeTab: string;
}>();

const emit = defineEmits<{
  (e: 'update:activeTab', value: string): void;
}>();
</script>

<template>
  <div class="sticky top-0 z-30 bg-white border-b border-gray-200 shadow-sm">
    <div class="max-w-screen-xl mx-auto px-4">
      <nav class="flex justify-center space-x-8 sm:space-x-4 overflow-x-auto py-2">
        <button
          v-for="tab in tabs"
          :key="tab.value"
          @click="$emit('update:activeTab', tab.value)"
          class="flex-shrink-0 px-3 py-1 text-sm sm:text-base font-medium rounded-full border transition"
          :class="activeTab === tab.value
            ? 'bg-purple-600 text-white border-purple-600'
            : 'bg-gray-100 text-gray-600 border-gray-200 hover:bg-gray-200'"
        >
          {{ tab.label }}
        </button>
      </nav>
    </div>
  </div>
</template>

<style scoped>

</style>
