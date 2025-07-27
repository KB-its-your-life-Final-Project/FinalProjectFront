import { defineStore } from "pinia";
import { ref, reactive } from "vue";

// 서버로 전송할 데이터터
interface FormData {
  buildingName: string;
  roadAddress: string; // 도로명주소
  jibunAddress: string; // 지번주소
  dongName: string; // 법정동주소
  lat: number; // 위도
  lng: number; // 경도
  budget: number | null;
}

interface BuildingInfo {
  // 건물 정보 (위반 건축물 여부부, 건물 용도)
  [key: string]: unknown;
}

interface ResultData {
  // 결과 데이터  (건축년도, 역전세율)
  [key: string]: unknown;
}

const initFormData: FormData = {
  buildingName: '',
  roadAddress: '',
  jibunAddress: '',
  dongName: '',
  lat: 0,
  lng: 0,
  budget: null,
};

export const safeReportStore = defineStore("safeReport", () => {
  const currentStep = ref(0);
  const formData = reactive<FormData>({ ...initFormData });
  const resultData = ref<ResultData | null>(null);
  const buildingInfo = ref<BuildingInfo | null>(null);

  const updateFormData = (updated: Partial<FormData>) => {
    Object.assign(formData, updated);
  };

  const nextStep = (payload?: { resultData?: unknown; buildingInfo?: unknown }) => {
    if (payload?.resultData) {
      resultData.value = payload.resultData as ResultData;
    }
    if (payload?.buildingInfo) {
      buildingInfo.value = payload.buildingInfo as BuildingInfo;
    }
    currentStep.value++;
  };

  const prevStep = () => {
    const from = currentStep.value;
    currentStep.value--;

    if (from === 1) {
      // 1→0: 건물 정보 초기화
      formData.buildingName = '';
    } else if (from === 2) {
      // 2→1: 예산 정보 초기화
      formData.budget = null;
      console.log("초기화된 budget 값:", formData.budget);
    }
  };

  const resetStore = () => {
    currentStep.value = 0;
    Object.assign(formData, initFormData);
    resultData.value = null;
    buildingInfo.value = null;
  };

  return {
    currentStep,
    formData,
    resultData,
    buildingInfo,

    updateFormData,
    nextStep,
    prevStep,
    resetStore,
  };
});
