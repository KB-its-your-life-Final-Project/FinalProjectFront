<script setup lang="ts">
import DatePicker from "vue-datepicker-next";
import "vue-datepicker-next/index.css";
import { ref, watch } from "vue";
const props = defineProps<{
  label: string;
  modelValue: Date | null;
  format?: string;
  inputClass?: string;
}>();
const emit = defineEmits<{
  (e: "update:modelValue", value: Date | null): void;
}>();

const internalDate = ref<Date | null>(props.modelValue);

// 내부값이 바뀌면 부모에게 알림
watch(internalDate, (newVal) => {
  emit("update:modelValue", newVal);
});
</script>

<template>
  <div class="relative w-full mt-5">
    <div class="absolute -top-2 left-3 text-sm test-gray-500 bg-white z-1">{{ label }}</div>
    <DatePicker
      v-model:value="internalDate"
      :format="format ?? 'YYYY-MM-DD'"
      :input-class="inputClass ?? 'border p-2 rounded w-full'"
    />
  </div>
</template>
