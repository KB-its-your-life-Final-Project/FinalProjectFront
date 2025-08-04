<script setup lang="ts">
import { computed } from "vue";

const props = defineProps<{
  modelValue: boolean;
}>();
const emit = defineEmits<{
  (e: "update:modelValue", value: boolean): void;
}>();

const isOn = computed({
  get() {
    return props.modelValue;
  },
  set(value: boolean) {
    emit("update:modelValue", value);
  },
});

function toggle() {
  isOn.value = !isOn.value;
}
</script>

<template>
  <button
    :class="[
      'relative w-15 h-7 rounded-full transition-colors duration-300 cursor-pointer',
      isOn ? 'bg-kb-yellow' : 'bg-gray-200',
    ]"
    @click="toggle"
  >
    <div
      class="w-6 h-6 bg-white rounded-full shadow-md absolute top-1/2 transform -translate-y-1/2 transition-transform duration-300"
      :class="isOn ? 'translate-x-8' : 'translate-x-1'"
    ></div>
  </button>
</template>
