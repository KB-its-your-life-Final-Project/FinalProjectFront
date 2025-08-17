<!--
Toast 알림 컴포넌트
1. useToast에서 관리하는 toasts 배열을 순회하며 표시
2. 타입(success, error, info)에 따라 색상과 아이콘 변경
3. transition-group으로 등장/퇴장 애니메이션 적용
4. 화면 하단 중앙에 고정 표시
5. 메시지 길이에 따라 줄바꿈 가능
-->
<template>
  <div class="fixed bottom-20 left-1/2 transform -translate-x-1/2 z-[9999]">
    <transition-group name="toast" tag="div" class="space-y-2">
      <div
        v-for="toast in toasts"
        :key="toast.id"
        class="flex items-center gap-2 px-4 py-2 rounded-full shadow text-white bg-black/50 transition-all"
      >
        <div
          :class="[
            'w-6 h-6 flex items-center justify-center rounded-full shrink-0',
            bgColorMap[toast.type] || 'bg-blue-500',
          ]"
        >
          <font-awesome-icon :icon="getIconName(toast.type)" class="text-white text-xs" />
        </div>
        <div class="text-sm break-words">{{ toast.message }}</div>
      </div>
    </transition-group>
  </div>
</template>

<script setup lang="ts">
import { useToast } from "@/utils/useToast";
const bgColorMap: Record<string, string> = {
  success: "bg-green-500",
  error: "bg-red-500",
  info: "bg-blue-500",
};

function getIconName(type: string) {
  switch (type) {
    case "success":
      return "fas fa-check";
    case "error":
      return "fas fa-triangle-exclamation";
    case "info":
    default:
      return "fas fa-info-circle";
  }
}
const { toasts } = useToast();
</script>

<style scoped>
.toast-enter-from {
  opacity: 0;
  transform: translateY(20px);
}
.toast-enter-to {
  opacity: 1;
  transform: translateY(0);
}
.toast-enter-active {
  transition: all 0.3s ease;
}
.toast-leave-from {
  opacity: 1;
  transform: translateY(0);
}
.toast-leave-to {
  opacity: 0;
  transform: translateY(20px);
}
.toast-leave-active {
  transition: all 0.3s ease;
}
</style>
