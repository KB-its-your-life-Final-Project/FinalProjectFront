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

/**
 * BuildingInfoDto
 * 건물 정보
 */
export interface BuildingInfoDto {
  /**
   * 건물명
   * @example "목동아파트"
   */
  buildingName?: string;
  /**
   * 지번 주소
   * @example "역삼동 123-45"
   */
  jibunAddr?: string;
  /**
   * 위도
   * @format double
   * @example 37.5665
   */
  latitude?: number;
  /**
   * 경도
   * @format double
   * @example 126.978
   */
  longitude?: number;
}

/**
 * BuildingResponseDto
 * 건물 검색 결과
 */
export interface BuildingResponseDto {
  /**
   * 건물 정보 목록
   * @example [{"buildingName":"목동아파트","latitude":37.5665,"longitude":126.978}]
   */
  buildingInfos?: BuildingInfoDto[];
  /**
   * 읍면동 이름
   * @example "목동"
   */
  dongName?: string;
  /**
   * 5자리 지역코드
   * @example 11110
   */
  regionCode?: string;
}

/**
 * DongDto
 * 읍/면/동 정보
 */
export interface DongDto {
  /**
   * 읍/면/동 이름
   * @example "원서동"
   */
  dongNm?: string;
  /**
   * 시/군/구 코드
   * @example 110
   */
  sggCd?: string;
  /**
   * 시/도 코드
   * @example 11
   */
  sidoCd?: string;
  /**
   * 읍/면/동 코드
   * @example 149
   */
  umdCd?: string;
}

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

/** FacilityDTO */
export interface FacilityDTO {
  locataddNm?: string;
  regionCd?: string;
  regionName?: string;
  /** @format int64 */
  totalBicycleCount?: number;
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

/**
 * HomeRegisterRequestDTO
 * 나의 집 저장 요청 데이터
 */
export interface HomeRegisterRequestDTO {
  /**
   * 건물동 이름
   * @example "101동"
   */
  buildingNumber?: string;
  /**
   * 계약 종료일
   * @example "2025.04.23"
   */
  contractEnd?: string;
  /**
   * 계약 시작일
   * @example "2023.04.23"
   */
  contractStart?: string;
  /**
   * 전세 금액
   * @format int32
   * @example 200
   */
  jeonseAmount?: number;
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
   * 월세 보증금
   * @format int32
   * @example 300
   */
  monthlyDeposit?: number;
  /**
   * 월세 금액
   * @format int32
   * @example 50
   */
  monthlyRent?: number;
  /**
   * 거래 유형
   * @format int32
   * @example 1
   */
  rentType?: number;
}

/**
 * HomeRegisterResponseDTO
 * 나의 집 저장 응답 데이터
 */
export interface HomeRegisterResponseDTO {
  /**
   * 처리 타입
   * @example "UPDATE"
   */
  actionType?: string;
  /**
   * 건물명
   * @example "강남아파트"
   */
  buildingName?: string;
  /**
   * 건물동명
   * @example "101동"
   */
  buildingNumber?: string;
  /**
   * 계약 종료일
   * @example "2025.04.23"
   */
  contractEnd?: string;
  /**
   * 계약 시작일
   * @example "2023.04.23"
   */
  contractStart?: string;
  /**
   * 부동산 ID
   * @format int32
   * @example 12345
   */
  estateId?: number;
  /**
   * 전세 금액
   * @format int32
   * @example 200
   */
  jeonseAmount?: number;
  /**
   * 월세 보증금
   * @format int32
   * @example 300
   */
  monthlyDeposit?: number;
  /**
   * 월세 금액
   * @format int32
   * @example 50
   */
  monthlyRent?: number;
  /**
   * 등록일
   * @example "2023-04-23T10:30:00"
   */
  regDate?: string;
  /**
   * 거래 유형
   * @format int32
   * @example 1
   */
  rentType?: number;
}

/** HospitalDTO */
export interface HospitalDTO {
  locataddNm?: string;
  regionCd?: string;
  regionName?: string;
  /** @format int64 */
  totalCount?: number;
}

/** LawdCdResponseDTO */
export interface LawdCdResponseDTO {
  adptDe?: string;
  /** @format int32 */
  gridX?: number;
  /** @format int32 */
  gridY?: number;
  locallowNm?: string;
  /** @format int32 */
  locatOrder?: number;
  locatRm?: string;
  locataddNm?: string;
  locathightCd?: string;
  locatjijukCd?: string;
  locatjuminCd?: string;
  /** @format date-time */
  regDate?: string;
  regionCd?: string;
  riCd?: string;
  sggCd?: string;
  sidoCd?: string;
  umdCd?: string;
}

/** LocalInfoResponseDTO */
export interface LocalInfoResponseDTO {
  /** @format int32 */
  gridX?: number;
  /** @format int32 */
  gridY?: number;
  locataddNm?: string;
  region?: string;
  regionCd?: string;
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

/** PopulationDTO */
export interface PopulationDTO {
  locataddNm?: string;
  /** @format int64 */
  populationTotal?: number;
  /** @format int64 */
  populationYouth?: number;
  regionCd?: string;
  regionName?: string;
}

/** RecentSafeReportResponseDto */
export interface RecentSafeReportResponseDto {
  /** @format int32 */
  budget?: number;
  buildingName?: string;
  /** @format int32 */
  id?: number;
  resultGrade?: string;
  roadAddress?: string;
  /** @format int32 */
  score?: number;
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
  reverseRentalRatio?: number;
  /**
   * 전세가율 점수
   * @format int32
   * @example 5
   */
  score?: number;
}

/** ReverseGeocodeResponseDTO */
export interface ReverseGeocodeResponseDTO {
  addressName?: string;
  /** @format double */
  latitude?: number;
  legalDongCode?: string;
  legalDongName?: string;
  /** @format double */
  longitude?: number;
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
   * @example "문동동"
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
  /**
   * 최종 점수
   * @format int32
   * @example 7
   */
  totalScore?: number;
  /** 위반 여부 정보 */
  violationStatus?: ViolationStatus;
}

/** SafetyDTO */
export interface SafetyDTO {
  locataddNm?: string;
  regionCd?: string;
  regionName?: string;
  /** @format int64 */
  totalCount?: number;
}

/** SearchHistoryRequestDTO */
export interface SearchHistoryRequestDTO {
  keyword?: string;
}

/** SearchHistoryResponseDTO */
export interface SearchHistoryResponseDTO {
  keyword?: string;
}

/**
 * SidoDto
 * 시/도 정보
 */
export interface SidoDto {
  /**
   * 시/도 코드
   * @example 11
   */
  sidoCd?: string;
  /**
   * 시/도 이름
   * @example "서울"
   */
  sidoNm?: string;
}

/**
 * SigugunDto
 * 시/군/구 정보
 */
export interface SigugunDto {
  /**
   * 시/군/구 코드
   * @example 110
   */
  sggCd?: string;
  /**
   * 시/군/구 이름
   * @example "종로구"
   */
  sggNm?: string;
  /**
   * 시/도 코드
   * @example 11
   */
  sidoCd?: string;
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
   * 위반 점수
   * @format int32
   * @example 3
   */
  score?: number;
  /**
   * 위반 여부
   * @example "위반건축물"
   */
  violationStatus?: string;
}

/** WeatherDTO */
export interface WeatherDTO {
  /** @format int32 */
  gridX?: number;
  /** @format int32 */
  gridY?: number;
  locataddNm?: string;
  /** @format int32 */
  maxTemperature?: number;
  /** @format int32 */
  minTemperature?: number;
  region?: string;
  regionCd?: string;
  skyCondition?: string;
  /** @format int32 */
  temperature?: number;
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

/** ApiResponse«BuildingResponseDto» */
export interface ApiResponseBuildingResponseDto {
  /** @format int32 */
  code?: number;
  /** 건물 검색 결과 */
  data?: BuildingResponseDto;
  message?: string;
  success?: boolean;
}

/** ApiResponse«EstateDTO» */
export interface ApiResponseEstateDTO {
  /** @format int32 */
  code?: number;
  data?: EstateDTO;
  message?: string;
  success?: boolean;
}

/** ApiResponse«FacilityDTO» */
export interface ApiResponseFacilityDTO {
  /** @format int32 */
  code?: number;
  data?: FacilityDTO;
  message?: string;
  success?: boolean;
}

/** ApiResponse«HomeRegisterResponseDTO» */
export interface ApiResponseHomeRegisterResponseDTO {
  /** @format int32 */
  code?: number;
  /** 나의 집 저장 응답 데이터 */
  data?: HomeRegisterResponseDTO;
  message?: string;
  success?: boolean;
}

/** ApiResponse«HospitalDTO» */
export interface ApiResponseHospitalDTO {
  /** @format int32 */
  code?: number;
  data?: HospitalDTO;
  message?: string;
  success?: boolean;
}

/** ApiResponse«List«DongDto»» */
export interface ApiResponseListDongDto {
  /** @format int32 */
  code?: number;
  data?: DongDto[];
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

/** ApiResponse«List«LawdCdResponseDTO»» */
export interface ApiResponseListLawdCdResponseDTO {
  /** @format int32 */
  code?: number;
  data?: LawdCdResponseDTO[];
  message?: string;
  success?: boolean;
}

/** ApiResponse«List«LocalInfoResponseDTO»» */
export interface ApiResponseListLocalInfoResponseDTO {
  /** @format int32 */
  code?: number;
  data?: LocalInfoResponseDTO[];
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

/** ApiResponse«List«SidoDto»» */
export interface ApiResponseListSidoDto {
  /** @format int32 */
  code?: number;
  data?: SidoDto[];
  message?: string;
  success?: boolean;
}

/** ApiResponse«List«SigugunDto»» */
export interface ApiResponseListSigugunDto {
  /** @format int32 */
  code?: number;
  data?: SigugunDto[];
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

/** ApiResponse«PopulationDTO» */
export interface ApiResponsePopulationDTO {
  /** @format int32 */
  code?: number;
  data?: PopulationDTO;
  message?: string;
  success?: boolean;
}

/** ApiResponse«ReverseGeocodeResponseDTO» */
export interface ApiResponseReverseGeocodeResponseDTO {
  /** @format int32 */
  code?: number;
  data?: ReverseGeocodeResponseDTO;
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

/** ApiResponse«SafetyDTO» */
export interface ApiResponseSafetyDTO {
  /** @format int32 */
  code?: number;
  data?: SafetyDTO;
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

/** ApiResponse«WeatherDTO» */
export interface ApiResponseWeatherDTO {
  /** @format int32 */
  code?: number;
  data?: WeatherDTO;
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
