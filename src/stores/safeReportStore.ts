import { defineStore } from "pinia";
import { ref, reactive } from "vue";
import type {
  SafeReportRequestDto,
  RentalRatioAndBuildyear,
  FloorAndPurpose,
  ViolationStatusVO
} from "@/api/autoLoad/data-contracts";

const initFormData: SafeReportRequestDto = {
  buildingName: "",
  roadAddress: "",
  jibunAddress: "",
  dongName: "",
  lat: 0,
  lng: 0,
  budget: undefined,
};

export const safeReportStore = defineStore("safeReport", () => {
  const currentStep = ref(0);
  const formData = reactive<SafeReportRequestDto>({ ...initFormData });
  const resultData = ref<RentalRatioAndBuildyear | null>(null);
  const violationStatus = ref<string | null>(null);
  const floorAndPurposeList = ref<FloorAndPurpose[] | null>(null);

  const updateFormData = (updated: Partial<SafeReportRequestDto>) => {
    Object.assign(formData, updated);
  };

  // API 호출용 DTO 생성 메서드
  const createRequestDto = (): SafeReportRequestDto => {
    return {
      budget: formData.budget,
      buildingName: formData.buildingName,
      dongName: formData.dongName,
      jibunAddress: formData.jibunAddress,
      lat: formData.lat,
      lng: formData.lng,
      roadAddress: formData.roadAddress,
    };
  };

  const nextStep = (payload?: { resultData?: unknown; buildingInfo?: unknown }) => {
    if (payload?.resultData) {
      resultData.value = payload.resultData as RentalRatioAndBuildyear;
    }
    currentStep.value++;
  };

  const prevStep = () => {
    const from = currentStep.value;
    currentStep.value--;

    if (from === 1) {
      // 1→0: 건물 정보 초기화
      formData.buildingName = "";
    } else if (from === 2) {
      // 2→1: 예산 정보 초기화
      formData.budget = undefined;
      console.log("초기화된 budget 값:", formData.budget);
    }
  };

  const resetStore = () => {
    currentStep.value = 0;
    Object.assign(formData, initFormData);
    resultData.value = null;
    violationStatus.value = null;
    floorAndPurposeList.value = null;
  };

  const updateResultData = (data: RentalRatioAndBuildyear | null) => {
    resultData.value = data;
  };

  const updateViolationStatus = (status: string | null) => {
    violationStatus.value = status;
  };

  const updateFloorAndPurposeList = (data: FloorAndPurpose[] | null) => {
    floorAndPurposeList.value = data;
  };

  const updateViolationStatusVO = (data: ViolationStatusVO | null) => {
    violationStatus.value = data?.violationStatus ?? null;
  };

  return {
    currentStep,
    formData,
    resultData,
    violationStatus,
    floorAndPurposeList,

    updateFormData,
    createRequestDto,
    nextStep,
    prevStep,
    resetStore,
    updateResultData,
    updateViolationStatus,
    updateFloorAndPurposeList,
    updateViolationStatusVO,
  };
});
