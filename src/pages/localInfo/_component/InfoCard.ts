import { Api } from "@/api/autoLoad/Api";

export type InfoCardType = {
  icon: string;
  title: string;
  value: string;
  description: string;
  apiCall?: (regionCd: string) => Promise<string>;
};

const api = new Api();

const fetchPopulationInfo = async (regionCd: string): Promise<string> => {
  try {
    const response = await api.getPopulationUsingGet({ regionCd: regionCd }, {});
    console.log("인구 API 응답:", response);

    const population = response.data?.data;
    if (population && population.populationYouth) {
      const youth = population.populationYouth;
      return `${youth.toLocaleString()}명`;
    } else {
      return "--";
    }
  } catch (err: unknown) {
    console.error("인구 정보 조회 실패:", err);
    return "--";
  }
};

const fetchFacilityInfo = async (regionCd: string): Promise<string> => {
  try {
    const response = await api.getFacilityCountsUsingGet({ regionCd: regionCd }, {});
    console.log("편의시설 API 응답:", response);

    const facility = response.data?.data;
    if (facility && facility.totalBicycleCount) {
      // 자전거 대수를 표시
      const bicycleCount = facility.totalBicycleCount;
      return `${bicycleCount.toLocaleString()}개`;
    } else {
      return "--"; // 기본값
    }
  } catch (err: unknown) {
    console.error("편의시설 정보 조회 실패:", err);
    return "--"; // 에러 시 기본값
  }
};

const fetchSafetyInfo = async (regionCd: string): Promise<string> => {
  try {
    const response = await api.getSafetyCountsUsingGet({ regionCd: regionCd }, {});
    console.log("치안시설 API 응답:", response);

    const safety = response.data?.data;
    if (safety && safety.totalCount) {
      // 안심벨 개수를 표시 (백엔드에서 totalCount로 반환)
      const safetyBellCount = safety.totalCount;
      return `${safetyBellCount.toLocaleString()}개`;
    } else {
      return "--"; // 기본값
    }
  } catch (err: unknown) {
    console.error("치안시설 정보 조회 실패:", err);
    return "--"; // 에러 시 기본값
  }
};

const fetchHospitalInfo = async (regionCd: string): Promise<string> => {
  try {
    console.log("병원 API 호출 시작 - regionCd:", regionCd);
    const response = await api.getHospitalCountsUsingGet({ regionCd: regionCd }, {});
    console.log("병원 API 응답 전체:", response);
    console.log("병원 API 응답 data:", response.data);
    console.log("병원 API 응답 data.data:", response.data?.data);

    const hospital = response.data?.data;
    if (hospital && hospital.totalCount) {
      // 병원 개수를 표시 (백엔드에서 totalCount로 반환)
      const hospitalCount = hospital.totalCount;
      console.log("병원 개수:", hospitalCount);
      return `${hospitalCount.toLocaleString()}개`;
    } else {
      console.log("병원 데이터 없음 또는 totalCount 없음");
      return "--"; // 기본값
    }
  } catch (err: unknown) {
    console.error("병원 정보 조회 실패:", err);
    return "--"; // 에러 시 기본값
  }
};

export const InfoCardList: InfoCardType[] = [
  {
    icon: "fa-solid fa-users",
    title: "인구수",
    value: "20만", // Initial static value
    description: "청년 인구수",
    apiCall: fetchPopulationInfo, // Linked API call
  },
  {
    icon: "fa-solid fa-motorcycle",
    title: "자전거",
    value: "1,234", // Initial static value
    description: "대여소 수",
    apiCall: fetchFacilityInfo, // Linked API call
  },
  {
    icon: "fa-solid fa-shield-halved",
    title: "치안시설",
    value: "50", // Initial static value
    description: "안심벨 수",
    apiCall: fetchSafetyInfo, // Linked API call
  },
  {
    icon: "fa-solid fa-hospital",
    title: "병원",
    value: "15", // Initial static value
    description: "의료기관 수",
    apiCall: fetchHospitalInfo, // Linked API call
  },
];
