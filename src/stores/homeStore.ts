import { defineStore } from "pinia";
import { reactive, computed } from "vue";
import { Api } from "@/api/autoLoad/Api";
import type { HomeRegisterRequestDTO, HomeRegisterResponseDTO } from "@/api/autoLoad/data-contracts";

const api = new Api();

// 주소 정보 인터페이스
interface AddressInfo {
  roadAddress: string;
  jibunAddress: string;
  buildingName: string;
  dongName: string;
  buildingNumber: string;
  umdNm?: string; // 읍면동명
  jibunAddr?: string; // 지번주소
}

// 집 정보 인터페이스
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

// 기본 주소 정보
const getDefaultAddressInfo = (): AddressInfo => ({
  roadAddress: "",
  jibunAddress: "",
  buildingName: "",
  dongName: "",
  buildingNumber: "",
});

// 기본 집 정보
const getDefaultHomeInfo = (): HomeInfo => ({
  addressInfo: getDefaultAddressInfo(),
  rentType: 1,
});

export const useHomeStore = defineStore("home", () => {
  // 상태
  const homeInfo = reactive<HomeInfo>(getDefaultHomeInfo());
  const isLoading = reactive({ value: false });

  // 계산된 속성
  const hasHomeInfo = computed(() => {
    return homeInfo.addressInfo.buildingName || homeInfo.addressInfo.buildingNumber;
  });

  const isJeonse = computed(() => homeInfo.rentType === 1);
  const isMonthlyRent = computed(() => homeInfo.rentType === 2);

  // 주소 정보 업데이트
  const updateAddressInfo = (addressData: Partial<AddressInfo>) => {
    console.log("🔄 updateAddressInfo 호출됨:", addressData);

    // 반응성을 보장하기 위해 각 필드를 개별적으로 업데이트
    if (addressData.roadAddress !== undefined) {
      homeInfo.addressInfo.roadAddress = addressData.roadAddress;
    }
    if (addressData.jibunAddress !== undefined) {
      homeInfo.addressInfo.jibunAddress = addressData.jibunAddress;
    }
    if (addressData.buildingName !== undefined) {
      homeInfo.addressInfo.buildingName = addressData.buildingName;
    }
    if (addressData.dongName !== undefined) {
      homeInfo.addressInfo.dongName = addressData.dongName;
    }
    if (addressData.buildingNumber !== undefined) {
      homeInfo.addressInfo.buildingNumber = addressData.buildingNumber;
    }
    if (addressData.umdNm !== undefined) {
      homeInfo.addressInfo.umdNm = addressData.umdNm;
    }
    if (addressData.jibunAddr !== undefined) {
      homeInfo.addressInfo.jibunAddr = addressData.jibunAddr;
    }

    console.log("✅ 주소 정보 업데이트 완료:", homeInfo.addressInfo);
  };

  // 건물동 번호 업데이트
  const updateBuildingNumber = (buildingNumber: string) => {
    homeInfo.addressInfo.buildingNumber = buildingNumber;
    console.log("건물동 번호 업데이트:", buildingNumber);
  };

  // 계약 정보 업데이트
  const updateContractInfo = (contractData: Partial<HomeInfo>) => {
    Object.assign(homeInfo, contractData);
    console.log("계약 정보 업데이트:", contractData);
  };

  // 집 정보 등록
  const registerHome = async (requestData: HomeRegisterRequestDTO): Promise<HomeRegisterResponseDTO> => {
    try {
      isLoading.value = true;
      const { data } = await api.registerHomeUsingPost(requestData);

      if (data.success && data.data) {
        // 응답 데이터로 집 정보 업데이트
        updateHomeInfoFromResponse(data.data);
        console.log("집 정보 등록 성공:", data.data);
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

  // 집 정보 수정
  const updateHome = async (requestData: HomeRegisterRequestDTO): Promise<HomeRegisterResponseDTO> => {
    try {
      isLoading.value = true;
      const { data } = await api.registerHomeUsingPost(requestData);

      if (data.success && data.data) {
        // 응답 데이터로 집 정보 업데이트
        updateHomeInfoFromResponse(data.data);
        console.log("집 정보 수정 성공:", data.data);
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

  // 응답 데이터로 집 정보 업데이트
  const updateHomeInfoFromResponse = (responseData: HomeRegisterResponseDTO) => {
    // 기존 주소 정보는 유지하고, 응답에서 받은 정보만 업데이트
    homeInfo.id = responseData.estateId;
    homeInfo.contractStart = responseData.contractStart;
    homeInfo.contractEnd = responseData.contractEnd;
    homeInfo.rentType = responseData.rentType || 1;
    homeInfo.jeonseAmount = responseData.jeonseAmount;
    homeInfo.monthlyRent = responseData.monthlyRent;
    homeInfo.monthlyDeposit = responseData.monthlyDeposit;
    homeInfo.regDate = responseData.regDate;

    // 주소 정보 업데이트
    if (responseData.buildingName) {
      homeInfo.addressInfo.buildingName = responseData.buildingName;
    }
    if (responseData.buildingNumber) {
      homeInfo.addressInfo.buildingNumber = responseData.buildingNumber;
    }
    if (responseData.umdNm) {
      homeInfo.addressInfo.umdNm = responseData.umdNm;
    }
    if (responseData.jibunAddr) {
      homeInfo.addressInfo.jibunAddr = responseData.jibunAddr;
    }

    // jibunAddr을 jibunAddress로도 설정 (호환성을 위해)
    if (responseData.jibunAddr && !homeInfo.addressInfo.jibunAddress) {
      homeInfo.addressInfo.jibunAddress = responseData.jibunAddr;
    }

    // umdNm을 dongName으로도 설정 (호환성을 위해)
    if (responseData.umdNm && !homeInfo.addressInfo.dongName) {
      homeInfo.addressInfo.dongName = responseData.umdNm;
    }

    // 백엔드에서 받은 위도/경도 정보 업데이트
    if (responseData.latitude) {
      homeInfo.lat = responseData.latitude;
    }
    if (responseData.longitude) {
      homeInfo.lng = responseData.longitude;
    }
  };

  // 집 정보 초기화 (새로운 주소 선택 시)
  const resetHomeInfo = () => {
    homeInfo.addressInfo = getDefaultAddressInfo();
    homeInfo.contractStart = undefined;
    homeInfo.contractEnd = undefined;
    homeInfo.jeonseAmount = undefined;
    homeInfo.monthlyRent = undefined;
    homeInfo.monthlyDeposit = undefined;
    homeInfo.lat = undefined;
    homeInfo.lng = undefined;
    homeInfo.addressInfo.umdNm = undefined;
    homeInfo.addressInfo.jibunAddr = undefined;
    console.log("집 정보 초기화 완료");
  };

  // 집 정보 로드 (수정 모드에서 기존 데이터로 초기화)
  const loadHomeInfo = (existingData: HomeRegisterResponseDTO) => {
    // 기존 데이터로 초기화
    homeInfo.id = existingData.estateId;
    homeInfo.contractStart = existingData.contractStart;
    homeInfo.contractEnd = existingData.contractEnd;
    homeInfo.rentType = existingData.rentType || 1;
    homeInfo.jeonseAmount = existingData.jeonseAmount;
    homeInfo.monthlyRent = existingData.monthlyRent;
    homeInfo.monthlyDeposit = existingData.monthlyDeposit;
    homeInfo.regDate = existingData.regDate;

    // 주소 정보는 기존에 저장된 것을 사용하거나 기본값 설정
    homeInfo.addressInfo.buildingName = existingData.buildingName || "";
    homeInfo.addressInfo.buildingNumber = existingData.buildingNumber || "";
    homeInfo.addressInfo.umdNm = existingData.umdNm || "";
    homeInfo.addressInfo.jibunAddr = existingData.jibunAddr || "";

    // jibunAddr을 jibunAddress로도 설정 (호환성을 위해)
    if (existingData.jibunAddr && !homeInfo.addressInfo.jibunAddress) {
      homeInfo.addressInfo.jibunAddress = existingData.jibunAddr;
    }

    // umdNm을 dongName으로도 설정 (호환성을 위해)
    if (existingData.umdNm && !homeInfo.addressInfo.dongName) {
      homeInfo.addressInfo.dongName = existingData.umdNm;
    }

    // 백엔드에서 받은 위도/경도 정보 설정
    if (existingData.latitude) {
      homeInfo.lat = existingData.latitude;
    }
    if (existingData.longitude) {
      homeInfo.lng = existingData.longitude;
    }

    console.log("기존 집 정보 로드 완료:", homeInfo);
  };

  // 집 정보 내보내기 (폼 데이터 생성용)
  const exportHomeInfo = (): HomeRegisterRequestDTO => {
    return {
      buildingNumber: homeInfo.addressInfo.buildingNumber,
      contractStart: homeInfo.contractStart,
      contractEnd: homeInfo.contractEnd,
      rentType: homeInfo.rentType,
      jeonseAmount: homeInfo.jeonseAmount,
      monthlyRent: homeInfo.monthlyRent,
      monthlyDeposit: homeInfo.monthlyDeposit,
      lat: homeInfo.lat,
      lng: homeInfo.lng,
    };
  };

    return {
    // 상태
    homeInfo,
    isLoading: computed(() => isLoading.value),

    // 계산된 속성
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
