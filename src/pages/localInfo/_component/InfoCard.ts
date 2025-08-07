import { Api } from "@/api/autoLoad/Api";

export type InfoCardType = {
  icon: string;
  title: string;
  value: string;
  description: string;
  color: string;
  apiCall?: (regionCd: string) => Promise<string>;
};

const api = new Api();

// 공통 API 호출 함수
const fetchApiData = async (
  apiMethod: (query: { regionCd: string }, params?: any) => Promise<any>,
  regionCd: string,
  dataKey: string,
  errorMessage: string,
): Promise<string> => {
  try {
    const response = await apiMethod({ regionCd });

    if (!response.data?.success) {
      return "--";
    }

    const data = response.data?.data;
    if (data && data[dataKey] !== null && data[dataKey] !== undefined) {
      const value = data[dataKey];

      // 청년 비율인 경우 퍼센트로 변환
      if (dataKey === "youthRatio") {
        return `${(value * 100).toFixed(1)}%`;
      }

      // 나머지는 숫자 포맷팅
      return `${value.toLocaleString()}개`;
    }

    return "--";
  } catch (err: unknown) {
    console.error(errorMessage, err);
    return "--";
  }
};

// 각 카드별 API 호출 함수들
const fetchPopulationInfo = (regionCd: string) =>
  fetchApiData(api.getPopulationByRegionCdUsingGet, regionCd, "youthRatio", "인구 정보 조회 실패");

const fetchFacilityInfo = (regionCd: string) =>
  fetchApiData(
    api.getFacilityCountsByRegionCdUsingGet,
    regionCd,
    "totalBicycleCount",
    "편의시설 정보 조회 실패",
  );

const fetchSafetyInfo = (regionCd: string) =>
  fetchApiData(
    api.getSafetyCountsByRegionCdUsingGet,
    regionCd,
    "totalCount",
    "치안시설 정보 조회 실패",
  );

const fetchHospitalInfo = (regionCd: string) =>
  fetchApiData(
    api.getHospitalCountsByRegionCdUsingGet,
    regionCd,
    "totalCount",
    "병원 정보 조회 실패",
  );

export const InfoCardList: InfoCardType[] = [
  {
    icon: "fa-solid fa-users",
    title: "청년 인구비율",
    value: "--",
    description: "전체 주민 대비 청년 주민수",
    color: "text-blue-500",
    apiCall: fetchPopulationInfo,
  },
  {
    icon: "fa-solid fa-motorcycle",
    title: "공공자전거",
    value: "--",
    description: "따릉이 대여소 수",
    color: "text-green-500",
    apiCall: fetchFacilityInfo,
  },
  {
    icon: "fa-solid fa-shield-halved",
    title: "치안시설",
    value: "--",
    description: "안심벨 개수",
    color: "text-yellow-500",
    apiCall: fetchSafetyInfo,
  },
  {
    icon: "fa-solid fa-first-aid",
    title: "병원",
    value: "--",
    description: "자치구 응급의료기관 수",
    color: "text-red-500",
    apiCall: fetchHospitalInfo,
  },
];
