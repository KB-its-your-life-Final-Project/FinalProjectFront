import type {
  SafeReportRequestDto,
  RentalRatioAndBuildyear,
  FloorAndPurpose,
  ViolationStatus,
} from "@/api/autoLoad/data-contracts";

// 초기 폼 데이터
export const INIT_FORM_DATA: SafeReportRequestDto = {
  buildingName: "",
  roadAddress: "",
  jibunAddress: "",
  dongName: "",
  lat: 0,
  lng: 0,
  budget: undefined,
};

// 스텝 정의
export enum SafeReportStep {
  SEARCH_BUILDING = 0,
  SELECT_BUDGET = 1,
  RESULT = 2,
}

// 스텝별 초기화 설정
export interface StepResetConfig {
  [SafeReportStep.SEARCH_BUILDING]: {
    resetFields: (keyof SafeReportRequestDto)[];
  };
  [SafeReportStep.SELECT_BUDGET]: {
    resetFields: (keyof SafeReportRequestDto)[];
  };
  [SafeReportStep.RESULT]: {
    resetFields: (keyof SafeReportRequestDto)[];
  };
}

export const STEP_RESET_CONFIG: StepResetConfig = {
  [SafeReportStep.SEARCH_BUILDING]: {
    resetFields: ["buildingName", "roadAddress", "jibunAddress", "dongName", "lat", "lng"],
  },
  [SafeReportStep.SELECT_BUDGET]: {
    resetFields: ["budget"],
  },
  [SafeReportStep.RESULT]: {
    resetFields: [],
  },
};

// Store 상태 타입
export interface SafeReportState {
  currentStep: number;
  formData: SafeReportRequestDto;
  resultData: RentalRatioAndBuildyear | null;
  violationStatus: string | null;
  floorAndPurposeList: FloorAndPurpose[] | null;
}

// Export 타입들
export type { SafeReportRequestDto, RentalRatioAndBuildyear, FloorAndPurpose, ViolationStatus };
