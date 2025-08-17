<!--
뒤로가기 버튼 컴포넌트.
go_back_icon.svg 아이콘을 클릭하면 movePage.back()을 호출하여 이전 페이지로 이동.
-->
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
