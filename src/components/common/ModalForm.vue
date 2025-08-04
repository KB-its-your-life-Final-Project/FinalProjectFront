<script setup lang="ts">
import { useToast, ToastType } from "@/utils/useToast";

const props = defineProps<{
  title: string;
  hasConfirmBtn?: boolean;
  handleConfirm: () =>
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
  <!-- Dim -->
  <div
    class="fixed inset-0 bg-black/50 flex items-center justify-center z-10"
    @click.self="emit('close')"
  >
    <!-- Modal -->
    <div class="bg-white rounded-xl shadow-lg w-full p-8 max-w-md mx-4 relative">
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
    </div>
  </div>
</template>
