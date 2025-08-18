<script setup lang="ts">
/**
 * ConfirmModal 컴포넌트
 * - 기본 모달(BaseModal)을 확장하여 확인/취소 버튼이 있는 모달을 제공
 * - props.handleConfirm 이 있으면 "완료" 버튼 클릭 시 비동기/동기 처리 로직 실행
 * - 처리 결과에 따라 Toast 메시지를 띄움
 *
 * Props:
 * @prop title         - 모달 제목 (필수)
 * @prop hasConfirmBtn - 확인/닫기 버튼 2개 여부 (true 시 "닫기/완료", false 시 "확인")
 * @prop handleConfirm - 확인 버튼 클릭 시 실행할 콜백
 *                       (Promise 또는 동기 객체 반환, { success, message } 형식)
 *
 * Emits:
 * @emit close - 모달 닫기 이벤트
 */
import { useToast, ToastType } from "@/utils/useToast";
import BaseModal from "./BaseModal.vue";
const props = defineProps<{
  title: string;
  hasConfirmBtn?: boolean;
  handleConfirm?: () =>
    | Promise<{ success: boolean; message: string }>
    | { success: boolean; message: string };
}>();

const { addToast, createToast } = useToast();
const showToast = (msg: string, type?: ToastType) => {
  addToast(createToast(msg, type));
};
const emit = defineEmits(["close"]);
async function onConfirm() {
  if (!props.handleConfirm) {
    emit("close");
    return;
  }

  try {
    const result = await props.handleConfirm();
    if (result.success) {
      showToast(result.message || "성공적으로 처리되었습니다.", "success");
      emit("close");
    } else {
      showToast(result.message || "처리에 실패했습니다.", "error");
    }
  } catch (error) {
    showToast("오류가 발생했습니다.\n" + String(error), "error");
  }
}
</script>
<template>
  <BaseModal verticalAlign="middle" @close="$emit('close')">
    <h2 class="text-xl font-pretendard-bold mb-4">{{ title }}</h2>
    <!-- 컨텐츠 최대 높이 = 화면 1/2 초과 시 스크롤 생성 -->
    <div class="max-h-[50vh] overflow-y-auto pt-1 hide-scrollbar">
      <slot></slot>
    </div>
    <div class="flex justify-end gap-2 mt-8">
      <template v-if="hasConfirmBtn">
        <button
          class="rounded-xl w-1/2 cursor-pointer text-white bg-kb-gray-light"
          @click="$emit('close')"
        >
          닫기
        </button>
        <button
          class="rounded-xl w-1/2 py-2 bg-kb-yellow-positive text-white cursor-pointer"
          @click="onConfirm"
        >
          완료
        </button>
      </template>
      <template v-else>
        <button
          class="rounded-xl w-full py-2 bg-kb-yellow-positive text-white cursor-pointer"
          @click="$emit('close')"
        >
          확인
        </button>
      </template>
    </div>
  </BaseModal>
</template>
