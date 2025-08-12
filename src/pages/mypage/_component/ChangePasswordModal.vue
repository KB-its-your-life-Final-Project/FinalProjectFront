<script setup lang="ts">
import { ref } from "vue";
import ModalForm from "@/components/common/ModalForm.vue";
import DefaultInput from "@/components/common/DefaultInput.vue";
import { Api } from "@/api/autoLoad/Api";
import type { VerifyPwdRequestDTO, ChangeRequestDTO } from "@/api/autoLoad/data-contracts";
import { isEmpty, isValidPasswordFormat, isValidPasswordChk } from "@/utils/validate";
import { useToast } from "@/utils/useToast";
import { authStore } from "@/stores/authStore";

// 상태
const oldPwd = ref("");
const newPwd = ref("");
const newPwdChk = ref("");
const isVerified = ref(false);

// Emit
const emit = defineEmits(["close"]);

// API
const api = new Api();

const auth = authStore();
const { addToast, createToast } = useToast();

// 비밀번호 확인 버튼 클릭 시 (기존 비밀번호 인증)
async function checkPassword(password: string) {
  if (isEmpty(password)) {
    addToast(createToast("기존 비밀번호를 입력하세요", "error"));
    return;
  }
  const verifyPwdRequestDto: VerifyPwdRequestDTO = {
    email: auth.member.email,
    pwd: password,
  };
  console.log("verifyPwdRequestDto: ", verifyPwdRequestDto);
  const { data } = await api.verifyPwdUsingPost(verifyPwdRequestDto);
  console.log("response data: ", data);
  if (data.data) {
    addToast(createToast("비밀번호가 일치합니다", "success"));
    isVerified.value = true;
    return;
  }
  addToast(createToast("비밀번호가 일치하지 않습니다", "error"));
  return;
}

async function handleConfirm(): Promise<{ success: boolean; message: string }> {
  if (!isVerified.value) {
    return { success: false, message: "기존 비밀번호를 인증하세요" };
  }
  if (isEmpty(newPwd.value) || isEmpty(newPwdChk.value)) {
    return { success: false, message: "새 비밀번호 및 비밀번호 확인을 입력하세요 (공백 불가)" };
  }
  if (!isValidPasswordFormat(newPwd.value) || !isValidPasswordFormat(newPwdChk.value)) {
    return { success: false, message: "새 비밀번호의 형식이 올바르지 않습니다" };
  }
  if (!isValidPasswordChk(newPwd.value, newPwdChk.value)) {
    return { success: false, message: "새 비밀번호 및 비밀번호 확인이 불일치 합니다" };
  }
  if (oldPwd.value == newPwd.value) {
    return { success: false, message: "기존 비밀번호와 다른 비밀번호를 입력하세요" };
  }

  const changeRequestDto: ChangeRequestDTO = {
    name: "",
    pwd: newPwd.value,
    changeType: 2, // 1: name, 2: pwd
  };
  console.log("changeRequestDto: ", changeRequestDto);

  try {
    const { data } = await api.changeMemberInfoUsingPut(changeRequestDto);
    console.log("data: ", data);
    return { success: true, message: "비밀번호가 변경되었습니다" };
  } catch (error: unknown) {
    console.error("비밀번호 변경 실패: ", error);
    return { success: false, message: "비밀번호 변경에 실패했습니다" };
  }
}
</script>
<template>
  <ModalForm
    :title="'비밀번호 변경'"
    :handle-confirm="handleConfirm"
    @close="emit('close')"
    hasConfirmBtn
  >
    <DefaultInput
      label="기존 비밀번호"
      v-model="oldPwd"
      type="password"
      placeholder="본인 인증이 필요합니다"
      showButton
      button-label="인증"
      @button-click="checkPassword(oldPwd)"
    />
    <div v-if="isVerified" class="text-sm text-success mt-1 ml-1">* 인증 완료</div>
    <DefaultInput
      class="mt-4"
      label="새 비밀번호"
      v-model="newPwd"
      :type="'password'"
      placeholder="새 비밀번호를 입력하세요"
    ></DefaultInput>
    <div class="text-gray-400 pl-1 text-sm pt-1">8자 이상, 대소문자, 숫자, 특수문자 포함</div>
    <DefaultInput
      class="mt-4"
      label="비밀번호 확인"
      v-model="newPwdChk"
      :type="'password'"
      placeholder="새 비밀번호를 입력하세요"
    ></DefaultInput>
  </ModalForm>
</template>
