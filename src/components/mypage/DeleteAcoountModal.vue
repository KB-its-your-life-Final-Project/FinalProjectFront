<script setup lang="ts">
import ModalForm from "../common/ModalForm.vue";
import CustomInput from "./CustomInput.vue";
import { ref } from "vue";
import { useToast } from "@/utils/useToast";
import { isEmpty, isValidPassword } from "@/utils/validate";
import movePage from "@/utils/movePage";

const emit = defineEmits(["close"]);
const { addToast, createToast } = useToast();
const password = ref("");
const validation = ref(false);
function handleConfirm(): { success: boolean; message: string } {
  if (!validation.value) {
    return { success: false, message: "본인인증을 먼저 해야 합니다" };
  }
  /** todo: 회원 삭제 요청 */
  /** todo: 로그아웃 해야함. 만약 라우터 가드가 있다면 화면 이동은 없어도 될지도? */
  // 1.5초 후 화면 이동
  setTimeout(() => {
    movePage.homeMain();
  }, 1500);
  return { success: true, message: "탈퇴가 완료되었습니다" };
}
function checkPassword(password: string) {
  if (isEmpty(password) || !isValidPassword(password)) {
    addToast(createToast("입력이 되지 않거나 올바르지 않은 형식의 비밀번호 입니다", "error"));
    return;
  }
  /** todo: 비밀번호 검증 api 호출 */
  addToast(createToast("비밀번호가 일치합니다", "success"));
  validation.value = true;
}
</script>
<template>
  <ModalForm :title="'회원 탈퇴'" @close="emit('close')" :handle-confirm="handleConfirm">
    <div class="flex gap-3 items-center">
      <CustomInput :label="'기존 비밀번호'" v-model="password" :type="'password'"></CustomInput>
      <div
        class="cursor-pointer text-sm hover:underline"
        @click="validation ? null : checkPassword(password)"
      >
        비밀번호 확인
      </div>
    </div>
    <div v-if="validation" class="text-sm text-success mt-1 ml-1">* 비밀번호 확인 성공</div>
  </ModalForm>
</template>
