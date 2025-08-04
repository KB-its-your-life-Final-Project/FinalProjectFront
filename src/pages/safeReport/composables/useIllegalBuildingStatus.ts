import { computed } from 'vue';

export interface IllegalBuildingInfo {
  bg: string;
  text: string;
  label: string;
}

export function useIllegalBuildingStatus(violationStatus: () => string | null) {
  const illegalBox = computed<IllegalBuildingInfo>(() => {
    const status = violationStatus();
    // 조회 불가
    if (status === null || status === undefined) {
      return {
        bg: 'bg-gray-200',
        text: 'text-gray-500',
        label: '조회 불가',
      };
    }
    // 위험 (위반건축물)
    else if (status === '위반건축물') {
      return {
        bg: 'bg-red-100',
        text: 'text-red-600',
        label: '있음',
      };
    }
    // 안전 건축물
    else {
      return {
        bg: 'bg-green-100',
        text: 'text-green-700',
        label: '없음',
      };
    }
  });

  return {
    illegalBox,
  };
}
