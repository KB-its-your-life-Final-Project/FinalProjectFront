<script lang="ts" setup>
import { defineEmits } from "vue";

const props = defineProps<{
  modelValue: string;
  options: { label: string; value: string }[];
  rounded?: boolean;
}>();

const emit = defineEmits<{
  (e: "update:modelValue", value: string): void;
  (e: "change", value: string): void;
}>();

function select(value: string) {
  emit("update:modelValue", value);
  emit("change", value);
}

const isFirst = (idx: number) => idx === 0;
const isLast = (idx: number) => idx === props.options.length - 1;
</script>

<template>
  <div
    class="flex w-full border border-gray-300 overflow-hidden"
    :class="{ 'rounded-full': rounded }"
  >
    <button
      v-for="(option, idx) in options"
      :key="option.value"
      class="flex-1 py-1 text-center transition-all duration-200 cursor-pointer"
      :class="[
        modelValue === option.value
          ? 'bg-kb-yellow-positive text-white border border-gray-300'
          : 'bg-gray-100 text-gray-700 border border-gray-300',
        isFirst(idx) && rounded ? 'rounded-l-full' : '',
        isLast(idx) && rounded ? 'rounded-r-full' : '',
      ]"
      @click="select(option.value)"
    >
      {{ option.label }}
    </button>
  </div>
</template>
