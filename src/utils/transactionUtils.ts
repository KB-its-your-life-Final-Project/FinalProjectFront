type InputDealType = "매매" | "전월세"; // 입력 데이터 타입
export type OutputDealType = "매매" | "전세" | "월세"; // 변환 후 데이터 타입
type FilterType = "전체" | OutputDealType; // 필터링 옵션

export interface GraphItemInput {
  date: string;
  deposit: number;
  monthlyRent?: number;
  dealAmount?: number;
  type: InputDealType;
}

export interface GraphItemOutput {
  date: string;
  deposit: number;
  monthlyRent?: number;
  dealAmount?: number;
  type: OutputDealType;
}
/**
 * 주어진 부동산 거래 데이터 리스트에서
 * - "전월세" 타입은 monthlyRent 값에 따라 "전세" 또는 "월세"로 변환
 * - "매매" 타입은 변환 없이 유지
 *
 * 변환 후, 사용자가 선택한 필터 타입에 맞춰 데이터를 필터링하여 반환
 *
 * 필터 타입:
 * - "전체": 매매, 전세, 월세 모든 데이터를 반환
 * - "매매": 매매 데이터만 반환
 * - "전세": 전세 데이터만 반환
 * - "월세": 월세 데이터만 반환
 *
 * @param list - 입력 부동산 거래 데이터 리스트 (type은 "매매" 또는 "전월세")
 * @param filterType - 필터 옵션 ("전체" | "매매" | "전세" | "월세")
 * @returns 필터 타입에 맞춰 변환 및 필터링된 데이터 리스트
 */
export function classifyRentType(
  list: GraphItemInput[],
  filterType: FilterType,
): GraphItemOutput[] {
  const converted: GraphItemOutput[] = list.map((item) => {
    if (item.type === "전월세") {
      const isMonthly = item.monthlyRent !== undefined && item.monthlyRent > 0;
      return {
        ...item,
        type: isMonthly ? "월세" : "전세",
        dealAmount: undefined,
      };
    }
    return {
      ...item,
      type: "매매",
      dealAmount: item.dealAmount,
    };
  });

  if (filterType === "전체") {
    return converted;
  }
  return converted.filter((item) => item.type === filterType);
}
