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

import type {
  ApiResponseBoolean,
  ApiResponseListEstateWishlistResponseDTO,
  ApiResponseListMemberDTO,
  ApiResponseListRegionWishlistResponseDTO,
  ApiResponseListSearchHistoryResponseDTO,
  ApiResponseMemberDTO,
  ApiResponseSafeReportResponseDto,
  ApiResponseVoid,
  EstateWishlistRequestDTO,
  LoginDTO,
  RegionWishlistRequestDTO,
  SafeReportRequestDto,
  SearchHistoryRequestDTO,
  TransactionRequestDTO,
  TransactionResponseDTO,
} from "./data-contracts";
import { ContentType, HttpClient } from "./http-client";
import type { RequestParams } from "./http-client";

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
   * No description
   *
   * @tags SafeReport
   * @name ReceiveFormUsingPost
   * @summary receiveForm
   * @request POST:/api/report/requestData
   */
  receiveFormUsingPost = (dto: SafeReportRequestDto, params: RequestParams = {}) =>
    this.request<ApiResponseSafeReportResponseDto, void>({
      path: `/api/report/requestData`,
      method: "POST",
      body: dto,
      type: ContentType.Json,
      ...params,
    });
}
