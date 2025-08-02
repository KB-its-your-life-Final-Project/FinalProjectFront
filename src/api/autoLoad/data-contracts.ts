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

/** ChangeRequestDTO */
export interface ChangeRequestDTO {
  /** @format int32 */
  changeType?: number;
  name?: string;
  profileImg?: string;
  pwd?: string;
}

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

/** LoginRequestDTO */
export interface LoginRequestDTO {
  code?: string;
  /** @format int32 */
  createdType?: number;
  email?: string;
  pwd?: string;
}

/** MemberResponseDTO */
export interface MemberResponseDTO {
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

/** SafeReportResponseDto */
export interface SafeReportResponseDto {
  floorAndPurposeList?: FloorAndPurpose[];
  rentalRatioAndBuildyear?: RentalRatioAndBuildyear;
  violationStatus?: ViolationStatus;
}

/** SearchHistoryRequestDTO */
export interface SearchHistoryRequestDTO {
  keyword?: string;
}

/** SearchHistoryResponseDTO */
export interface SearchHistoryResponseDTO {
  keyword?: string;
}

/** TransactionRequestDTO */
export interface TransactionRequestDTO {
  buildingName?: string;
  endDate?: string;
  startDate?: string;
  /** @format int32 */
  tradeType?: number;
}

/** TransactionResponseDTO */
export interface TransactionResponseDTO {
  date?: string;
  /** @format int32 */
  price?: number;
  type?: string;
}

/** VerifyPwdRequestDTO */
export interface VerifyPwdRequestDTO {
  email?: string;
  pwd?: string;
}

/** ViolationStatus */
export interface ViolationStatus {
  violationStatus?: string;
}

/** YouthContentDTO */
export interface YouthContentDTO {
  atchFile?: string;
  bbsSn?: string;
  frstRegDt?: string;
  frstRgtrNm?: string;
  lastMdfcnDt?: string;
  lastMdfrNm?: string;
  pstInqCnt?: string;
  pstSeNm?: string;
  pstSeSn?: string;
  pstSn?: string;
  pstTtl?: string;
  pstUrlAddr?: string;
  pstWholCn?: string;
}

/** ApiResponse«List«EstateWishlistResponseDTO»» */
export interface ApiResponseListEstateWishlistResponseDTO {
  /** @format int32 */
  code?: number;
  data?: EstateWishlistResponseDTO[];
  message?: string;
  success?: boolean;
}

/** ApiResponse«List«MemberResponseDTO»» */
export interface ApiResponseListMemberResponseDTO {
  /** @format int32 */
  code?: number;
  data?: MemberResponseDTO[];
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

/** ApiResponse«List«YouthContentDTO»» */
export interface ApiResponseListYouthContentDTO {
  /** @format int32 */
  code?: number;
  data?: YouthContentDTO[];
  message?: string;
  success?: boolean;
}

/** ApiResponse«MemberResponseDTO» */
export interface ApiResponseMemberResponseDTO {
  /** @format int32 */
  code?: number;
  data?: MemberResponseDTO;
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
