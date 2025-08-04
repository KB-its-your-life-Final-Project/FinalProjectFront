import { reactive, ref } from 'vue';
import type {
  SafeReportRequestDto,
  RentalRatioAndBuildyear,
  FloorAndPurpose,
  ViolationStatus
} from '../types';
import { INIT_FORM_DATA } from '../types';

export function useDataManagement() {
  const formData = reactive<SafeReportRequestDto>({ ...INIT_FORM_DATA });
  const resultData = ref<RentalRatioAndBuildyear | null>(null);
  const violationStatus = ref<string | null>(null);
  const floorAndPurposeList = ref<FloorAndPurpose[] | null>(null);

  /**
   * 폼 데이터 업데이트
   * @param updated - 업데이트할 데이터
   */
  const updateFormData = (updated: Partial<SafeReportRequestDto>) => {
    Object.assign(formData, updated);
  };

  /**
   * API 호출용 DTO 생성
   * @returns SafeReportRequestDto
   */
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

  /**
   * 결과 데이터 업데이트
   * @param data - 결과 데이터
   */
  const updateResultData = (data: RentalRatioAndBuildyear | null) => {
    resultData.value = data;
  };

  /**
   * 위반 상태 업데이트
   * @param status - 위반 상태
   */
  const updateViolationStatus = (status: string | null) => {
    violationStatus.value = status;
  };

  /**
   * 층별 용도 목록 업데이트
   * @param data - 층별 용도 목록
   */
  const updateFloorAndPurposeList = (data: FloorAndPurpose[] | null) => {
    floorAndPurposeList.value = data;
  };

  /**
   * ViolationStatus 객체로부터 위반 상태 업데이트
   * @param data - ViolationStatus 객체
   */
  const updateViolationStatusVO = (data: ViolationStatus | null) => {
    violationStatus.value = data?.violationStatus ?? null;
  };

  /**
   * 모든 데이터 초기화
   */
  const resetAllData = () => {
    Object.assign(formData, INIT_FORM_DATA);
    resultData.value = null;
    violationStatus.value = null;
    floorAndPurposeList.value = null;
  };

  /**
   * 폼 데이터만 초기화
   */
  const resetFormData = () => {
    Object.assign(formData, INIT_FORM_DATA);
  };

  return {
    // 상태
    formData,
    resultData,
    violationStatus,
    floorAndPurposeList,

    // 메서드
    updateFormData,
    createRequestDto,
    updateResultData,
    updateViolationStatus,
    updateFloorAndPurposeList,
    updateViolationStatusVO,
    resetAllData,
    resetFormData,
  };
}
