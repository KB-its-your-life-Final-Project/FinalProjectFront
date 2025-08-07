import { computed } from 'vue';
import type { SafeReportResponseDto } from '@/api/autoLoad/data-contracts';

export interface TotalGradeInfo {
  text: string;
  color: {
    bg: string;
    text: string;
    label: string;
  };
  riskText: string;
}

export function useTotalGradeCalculation(resultData: () => SafeReportResponseDto | null) {
  const totalGradeText = computed(() => {
    const data = resultData();
    if (!data || typeof data.totalScore !== "number" || data.totalScore === 0) return "-";
    if (data.totalScore >= 8) return "안전";
    else if (data.totalScore >= 5) return "주의";
    else return "위험";
  });

  const totalGradeColor = computed(() => {
    const data = resultData();
    if (!data || typeof data.totalScore !== "number" || data.totalScore === 0) {
      return {
        bg: "bg-gray-100",
        text: "text-gray-400",
        label: "-",
      };
    }

    if (data.totalScore >= 8) {
      return {
        bg: "bg-yellow-100",
        text: "text-yellow-600",
        label: "안전",
      };
    } else if (data.totalScore >= 5) {
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

  const totalRiskText = computed(() => {
    if (totalGradeText.value === "위험" || totalGradeText.value === "주의") {
      return "전체적인 안전성에 대한 리스크가 있습니다.";
    } else if (totalGradeText.value === "안전") {
      return "전체적인 안전성이 확보되어 있습니다.";
    }
    return "";
  });

  const totalGradeInfo = computed<TotalGradeInfo>(() => ({
    text: totalGradeText.value,
    color: totalGradeColor.value,
    riskText: totalRiskText.value,
  }));

  return {
    totalGradeText,
    totalGradeColor,
    totalRiskText,
    totalGradeInfo,
  };
}
