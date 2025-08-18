<script setup lang="ts">
/**
 * 토글 스위치 컴포넌트
 * 1. modelValue 기반으로 상태(on/off) 결정
 * 2. 클릭 시 toggle 함수로 상태 반전 후 부모에 update:modelValue 이벤트 발생
 * 3. 배경 색상(isOn)에 따라 변경 (노랑/회색)
 * 4. 스위치 원 위치도 isOn에 따라 이동
 * 5. CSS transition으로 부드러운 색상/위치 변경
 */
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
