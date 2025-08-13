<script setup lang="ts">
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
