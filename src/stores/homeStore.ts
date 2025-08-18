import { defineStore } from "pinia";
import { reactive, computed } from "vue";
import { Api } from "@/api/autoLoad/Api";
import type {
  HomeRegisterRequestDTO,
  HomeRegisterResponseDTO,
} from "@/api/autoLoad/data-contracts";

const api = new Api();

/** ---------------- 주소 정보 인터페이스 ---------------- */
interface AddressInfo {
  roadAddress: string;
  jibunAddress: string;
  buildingName: string;
  dongName: string;
  buildingNumber: string;
  umdNm?: string; // 읍면동명
  jibunAddr?: string; // 지번주소
}

/** ---------------- 집 정보 인터페이스 ---------------- */
interface HomeInfo {
  id?: number;
  addressInfo: AddressInfo;
  contractStart?: string;
  contractEnd?: string;
  rentType: 1 | 2; // 1: 전세, 2: 월세
  jeonseAmount?: number;
  monthlyRent?: number;
  monthlyDeposit?: number;
  lat?: number;
  lng?: number;
  regDate?: string;
}

/** ---------------- 기본값 생성 함수 ---------------- */
const getDefaultAddressInfo = (): AddressInfo => ({
  roadAddress: "",
  jibunAddress: "",
  buildingName: "",
  dongName: "",
  buildingNumber: "",
});

const getDefaultHomeInfo = (): HomeInfo => ({
  addressInfo: getDefaultAddressInfo(),
  rentType: 1,
});

/** ---------------- Home Store ---------------- */
export const useHomeStore = defineStore("home", () => {
  /** ---------------- 상태 ---------------- */
  const homeInfo = reactive<HomeInfo>(getDefaultHomeInfo());
  const isLoading = reactive({ value: false });

  /** ---------------- 계산된 속성 ---------------- */
  const hasHomeInfo = computed(
    () => !!(homeInfo.addressInfo.buildingName || homeInfo.addressInfo.buildingNumber),
  );
  const isJeonse = computed(() => homeInfo.rentType === 1);
  const isMonthlyRent = computed(() => homeInfo.rentType === 2);

  /** ---------------- 액션 ---------------- */
  /**
   * 주소 정보 업데이트
   * @param addressData 부분 주소 정보
   */
  const updateAddressInfo = (addressData: Partial<AddressInfo>) => {
    Object.keys(addressData).forEach((key) => {
      if (addressData[key as keyof AddressInfo] !== undefined) {
        homeInfo.addressInfo[key as keyof AddressInfo] = addressData[key as keyof AddressInfo]!;
      }
    });
  };

  /** 건물동 번호만 업데이트 */
  const updateBuildingNumber = (buildingNumber: string) => {
    homeInfo.addressInfo.buildingNumber = buildingNumber;
  };

  /** 계약 정보 업데이트 */
  const updateContractInfo = (contractData: Partial<HomeInfo>) => {
    Object.assign(homeInfo, contractData);
  };

  /**
   * 집 정보 등록
   * @param requestData 등록 요청 데이터
   */
  const registerHome = async (
    requestData: HomeRegisterRequestDTO,
  ): Promise<HomeRegisterResponseDTO> => {
    try {
      isLoading.value = true;
      const { data } = await api.registerHomeUsingPost(requestData);
      if (data.success && data.data) {
        updateHomeInfoFromResponse(data.data);
        return data.data;
      }
      throw new Error(data.message || "집 정보 등록에 실패했습니다.");
    } catch (error) {
      console.error("집 정보 등록 오류:", error);
      throw error;
    } finally {
      isLoading.value = false;
    }
  };

  /**
   * 집 정보 수정
   * @param requestData 수정 요청 데이터
   */
  const updateHome = async (
    requestData: HomeRegisterRequestDTO,
  ): Promise<HomeRegisterResponseDTO> => {
    try {
      isLoading.value = true;
      const { data } = await api.registerHomeUsingPost(requestData);
      if (data.success && data.data) {
        updateHomeInfoFromResponse(data.data);
        return data.data;
      }
      throw new Error(data.message || "집 정보 수정에 실패했습니다.");
    } catch (error) {
      console.error("집 정보 수정 오류:", error);
      throw error;
    } finally {
      isLoading.value = false;
    }
  };

  /**
   * 서버 응답 데이터로 집 정보 업데이트
   * @param responseData 등록/수정 응답 DTO
   */
  const updateHomeInfoFromResponse = (responseData: HomeRegisterResponseDTO) => {
    homeInfo.id = responseData.estateId;
    homeInfo.contractStart = responseData.contractStart;
    homeInfo.contractEnd = responseData.contractEnd;
    homeInfo.rentType = (responseData.rentType as 1 | 2) || 1;
    homeInfo.jeonseAmount = responseData.jeonseAmount;
    homeInfo.monthlyRent = responseData.monthlyRent;
    homeInfo.monthlyDeposit = responseData.monthlyDeposit;
    homeInfo.regDate = responseData.regDate;

    // 주소 정보 업데이트
    if (responseData.buildingName && responseData.buildingName !== "경상남도 거제시") {
      homeInfo.addressInfo.buildingName = responseData.buildingName;
    }
    if (responseData.buildingNumber)
      homeInfo.addressInfo.buildingNumber = responseData.buildingNumber;
    if (responseData.umdNm) homeInfo.addressInfo.umdNm = responseData.umdNm;
    if (responseData.jibunAddr) homeInfo.addressInfo.jibunAddr = responseData.jibunAddr;

    // 호환성 유지
    if (responseData.jibunAddr && !homeInfo.addressInfo.jibunAddress) {
      homeInfo.addressInfo.jibunAddress = responseData.jibunAddr;
    }
    if (responseData.umdNm && !homeInfo.addressInfo.dongName) {
      homeInfo.addressInfo.dongName = responseData.umdNm;
    }

    // 위도/경도 업데이트
    if (responseData.latitude) homeInfo.lat = responseData.latitude;
    if (responseData.longitude) homeInfo.lng = responseData.longitude;
  };

  /** 집 정보 초기화 (주소 정보는 유지) */
  const resetHomeInfo = () => {
    homeInfo.contractStart = undefined;
    homeInfo.contractEnd = undefined;
    homeInfo.jeonseAmount = undefined;
    homeInfo.monthlyRent = undefined;
    homeInfo.monthlyDeposit = undefined;
    homeInfo.lat = undefined;
    homeInfo.lng = undefined;
  };

  /**
   * 기존 집 정보 로드 (수정 모드)
   * @param existingData 서버에서 받아온 기존 집 정보
   */
  const loadHomeInfo = (existingData: HomeRegisterResponseDTO) => {
    homeInfo.id = existingData.estateId;
    homeInfo.contractStart = existingData.contractStart;
    homeInfo.contractEnd = existingData.contractEnd;
    homeInfo.rentType = (existingData.rentType as 1 | 2) || 1;
    homeInfo.jeonseAmount = existingData.jeonseAmount;
    homeInfo.monthlyRent = existingData.monthlyRent;
    homeInfo.monthlyDeposit = existingData.monthlyDeposit;
    homeInfo.regDate = existingData.regDate;

    homeInfo.addressInfo.roadAddress = existingData.roadAddress || "";
    if (existingData.buildingName && existingData.buildingName !== "경상남도 거제시") {
      homeInfo.addressInfo.buildingName = existingData.buildingName;
    }
    homeInfo.addressInfo.buildingNumber = existingData.buildingNumber || "";
    homeInfo.addressInfo.umdNm = existingData.umdNm || "";
    homeInfo.addressInfo.jibunAddr = existingData.jibunAddr || "";

    // 호환성 유지
    if (existingData.jibunAddr && !homeInfo.addressInfo.jibunAddress) {
      homeInfo.addressInfo.jibunAddress = existingData.jibunAddr;
    }
    if (existingData.umdNm && !homeInfo.addressInfo.dongName) {
      homeInfo.addressInfo.dongName = existingData.umdNm;
    }

    // 위도/경도 업데이트
    if (existingData.latitude) homeInfo.lat = existingData.latitude;
    if (existingData.longitude) homeInfo.lng = existingData.longitude;
  };

  /** 폼 제출용 집 정보 생성 */
  const exportHomeInfo = (): HomeRegisterRequestDTO => ({
    buildingNumber: homeInfo.addressInfo.buildingNumber,
    contractStart: homeInfo.contractStart,
    contractEnd: homeInfo.contractEnd,
    rentType: homeInfo.rentType,
    jeonseAmount: homeInfo.jeonseAmount,
    monthlyRent: homeInfo.monthlyRent,
    monthlyDeposit: homeInfo.monthlyDeposit,
    lat: homeInfo.lat,
    lng: homeInfo.lng,
  });

  return {
    // 상태
    homeInfo,
    isLoading: computed(() => isLoading.value),

    // 계산값
    hasHomeInfo,
    isJeonse,
    isMonthlyRent,

    // 액션
    updateAddressInfo,
    updateBuildingNumber,
    updateContractInfo,
    registerHome,
    updateHome,
    resetHomeInfo,
    loadHomeInfo,
    exportHomeInfo,
    updateHomeInfoFromResponse,
  };
});
