import { ref } from "vue";
import { numberToKorean, sanitizeNumberInput, validateBudgetInput } from "@/utils/numberUtils";

export function useBudgetInput(initialBudget?: number) {
  const rawInput = ref(""); // 사용자가 입력한 숫자 문자열
  const budget = ref<number | undefined>(initialBudget);
  const displayValue = ref(""); // 변환된 한글 금액
  const showError = ref(false);
  const inputRef = ref<HTMLInputElement>();

  /**
   * 입력값 처리
   * @param e - 입력 이벤트
   */
  const handleInput = (e: Event) => {
    let val = (e.target as HTMLInputElement).value;

    // 숫자 이외 입력 제거
    val = sanitizeNumberInput(val);

    if (val === "") {
      rawInput.value = "";
      showError.value = false;
      updateDisplay();
      return;
    }

    // 최대값 검증
    const validation = validateBudgetInput(val, 999999);
    if (!validation.isValid) {
      showError.value = true;
      rawInput.value = validation.value;
    } else {
      showError.value = false;
      rawInput.value = val;
    }

    updateDisplay();
  };

  /**
   * 표시값 업데이트
   */
  const updateDisplay = () => {
    if (rawInput.value === "") {
      displayValue.value = "";
      budget.value = undefined;
      return;
    }

    const numeric = Number(rawInput.value);
    displayValue.value = numberToKorean(numeric * 10000);
    budget.value = numeric;
  };

  /**
   * 입력 필드 포커스
   */
  const focusInput = () => {
    setTimeout(() => {
      inputRef.value?.focus();
    }, 100);
  };

  /**
   * 입력값 초기화
   */
  const resetInput = () => {
    rawInput.value = "";
    budget.value = undefined;
    displayValue.value = "";
    showError.value = false;
  };

  return {
    // 상태
    rawInput,
    budget,
    displayValue,
    showError,
    inputRef,

    // 메서드
    handleInput,
    updateDisplay,
    focusInput,
    resetInput,
  };
}
