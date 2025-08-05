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

import {
  ApiResponseBoolean,
  ApiResponseEstateDTO,
  ApiResponseFacilityDTO,
  ApiResponseHospitalDTO,
  ApiResponseListEstateWishlistResponseDTO,
  ApiResponseListLocalInfoResponseDTO,
  ApiResponseListMemberDTO,
  ApiResponseListRecentSafeReportResponseDto,
  ApiResponseListRegionWishlistResponseDTO,
  ApiResponseListSearchHistoryResponseDTO,
  ApiResponseListYouthContentDTO,
  ApiResponseMemberDTO,
  ApiResponsePopulationDTO,
  ApiResponseReverseGeocodeResponseDTO,
  ApiResponseSafeReportResponseDto,
  ApiResponseSafetyDTO,
  ApiResponseVoid,
  ApiResponseWeatherDTO,
  EstateWishlistRequestDTO,
  LoginDTO,
  RegionWishlistRequestDTO,
  SafeReportRequestDto,
  SearchHistoryRequestDTO,
  TransactionRequestDTO,
  TransactionResponseDTO,
} from "./data-contracts";
import { ContentType, HttpClient, RequestParams } from "./http-client";

export class Api<
  SecurityDataType = unknown,
> extends HttpClient<SecurityDataType> {
  /**
   * No description
   *
   * @tags Estate 정보 조회
   * @name GetEstateByAddressUsingGet
   * @summary getEstateByAddress
   * @request GET:/api/estate/address/{address}
   */
  getEstateByAddressUsingGet = (address: string, params: RequestParams = {}) =>
    this.request<ApiResponseEstateDTO, void>({
      path: `/api/estate/address/${address}`,
      method: "GET",
      ...params,
    });
  /**
   * No description
   *
   * @tags Estate 정보 조회
   * @name GetEstateByLatLngUsingGet
   * @summary getEstateByLatLng
   * @request GET:/api/estate/latlng
   */
  getEstateByLatLngUsingGet = (
    query: {
      /**
       * lat
       * @format double
       */
      lat: number;
      /**
       * lng
       * @format double
       */
      lng: number;
    },
    params: RequestParams = {},
  ) =>
    this.request<ApiResponseEstateDTO, void>({
      path: `/api/estate/latlng`,
      method: "GET",
      query: query,
      ...params,
    });
  /**
   * @description 법정동코드(regionCd)로 해당 지역의 편의시설(예: 자전거 대수) 정보를 조회합니다.
   *
   * @tags 지역 정보 API
   * @name GetFacilityCountsByRegionCdUsingGet
   * @summary 법정동코드로 편의시설 수 조회
   * @request GET:/api/localinfo/facilities-count
   */
  getFacilityCountsByRegionCdUsingGet = (
    query: {
      /**
       * 지역 법정동 코드
       * @example "1168010800"
       */
      regionCd: string;
    },
    params: RequestParams = {},
  ) =>
    this.request<ApiResponseFacilityDTO, void>({
      path: `/api/localinfo/facilities-count`,
      method: "GET",
      query: query,
      ...params,
    });
  /**
   * @description 법정동코드(regionCd)로 해당 지역의 병원 수 정보를 조회합니다.
   *
   * @tags 지역 정보 API
   * @name GetHospitalCountsByRegionCdUsingGet
   * @summary 법정동코드로 병원 수 조회
   * @request GET:/api/localinfo/hospitals-count
   */
  getHospitalCountsByRegionCdUsingGet = (
    query: {
      /**
       * 지역 법정동 코드
       * @example "1168010800"
       */
      regionCd: string;
    },
    params: RequestParams = {},
  ) =>
    this.request<ApiResponseHospitalDTO, void>({
      path: `/api/localinfo/hospitals-count`,
      method: "GET",
      query: query,
      ...params,
    });
  /**
   * @description 법정동코드(regionCd)로 해당 지역의 인구 정보를 조회합니다.
   *
   * @tags 지역 정보 API
   * @name GetPopulationByRegionCdUsingGet
   * @summary 법정동코드로 인구 조회
   * @request GET:/api/localinfo/population
   */
  getPopulationByRegionCdUsingGet = (
    query: {
      /**
       * 지역 법정동 코드
       * @example "1168010800"
       */
      regionCd: string;
    },
    params: RequestParams = {},
  ) =>
    this.request<ApiResponsePopulationDTO, void>({
      path: `/api/localinfo/population`,
      method: "GET",
      query: query,
      ...params,
    });
  /**
   * @description 위도/경도(latitude, longitude)를 이용하여 법정동 주소 정보를 조회합니다.
   *
   * @tags 지역 정보 API
   * @name ReverseGeocodeUsingGet
   * @summary 좌표로 법정동 주소 조회
   * @request GET:/api/localinfo/reverse-geocode
   */
  reverseGeocodeUsingGet = (
    query: {
      /**
       * 위도 (Latitude)
       * @format double
       * @example 37.5665
       */
      latitude: number;
      /**
       * 경도 (Longitude)
       * @format double
       * @example 126.978
       */
      longitude: number;
    },
    params: RequestParams = {},
  ) =>
    this.request<ApiResponseReverseGeocodeResponseDTO, void>({
      path: `/api/localinfo/reverse-geocode`,
      method: "GET",
      query: query,
      ...params,
    });
  /**
   * @description 법정동코드(regionCd)로 해당 지역의 안전시설(안심벨) 수 정보를 조회합니다.
   *
   * @tags 지역 정보 API
   * @name GetSafetyCountsByRegionCdUsingGet
   * @summary 법정동코드로 안전시설 수 조회
   * @request GET:/api/localinfo/safety-count
   */
  getSafetyCountsByRegionCdUsingGet = (
    query: {
      /**
       * 지역 법정동 코드
       * @example "1168010800"
       */
      regionCd: string;
    },
    params: RequestParams = {},
  ) =>
    this.request<ApiResponseSafetyDTO, void>({
      path: `/api/localinfo/safety-count`,
      method: "GET",
      query: query,
      ...params,
    });
  /**
   * @description 키워드로 지역을 검색합니다.
   *
   * @tags 지역 정보 API
   * @name SearchRegionsUsingGet
   * @summary 지역 검색
   * @request GET:/api/localinfo/search
   */
  searchRegionsUsingGet = (
    query: {
      /**
       * 검색 키워드
       * @example "강남"
       */
      keyword: string;
    },
    params: RequestParams = {},
  ) =>
    this.request<ApiResponseListLocalInfoResponseDTO, void>({
      path: `/api/localinfo/search`,
      method: "GET",
      query: query,
      ...params,
    });
  /**
   * @description 법정동코드로 날씨 정보를 조회합니다.
   *
   * @tags 지역 정보 API
   * @name GetWeatherByRegionNameUsingGet
   * @summary 법정동코드로 날씨 조회
   * @request GET:/api/localinfo/weather
   */
  getWeatherByRegionNameUsingGet = (
    query: {
      /**
       * 지역 법정동 코드
       * @example "1168010800"
       */
      regionCd: string;
    },
    params: RequestParams = {},
  ) =>
    this.request<ApiResponseWeatherDTO, void>({
      path: `/api/localinfo/weather`,
      method: "GET",
      query: query,
      ...params,
    });
  /**
   * No description
   *
   * @tags member-controller
   * @name FindAllUsersUsingGet
   * @summary findAllUsers
   * @request GET:/api/member
   */
  findAllUsersUsingGet = (params: RequestParams = {}) =>
    this.request<ApiResponseListMemberDTO, void>({
      path: `/api/member`,
      method: "GET",
      ...params,
    });
  /**
   * No description
   *
   * @tags member-controller
   * @name CheckDuplicateEmailUsingGet
   * @summary checkDuplicateEmail
   * @request GET:/api/member/checkemail/{email}
   */
  checkDuplicateEmailUsingGet = (email: string, params: RequestParams = {}) =>
    this.request<ApiResponseBoolean, void>({
      path: `/api/member/checkemail/${email}`,
      method: "GET",
      ...params,
    });
  /**
   * No description
   *
   * @tags member-controller
   * @name LoginUsingPost
   * @summary login
   * @request POST:/api/member/login
   */
  loginUsingPost = (loginDto: LoginDTO, params: RequestParams = {}) =>
    this.request<ApiResponseMemberDTO, void>({
      path: `/api/member/login`,
      method: "POST",
      body: loginDto,
      type: ContentType.Json,
      ...params,
    });
  /**
   * No description
   *
   * @tags member-controller
   * @name LogoutUsingPost
   * @summary logout
   * @request POST:/api/member/logout
   */
  logoutUsingPost = (params: RequestParams = {}) =>
    this.request<ApiResponseBoolean, void>({
      path: `/api/member/logout`,
      method: "POST",
      type: ContentType.Json,
      ...params,
    });
  /**
   * No description
   *
   * @tags member-controller
   * @name CheckLoginStatusUsingGet
   * @summary checkLoginStatus
   * @request GET:/api/member/me
   */
  checkLoginStatusUsingGet = (params: RequestParams = {}) =>
    this.request<ApiResponseMemberDTO, void>({
      path: `/api/member/me`,
      method: "GET",
      ...params,
    });
  /**
   * No description
   *
   * @tags member-controller
   * @name RegisterByEmailUsingPost
   * @summary registerByEmail
   * @request POST:/api/member/register/email
   */
  registerByEmailUsingPost = (
    query?: {
      email?: string;
      name?: string;
      password1?: string;
      password2?: string;
    },
    params: RequestParams = {},
  ) =>
    this.request<ApiResponseMemberDTO, void>({
      path: `/api/member/register/email`,
      method: "POST",
      query: query,
      type: ContentType.Json,
      ...params,
    });
  /**
   * No description
   *
   * @tags member-controller
   * @name FindMemberByIdUsingGet
   * @summary findMemberById
   * @request GET:/api/member/{id}
   */
  findMemberByIdUsingGet = (
    id: string,
    data: number,
    params: RequestParams = {},
  ) =>
    this.request<ApiResponseMemberDTO, void>({
      path: `/api/member/${id}`,
      method: "GET",
      body: data,
      type: ContentType.Json,
      ...params,
    });
  /**
   * No description
   *
   * @tags news-controller
   * @name GetNewsUsingGet
   * @summary getNews
   * @request GET:/api/news
   */
  getNewsUsingGet = (params: RequestParams = {}) =>
    this.request<ApiResponseListYouthContentDTO, void>({
      path: `/api/news`,
      method: "GET",
      ...params,
    });
  /**
   * @description 사용자가 최근에 본 안심레포트 목록을 조회합니다.
   *
   * @tags SafeReport
   * @name GetRecentReportsUsingGet
   * @summary 최근 본 안심레포트 목록 조회
   * @request GET:/api/report/recentSafeReport
   */
  getRecentReportsUsingGet = (params: RequestParams = {}) =>
    this.request<ApiResponseListRecentSafeReportResponseDto, void>({
      path: `/api/report/recentSafeReport`,
      method: "GET",
      ...params,
    });
  /**
   * @description 특정 안심레포트의 상세 정보를 조회합니다.
   *
   * @tags SafeReport
   * @name GetRecentReportDetailUsingGet
   * @summary 최근 본 안심레포트 상세 조회
   * @request GET:/api/report/recentSafeReport/{id}
   */
  getRecentReportDetailUsingGet = (id: number, params: RequestParams = {}) =>
    this.request<ApiResponseSafeReportResponseDto, void>({
      path: `/api/report/recentSafeReport/${id}`,
      method: "GET",
      ...params,
    });
  /**
   * @description 특정 안심레포트를 최근 본 목록에서 삭제합니다.
   *
   * @tags SafeReport
   * @name DeleteRecentReportUsingDelete
   * @summary 최근 본 안심레포트 삭제
   * @request DELETE:/api/report/recentSafeReport/{id}
   */
  deleteRecentReportUsingDelete = (id: number, params: RequestParams = {}) =>
    this.request<ApiResponseVoid, void>({
      path: `/api/report/recentSafeReport/${id}`,
      method: "DELETE",
      ...params,
    });
  /**
   * @description 건물의 위도/경도와 예산을 받아서 안심 레포트 정보를 생성합니다. 건축년도, 거래금액, 전세가율, 위반여부, 층수/용도 정보를 포함합니다.
   *
   * @tags SafeReport
   * @name GenerateSafeReportUsingPost
   * @summary 안심 레포트 데이터 요청
   * @request POST:/api/report/requestSafeReport
   */
  generateSafeReportUsingPost = (
    dto: SafeReportRequestDto,
    params: RequestParams = {},
  ) =>
    this.request<ApiResponseSafeReportResponseDto, void>({
      path: `/api/report/requestSafeReport`,
      method: "POST",
      body: dto,
      type: ContentType.Json,
      ...params,
    });
  /**
   * No description
   *
   * @tags transaction-detail-controller
   * @name GetFilteredDataUsingPost
   * @summary getFilteredData
   * @request POST:/api/transactions/detail
   */
  getFilteredDataUsingPost = (
    request: TransactionRequestDTO,
    params: RequestParams = {},
  ) =>
    this.request<TransactionResponseDTO[], void>({
      path: `/api/transactions/detail`,
      method: "POST",
      body: request,
      type: ContentType.Json,
      ...params,
    });
  /**
   * No description
   *
   * @tags 건물 관심 리스트
   * @name GetEstateIdsByMemberIdUsingGet
   * @summary getEstateIdsByMemberId
   * @request GET:/api/wishlist/estate
   */
  getEstateIdsByMemberIdUsingGet = (
    token: string,
    params: RequestParams = {},
  ) =>
    this.request<ApiResponseListEstateWishlistResponseDTO, void>({
      path: `/api/wishlist/estate`,
      method: "GET",
      body: token,
      type: ContentType.Json,
      ...params,
    });
  /**
   * No description
   *
   * @tags 건물 관심 리스트
   * @name AddWishlistUsingPost
   * @summary addWishlist
   * @request POST:/api/wishlist/estate
   */
  addWishlistUsingPost = (
    token: EstateWishlistRequestDTO,
    params: RequestParams = {},
  ) =>
    this.request<ApiResponseVoid, void>({
      path: `/api/wishlist/estate`,
      method: "POST",
      body: token,
      type: ContentType.Json,
      ...params,
    });
  /**
   * No description
   *
   * @tags 건물 관심 리스트
   * @name RemoveWishlistUsingDelete
   * @summary removeWishlist
   * @request DELETE:/api/wishlist/estate/{estateId}
   */
  removeWishlistUsingDelete = (
    estateId: number,
    token: string,
    params: RequestParams = {},
  ) =>
    this.request<ApiResponseVoid, void>({
      path: `/api/wishlist/estate/${estateId}`,
      method: "DELETE",
      body: token,
      type: ContentType.Json,
      ...params,
    });
  /**
   * No description
   *
   * @tags 검색 기록
   * @name GetSearchHistoryUsingGet
   * @summary getSearchHistory
   * @request GET:/api/wishlist/history
   */
  getSearchHistoryUsingGet = (token: string, params: RequestParams = {}) =>
    this.request<ApiResponseListSearchHistoryResponseDTO, void>({
      path: `/api/wishlist/history`,
      method: "GET",
      body: token,
      type: ContentType.Json,
      ...params,
    });
  /**
   * No description
   *
   * @tags 검색 기록
   * @name SaveSearchHistoryUsingPost
   * @summary saveSearchHistory
   * @request POST:/api/wishlist/history
   */
  saveSearchHistoryUsingPost = (
    token: SearchHistoryRequestDTO,
    params: RequestParams = {},
  ) =>
    this.request<ApiResponseVoid, void>({
      path: `/api/wishlist/history`,
      method: "POST",
      body: token,
      type: ContentType.Json,
      ...params,
    });
  /**
   * No description
   *
   * @tags 지역 관심 리스트
   * @name GetRegionsByMemberIdUsingGet
   * @summary getRegionsByMemberId
   * @request GET:/api/wishlist/region
   */
  getRegionsByMemberIdUsingGet = (token: string, params: RequestParams = {}) =>
    this.request<ApiResponseListRegionWishlistResponseDTO, void>({
      path: `/api/wishlist/region`,
      method: "GET",
      body: token,
      type: ContentType.Json,
      ...params,
    });
  /**
   * No description
   *
   * @tags 지역 관심 리스트
   * @name AddWishlistUsingPost1
   * @summary addWishlist
   * @request POST:/api/wishlist/region
   */
  addWishlistUsingPost1 = (
    token: RegionWishlistRequestDTO,
    params: RequestParams = {},
  ) =>
    this.request<ApiResponseVoid, void>({
      path: `/api/wishlist/region`,
      method: "POST",
      body: token,
      type: ContentType.Json,
      ...params,
    });
  /**
   * No description
   *
   * @tags 지역 관심 리스트
   * @name RemoveWishlistUsingDelete1
   * @summary removeWishlist
   * @request DELETE:/api/wishlist/region/{regionCd}
   */
  removeWishlistUsingDelete1 = (
    regionCd: string,
    token: string,
    params: RequestParams = {},
  ) =>
    this.request<ApiResponseVoid, void>({
      path: `/api/wishlist/region/${regionCd}`,
      method: "DELETE",
      body: token,
      type: ContentType.Json,
      ...params,
    });
}
