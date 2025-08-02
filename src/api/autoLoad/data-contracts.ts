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

/** EstateDTO */
export interface EstateDTO {
  /** @format int32 */
  buildYear?: number;
  buildingName?: string;
  /** @format int32 */
  buildingType?: number;
  /** @format int32 */
  id?: number;
  jibun?: string;
  jibunAddr?: string;
  /** @format double */
  latitude?: number;
  /** @format double */
  longitude?: number;
  mhouseType?: string;
  /** @format int32 */
  originalId?: number;
  /** @format int32 */
  sggCd?: number;
  sggNm?: string;
  shouseType?: string;
  /** @format int32 */
  sourceTable?: number;
  umdNm?: string;
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

/**
 * FloorAndPurpose
 * 층수와 용도 정보
 */
export interface FloorAndPurpose {
  /**
   * 면적
   * @example "84.5㎡"
   */
  resArea?: string;
  /**
   * 층수
   * @example "5층"
   */
  resFloor?: string;
  /**
   * 구조
   * @example "철근콘크리트"
   */
  resStructure?: string;
  /**
   * 용도
   * @example "주거"
   */
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

/** RecentSafeReportDetailResponseDto */
export interface RecentSafeReportDetailResponseDto {
  /** @format int32 */
  budget?: number;
  buildingName?: string;
  /** @format date-time */
  createdAt?: string;
  /** @format date-time */
  diagnosisDate?: string;
  diagnosisStatus?: string;
  dongName?: string;
  /** @format int32 */
  id?: number;
  jibunAddress?: string;
  latitude?: number;
  longitude?: number;
  reportData?: string;
  roadAddress?: string;
}

/** RecentSafeReportResponseDto */
export interface RecentSafeReportResponseDto {
  buildingName?: string;
  /** @format int32 */
  id?: number;
  resultGrade?: string;
  roadAddress?: string;
  /** @format date-time */
  updatedAt?: string;
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

/**
 * RentalRatioAndBuildyear
 * 거래금액, 건축연도, 역전세율 정보
 */
export interface RentalRatioAndBuildyear {
  /**
   * 건축연도
   * @format int32
   * @example 2010
   */
  buildYear?: number;
  /**
   * 연식률 점수
   * @format int32
   * @example 2
   */
  buildyear_score?: number;
  /**
   * 거래가 (만원)
   * @format int32
   * @example 50000
   */
  dealAmount?: number;
  /**
   * 역전세율 (%)
   * @format double
   * @example 85.5
   */
  reverse_rental_ratio?: number;
  /**
   * 최종 점수
   * @format int32
   * @example 5
   */
  score?: number;
}

/**
 * SafeReportRequestDto
 * 안전 리포트 요청 데이터
 */
export interface SafeReportRequestDto {
  /**
   * 예산 (만원)
   * @format int32
   * @example 5000
   */
  budget?: number;
  /**
   * 건물명
   * @example "아파트명"
   */
  buildingName?: string;
  /**
   * 동명
   * @example "101동"
   */
  dongName?: string;
  /**
   * 지번 주소
   * @example "서울특별시 강남구 역삼동 123-45"
   */
  jibunAddress?: string;
  /**
   * 위도
   * @format double
   * @example 37.5665
   */
  lat?: number;
  /**
   * 경도
   * @format double
   * @example 126.978
   */
  lng?: number;
  /**
   * 도로명 주소
   * @example "서울특별시 강남구 테헤란로 123"
   */
  roadAddress?: string;
}

/**
 * SafeReportResponseDto
 * 안전 리포트 응답 데이터
 */
export interface SafeReportResponseDto {
  /** 층수와 용도 목록 */
  floorAndPurposeList?: FloorAndPurpose[];
  /** 건축년도, 거래금액, 역전세율 정보 */
  rentalRatioAndBuildyear?: RentalRatioAndBuildyear;
  /** 위반 여부 정보 */
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

/**
 * ViolationStatus
 * 위반 여부 정보
 */
export interface ViolationStatus {
  /**
   * 위반 여부
   * @example "위반건축물"
   */
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

/** ApiResponse«EstateDTO» */
export interface ApiResponseEstateDTO {
  /** @format int32 */
  code?: number;
  data?: EstateDTO;
  message?: string;
  success?: boolean;
}

/** ApiResponse«List«EstateWishlistResponseDTO»» */
export interface ApiResponseListEstateWishlistResponseDTO {
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

/** ApiResponse«List«RecentSafeReportResponseDto»» */
export interface ApiResponseListRecentSafeReportResponseDto {
  /** @format int32 */
  code?: number;
  data?: RecentSafeReportResponseDto[];
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

/** ApiResponse«MemberDTO» */
export interface ApiResponseMemberDTO {
  /** @format int32 */
  code?: number;
  data?: MemberDTO;
  message?: string;
  success?: boolean;
}

/** ApiResponse«RecentSafeReportDetailResponseDto» */
export interface ApiResponseRecentSafeReportDetailResponseDto {
  /** @format int32 */
  code?: number;
  data?: RecentSafeReportDetailResponseDto;
  message?: string;
  success?: boolean;
}

/** ApiResponse«SafeReportResponseDto» */
export interface ApiResponseSafeReportResponseDto {
  /** @format int32 */
  code?: number;
  /** 안전 리포트 응답 데이터 */
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
