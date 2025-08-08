import { ref } from "vue";
import type { SafeReportRequestDto } from "../types";
import { SafeReportStep, STEP_RESET_CONFIG } from "../types";

export function useStepManagement(initialStep = 0) {
  const currentStep = ref(initialStep);

  /**
   * 다음 스텝으로 이동
   */
  const nextStep = () => {
    currentStep.value++;
  };

  /**
   * 이전 스텝으로 이동하면서 해당 스텝의 데이터 초기화
   * @param formData - 폼 데이터 (초기화를 위해)
   */
  const prevStep = (formData: SafeReportRequestDto) => {
    const from = currentStep.value;
    currentStep.value--;

    // 스텝별 초기화 로직
    if (from === SafeReportStep.SELECT_BUDGET) {
      // 1→0: 건물 정보 초기화
      const resetFields = STEP_RESET_CONFIG[SafeReportStep.SEARCH_BUILDING].resetFields;
      resetFields.forEach((field: keyof SafeReportRequestDto) => {
        if (field === "lat" || field === "lng") {
          (formData as Record<string, number>)[field] = 0;
        } else if (field === "budget") {
          (formData as Record<string, undefined>)[field] = undefined;
        } else {
          (formData as Record<string, string>)[field] = "";
        }
      });
    } else if (from === SafeReportStep.RESULT) {
      // 2→1: 예산 정보 초기화
      const resetFields = STEP_RESET_CONFIG[SafeReportStep.SELECT_BUDGET].resetFields;
      resetFields.forEach((field: keyof SafeReportRequestDto) => {
        (formData as Record<string, undefined>)[field] = undefined;
      });
      console.log("초기화된 budget 값:", formData.budget);
    }
  };

  /**
   * 특정 스텝으로 이동
   * @param step - 이동할 스텝
   */
  const goToStep = (step: SafeReportStep) => {
    currentStep.value = step;
  };

  /**
   * 현재 스텝이 특정 스텝인지 확인
   * @param step - 확인할 스텝
   * @returns 현재 스텝이 해당 스텝인지 여부
   */
  const isCurrentStep = (step: SafeReportStep): boolean => {
    return currentStep.value === step;
  };

  /**
   * 스텝 초기화
   */
  const resetStep = () => {
    currentStep.value = 0;
  };

  return {
    currentStep,
    nextStep,
    prevStep,
    goToStep,
    isCurrentStep,
    resetStep,
  };
}
