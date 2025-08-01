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
  ApiResponseFormData,
  ApiResponseListMemberDTO,
  ApiResponseMemberDTO,
  LoginDTO,
  SafeReportRequestDto,
  ApiResponseListLocalInfoResponseDTO,
  ApiResponseWeatherDTO,
  ApiResponsePopulationDTO,
  ApiResponseReverseGeocodeResponseDTO,
  ApiResponseFacilityDTO,
  ApiResponseHospitalDTO,
  ApiResponseSafetyDTO,
} from "./data-contracts";
import { ContentType, HttpClient, RequestParams } from "./http-client";

export class Api<SecurityDataType = unknown> extends HttpClient<SecurityDataType> {
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
  findMemberByIdUsingGet = (id: string, data: number, params: RequestParams = {}) =>
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
   * @tags safe-report-controller
   * @name ReceiveFormUsingPost
   * @summary receiveForm
   * @request POST:/api/report/requestData
   */
  receiveFormUsingPost = (dto: SafeReportRequestDto, params: RequestParams = {}) =>
    this.request<ApiResponseFormData, void>({
      path: `/api/report/requestData`,
      method: "POST",
      body: dto,
      type: ContentType.Json,
      ...params,
    });

  // LocalInfo API 메서드들
  /**
   * 지역 검색
   *
   * @tags local-info-controller
   * @name SearchRegionsUsingGet
   * @summary 지역 검색
   * @request GET:/api/localinfo/search
   */
  searchRegionsUsingGet = (
    query?: {
      keyword?: string;
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
   * 날씨 조회
   *
   * @tags local-info-controller
   * @name GetWeatherUsingGet
   * @summary 법정동코드로 날씨 조회
   * @request GET:/api/localinfo/weather
   */
  getWeatherUsingGet = (
    query?: {
      regionCd?: string;
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
   * 인구 조회
   *
   * @tags local-info-controller
   * @name GetPopulationUsingGet
   * @summary 법정동코드로 인구 조회
   * @request GET:/api/localinfo/population
   */
  getPopulationUsingGet = (
    query?: {
      regionCd?: string;
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
   * 좌표로 주소 조회
   *
   * @tags local-info-controller
   * @name ReverseGeocodeUsingGet
   * @summary 좌표로 법정동 주소 조회
   * @request GET:/api/localinfo/reverse-geocode
   */
  reverseGeocodeUsingGet = (
    query?: {
      latitude?: number;
      longitude?: number;
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
   * 편의시설 수 조회
   *
   * @tags local-info-controller
   * @name GetFacilityCountsUsingGet
   * @summary 법정동코드로 편의시설 수 조회
   * @request GET:/api/localinfo/facilities-count
   */
  getFacilityCountsUsingGet = (
    query?: {
      regionCd?: string;
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
   * 병원 수 조회
   *
   * @tags local-info-controller
   * @name GetHospitalCountsUsingGet
   * @summary 법정동코드로 병원 수 조회
   * @request GET:/api/localinfo/hospitals-count
   */
  getHospitalCountsUsingGet = (
    query?: {
      regionCd?: string;
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
   * 안전시설 수 조회
   *
   * @tags local-info-controller
   * @name GetSafetyCountsUsingGet
   * @summary 법정동코드로 안전시설 수 조회
   * @request GET:/api/localinfo/safety-count
   */
  getSafetyCountsUsingGet = (
    query?: {
      regionCd?: string;
    },
    params: RequestParams = {},
  ) =>
    this.request<ApiResponseSafetyDTO, void>({
      path: `/api/localinfo/safety-count`,
      method: "GET",
      query: query,
      ...params,
    });
}
