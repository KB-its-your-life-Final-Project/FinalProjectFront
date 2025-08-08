import { defineStore } from "pinia";
import { useStepManagement } from "@/pages/safeReport/composables/useStepManagement";
import { useDataManagement } from "@/pages/safeReport/composables/useDataManagement";

export const safeReportStore = defineStore("safeReport", () => {
  // 스텝 관리
  const { currentStep, nextStep, prevStep, goToStep, isCurrentStep, resetStep } =
    useStepManagement();

  // 데이터 관리
  const {
    formData,
    resultData,
    safeReportData,
    violationStatus,
    floorAndPurposeList,
    updateFormData,
    createRequestDto,
    updateResultData,
    updateSafeReportData,
    updateViolationStatus,
    updateFloorAndPurposeList,
    updateViolationStatusVO,
    resetAllData,
    resetFormData,
  } = useDataManagement();

  /**
   * 스텝 이동 시 데이터 초기화를 포함한 prevStep
   */
  const prevStepWithReset = () => {
    prevStep(formData);
  };

  /**
   * 스토어 전체 초기화
   */
  const resetStore = () => {
    resetStep();
    resetAllData();
  };

  return {
    // 스텝 관련
    currentStep,
    nextStep,
    prevStep: prevStepWithReset,
    goToStep,
    isCurrentStep,
    resetStep,

    // 데이터 관련
    formData,
    resultData,
    safeReportData,
    violationStatus,
    floorAndPurposeList,

    // 데이터 업데이트
    updateFormData,
    createRequestDto,
    updateResultData,
    updateSafeReportData,
    updateViolationStatus,
    updateFloorAndPurposeList,
    updateViolationStatusVO,

    // 초기화
    resetStore,
    resetAllData,
    resetFormData,
  };
});
