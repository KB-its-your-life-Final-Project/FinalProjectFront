import { Api } from "@/api/autoLoad/Api";
import type {
  SafeReportRequestDto,
  RentalRatioAndBuildyear,
  ViolationStatus,
  FloorAndPurpose,
} from "@/api/autoLoad/data-contracts";

const api = new Api();

export interface SafeReportData {
  rentalRatioAndBuildyear: RentalRatioAndBuildyear | null;
  violationStatus?: ViolationStatus;
  floorAndPurposeList?: FloorAndPurpose[];
}

export class SafeReportService {
  /**
   * 안전 리포트 생성 API 호출
   */
  static async generateSafeReport(requestDto: SafeReportRequestDto): Promise<SafeReportData> {
    try {
      const { data } = await api.generateSafeReportUsingPost(requestDto);

      return {
        rentalRatioAndBuildyear: data.data?.rentalRatioAndBuildyear ?? null,
        violationStatus: data.data?.violationStatus,
        floorAndPurposeList: data.data?.floorAndPurposeList,
      };
    } catch (error) {
      console.error("전송 실패: ", error);
      throw error;
    }
  }

  /**
   * localStorage에서 저장된 리포트 데이터 로드
   */
  static loadSavedReportData(): SafeReportData | null {
    const savedReportDataStr = localStorage.getItem("savedReportData");
    if (!savedReportDataStr) return null;

    try {
      const savedData = JSON.parse(savedReportDataStr);
      return {
        rentalRatioAndBuildyear: savedData.rentalRatioAndBuildyear ?? null,
        violationStatus: savedData.violationStatus,
        floorAndPurposeList: savedData.floorAndPurposeList,
      };
    } catch (error) {
      console.error("저장된 데이터 파싱 실패:", error);
      return null;
    }
  }

  /**
   * localStorage에서 건물 정보 로드
   */
  static loadBuildingInfo() {
    return {
      buildingName: localStorage.getItem("buildingName") || "",
      budget: localStorage.getItem("budget")
        ? parseInt(localStorage.getItem("budget")!)
        : undefined,
      roadAddress: localStorage.getItem("roadAddress") || "",
    };
  }

  /**
   * localStorage 정리
   */
  static clearLocalStorage() {
    localStorage.removeItem("savedReportData");
    localStorage.removeItem("fromRecentReports");
    localStorage.removeItem("buildingName");
    localStorage.removeItem("budget");
    localStorage.removeItem("roadAddress");
  }

  /**
   * 데이터 유효성 검사
   */
  static validateReportData(data: SafeReportData) {
    const hasNoData = data.rentalRatioAndBuildyear?.dealAmount === 0;
    const hasHighRatio = (data.rentalRatioAndBuildyear?.reverseRentalRatio ?? 0) >= 100;

    return {
      hasNoData,
      hasHighRatio,
    };
  }
}
