<script lang="ts" setup>
import { defineProps, defineEmits } from "vue";

const props = defineProps<{
  modelValue: string;
  options: { label: string; value: string }[];
}>();

const emit = defineEmits<{
  (e: "update:modelValue", value: string): void;
}>();

function select(value: string) {
  emit("update:modelValue", value);
}

const isFirst = (idx: number) => idx === 0;
const isLast = (idx: number) => idx === props.options.length - 1;
</script>

<template>
  <div class="flex w-full border border-gray-300 rounded-full overflow-hidden">
    <button
      v-for="(option, idx) in options"
      :key="option.value"
      class="flex-1 py-2 text-center transition-all duration-200 border-r last:border-r-0"
      :class="[
        modelValue === option.value
          ? 'bg-kb-yellow-positive text-white border border-gray-300'
          : 'bg-gray-100 text-gray-700 border-transparent',
        isFirst(idx) ? 'rounded-l-full' : '',
        isLast(idx) ? 'rounded-r-full' : '',
      ]"
      @click="select(option.value)"
    >
      {{ option.label }}
    </button>
  </div>
</template>
