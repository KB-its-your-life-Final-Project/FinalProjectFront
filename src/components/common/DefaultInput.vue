<script setup lang="ts">
/** 
  커스텀 입력 컴포넌트.
  일반 입력 또는 금액 입력(type="money")을 지원하며,
  금액 입력 시 숫자만 허용하고 천억 이하만 입력 가능, 자동 포맷 표시.
  옵션으로 우측 버튼을 노출하고 클릭 이벤트를 부모로 전달할 수 있음.
*/
import { computed, ref, watch } from "vue";
import { sanitizeNumberInput, formatAmount } from "@/utils/numberUtils";
const props = defineProps<{
  label: string;
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

// 실제 숫자 값만 저장 (만원 단위)
const formatted = computed(() => {
  const n = String(props.modelValue ?? "").replace(/\D/g, "");
  return n ? formatAmount(Number(n)) : "";
});

function onInput(e: Event) {
  const input = e.target as HTMLInputElement;
  const val = input.value;

  if (props.type === "money") {
    // 숫자만 추출
    const numStr = sanitizeNumberInput(val);

    // 만약 입력값에 숫자가 아닌 문자가 포함되어 있다면 이전 값 복원
    if (val !== numStr) {
      input.value = rawValue.value;
      return;
    }

    const num = Number(numStr || "0") * 10000;
    const MAX_AMOUNT = 100000000000; // 천억
    if (num > MAX_AMOUNT) {
      // 천억 초과 시 이전 값 복원
      input.value = rawValue.value;
      return;
    }
    rawValue.value = numStr;
    emit("update:modelValue", rawValue.value);
  } else {
    rawValue.value = val;
    emit("update:modelValue", val);
  }
}
watch(
  () => props.modelValue,
  (val) => {
    rawValue.value = String(val ?? "");
  },
);

const displayValue = computed(() => {
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
      />
      <div
        v-if="type === 'money' && rawValue"
        class="absolute top-1/2 -translate-y-1/2 right-3 text-gray-500 text-sm pointer-events-none"
      >
        {{ formatted }}
      </div>
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
