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

/** EstateWishlistRequestDTO */
export interface EstateWishlistRequestDTO {
  /** @format int64 */
  estateId?: number;
}

/** EstateWishlistResponseDTO */
export interface EstateWishlistResponseDTO {
  buildingName?: string;
  /** @format int64 */
  estateId?: number;
}

/** FloorAndPurpose */
export interface FloorAndPurpose {
  resArea?: string;
  resFloor?: string;
  resStructure?: string;
  resUseType?: string;
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

/** RegionWishlistRequestDTO */
export interface RegionWishlistRequestDTO {
  regionCd?: string;
}

/** RegionWishlistResponseDTO */
export interface RegionWishlistResponseDTO {
  regionCd?: string;
  umdNm?: string;
}

/** RentalRatioAndBuildyear */
export interface RentalRatioAndBuildyear {
  /** @format int32 */
  buildYear?: number;
  /** @format int32 */
  buildyear_score?: number;
  /** @format int32 */
  dealAmount?: number;
  /** @format double */
  reverse_rental_ratio?: number;
  /** @format int32 */
  score?: number;
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
  data?: EstateWishlistResponseDTO[];
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

/** ApiResponse«List«RegionWishlistResponseDTO»» */
export interface ApiResponseListRegionWishlistResponseDTO {
  /** @format int32 */
  code?: number;
  data?: RegionWishlistResponseDTO[];
  message?: string;
  success?: boolean;
}

/** ApiResponse«List«SearchHistoryResponseDTO»» */
export interface ApiResponseListSearchHistoryResponseDTO {
  /** @format int32 */
  code?: number;
  data?: SearchHistoryResponseDTO[];
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

/** ApiResponse«SafeReportResponseDto» */
export interface ApiResponseSafeReportResponseDto {
  /** @format int32 */
  code?: number;
  data?: SafeReportResponseDto;
  message?: string;
  success?: boolean;
}

/** ApiResponse«Void» */
export interface ApiResponseVoid {
  /** @format int32 */
  code?: number;
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
