import { Api } from "@/api/autoLoad/Api";

export type InfoCardType = {
  icon: string; // FontAwesome 아이콘 이름
  title: string; // 카드 제목
  value: string; // api로 각각 불러올 값들, 현재는 임시로 표시
  description: string; // 부가 설명
  apiCall?: (regionCd: string) => Promise<string>; // API 호출 함수 (선택적)
};

const api = new Api();

// 인구 정보 가져오기 함수
const fetchPopulationInfo = async (regionCd: string): Promise<string> => {
  try {
    const response = await api.getPopulationUsingGet({ regionCd: regionCd }, {});
    console.log("인구 API 응답:", response);

    const population = response.data?.data;
    if (population && population.populationYouth) {
      // 청년 인구수를 정확한 숫자로 표시
      const youth = population.populationYouth;
      return `${youth.toLocaleString()}명`;
    } else {
      return "--"; // 기본값
    }
  } catch (err: unknown) {
    console.error("인구 정보 조회 실패:", err);
    return "--"; // 에러 시 기본값
  }
};

export const InfoCardList: InfoCardType[] = [
  {
    icon: "fa-solid fa-video",
    title: "주변 치안 정보",
    value: "120개",
    description: "CCTV",
  },
  {
    icon: "fa-solid fa-users",
    title: "청년 인구수",
    value: "20만",
    description: "청년 인구수",
    apiCall: fetchPopulationInfo, // 인구 API 호출 함수 연결
  },
  {
    icon: "fa-solid fa-shop",
    title: "편의시설",
    value: "80개",
    description: "편의점",
  },
  {
    icon: "fa-solid fa-utensils",
    title: "맛집",
    value: "47개",
    description: "인기 음식점",
  },
];
