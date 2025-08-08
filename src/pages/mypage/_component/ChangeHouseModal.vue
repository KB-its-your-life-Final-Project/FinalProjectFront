<script setup lang="ts">
import { ref, onMounted } from "vue";

import ModalForm from "@/components/common/ModalForm.vue";
import DatePicker from "@/components/common/DatePicker.vue";
import RadioListButton from "@/components/common/RadioListButton.vue";

import DefaultInput from "@/components/common/DefaultInput.vue";
import PostcodeSearch from "./SearchAddress.vue";
import { Api } from "@/api/autoLoad/Api";
import type { HomeRegisterRequestDTO } from "@/api/autoLoad/data-contracts";
import mapUtil from "@/utils/naverMap/naverMap";
const props = defineProps<
  | { type: "regist"; address?: never; contractDate?: never }
  | { type: "edit"; address: string; contractDate: string }
>();

const emit = defineEmits(["close"]);

const api = new Api();

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

// 컴포넌트 초기화
onMounted(async () => {
  if (props.type === "edit") {
    // 수정 모드: 기존 데이터로 폼 초기화
    formData.value.contractStart = props.contractDate || "";
    startDate.value = props.contractDate || null;
  }

  // Naver Maps API 로드
  try {
    await mapUtil.loadNaverMapScript();
  } catch (error) {
    console.error("네이버 지도 API 로드 실패:", error);
  }
});

const submitForm = async (): Promise<{ success: boolean; message: string }> => {
  try {
    // 폼 데이터를 HomeRegisterRequestDTO 형식으로 변환
    const requestData: HomeRegisterRequestDTO = {
      buildingNumber: formData.value.buildingNumber,
      contractStart: startDate.value || undefined,
      contractEnd: endDate.value || undefined,
      rentType: contractType.value === "jeonse" ? 1 : 2,
      jeonseAmount: contractType.value === "jeonse" ? parseInt(jeonseAmount.value) || 0 : 0,
      monthlyRent: contractType.value === "monthlyRent" ? parseInt(monthlyRent.value) || 0 : 0,
      monthlyDeposit: contractType.value === "monthlyRent" ? parseInt(deposit.value) || 0 : 0,
      lat: formData.value.lat,
      lng: formData.value.lng,
    };

    if (props.type === "regist") {
      // 집 등록
      await api.registerHomeUsingPost(requestData);
      return { success: true, message: "나의 집 정보가 등록되었습니다." };
    } else {
      // 집 정보 수정
      await api.registerHomeUsingPost(requestData);
      return { success: true, message: "나의 집 정보가 수정되었습니다." };
    }
  } catch (error) {
    console.error("집 정보 저장 실패:", error);
    return { success: false, message: "집 정보 저장에 실패했습니다." };
  }
};

// 주소를 좌표로 변환 (mapUtil 사용)
async function searchAddressToCoordinate(address: string) {
  try {
    const result = await mapUtil.searchAddressToCoordinate(address);
    console.log("✅ 위도:", result.latlng.lat(), "경도:", result.latlng.lng());

    // formData에 좌표 저장
    formData.value.lat = result.latlng.lat();
    formData.value.lng = result.latlng.lng();
  } catch (error) {
    console.error("주소를 좌표로 변환하는 데 실패했습니다:", error);
  }
}

// PostcodeSearch에서 주소 선택 완료 시 호출
async function handleAddressSelected(address: string) {
  if (address) {
    await searchAddressToCoordinate(address);
  }
}

// 동 정보 변경 시 호출
function handleBuildingNumberChanged(buildingNumber: string) {
  formData.value.buildingNumber = buildingNumber;
}

// 계약 유형 변경 시 호출
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
  <ModalForm :title="title" :handle-confirm="handleConfirm" @close="emit('close')" hasConfirmBtn>
    <div class="mt-4">
      <div class="text-lg font-pretendard-bold">집 주소</div>
      <PostcodeSearch
        @address-selected="handleAddressSelected"
        @building-number-changed="handleBuildingNumberChanged"
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
