export type InfoCardType= {
  icon: string; // FontAwesome 아이콘 이름
  title: string; // 카드 제목
  value: string; // api로 각각 불러올 값들, 현재는 임시로 표시
  description: string; // 부가 설명
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
    title: "인구수",
    value: "20만",
    description: "주민 수",
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
