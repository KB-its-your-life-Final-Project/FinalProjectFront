<script setup lang="ts">
import { ref } from "vue";
import ModalForm from "@/components/common/ModalForm.vue";
import DefaultInput from "@/components/common/DefaultInput.vue";
import { Api } from "@/api/autoLoad/Api";
import type { VerifyPwdRequestDTO, ChangeRequestDTO } from "@/api/autoLoad/data-contracts";
import { isEmpty, isValidPasswordFormat } from "@/utils/validate";
import movePage from "@/utils/movePage";
import { useToast } from "@/utils/useToast";
import { authStore } from "@/stores/authStore";

// 상태
const pwd = ref("");
const isVerified = ref(false);

// Emit
const emit = defineEmits(["close"]);

// API
const api = new Api();

const auth = authStore();
const { addToast, createToast } = useToast();

async function handleConfirm(): { success: boolean; message: string } {
  if (!isVerified.value) {
    return { success: false, message: "본인인증을 먼저 해야 합니다" };
  }
  /** todo: 회원 삭제 요청 */
  try {
    const { data } = await api.unregisterUsingPost();
    console.log("data - unregister: ", data);
  } catch (error: unknown) {
    console.error("회원 탈퇴 실패: ", error);
    return { success: false, message: " 회원 탈퇴 중 오류가 발생했습니다" };
  }
  try {
    if (auth.logout) {
    await auth.logout();
  } else {
    console.error("logoutUser is undefined");
  }
  } catch (error: unknown) {
    console.error("로그아웃 실패: ", error);
    return { success: false, message: "로그아웃 중 오류가 발생했습니다" };
  }

  // 1.5초 후 화면 이동
  setTimeout(() => {
    movePage.homeMain();
  }, 1500);
  return { success: true, message: "탈퇴가 완료되었습니다" };

}

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
</script>
<template>
  <ModalForm
    :title="'회원 탈퇴'"
    @close="emit('close')"
    :handle-confirm="handleConfirm"
    hasConfirmBtn
  >
    <div class="relative">
      <DefaultInput
        :label="'기존 비밀번호'"
        v-model="pwd"
        :type="'password'"
        show-button
        :button-label="'인증'"
        @button-click="checkPassword(pwd)"
      ></DefaultInput>
    </div>
    <div v-if="isVerified" class="text-sm text-success mt-1 ml-1">* 인증 완료</div>
  </ModalForm>
</template>
