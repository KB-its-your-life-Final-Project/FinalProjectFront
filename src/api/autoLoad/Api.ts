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
   * @name LogoutMemberUsingPost
   * @summary logoutMember
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
   * @name RegisterMemberByEmailUsingPost
   * @summary registerMemberByEmail
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
  /**
   * No description
   *
   * @tags transaction-detail-controller
   * @name GetFilteredDataUsingPost
   * @summary getFilteredData
   * @request POST:/api/transactions/detail
   */
  getFilteredDataUsingPost = (request: TransactionRequestDTO, params: RequestParams = {}) =>
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
  getEstateIdsByMemberIdUsingGet = (params: RequestParams = {}) =>
    this.request<ApiResponseListEstateWishlistResponseDTO, void>({
      path: `/api/wishlist/estate`,
      method: "GET",
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
  addWishlistUsingPost = (estateId: EstateWishlistRequestDTO, params: RequestParams = {}) =>
    this.request<ApiResponseVoid, void>({
      path: `/api/wishlist/estate`,
      method: "POST",
      body: estateId,
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
  removeWishlistUsingDelete = (estateId: number, params: RequestParams = {}) =>
    this.request<ApiResponseVoid, void>({
      path: `/api/wishlist/estate/${estateId}`,
      method: "DELETE",
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
  getSearchHistoryUsingGet = (params: RequestParams = {}) =>
    this.request<ApiResponseListSearchHistoryResponseDTO, void>({
      path: `/api/wishlist/history`,
      method: "GET",
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
  saveSearchHistoryUsingPost = (dto: SearchHistoryRequestDTO, params: RequestParams = {}) =>
    this.request<ApiResponseVoid, void>({
      path: `/api/wishlist/history`,
      method: "POST",
      body: dto,
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
  getRegionsByMemberIdUsingGet = (params: RequestParams = {}) =>
    this.request<ApiResponseListRegionWishlistResponseDTO, void>({
      path: `/api/wishlist/region`,
      method: "GET",
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
  addWishlistUsingPost1 = (estateId: RegionWishlistRequestDTO, params: RequestParams = {}) =>
    this.request<ApiResponseVoid, void>({
      path: `/api/wishlist/region`,
      method: "POST",
      body: estateId,
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
  removeWishlistUsingDelete1 = (regionCd: string, params: RequestParams = {}) =>
    this.request<ApiResponseVoid, void>({
      path: `/api/wishlist/region/${regionCd}`,
      method: "DELETE",
      ...params,
    });
}
