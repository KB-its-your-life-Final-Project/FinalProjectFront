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
  ApiResponseListMemberResponseDTO,
  ApiResponseListRegionWishlistResponseDTO,
  ApiResponseListSearchHistoryResponseDTO,
  ApiResponseListYouthContentDTO,
  ApiResponseMemberResponseDTO,
  ApiResponseSafeReportResponseDto,
  ApiResponseVoid,
  ChangeRequestDTO,
  EstateWishlistRequestDTO,
  LoginRequestDTO,
  RegionWishlistRequestDTO,
  SafeReportRequestDto,
  SearchHistoryRequestDTO,
  TransactionRequestDTO,
  TransactionResponseDTO,
  VerifyPwdRequestDTO,
} from "./data-contracts";
import { ContentType, HttpClient, RequestParams } from "./http-client";

export class Api<
  SecurityDataType = unknown,
> extends HttpClient<SecurityDataType> {
  /**
   * No description
   *
   * @tags member-controller
   * @name FindAllMembersUsingGet
   * @summary findAllMembers
   * @request GET:/api/member
   */
  findAllMembersUsingGet = (params: RequestParams = {}) =>
    this.request<ApiResponseListMemberResponseDTO, void>({
      path: `/api/member`,
      method: "GET",
      ...params,
    });
  /**
   * No description
   *
   * @tags member-controller
   * @name ChangeMemberInfoUsingPut
   * @summary changeMemberInfo
   * @request PUT:/api/member/change
   */
  changeMemberInfoUsingPut = (
    changeReqDto: ChangeRequestDTO,
    params: RequestParams = {},
  ) =>
    this.request<ApiResponseMemberResponseDTO, void>({
      path: `/api/member/change`,
      method: "PUT",
      body: changeReqDto,
      type: ContentType.Json,
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
  loginUsingPost = (loginReqDto: LoginRequestDTO, params: RequestParams = {}) =>
    this.request<ApiResponseMemberResponseDTO, void>({
      path: `/api/member/login`,
      method: "POST",
      body: loginReqDto,
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
    this.request<ApiResponseMemberResponseDTO, void>({
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
    this.request<ApiResponseMemberResponseDTO, void>({
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
   * @name UnregisterUsingPost
   * @summary unregister
   * @request POST:/api/member/unregister
   */
  unregisterUsingPost = (params: RequestParams = {}) =>
    this.request<ApiResponseMemberResponseDTO, void>({
      path: `/api/member/unregister`,
      method: "POST",
      type: ContentType.Json,
      ...params,
    });
  /**
   * No description
   *
   * @tags member-controller
   * @name VerifyPwdUsingPost
   * @summary verifyPwd
   * @request POST:/api/member/verifypwd
   */
  verifyPwdUsingPost = (
    verifyPwdReqDto: VerifyPwdRequestDTO,
    params: RequestParams = {},
  ) =>
    this.request<ApiResponseBoolean, void>({
      path: `/api/member/verifypwd`,
      method: "POST",
      body: verifyPwdReqDto,
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
  findMemberByIdUsingGet = (id: number, params: RequestParams = {}) =>
    this.request<ApiResponseMemberResponseDTO, void>({
      path: `/api/member/${id}`,
      method: "GET",
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
   * @tags news-controller
   * @name GetUnreadContentsUsingGet
   * @summary getUnreadContents
   * @request GET:/api/news/list
   */
  getUnreadContentsUsingGet = (
    query: {
      /**
       * memberId
       * @format int64
       */
      memberId: number;
      /**
       * page
       * @format int32
       */
      page: number;
      /**
       * size
       * @format int32
       */
      size: number;
    },
    params: RequestParams = {},
  ) =>
    this.request<ApiResponseListYouthContentDTO, void>({
      path: `/api/news/list`,
      method: "GET",
      query: query,
      ...params,
    });
  /**
   * No description
   *
   * @tags news-controller
   * @name MarkAsReadUsingPost
   * @summary markAsRead
   * @request POST:/api/news/read
   */
  markAsReadUsingPost = (
    query: {
      /**
       * contentId
       * @format int64
       */
      contentId: number;
      /**
       * memberId
       * @format int64
       */
      memberId: number;
    },
    params: RequestParams = {},
  ) =>
    this.request<void, void>({
      path: `/api/news/read`,
      method: "POST",
      query: query,
      type: ContentType.Json,
      ...params,
    });
  /**
   * No description
   *
   * @tags news-controller
   * @name SyncYouthContentsUsingPost
   * @summary syncYouthContents
   * @request POST:/api/news/sync
   */
  syncYouthContentsUsingPost = (params: RequestParams = {}) =>
    this.request<object, void>({
      path: `/api/news/sync`,
      method: "POST",
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
  receiveFormUsingPost = (
    dto: SafeReportRequestDto,
    params: RequestParams = {},
  ) =>
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
  addWishlistUsingPost = (
    estateId: EstateWishlistRequestDTO,
    params: RequestParams = {},
  ) =>
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
  saveSearchHistoryUsingPost = (
    dto: SearchHistoryRequestDTO,
    params: RequestParams = {},
  ) =>
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
  addWishlistUsingPost1 = (
    estateId: RegionWishlistRequestDTO,
    params: RequestParams = {},
  ) =>
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
