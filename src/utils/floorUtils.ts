/**
 * 층 정보를 사용자 친화적인 라벨로 변환
 * @param floor - 층 정보 문자열
 * @returns 변환된 층 라벨
 */
export function getFloorLabel(floor: string | undefined): string {
  if (!floor) return "";

  if (floor.startsWith("지")) {
    const remaining = floor.slice(1);
    return "지하" + remaining + (remaining.includes("층") ? "" : "층");
  }

  if (floor.startsWith("상")) {
    const remaining = floor.slice(1);
    return "지상" + remaining + (remaining.includes("층") ? "" : "층");
  }

  if (floor.startsWith("하")) {
    const remaining = floor.slice(1);
    return "지하" + remaining + (remaining.includes("층") ? "" : "층");
  }

  if (floor.startsWith("탑")) {
    const remaining = floor.slice(1);
    return "옥탑" + remaining + (remaining.includes("층") ? "" : "층");
  }

  return floor;
}
