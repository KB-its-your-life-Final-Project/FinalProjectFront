<script setup lang="ts">
import ModalForm from "@/components/common/ModalForm.vue";
import DefaultInput from "@/components/common/DefaultInput.vue";
import { ref } from "vue";
import { useToast } from "@/utils/useToast";
import { isEmpty, isValidPasswordFormat, isValidPasswordChk } from "@/utils/validate";

const oldPassword = ref("");
const newPassword = ref("");
const doublePassword = ref("");
const validation = ref(false);
const emit = defineEmits(["close"]);
const { addToast, createToast } = useToast();
function handleConfirm(): { success: boolean; message: string } {
  if (!validation.value) {
    return { success: false, message: "기존 비밀번호 확인부터 진행해 주세요." };
  }
  if (
    isEmpty(newPassword.value) ||
    !isValidPasswordFormat(newPassword.value) ||
    isEmpty(doublePassword.value) ||
    !isValidPasswordFormat(doublePassword.value)
  ) {
    return { success: false, message: "새 비밀번호가 비었거나 형식에 이상이 있습니다." };
  }
  if (!isValidPasswordChk(newPassword.value, doublePassword.value)) {
    return { success: false, message: "새 비밀번호가 불일치 합니다" };
  }
  return { success: true, message: "비밀번호가 변경되었습니다" };
}
function checkPassword(password: string) {
  if (isEmpty(password) || !isValidPasswordFormat(password)) {
    addToast(createToast("입력이 되지 않거나 올바르지 않은 형식의 비밀번호 입니다", "error"));
    return;
  }
  /** todo: 비밀번호 검증 api 호출 */
  addToast(createToast("비밀번호가 일치합니다", "success"));
  validation.value = true;
}
</script>
<template>
  <ModalForm :title="'비밀번호 변경'" :handle-confirm="handleConfirm" @close="emit('close')">
    <DefaultInput
      label="기존 비밀번호"
      v-model="oldPassword"
      type="password"
      placeholder="본인 인증이 필요합니다"
      showButton
      button-label="인증"
      @button-click="checkPassword(oldPassword)"
    />
    <div v-if="validation" class="text-sm text-success mt-1 ml-1">* 인증 완료</div>
    <DefaultInput
      class="mt-4"
      label="새 비밀번호"
      v-model="newPassword"
      :type="'password'"
      placeholder="새 비밀번호를 입력하세요"
    ></DefaultInput>
    <div class="text-gray-400 pl-1 text-sm pt-1">8자 이상, 대소문자, 숫자, 특수문자 포함</div>
    <DefaultInput
      class="mt-4"
      label="비밀번호 확인"
      v-model="doublePassword"
      :type="'password'"
      placeholder="새 비밀번호를 입력하세요"
    ></DefaultInput>
  </ModalForm>
</template>
