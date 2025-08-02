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

import { ApiResponseEstateDTO } from "./data-contracts";
import { HttpClient, RequestParams } from "./http-client";

export class Estate<
  SecurityDataType = unknown,
> extends HttpClient<SecurityDataType> {
  /**
   * No description
   *
   * @tags Estate 정보 조회
   * @name GetEstateByAddressUsingGet
   * @summary getEstateByAddress
   * @request GET:/estate/address/{address}
   */
  getEstateByAddressUsingGet = (address: string, params: RequestParams = {}) =>
    this.request<ApiResponseEstateDTO, void>({
      path: `/estate/address/${address}`,
      method: "GET",
      ...params,
    });
  /**
   * No description
   *
   * @tags Estate 정보 조회
   * @name GetEstateByLatLngUsingGet
   * @summary getEstateByLatLng
   * @request GET:/estate/latlng
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
      path: `/estate/latlng`,
      method: "GET",
      query: query,
      ...params,
    });
}
