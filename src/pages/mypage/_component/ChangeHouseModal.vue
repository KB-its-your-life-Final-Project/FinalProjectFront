<script setup lang="ts">
import { Ref, ref } from "vue";

import ModalForm from "../common/ModalForm.vue";
import DatePicker from "../common/DatePicker.vue";
import CustomInput from "./CustomInput.vue";
import PostcodeSearch from "@/components/mypage/SearchAddress.vue";
const props = defineProps<
  | { type: "regist"; address?: never; contractDate?: never }
  | { type: "edit"; address: string; contractDate: string }
>();

const emit = defineEmits(["close"]);

const startDate = ref(null);
const endDate = ref(null);
const contractType: Ref<"jeonse" | "monthlyRent" | null> = ref(null);
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
</script>
<template>
  <ModalForm :title="title" :handle-confirm="handleConfirm" @close="emit('close')">
    <div class="mt-4">
      <div class="text-lg font-pretendard-bold">집 주소</div>
      <PostcodeSearch />
    </div>
    <div class="mt-4">
      <div class="text-lg font-pretendard-bold">계약 기간</div>
      <DatePicker :label="'계약 시작일'" v-model="startDate"></DatePicker>
      <DatePicker :label="'계약 종료일'" v-model="endDate"></DatePicker>
    </div>
    <div class="mt-4">
      <div class="text-lg font-pretendard-bold">계약 금액</div>
      <label class="mr-4">
        <input type="radio" value="jeonse" v-model="contractType" /> 전세
      </label>
      <label> <input type="radio" value="monthlyRent" v-model="contractType" /> 월세 </label>
    </div>
    <div class="mt-3" v-if="contractType === 'jeonse'">
      <CustomInput class="w-1/2" :label="'전세금'" :type="'text'"></CustomInput>
    </div>
    <div class="mt-3" v-else-if="contractType === 'monthlyRent'">
      <CustomInput class="w-1/2" :label="'보증금'" :type="'text'"></CustomInput>
      <CustomInput class="mt-4 w-1/2" :label="'월세'" :type="'text'"></CustomInput>
    </div>
  </ModalForm>
</template>
