import apiClient from './apiClient';
import type { ApiResponse } from '@/types/api';
import type { MapAddressType } from '@/types/mapAddressType';

const  addressApi = {
  getAllAddress: async(): Promise<ApiResponse<MapAddressType[]>> => {
    try {
      const apiUrl = '/api/mapAddress';
      const response = await apiClient.get<ApiResponse<MapAddressType[]>>(apiUrl);
      return response.data;
    }
    catch (error) {
      console.log(error);
      throw error;
    }
  }
}

export default addressApi;
