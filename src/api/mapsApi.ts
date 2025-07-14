// src/api/mapsApi.ts
import apiClient from "@/api/apiClient.ts";

/**
 * 지도 화면에서 보이는 범위(경계)와 필터 정보를 담는 타입
 */
export interface BoundsParams {
  swLat: number;
  swLng: number;
  neLat: number;
  neLng: number;
  filter?: string; // 필요 시 추가 필터
}

/**
 * GET 방식: 쿼리 파라미터로 범위 전송
 */
export function fetchMapItems(params: BoundsParams) {
  return apiClient.get('/maps/items', { params });
}

/**
 * POST 방식: JSON 바디로 범위 전송
 */
export function postMapBounds(params: BoundsParams) {
  return apiClient.post('/maps/items', params);
}
