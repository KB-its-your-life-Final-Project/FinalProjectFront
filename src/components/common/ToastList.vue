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
