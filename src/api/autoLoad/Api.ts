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
  AlarmSettingRequestDto,
  ApiResponseBoolean,
  ApiResponseBuildingResponseDto,
  ApiResponseEstateDTO,
  ApiResponseFacilityDTO,
  ApiResponseHomeRegisterResponseDTO,
  ApiResponseHospitalDTO,
  ApiResponseInt,
  ApiResponseListAlarmResponseDto,
  ApiResponseListDongDto,
  ApiResponseListEstateDTO,
  ApiResponseListEstateSalesDTO,
  ApiResponseListEstateWishlistResponseDTO,
  ApiResponseListLawdCdResponseDTO,
  ApiResponseListLocalInfoResponseDTO,
  ApiResponseListMemberDTO,
  ApiResponseListRecentSafeReportResponseDto,
  ApiResponseListRegionWishlistResponseDTO,
  ApiResponseListSearchHistoryResponseDTO,
  ApiResponseListSidoDto,
  ApiResponseListSigugunDto,
  ApiResponseListYouthContentDTO,
  ApiResponseMemberDTO,
  ApiResponsePopulationDTO,
  ApiResponseReverseGeocodeResponseDTO,
  ApiResponseSafeReportResponseDto,
  ApiResponseSafetyDTO,
  ApiResponseVoid,
  ApiResponseWeather,
  EstateWishlistRequestDTO,
  HomeRegisterRequestDTO,
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
   * @tags alarm-controller
   * @name GetUnreadAlarmCountUsingGet
   * @summary getUnreadAlarmCount
   * @request GET:/api/alarm/count
   */
  getUnreadAlarmCountUsingGet = (token: string, params: RequestParams = {}) =>
    this.request<ApiResponseInt, void>({
      path: `/api/alarm/count`,
      method: "GET",
      body: token,
      type: ContentType.Json,
      ...params,
    });
  /**
   * No description
   *
   * @tags alarm-controller
   * @name GetAlarmListUsingGet
   * @summary getAlarmList
   * @request GET:/api/alarm/list
   */
  getAlarmListUsingGet = (token: string, params: RequestParams = {}) =>
    this.request<ApiResponseListAlarmResponseDto, void>({
      path: `/api/alarm/list`,
      method: "GET",
      body: token,
      type: ContentType.Json,
      ...params,
    });
  /**
   * No description
   *
   * @tags alarm-controller
   * @name UpdateAlarmSettingUsingPut
   * @summary updateAlarmSetting
   * @request PUT:/api/alarm/settings
   */
  updateAlarmSettingUsingPut = (
    token: AlarmSettingRequestDto,
    params: RequestParams = {},
  ) =>
    this.request<ApiResponseVoid, void>({
      path: `/api/alarm/settings`,
      method: "PUT",
      body: token,
      type: ContentType.Json,
      ...params,
    });
  /**
   * No description
   *
   * @tags alarm-controller
   * @name MarkAlarmReadUsingPut
   * @summary markAlarmRead
   * @request PUT:/api/alarm/{alarmId}/read
   */
  markAlarmReadUsingPut = (
    alarmId: number,
    token: string,
    params: RequestParams = {},
  ) =>
    this.request<ApiResponseVoid, void>({
      path: `/api/alarm/${alarmId}/read`,
      method: "PUT",
      body: token,
      type: ContentType.Json,
      ...params,
    });
  /**
   * No description
   *
   * @tags Estate 정보 조회
   * @name GetEstateByElementUsingGet
   * @summary getEstateByElement
   * @request GET:/api/estate
   */
  getEstateByElementUsingGet = (
    query?: {
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
    },
    params: RequestParams = {},
  ) =>
    this.request<ApiResponseListEstateDTO, void>({
      path: `/api/estate`,
      method: "GET",
      query: query,
      ...params,
    });
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
   * No description
   *
   * @tags Estate 정보 조회
   * @name GetEstateSalesByElementUsingGet
   * @summary getEstateSalesByElement
   * @request GET:/api/estate/sales
   */
  getEstateSalesByElementUsingGet = (
    query?: {
      /** @format int32 */
      dealAmount?: number;
      /** @format int32 */
      dealDay?: number;
      /** @format int32 */
      dealMonth?: number;
      /** @format int32 */
      dealYear?: number;
      /** @format int32 */
      deposit?: number;
      /** @format int32 */
      estateId?: number;
      /** @format int32 */
      id?: number;
      /** @format int32 */
      monthlyRent?: number;
      /** @format int32 */
      tradeType?: number;
    },
    params: RequestParams = {},
  ) =>
    this.request<ApiResponseListEstateSalesDTO, void>({
      path: `/api/estate/sales`,
      method: "GET",
      query: query,
      ...params,
    });
  /**
   * No description
   *
   * @tags Estate 정보 조회
   * @name GetEstateBySquareUsingGet
   * @summary getEstateBySquare
   * @request GET:/api/estate/sqaure
   */
  getEstateBySquareUsingGet = (
    query?: {
      /** @format double */
      maxLat?: number;
      /** @format double */
      maxLng?: number;
      /** @format double */
      minLat?: number;
      /** @format double */
      minLng?: number;
    },
    params: RequestParams = {},
  ) =>
    this.request<ApiResponseListEstateDTO, void>({
      path: `/api/estate/sqaure`,
      method: "GET",
      query: query,
      ...params,
    });
  /**
   * No description
   *
   * @tags lawdCd 정보 조회
   * @name GetAllLawdCdUsingGet
   * @summary getAllLawdCd
   * @request GET:/api/lawdCd
   */
  getAllLawdCdUsingGet = (
    query?: {
      /** @format int32 */
      limit?: number;
      /** @format int32 */
      offset?: number;
      regionCd?: string;
      sggCd?: string;
      sidoCd?: string;
      umdCd?: string;
    },
    params: RequestParams = {},
  ) =>
    this.request<ApiResponseListLawdCdResponseDTO, void>({
      path: `/api/lawdCd`,
      method: "GET",
      query: query,
      ...params,
    });
  /**
   * @description 지역코드와 읍면동명을 이용하여 해당 지역의 건물명 목록을 조회합니다. 예: 지역코드 11110, 읍면동명 '목동'으로 검색 시 해당 지역의 모든 건물명을 반환합니다.
   *
   * @tags lawdCd 정보 조회
   * @name GetBuildingListUsingGet
   * @summary 건물명 목록 조회
   * @request GET:/api/lawdCd/buildings
   */
  getBuildingListUsingGet = (
    query: {
      /**
       * 읍면동 한글 이름
       * @example "목동"
       */
      dongName: string;
      /**
       * 5자리 지역코드 (sido_cd + sgg_cd)
       * @example "11110"
       */
      regionCode: string;
    },
    params: RequestParams = {},
  ) =>
    this.request<ApiResponseBuildingResponseDto, void>({
      path: `/api/lawdCd/buildings`,
      method: "GET",
      query: query,
      ...params,
    });
  /**
   * @description 선택된 시/군/구의 읍/면/동 목록을 조회합니다. 예: 종로구(110) 선택 시 원서동, 훈정동, 묘동 등의 동 목록을 반환합니다.
   *
   * @tags lawdCd 정보 조회
   * @name GetDongListUsingGet
   * @summary 읍/면/동 목록 조회
   * @request GET:/api/lawdCd/dong/{sidoCd}/{sggCd}
   */
  getDongListUsingGet = (
    sggCd: string,
    sidoCd: string,
    params: RequestParams = {},
  ) =>
    this.request<ApiResponseListDongDto, void>({
      path: `/api/lawdCd/dong/${sidoCd}/${sggCd}`,
      method: "GET",
      ...params,
    });
  /**
   * @description 전국의 시/도 목록을 조회합니다. 서울, 부산, 대구, 인천, 광주, 대전, 울산, 세종, 경기, 강원, 충북, 충남, 전북, 전남, 경북, 경남, 제주를 포함합니다.
   *
   * @tags lawdCd 정보 조회
   * @name GetSidoListUsingGet
   * @summary 시/도 목록 조회
   * @request GET:/api/lawdCd/sido
   */
  getSidoListUsingGet = (params: RequestParams = {}) =>
    this.request<ApiResponseListSidoDto, void>({
      path: `/api/lawdCd/sido`,
      method: "GET",
      ...params,
    });
  /**
   * @description 선택된 시/도의 시/군/구 목록을 조회합니다. 예: 서울(11) 선택 시 종로구, 중구, 용산구 등의 구 목록을 반환합니다.
   *
   * @tags lawdCd 정보 조회
   * @name GetSigugunListUsingGet
   * @summary 시/군/구 목록 조회
   * @request GET:/api/lawdCd/sigugun/{sidoCd}
   */
  getSigugunListUsingGet = (sidoCd: string, params: RequestParams = {}) =>
    this.request<ApiResponseListSigugunDto, void>({
      path: `/api/lawdCd/sigugun/${sidoCd}`,
      method: "GET",
      ...params,
    });
  /**
   * No description
   *
   * @tags local-info-controller
   * @name GetFacilityCountsByRegionCdUsingGet
   * @summary getFacilityCountsByRegionCd
   * @request GET:/api/localinfo/facilities-count
   */
  getFacilityCountsByRegionCdUsingGet = (
    query: {
      /** regionCd */
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
   * No description
   *
   * @tags local-info-controller
   * @name GetHospitalCountsByRegionCdUsingGet
   * @summary getHospitalCountsByRegionCd
   * @request GET:/api/localinfo/hospitals-count
   */
  getHospitalCountsByRegionCdUsingGet = (
    query: {
      /** regionCd */
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
   * No description
   *
   * @tags local-info-controller
   * @name GetPopulationByRegionCdUsingGet
   * @summary getPopulationByRegionCd
   * @request GET:/api/localinfo/population
   */
  getPopulationByRegionCdUsingGet = (
    query: {
      /** regionCd */
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
   * No description
   *
   * @tags local-info-controller
   * @name ReverseGeocodeUsingGet
   * @summary reverseGeocode
   * @request GET:/api/localinfo/reverse-geocode
   */
  reverseGeocodeUsingGet = (
    query: {
      /**
       * latitude
       * @format double
       */
      latitude: number;
      /**
       * longitude
       * @format double
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
   * No description
   *
   * @tags local-info-controller
   * @name GetSafetyCountsByRegionCdUsingGet
   * @summary getSafetyCountsByRegionCd
   * @request GET:/api/localinfo/safety-count
   */
  getSafetyCountsByRegionCdUsingGet = (
    query: {
      /** regionCd */
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
   * No description
   *
   * @tags local-info-controller
   * @name SearchRegionsUsingGet
   * @summary searchRegions
   * @request GET:/api/localinfo/search
   */
  searchRegionsUsingGet = (
    query: {
      /** keyword */
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
   * No description
   *
   * @tags local-info-controller
   * @name GetWeatherByRegionCdUsingGet
   * @summary getWeatherByRegionCd
   * @request GET:/api/localinfo/weather
   */
  getWeatherByRegionCdUsingGet = (
    query: {
      /** regionCd */
      regionCd: string;
    },
    params: RequestParams = {},
  ) =>
    this.request<ApiResponseWeather, void>({
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
   * @description 사용자의 집 정보를 조회합니다.
   *
   * @tags MyHomeRegister
   * @name GetHomeInfoUsingGet
   * @summary 나의 집 정보 조회
   * @request GET:/api/myhome/info
   */
  getHomeInfoUsingGet = (token: string, params: RequestParams = {}) =>
    this.request<ApiResponseHomeRegisterResponseDTO, void>({
      path: `/api/myhome/info`,
      method: "GET",
      body: token,
      type: ContentType.Json,
      ...params,
    });
  /**
   * @description 사용자의 집 정보를 등록합니다.
   *
   * @tags MyHomeRegister
   * @name RegisterHomeUsingPost
   * @summary 나의 집 정보 등록
   * @request POST:/api/myhome/register
   */
  registerHomeUsingPost = (
    token: HomeRegisterRequestDTO,
    params: RequestParams = {},
  ) =>
    this.request<ApiResponseHomeRegisterResponseDTO, void>({
      path: `/api/myhome/register`,
      method: "POST",
      body: token,
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
  getRecentReportsUsingGet = (token: string, params: RequestParams = {}) =>
    this.request<ApiResponseListRecentSafeReportResponseDto, void>({
      path: `/api/report/recentSafeReport`,
      method: "GET",
      body: token,
      type: ContentType.Json,
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
  getRecentReportDetailUsingGet = (
    id: number,
    token: string,
    params: RequestParams = {},
  ) =>
    this.request<ApiResponseSafeReportResponseDto, void>({
      path: `/api/report/recentSafeReport/${id}`,
      method: "GET",
      body: token,
      type: ContentType.Json,
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
  deleteRecentReportUsingDelete = (
    id: number,
    token: string,
    params: RequestParams = {},
  ) =>
    this.request<ApiResponseVoid, void>({
      path: `/api/report/recentSafeReport/${id}`,
      method: "DELETE",
      body: token,
      type: ContentType.Json,
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
    token: SafeReportRequestDto,
    params: RequestParams = {},
  ) =>
    this.request<ApiResponseSafeReportResponseDto, void>({
      path: `/api/report/requestSafeReport`,
      method: "POST",
      body: token,
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
