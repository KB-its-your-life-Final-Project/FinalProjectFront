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
  ApiResponseListMemberDTO,
  ApiResponseMemberDTO,
  RegisterGoogleDTO,
  RegisterKakaoDTO,
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
   * @name FindLoggedinUserUsingGet
   * @summary findLoggedinUser
   * @request GET:/api/member/loggedin
   */
  findLoggedinUserUsingGet = (
    query?: {
      authenticated?: boolean;
      "authorities[0].authority"?: string;
      credentials?: object;
      details?: object;
      principal?: object;
    },
    params: RequestParams = {},
  ) =>
    this.request<ApiResponseMemberDTO, void>({
      path: `/api/member/loggedin`,
      method: "GET",
      query: query,
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
  logoutMemberUsingPost = (params: RequestParams = {}) =>
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
  registerMemberByEmailUsingPost = (
    query?: {
      email?: string;
      name?: string;
      password?: string;
      verificationCode?: string;
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
   * @name RegisterOrLoginMemberByGoogleUsingPost
   * @summary registerOrLoginMemberByGoogle
   * @request POST:/api/member/register/google
   */
  registerOrLoginMemberByGoogleUsingPost = (
    registerDto: RegisterGoogleDTO,
    params: RequestParams = {},
  ) =>
    this.request<ApiResponseMemberDTO, void>({
      path: `/api/member/register/google`,
      method: "POST",
      body: registerDto,
      type: ContentType.Json,
      ...params,
    });
  /**
   * No description
   *
   * @tags member-controller
   * @name RegisterOrLoginMemberByKakaoUsingPost
   * @summary registerOrLoginMemberByKakao
   * @request POST:/api/member/register/kakao
   */
  registerOrLoginMemberByKakaoUsingPost = (
    registerDto: RegisterKakaoDTO,
    params: RequestParams = {},
  ) =>
    this.request<ApiResponseMemberDTO, void>({
      path: `/api/member/register/kakao`,
      method: "POST",
      body: registerDto,
      type: ContentType.Json,
      ...params,
    });
  /**
   * No description
   *
   * @tags member-controller
   * @name SendVerificationCodeUsingPost
   * @summary sendVerificationCode
   * @request POST:/api/member/sendcode
   */
  sendVerificationCodeUsingPost = (
    query: {
      /** email */
      email: string;
    },
    params: RequestParams = {},
  ) =>
    this.request<ApiResponseBoolean, void>({
      path: `/api/member/sendcode`,
      method: "POST",
      query: query,
      type: ContentType.Json,
      ...params,
    });
  /**
   * No description
   *
   * @tags member-controller
   * @name VerifyCodeUsingPost
   * @summary verifyCode
   * @request POST:/api/member/verifycode
   */
  verifyCodeUsingPost = (
    query: {
      /** email */
      email: string;
      /** verificationCode */
      verificationCode: string;
    },
    params: RequestParams = {},
  ) =>
    this.request<ApiResponseBoolean, void>({
      path: `/api/member/verifycode`,
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
  findMemberByIdUsingGet = (id: number, params: RequestParams = {}) =>
    this.request<ApiResponseMemberDTO, void>({
      path: `/api/member/${id}`,
      method: "GET",
      ...params,
    });
}
