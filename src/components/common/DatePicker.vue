<script setup lang="ts">
import DatePicker from "vue-datepicker-next";
import "vue-datepicker-next/index.css";
import { ref, watch } from "vue";
const props = defineProps<{
  modelValue: Date | null;
  format?: string;
  placeholder?: string;
}>();
const emit = defineEmits<{
  (e: "update:modelValue", value: Date | null): void;
}>();

const internalDate = ref<Date | null>(props.modelValue);

watch(internalDate, (newVal) => {
  emit("update:modelValue", newVal);
});
</script>

<template>
  <div class="w-full">
    <DatePicker
      v-model:value="internalDate"
      :format="format ?? 'YYYY-MM-DD'"
      inputClass="border border-gray-300 bg-gray-100 text-gray-400 px-2 py-1 w-full cursor-pointer"
      :placeholder="placeholder"
      style="width: 100%"
    />
  </div>
</template>
