<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useHomeStore } from "@/stores/homeStore";
import ModalForm from "@/components/common/ModalForm.vue";
import DatePicker from "@/components/common/DatePicker.vue";
import RadioListButton from "@/components/common/RadioListButton.vue";
import DefaultInput from "@/components/common/DefaultInput.vue";
import PostcodeSearch from "./SearchAddress.vue";
import { Api } from "@/api/autoLoad/Api";
import type { HomeRegisterRequestDTO, HomeRegisterResponseDTO } from "@/api/autoLoad/data-contracts";
import mapUtil from "@/utils/naverMap/naverMap";
const props = defineProps<
  | { type: "regist"; address?: never; contractDate?: never }
  | { type: "edit"; address: string; contractDate: string; homeData: HomeRegisterResponseDTO }
>();

const emit = defineEmits(["close"]);

// 모달 닫기 시 원래 주소 정보로 복원
function restoreOriginalAddress() {
  if (originalAddressInfo.value && props.type === "edit") {
    homeStore.updateAddressInfo(originalAddressInfo.value);
  }
}

// 모달 닫기 처리
function handleClose() {
  restoreOriginalAddress(); // 원래 주소 정보로 복원
  emit('close'); // 모달 닫기
}

const api = new Api();
const homeStore = useHomeStore();

const formData = ref<HomeRegisterRequestDTO>({
  buildingNumber: "",
  contractStart: "",
  contractEnd: "",
  rentType: 1, // 1: 전세, 2: 월세
  jeonseAmount: 0,
  monthlyRent: 0,
  monthlyDeposit: 0,
  lat: 0,
  lng: 0,
});

const startDate = ref<string | null>(null);
const endDate = ref<string | null>(null);
const deposit = ref(""); // 보증금
const monthlyRent = ref(""); // 월세
const jeonseAmount = ref(""); // 전세금
const contractType = ref<"jeonse" | "monthlyRent">("jeonse");
const title = props.type === "regist" ? "나의 집 등록" : "나의 집 수정";

// 원래 주소 정보 저장용 (모달 닫기 시 복원용)
const originalAddressInfo = ref<{
  roadAddress: string;
  jibunAddress: string;
  buildingName: string;
  dongName: string;
  buildingNumber: string;
  umdNm?: string;
  jibunAddr?: string;
} | null>(null);

// 컴포넌트 초기화
onMounted(async () => {

  if (props.type === "edit" && props.homeData) {
    // 수정 모드: 기존 데이터로 폼 초기화
    const homeData = props.homeData;

    // 계약 기간 설정
    startDate.value = homeData.contractStart || null;
    endDate.value = homeData.contractEnd || null;

    // 계약 유형 설정
    contractType.value = homeData.rentType === 1 ? "jeonse" : "monthlyRent";

    // 금액 정보 설정
    if (homeData.rentType === 1) {
      // 전세
      jeonseAmount.value = homeData.jeonseAmount?.toString() || "";
    } else {
      // 월세
      deposit.value = homeData.monthlyDeposit?.toString() || "";
      monthlyRent.value = homeData.monthlyRent?.toString() || "";
    }

    // 주소 정보 설정 (PostcodeSearch 컴포넌트에서 사용할 수 있도록)
    formData.value.buildingNumber = homeData.buildingNumber || "";

    // 기존 집 정보를 store에 로드
    homeStore.loadHomeInfo(homeData);

    // PostcodeSearch에서 사용할 수 있도록 formData 업데이트
    formData.value.buildingNumber = homeData.buildingNumber || "";

    // 백엔드에서 받아온 도로명주소를 homeStore에 저장
    if (homeData.roadAddress) {
      // 원래 주소 정보 저장 (모달 닫기 시 복원용)
      originalAddressInfo.value = {
        roadAddress: homeData.roadAddress,
        jibunAddress: homeData.jibunAddr || "",
        buildingName: homeData.buildingName || "",
        dongName: homeData.umdNm || "",
        buildingNumber: homeData.buildingNumber || "",
        umdNm: homeData.umdNm || "",
        jibunAddr: homeData.jibunAddr || ""
      };

      // 모든 주소 정보 homeStore에 업데이트
      homeStore.updateAddressInfo({
        roadAddress: homeData.roadAddress,
        jibunAddress: homeData.jibunAddr || "",
        buildingName: homeData.buildingName || "",
        dongName: homeData.umdNm || "",
        buildingNumber: homeData.buildingNumber || "",
        umdNm: homeData.umdNm || "",
        jibunAddr: homeData.jibunAddr || ""
      });
    } else {
      console.log("⚠️ 백엔드에 도로명주소 정보 없음");
    }

  } else {
    console.log("✅ 등록 모드, 바로 모달 표시");
  }

  try {
    await mapUtil.loadNaverMapScript();
  } catch (error) {
    console.error("네이버 지도 API 로드 실패:", error);
  }
});

const submitForm = async (): Promise<{ success: boolean; message: string }> => {
  try {
    // 주소 정보 결정: 사용자가 새 주소를 선택했으면 homeStore의 정보, 아니면 기존 props의 정보
    const addressInfo = homeStore.homeInfo.addressInfo;
    const hasNewAddress = addressInfo.buildingName && addressInfo.roadAddress &&
                          (addressInfo.buildingName !== props.homeData?.buildingName ||
                           addressInfo.roadAddress !== props.homeData?.roadAddress);

    // 기존 집 정보를 유지하면서 수정된 정보만 업데이트
    const requestData: HomeRegisterRequestDTO = {
      // 주소 정보: 새 주소가 있으면 homeStore에서, 없으면 기존 props에서 가져오기
      buildingNumber: hasNewAddress ? addressInfo.buildingNumber : (props.homeData?.buildingNumber || ""),
      buildingName: hasNewAddress ? addressInfo.buildingName : (props.homeData?.buildingName || ""),
      roadAddress: hasNewAddress ? addressInfo.roadAddress : (props.homeData?.roadAddress || ""),
      jibunAddress: hasNewAddress ? addressInfo.jibunAddress : (props.homeData?.jibunAddr || ""),
      dongName: hasNewAddress ? addressInfo.dongName : (props.homeData?.umdNm || ""),
      // 계약 정보
      contractStart: startDate.value || undefined,
      contractEnd: endDate.value || undefined,
      rentType: contractType.value === "jeonse" ? 1 : 2,
      // 금액 정보 (수정된 값만)
      jeonseAmount: contractType.value === "jeonse" ? parseInt(jeonseAmount.value) || 0 : 0,
      monthlyRent: contractType.value === "monthlyRent" ? parseInt(monthlyRent.value) || 0 : 0,
      monthlyDeposit: contractType.value === "monthlyRent" ? parseInt(deposit.value) || 0 : 0,
      // 좌표 정보: 새 주소가 있으면 homeStore에서, 없으면 기존 props에서 가져오기
      lat: hasNewAddress ? (homeStore.homeInfo.lat || 0) : (props.homeData?.latitude || 0),
      lng: hasNewAddress ? (homeStore.homeInfo.lng || 0) : (props.homeData?.longitude || 0),
    };


    if (props.type === "regist") {
      // 집 등록
      const response = await api.registerHomeUsingPost(requestData);
      if (response.data.success && response.data.data) {
        homeStore.updateHomeInfoFromResponse(response.data.data);
      }
      return { success: true, message: "나의 집 정보가 등록되었습니다." };
    } else {
      // 집 정보 수정
      const response = await api.registerHomeUsingPost(requestData);
      if (response.data.success && response.data.data) {
        homeStore.updateHomeInfoFromResponse(response.data.data);
      }
      return { success: true, message: "나의 집 정보가 수정되었습니다." };
    }
  } catch (error) {
    console.error("집 정보 저장 실패:", error);
    return { success: false, message: "집 정보 저장에 실패했습니다." };
  }
};

// 주소를 좌표로 변환
async function searchAddressToCoordinate(address: string) {
  try {
    const result = await mapUtil.searchAddressToCoordinate(address);
    const lat = result.latlng.lat();
    const lng = result.latlng.lng();

    // formData와 homeStore 모두에 좌표 저장
    formData.value.lat = lat;
    formData.value.lng = lng;

    // homeStore에도 좌표 정보 업데이트
    homeStore.homeInfo.lat = lat;
    homeStore.homeInfo.lng = lng;


  } catch (error) {
    console.error("주소를 좌표로 변환하는 데 실패했습니다:", error);
  }
}

// PostcodeSearch에서 주소 선택 완료 시
async function handleAddressSelected(address: string) {
  if (address) {
    await searchAddressToCoordinate(address);
  }
}

// PostcodeSearch에서 주소 정보가 업데이트될 때
function handleAddressInfoUpdated(addressData: {
  roadAddress: string;
  jibunAddress: string;
  buildingName: string;
  dongName: string;
  buildingNumber: string;
  umdNm?: string;
  jibunAddr?: string;
}) {
  // homeStore에 주소 정보 업데이트
  homeStore.updateAddressInfo(addressData);

  // formData도 함께 업데이트하여 UI 동기화
  formData.value.buildingNumber = addressData.buildingNumber;
  // resetHomeInfo() 호출하지 않음 - 좌표 정보 유지
}



// 동 정보 변경 시
function handleBuildingNumberChanged(buildingNumber: string) {
  // formData 업데이트
  formData.value.buildingNumber = buildingNumber;

  // homeStore도 함께 업데이트
  homeStore.updateBuildingNumber(buildingNumber);
}

// 계약 유형 변경 시
function handleContractTypeChanged() {
  // 계약 유형이 변경되면 모든 입력값 초기화
  if (contractType.value === "jeonse") {
    // 전세로 변경 시 월세 관련 입력값 초기화
    monthlyRent.value = "";
    deposit.value = "";
    jeonseAmount.value = "";
  } else {
    // 월세로 변경 시 전세 관련 입력값 초기화
    jeonseAmount.value = "";
    deposit.value = "";
  }
}

async function handleConfirm(): Promise<{ success: boolean; message: string }> {
  return await submitForm();
}

const options = [
  { label: "전세", value: "jeonse" },
  { label: "월세", value: "monthlyRent" },
];
</script>
<template>
  <ModalForm :title="title" :handle-confirm="handleConfirm" @close="handleClose" hasConfirmBtn>
    <div class="mt-4">
      <div class="text-lg font-pretendard-bold">집 주소</div>
      <PostcodeSearch
        :initial-address="props.type === 'edit' && props.homeData ?
          (() => {
            const savedAddressInfo = homeStore.homeInfo.addressInfo;
            if (savedAddressInfo.buildingName || savedAddressInfo.buildingNumber) {
              return savedAddressInfo;
            }
            // 저장된 주소 정보가 없다면 기본값 반환
            return {
              roadAddress: homeStore.homeInfo.addressInfo.roadAddress || '',
              jibunAddress: props.homeData.jibunAddr || '',
              buildingName: props.homeData.buildingName || '',
              dongName: props.homeData.umdNm || '',
              buildingNumber: props.homeData.buildingNumber || '',
              umdNm: props.homeData.umdNm || ''
            };
          })()
        : undefined"
        @address-selected="handleAddressSelected"
        @building-number-changed="handleBuildingNumberChanged"
        @address-info-updated="handleAddressInfoUpdated"
      />

    </div>
    <div class="mt-4">
      <div class="text-lg font-pretendard-bold">계약 기간</div>
      <div class="flex items-center gap-1 mt-4">
        <DatePicker
          :label="'계약 시작일'"
          :model-value="startDate ? new Date(startDate) : null"
          @update:model-value="
            (date) => {
              startDate = date ? date.toLocaleDateString('sv-SE') : null;
            }
          "
          placeholder="계약 시작일"
        ></DatePicker>
        <div class="text-lg font-pretendard-bold">~</div>
        <DatePicker
          :label="'계약 종료일'"
          :model-value="endDate ? new Date(endDate) : null"
          @update:model-value="
            (date) => {
              endDate = date ? date.toLocaleDateString('sv-SE') : null;
            }
          "
          placeholder="계약 종료일"
        ></DatePicker>
      </div>
    </div>

    <div class="mt-4">
      <div class="text-lg font-pretendard-bold">계약 금액</div>
      <RadioListButton
        class="mt-4"
        v-model="contractType"
        :options="options"
        rounded
        @change="handleContractTypeChanged"
      />
    </div>
    <div class="mt-5" v-if="contractType === 'jeonse'">
      <DefaultInput label="전세금" type="money" v-model="jeonseAmount"></DefaultInput>
    </div>
    <div class="mt-5" v-else-if="contractType === 'monthlyRent'">
      <DefaultInput label="보증금" type="money" v-model="deposit"></DefaultInput>
      <DefaultInput class="mt-4" label="월세" type="money" v-model="monthlyRent"></DefaultInput>
    </div>
  </ModalForm>
</template>
