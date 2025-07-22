<!-- MenuPage.vue 레이아웃 -->
<script setup lang="ts">
// 필요 시 기능 추가
import Header from "@/components/layout/header/Header.vue";
import Section from "@/components/nav/BottomNav.vue";
import { mainRouteName } from "@/router/mainRoute";
</script>

<template>
  <Header :headerShowtype="mainRouteName.mainMenu" />

  <h1 class="text-xl font-bold">전체 메뉴</h1>
  <ul class="mt-4 space-y-2">
    <li>마이페이지</li>
    <li>안심 정보</li>
    <li>찜한 매물</li>
    <li>서비스 소개</li>
    <!-- 실제 라우팅 연결은 필요에 따라 RouterLink-->
  </ul>
  <Section />
</template>
