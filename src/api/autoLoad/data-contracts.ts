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

/** RentalRatioAndBuildyear */
export interface RentalRatioAndBuildyear {
  /** @format int32 */
  buildYear?: number;
  /** @format int32 */
  dealAmount?: number;
  /** @format int32 */
  score?: number;
  /** @format double */
  reverse_rental_ratio?: number;
}

/** FloorAndPurpose */
export interface FloorAndPurpose {
  resFloor?: string;
  resUseType?: string;
  resStructure?: string;
  resArea?: string;
}

/** ViolationStatusVO */
export interface ViolationStatusVO {
  violationStatus?: string;
}

/** SafeReportResponseDto */
export interface SafeReportResponseDto {
  rentalRatioAndBuildyear?: RentalRatioAndBuildyear;
  violationStatus?: ViolationStatusVO;
  floorAndPurposeList?: FloorAndPurpose[];
}

/** ApiResponse«SafeReportResponseDto» */
export interface ApiResponseSafeReportResponseDto {
  /** @format int32 */
  code?: number;
  data?: SafeReportResponseDto;
  message?: string;
  success?: boolean;
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
