<script setup lang="ts">
import ToggleButton from "@/components/common/ToggleButton.vue";
import { computed } from "vue";
const props = defineProps<{
  main?: string;
  sub?: string;
  setting: boolean;
}>();
const emit = defineEmits<{
  (e: "update:setting", value: boolean): void;
}>();
const internalSetting = computed({
  get() {
    return props.setting; // 부모가 준 값 읽기
  },
  set(value: boolean) {
    emit("update:setting", value); // 값이 바뀌면 부모에 알림
  },
});
</script>

<template>
  <div class="flex justify-between items-center border-b py-5 border-gray-200">
    <div>
      <div>
        <div class="text-lg">{{ main }}</div>
        <div v-if="typeof sub === 'string'" class="text-md text-gray-400 pt-1">{{ sub }}</div>
      </div>
    </div>
    <ToggleButton v-model="internalSetting" />
  </div>
</template>
