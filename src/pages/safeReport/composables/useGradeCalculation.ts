import { computed } from 'vue';
import type { RentalRatioAndBuildyear } from '@/api/autoLoad/data-contracts';

export interface GradeInfo {
  text: string;
  color: {
    bg: string;
    text: string;
    label: string;
  };
  riskText: string;
}

export function useGradeCalculation(resultData: () => RentalRatioAndBuildyear | null) {
  const gradeText = computed(() => {
    const data = resultData();
    if (!data || typeof data.score !== "number" || data.dealAmount === 0) return "조회 불가";
    if (data.score === 10) return "안전";
    else if (data.score === 6) return "주의";
    else return "위험";
  });

  const gradeColor = computed(() => {
    const data = resultData();
    if (!data || typeof data.score !== "number" || data.dealAmount === 0) {
      return {
        bg: "bg-gray-100",
        text: "text-gray-400",
        label: "조회 불가",
      };
    }

    if (data.score === 10) {
      return {
        bg: "bg-yellow-100",
        text: "text-yellow-600",
        label: "안전",
      };
    } else if (data.score === 6) {
      return {
        bg: "bg-orange-100",
        text: "text-orange-500",
        label: "주의",
      };
    } else {
      return {
        bg: "bg-red-100",
        text: "text-red-600",
        label: "위험",
      };
    }
  });

  const riskText = computed(() => {
    if (gradeText.value === "위험" || gradeText.value === "주의") {
      return "보증금 회수에 대한 리스크가 있습니다.";
    } else if (gradeText.value === "안전") {
      return "보증금 회수에 대한 리스크가 없습니다.";
    }
    return "";
  });

  const gradeInfo = computed<GradeInfo>(() => ({
    text: gradeText.value,
    color: gradeColor.value,
    riskText: riskText.value,
  }));

  return {
    gradeText,
    gradeColor,
    riskText,
    gradeInfo,
  };
}
