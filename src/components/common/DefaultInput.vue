<script setup lang="ts">
import { computed, ref, watch } from "vue";
const props = defineProps<{
  label: string;
  oldData?: string;
  modelValue?: string;
  disabled?: boolean;
  placeholder?: string;
  type: string;
  showButton?: boolean;
  buttonLabel?: string;
}>();
const emit = defineEmits<{
  (e: "update:modelValue", value: string): void;
  (e: "button-click"): void;
}>();

// 내부 값 관리
const rawValue = ref(String(props.modelValue ?? ""));

// 실제 숫자 값만 저장
const formatted = computed(() => {
  const n = rawValue.value.replace(/\D/g, "");
  return n ? Number(n).toLocaleString() + "원" : "";
});

function onInput(e: Event) {
  const val = (e.target as HTMLInputElement).value;
  if (props.type === "money") {
    rawValue.value = val.replace(/\D/g, "");
    emit("update:modelValue", rawValue.value);
  } else {
    rawValue.value = val;
    emit("update:modelValue", val);
  }
}
function onBlur(event: FocusEvent) {
  if (props.type !== "money") return;
  const target = event.target as HTMLInputElement;
  const rawValue = target.value.replace(/[^\d]/g, "");
  target.value = Number(rawValue).toLocaleString() + "원";
}
watch(
  () => props.modelValue,
  (val) => {
    rawValue.value = String(val ?? "");
  },
);

const displayValue = computed(() => {
  if (props.disabled) return props.oldData ?? "";
  if (props.type === "money") return rawValue.value;
  return rawValue.value;
});
</script>

<template>
  <div>
    <label :for="label" class="pl-1">{{ label }}</label>
    <div class="relative mt-2">
      <input
        :id="label"
        class="w-full border border-gray-300 rounded-xl px-3 py-2 pr-28"
        :type="type === 'money' ? 'text' : type"
        :disabled="disabled"
        :value="displayValue"
        :placeholder="placeholder"
        @input="onInput"
        @blur="onBlur"
      />
      <span
        v-if="type === 'money' && rawValue"
        class="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 text-sm pointer-events-none"
      >
        {{ formatted }}
      </span>
      <button
        v-if="showButton"
        class="absolute right-0 top-0 h-full px-4 min-w-[80px] rounded-r-xl bg-kb-yellow-positive text-white"
        @click="emit('button-click')"
      >
        {{ buttonLabel || "버튼" }}
      </button>
    </div>
  </div>
</template>
