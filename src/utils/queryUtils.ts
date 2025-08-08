import type { LocationQueryValueRaw } from "vue-router";

const queryUtil = {
  /**
   * Vue Router 쿼리 파라미터를 안전하게 문자열로 변환
   * @param queryValue - 쿼리 파라미터 값
   * @returns 변환된 문자열 또는 undefined
   */
  getQueryString(
    queryValue: LocationQueryValueRaw | LocationQueryValueRaw[] | undefined,
  ): string | undefined {
    if (!queryValue) return undefined;
    if (Array.isArray(queryValue)) return queryValue[0]?.toString();
    return queryValue.toString();
  },
};

export default queryUtil;
