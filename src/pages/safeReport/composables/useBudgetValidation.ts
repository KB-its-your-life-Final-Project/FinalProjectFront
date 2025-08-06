import { ref } from "vue";

export interface BudgetValidationResult {
  isValid: boolean;
  message: string;
}

export function useBudgetValidation() {
  const showValidationModal = ref(false);
  const validationMessage = ref("");

  /**
   * 예산 유효성 검사
   * @param budget - 검증할 예산 값
   * @returns 검증 결과
   */
  const validateBudget = (budget: number | undefined): BudgetValidationResult => {
    const budgetValue = Number(budget);

    // 100만원(=100) 이하 불가
    if (budget == null || budgetValue <= 0 || !Number.isFinite(budgetValue)) {
      return {
        isValid: false,
        message: "예산을 올바르게 입력해주세요!",
      };
    }

    if (budgetValue < 100) {
      return {
        isValid: false,
        message: "예산은 100만원 이상이어야 합니다!",
      };
    }

    return {
      isValid: true,
      message: "",
    };
  };

  /**
   * 검증 실패 시 모달 표시
   * @param message - 표시할 메시지
   */
  const showValidationError = (message: string) => {
    validationMessage.value = message;
    showValidationModal.value = true;
  };

  /**
   * 모달 확인 핸들러
   */
  const handleValidationConfirm = () => {
    return { success: true, message: "확인되었습니다." };
  };

  /**
   * 모달 닫기
   */
  const closeValidationModal = () => {
    showValidationModal.value = false;
  };

  return {
    showValidationModal,
    validationMessage,
    validateBudget,
    showValidationError,
    handleValidationConfirm,
    closeValidationModal,
  };
}
