const estateTradeOptions = [
  { label: "전체", value: "전체" },
  { label: "매매", value: "매매" },
  { label: "전세", value: "전세" },
  { label: "월세", value: "월세" },
];
type estateTradeType = typeof estateTradeOptions;

const estateMhouseOptions = [
  { value: 1, label: "연립" },
  { value: 2, label: "다세대" },
];
type estateMhouseType = typeof estateMhouseOptions;

const estateShouseOptions = [
  { value: 1, label: "다가구" },
  { value: 2, label: "단독" },
];
type estateShouseType = typeof estateShouseOptions;

const estateBuildingOptions = [
  { value: 1, label: "아파트" },
  { value: 2, label: "오피스텔" },
  { value: 3, label: "연립" },
  { value: 4, label: "단독" },
];
type estateBuildingType = typeof estateBuildingOptions;

export { estateTradeOptions, estateMhouseOptions, estateShouseOptions, estateBuildingOptions };
export type { estateTradeType, estateMhouseType, estateShouseType, estateBuildingType };
