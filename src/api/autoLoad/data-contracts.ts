/* eslint-disable */
/* tslint:disable */
// @ts-nocheck
/*
 * ---------------------------------------------------------------
 * ## THIS FILE WAS GENERATED VIA SWAGGER-TYPESCRIPT-API        ##
 * ##                                                           ##
 * ## AUTHOR: acacode                                           ##
 * ## SOURCE: https://github.com/acacode/swagger-typescript-api ##
 * ---------------------------------------------------------------
 */

/** FormData */
export interface FormData {
  /** @format int32 */
  buildYear?: number;
  /** @format int32 */
  dealAmount?: number;
  /** @format int32 */
  score?: number;
}

/** LoginDTO */
export interface LoginDTO {
  code?: string;
  /** @format int32 */
  createdType?: number;
  email?: string;
  password?: string;
}

/** MemberDTO */
export interface MemberDTO {
  /** @format int32 */
  age?: number;
  /** @format int32 */
  createdType?: number;
  email?: string;
  googleId?: string;
  /** @format int32 */
  id?: number;
  /** @format int32 */
  isDelete?: number;
  /** @format int32 */
  isDisable?: number;
  kakaoId?: string;
  name?: string;
  phone?: string;
  profileImg?: string;
  pwd?: string;
  recentIp?: string;
  /** @format date-time */
  regDate?: string;
  regIp?: string;
}

/** SafeReportRequestDto */
export interface SafeReportRequestDto {
  /** @format int32 */
  budget?: number;
  buildingName?: string;
  dongName?: string;
  jibunAddress?: string;
  /** @format double */
  lat?: number;
  /** @format double */
  lng?: number;
  roadAddress?: string;
}

// LocalInfo 관련 타입들
export interface LocalInfoResponseDTO {
  region?: string;
  regionCd?: string;
  /** @format int32 */
  gridX?: number;
  /** @format int32 */
  gridY?: number;
  locataddNm?: string;
}

export interface WeatherDTO {
  temperature?: string;
  maxTemperature?: string;
  minTemperature?: string;
  skyCondition?: string;
}

export interface PopulationDTO {
  regionCd?: string;
  regionName?: string;
  locataddNm?: string;
  /** @format int64 */
  populationTotal?: number;
  /** @format int64 */
  populationYouth?: number;
}

export interface FacilityDTO {
  regionCd?: string;
  regionName?: string;
  locataddNm?: string;
  /** @format int64 */
  totalBicycleCount?: number;
}

export interface HospitalDTO {
  regionCd?: string;
  regionName?: string;
  locataddNm?: string;
  /** @format int64 */
  totalCount?: number;
}

export interface SafetyDTO {
  regionCd?: string;
  regionName?: string;
  locataddNm?: string;
  /** @format int64 */
  totalCount?: number;
}

export interface ReverseGeocodeResponseDTO {
  address?: string;
  regionCd?: string;
  /** @format double */
  latitude?: number;
  /** @format double */
  longitude?: number;
}

/** ApiResponse«FormData» */
export interface ApiResponseFormData {
  /** @format int32 */
  code?: number;
  data?: FormData;
  message?: string;
  success?: boolean;
}

/** ApiResponse«List«MemberDTO»» */
export interface ApiResponseListMemberDTO {
  /** @format int32 */
  code?: number;
  data?: MemberDTO[];
  message?: string;
  success?: boolean;
}

/** ApiResponse«MemberDTO» */
export interface ApiResponseMemberDTO {
  /** @format int32 */
  code?: number;
  data?: MemberDTO;
  message?: string;
  success?: boolean;
}

/** ApiResponse«boolean» */
export interface ApiResponseBoolean {
  /** @format int32 */
  code?: number;
  data?: boolean;
  message?: string;
  success?: boolean;
}

// LocalInfo API 응답 타입들
export interface ApiResponseListLocalInfoResponseDTO {
  /** @format int32 */
  code?: number;
  data?: LocalInfoResponseDTO[];
  message?: string;
  success?: boolean;
}

export interface ApiResponseWeatherDTO {
  /** @format int32 */
  code?: number;
  data?: WeatherDTO;
  message?: string;
  success?: boolean;
}

export interface ApiResponsePopulationDTO {
  /** @format int32 */
  code?: number;
  data?: PopulationDTO;
  message?: string;
  success?: boolean;
}

export interface ApiResponseFacilityDTO {
  /** @format int32 */
  code?: number;
  data?: FacilityDTO;
  message?: string;
  success?: boolean;
}

export interface ApiResponseHospitalDTO {
  /** @format int32 */
  code?: number;
  data?: HospitalDTO;
  message?: string;
  success?: boolean;
}

export interface ApiResponseSafetyDTO {
  /** @format int32 */
  code?: number;
  data?: SafetyDTO;
  message?: string;
  success?: boolean;
}

export interface ApiResponseReverseGeocodeResponseDTO {
  /** @format int32 */
  code?: number;
  data?: ReverseGeocodeResponseDTO;
  message?: string;
  success?: boolean;
}
