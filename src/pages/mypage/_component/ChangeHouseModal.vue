<script setup lang="ts">
import { ref } from "vue";

import ModalForm from "@/components/common/ModalForm.vue";
import DatePicker from "@/components/common/DatePicker.vue";
import RadioListButton from "@/components/common/RadioListButton.vue";

import DefaultInput from "@/components/common/DefaultInput.vue";
import PostcodeSearch from "./SearchAddress.vue";

const props = defineProps<
  | { type: "regist"; address?: never; contractDate?: never }
  | { type: "edit"; address: string; contractDate: string }
>();

const emit = defineEmits(["close"]);

const startDate = ref(null);
const endDate = ref(null);
const deposit = ref("");
const monthlyRent = ref("");
const contractType = ref<"jeonse" | "monthlyRent">("jeonse");
const title = props.type === "regist" ? "나의 집 등록" : "나의 집 수정";
function handleConfirm(): { success: boolean; message: string } {
  // 처리 로직이 아직 없으니 그냥 성공했다고 가정
  switch (props.type) {
    case "regist":
      return { success: true, message: "나의 집 정보가 등록되었습니다." };
    case "edit":
      return { success: true, message: "나의 집 정보가 수정되었습니다." };
  }
}

const options = [
  { label: "전세", value: "jeonse" },
  { label: "월세", value: "monthlyRent" },
];
</script>
<template>
  <ModalForm :title="title" :handle-confirm="handleConfirm" @close="emit('close')">
    <div class="mt-4">
      <div class="text-lg font-pretendard-bold">집 주소</div>
      <PostcodeSearch />
    </div>
    <div class="mt-4">
      <div class="text-lg font-pretendard-bold">계약 기간</div>
      <div class="flex items-center gap-1 mt-4">
        <DatePicker
          :label="'계약 시작일'"
          v-model="startDate"
          placeholder="계약 시작일"
        ></DatePicker>
        <div class="text-lg font-pretendard-bold">~</div>
        <DatePicker :label="'계약 종료일'" v-model="endDate" placeholder="계약 종료일"></DatePicker>
      </div>
    </div>

    <div class="mt-4">
      <div class="text-lg font-pretendard-bold">계약 금액</div>
      <RadioListButton class="mt-4" v-model="contractType" :options="options" rounded />
    </div>
    <div class="mt-5" v-if="contractType === 'jeonse'">
      <DefaultInput label="전세금" type="money" v-model="deposit"></DefaultInput>
    </div>
    <div class="mt-5" v-else-if="contractType === 'monthlyRent'">
      <DefaultInput label="보증금" type="money" v-model="deposit"></DefaultInput>
      <DefaultInput class="mt-4" label="월세" type="money" v-model="monthlyRent"></DefaultInput>
    </div>
  </ModalForm>
</template>
