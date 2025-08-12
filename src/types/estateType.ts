import {
  apartmentPng,
  multihousePng,
  officetelPng,
  singlehousePng,
} from "@/assets/imgs/buildingType/buildingType";

const estateTradeOptions = [
  { label: "전체", value: "전체" },
  { label: "매매", value: "매매" },
  { label: "전세", value: "전세" },
  { label: "월세", value: "월세" },
];
type estateTradeType = typeof estateTradeOptions;

const estateTradeOptionsFinal = [
  { value: 1, label: "매매", parent: 1 },
  { value: 2, label: "전세", parent: 2 },
  { value: 3, label: "월세", parent: 2 },
];
type estateTradeFinalType = typeof estateTradeOptionsFinal;

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
  { value: 1, label: "아파트", image: apartmentPng },
  { value: 2, label: "오피스텔", image: officetelPng },
  { value: 3, label: "연립", image: multihousePng },
  { value: 4, label: "단독", image: singlehousePng },
];
type estateBuildingType = typeof estateBuildingOptions;

export {
  estateTradeOptions,
  estateMhouseOptions,
  estateShouseOptions,
  estateBuildingOptions,
  estateTradeOptionsFinal,
};
export type {
  estateTradeType,
  estateMhouseType,
  estateShouseType,
  estateBuildingType,
  estateTradeFinalType,
};
