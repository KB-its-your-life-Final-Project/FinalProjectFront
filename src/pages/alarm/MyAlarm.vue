<script setup lang="ts">
// 나중에 로직이 들어갈 수 있음
import Section from "@/components/nav/BottomNav.vue";
import Header from "@/components/layout/header/Header.vue";
import { mainRouteName } from "@/router/mainRoute";
</script>

<template>
  <Header :headerShowtype="mainRouteName.myAlarm" />
  <!--노란색 배경의 크기를 다른 페이지들과 맞추고 싶다면  <div class="h-[3rem]"></div> -->
  <!--안에 컨텐츠 없으면 자동으로 작아짐!-->
  <h1 class="text-xl font-bold">알림 설정</h1>

  <ul class="mt-4 space-y-2">
    <li>1</li>
    <li>2</li>
    <li>3</li>
    <li>4</li>
    <!-- 실제 라우팅 연결은 필요에 따라 RouterLink-->
  </ul>
  <!-- 섹션 없어도 될 것 같음 황병권 20250721 15:32 -->
  <Section />
</template>
