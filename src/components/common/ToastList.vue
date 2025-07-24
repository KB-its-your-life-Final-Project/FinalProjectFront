<template>
  <div class="fixed top-10 left-1/2 transform -translate-x-1/2 z-[9999]">
    <transition-group name="toast" tag="div" class="space-y-2">
      <div
        v-for="toast in toasts"
        :key="toast.id"
        :class="['px-4 py-2 rounded-md shadow text-white transition-all', bgColorMap[toast.type]]"
      >
        {{ toast.message }}
      </div>
    </transition-group>
  </div>
</template>

<script setup lang="ts">
import { useToast } from "@/utils/useToast";
const bgColorMap = {
  success: "bg-success",
  error: "bg-error",
  info: "bg-blue-500",
};

const { toasts } = useToast();
</script>

<style scoped>
.toast-enter-from {
  opacity: 0;
  transform: translateY(-20px);
}
.toast-enter-active {
  transition: all 0.3s ease;
}
.toast-leave-to {
  opacity: 0;
  transform: translateY(-20px);
}
.toast-leave-active {
  transition: all 0.3s ease;
}
</style>
