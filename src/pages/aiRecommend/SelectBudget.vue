<script setup lang="ts">
import { watch, onMounted } from "vue";
import { safeReportStore } from "@/stores/safeReportStore";
import ModalForm from "@/components/common/ModalForm.vue";
import { useBudgetInput } from "../safeReport/composables/useBudgetInput";
import { useBudgetValidation } from "../safeReport/composables/useBudgetValidation";

const store = safeReportStore();

// 예산 입력 관리
const { rawInput, budget, displayValue, inputRef, handleInput, focusInput } = useBudgetInput(
  store.formData.budget,
);

// 예산 검증 관리
const {
  showValidationModal,
  validationMessage,
  validateBudget,
  showValidationError,
  handleValidationConfirm,
} = useBudgetValidation();

// store와 동기화
watch(budget, (val) => {
  store.updateFormData({ budget: val });
});

onMounted(() => {
  focusInput();
});

// AI 추천 확인 버튼 클릭 시 부모 컴포넌트에 이벤트 emit
const emit = defineEmits<{
  next: [];
}>();

const next = () => {
  if (budget.value) {
    emit("next");
  }
};
</script>

<template>
  <div class="relative flex flex-col flex-1 min-h-screen px-6 gap-6 mt-6">
    <div>
      <h1 class="text-2xl font-pretendard-bold mb-1">예산은 얼마인가요?</h1>
      <h1 class="text-2xl font-pretendard-bold mb-1">더 상세한 정보를 제공해드릴게요!</h1>
    </div>

    <div class="relative w-full max-w-lg mx-auto">
      <!-- 한글 금액 표시 (input 위) -->
      <span v-if="rawInput.length >= 3" class="absolute right-4 -top-6 text-s text-kb-ui-04 mt-1">
        {{ displayValue }}원
      </span>
      <div class="flex items-center w-full">
        <input
          ref="inputRef"
          v-model="rawInput"
          @input="handleInput"
          type="text"
          maxlength="6"
          placeholder="보증금 예산 입력"
          class="w-full border border-kb-ui-06 rounded-full pl-4 pr-14 focus:outline-none bg-white cursor-text mt-1 text-base"
          style="height: 2.5rem; line-height: 2.5rem; padding-top: 0; padding-bottom: 0"
        />
        <span
          class="absolute right-4 top-0 bottom-0 flex items-center text-kb-ui-04 pointer-events-none text-base"
          style="height: 3rem; line-height: 2.5rem"
        >
          만원
        </span>
      </div>

      <div class="text-xs text-kb-ui-04 mt-2 text-right">예산은 100억원 미만이어야 합니다</div>
    </div>
    <div class="fixed z-auto inset-x-0 bottom-6 flex justify-end px-6 pb-24">
      <button
        @click="next"
        :disabled="!budget"
        class="px-4 py-2 bg-kb-yellow rounded text-kb-ui-11 terst disabled:opacity-50"
      >
        AI 추천 확인
      </button>
    </div>
  </div>

  <!-- 유효성 검사 모달 -->
  <ModalForm
    v-if="showValidationModal"
    title="예산 부적합"
    :handle-confirm="handleValidationConfirm"
    @close="showValidationModal = false"
  >
    <p>{{ validationMessage }}</p>
  </ModalForm>
</template>
