<template>
  <div
    class="flex items-start bg-white rounded-xl shadow-md p-6 mb-6 hover:shadow-lg transition-shadow relative"
  >
    <!-- X 버튼 -->
    <button
      @click.stop="$emit('delete')"
      class="absolute top-4 right-4 w-7 h-7 rounded-full bg-gray-100 hover:bg-red-500 hover:text-white flex items-center justify-center transition-all duration-200 text-gray-500 hover:text-white font-bold text-lg border border-gray-200 hover:border-red-500"
      title="읽음 처리"
    >
      ×
    </button>

    <!-- 카드 내용 (클릭 시 읽음 처리) -->
    <div class="flex-shrink-0 mr-4" @click="$emit('click')">
      <div :class="['w-12 h-12 rounded-full flex items-center justify-center', iconColor]">
        <font-awesome-icon :icon="icon" class="text-white text-xl" />
      </div>
    </div>
    <div class="flex-grow cursor-pointer pr-8" @click="$emit('click')">
      <div class="flex justify-between items-start mb-3">
        <h3 class="font-bold text-lg text-gray-900">{{ title }}</h3>
        <span class="text-sm text-gray-500">{{ timeAgo }}</span>
      </div>
      <p class="text-base text-gray-700 leading-relaxed">{{ content }}</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";

defineProps<{
  icon: string; // e.g., ['fas', 'bell']
  title: string;
  content: string;
  timeAgo: string;
  iconColor: string; // 배경색 클래스
}>();

defineEmits<{
  (e: "click"): void;
  (e: "delete"): void;
}>();
</script>
