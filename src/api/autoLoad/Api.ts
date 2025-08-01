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

/** ViolationStatus */
export interface ViolationStatus {
  violationStatus?: string;
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

/** ApiResponse«MemberDTO» */
export interface ApiResponseMemberDTO {
  /** @format int32 */
  code?: number;
  data?: MemberDTO;
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
  AxiosInstance,
  AxiosRequestConfig,
  AxiosResponse,
  HeadersDefaults,
  ResponseType,
} from "axios";
import axios from "axios";

export type QueryParamsType = Record<string | number, any>;

export interface FullRequestParams
  extends Omit<AxiosRequestConfig, "data" | "params" | "url" | "responseType"> {
  /** set parameter to `true` for call `securityWorker` for this request */
  secure?: boolean;
  /** request path */
  path: string;
  /** content type of request body */
  type?: ContentType;
  /** query params */
  query?: QueryParamsType;
  /** format of response (i.e. response.json() -> format: "json") */
  format?: ResponseType;
  /** request body */
  body?: unknown;
}

export type RequestParams = Omit<FullRequestParams, "body" | "method" | "query" | "path">;

export interface ApiConfig<SecurityDataType = unknown>
  extends Omit<AxiosRequestConfig, "data" | "cancelToken"> {
  securityWorker?: (
    securityData: SecurityDataType | null,
  ) => Promise<AxiosRequestConfig | void> | AxiosRequestConfig | void;
  secure?: boolean;
  format?: ResponseType;
}

export enum ContentType {
  Json = "application/json",
  JsonApi = "application/vnd.api+json",
  FormData = "multipart/form-data",
  UrlEncoded = "application/x-www-form-urlencoded",
  Text = "text/plain",
}

export class HttpClient<SecurityDataType = unknown> {
  public instance: AxiosInstance;
  private securityData: SecurityDataType | null = null;
  private securityWorker?: ApiConfig<SecurityDataType>["securityWorker"];
  private secure?: boolean;
  private format?: ResponseType;

  constructor({
    securityWorker,
    secure,
    format,
    ...axiosConfig
  }: ApiConfig<SecurityDataType> = {}) {
    this.instance = axios.create({
      ...axiosConfig,
      baseURL: axiosConfig.baseURL || "//localhost:8080",
      withCredentials: true,
    });
    this.secure = secure;
    this.format = format;
    this.securityWorker = securityWorker;
  }

  public setSecurityData = (data: SecurityDataType | null) => {
    this.securityData = data;
  };

  protected mergeRequestParams(
    params1: AxiosRequestConfig,
    params2?: AxiosRequestConfig,
  ): AxiosRequestConfig {
    const method = params1.method || (params2 && params2.method);

    return {
      ...this.instance.defaults,
      ...params1,
      ...(params2 || {}),
      headers: {
        ...((method &&
          this.instance.defaults.headers[method.toLowerCase() as keyof HeadersDefaults]) ||
          {}),
        ...(params1.headers || {}),
        ...((params2 && params2.headers) || {}),
      },
    };
  }

  protected stringifyFormItem(formItem: unknown) {
    if (typeof formItem === "object" && formItem !== null) {
      return JSON.stringify(formItem);
    } else {
      return `${formItem}`;
    }
  }

  protected createFormData(input: Record<string, unknown>): FormData {
    if (input instanceof FormData) {
      return input;
    }
    return Object.keys(input || {}).reduce((formData, key) => {
      const property = input[key];
      const propertyContent: any[] = property instanceof Array ? property : [property];

      for (const formItem of propertyContent) {
        const isFileType = formItem instanceof Blob || formItem instanceof File;
        formData.append(key, isFileType ? formItem : this.stringifyFormItem(formItem));
      }

      return formData;
    }, new FormData());
  }

  public request = async <T = any, _E = any>({
    secure,
    path,
    type,
    query,
    format,
    body,
    ...params
  }: FullRequestParams): Promise<AxiosResponse<T>> => {
    const secureParams =
      ((typeof secure === "boolean" ? secure : this.secure) &&
        this.securityWorker &&
        (await this.securityWorker(this.securityData))) ||
      {};
    const requestParams = this.mergeRequestParams(params, secureParams);
    const responseFormat = format || this.format || undefined;

    if (type === ContentType.FormData && body && body !== null && typeof body === "object") {
      body = this.createFormData(body as Record<string, unknown>);
    }

    if (type === ContentType.Text && body && body !== null && typeof body !== "string") {
      body = JSON.stringify(body);
    }

    return this.instance.request({
      ...requestParams,
      headers: {
        ...(requestParams.headers || {}),
        ...(type ? { "Content-Type": type } : {}),
      },
      params: query,
      responseType: responseFormat,
      data: body,
      url: path,
    });
  };
}

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
