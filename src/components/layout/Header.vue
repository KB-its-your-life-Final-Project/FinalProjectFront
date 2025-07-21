<!-- Header -->

<script setup lang="ts">
import { defineProps } from "vue";
import movePage from "@/utils/movePage";

const props = defineProps<{
  title?: string;
  showBack?: boolean; // 뒤로가기 버튼 표시 여부
  showAlarm?: boolean; // 알림 아이콘 표시 여부
}>();
</script>

<template>
  <header class="bg-kb-yellow w-full px-[1rem] pt-[4rem] pb-[4.375rem] relative">
    <!-- 왼쪽: 뒤로가기 아이콘 or 타이틀 -->
    <div
      class="absolute top-[1rem] left-[1rem] flex items-center space-x-[1rem] text-kb-ui-01 text-[1.25rem]"
    >
      <font-awesome-icon
        v-if="props.showBack"
        :icon="['fas', 'arrow-left']"
        class="text-[1.125rem] cursor-pointer"
        @click="movePage.back()"
      />
      <span
        v-if="props.title"
        :class="['text-base font-semibold text-kb-ui-01', props.showBack ? 'ml-4' : '']"
      >
        {{ props.title }}
      </span>
    </div>

    <div
      v-if="props.showAlarm"
      class="absolute top-[1rem] right-[1rem] flex items-center space-x-[1rem] text-kb-ui-01 text-xl"
    >
      <font-awesome-icon
        :icon="['fas', 'bell']"
        class="cursor-pointer"
        @click="movePage.myAlarm()"
      />
    </div>

    <slot />
  </header>
</template>
