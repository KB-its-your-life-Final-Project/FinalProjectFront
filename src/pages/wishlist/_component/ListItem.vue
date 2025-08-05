<script lang="ts" setup>
defineProps<{
  name: string;
  subName?: string;
}>();
</script>

<template>
  <li class="flex items-center text-sm border-b border-gray-300 pt-3 pb-3">
    <div class="flex items-center">
      <!-- 아이콘 혹은 버튼이 들어갈 자리 -->
      <div class="w-10 h-10 p-2">
        <slot />
      </div>
      <div>
        <div class="font-pretendard-semibold">{{ name }}</div>
        <div v-if="subName" class="text-gray-500 text-xs">{{ subName }}</div>
      </div>
    </div>
  </li>
</template>
