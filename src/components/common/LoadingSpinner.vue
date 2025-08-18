<script setup lang="ts">
/**
 * 커스텀 로딩 스피너 컴포넌트.
 * 크기, 테두리 두께/색상, margin 등을 props로 제어 가능.
 * 옵션에 따라 border-top 투명 처리나 border-bottom-only 모드 지원.
 */
import { computed, defineProps } from "vue";

const props = defineProps({
  size: { type: String, default: "h-12 w-12" },
  borderWidth: { type: String, default: "border-4" },
  borderColor: { type: String, default: "border-kb-yellow" },
  marginBottom: { type: String, default: "mb-4" },
  borderTopTransparent: { type: Boolean, default: false },
  borderBottomOnly: { type: Boolean, default: true },
});

const sizeClass = computed(() => props.size);
const borderWidthClass = computed(() => (props.borderBottomOnly ? "" : props.borderWidth));
const borderColorClass = computed(() => props.borderColor);
const marginBottomClass = computed(() => props.marginBottom);
</script>

<template>
  <div
    :class="[
      'animate-spin rounded-full mx-auto',
      sizeClass,
      borderWidthClass,
      borderColorClass,
      marginBottomClass,
      borderTopTransparent ? 'border-t-transparent' : '',
      borderBottomOnly ? 'border-b-2' : '',
    ]"
  ></div>
</template>
