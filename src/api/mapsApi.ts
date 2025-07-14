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
 * 지도 아이템(위치) 정보 타입
 */
export interface MapItem {
  lat: number;
  lng: number;
  // 추가 데이터 필드가 있으면 여기에 선언
  [key: string]: any;
}

/**
 * GET 방식: 쿼리 파라미터로 범위 전송, 지도 아이템 목록 응답
 */
export function fetchMapItems(params: BoundsParams) {
  return apiClient.get<MapItem[]>('/maps/items', { params });
}

/**
 * POST 방식: JSON 바디로 범위 전송, 지도 아이템 목록 응답
 */
export function postMapBounds(params: BoundsParams) {
  return apiClient.post<MapItem[]>('/maps/items', params);
}

/**
 * 편의 함수: POST 요청으로 받은 데이터를 바로 반환 - 지도에 표시해야 할 위치 정보들을 백엔드로부터 제공받기
 */
export async function getMapItems(params: BoundsParams): Promise<MapItem[]> {
  const response = await postMapBounds(params);
  return response.data;
}
