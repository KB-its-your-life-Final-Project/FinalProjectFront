<script setup lang="ts">
import movePage from "@/utils/movePage";

const goBack = async () => {
  movePage.back();
};
</script>

<template>
  <img
    class="w-6 h-6 cursor-pointer"
    src="@/assets/imgs/go_back_icon.svg"
    alt="뒤로가기"
    @click="goBack"
  />
</template>

<style scoped></style>
