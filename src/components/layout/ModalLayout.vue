<script setup lang="ts">
import { computed } from "vue";

const props = defineProps<{
  verticalAlign?: "top" | "middle" | "bottom";
  offset?: number;
}>();

// Tailwind가 동적 클래스로는 적용되지 않아 직접 스타일 지정
const styleValue = computed(() => {
  const offset = props.offset ?? 32; // 기본 32px
  switch (props.verticalAlign) {
    case "top":
      return { top: `${offset}px` };
    case "bottom":
      return { bottom: `${offset}px` };
    case "middle":
    default:
      return { top: "50%", transform: "translateY(-50%)" };
  }
});
</script>

<template>
  <div class="absolute left-1/2 -translate-x-1/2 w-full px-4 max-w-md" :style="styleValue">
    <div class="bg-white rounded-xl shadow-lg p-8">
      <slot></slot>
    </div>
  </div>
</template>
