<!--MapPage 레이아웃-->
<script setup lang="ts">
import Header from "@/components/layout/header/Header.vue";
import Section from "@/components/nav/BottomNav.vue";
import LogoSearchBar from "@/pages/home/_component/LogoSearchBar.vue";
import MapPage from "@/pages/mapSearch/MapPage.vue";
import { mainRouteName } from "@/router/mainRoute";
import Footer from "@/components/layout/Footer.vue";
</script>

<template>
  <!--  max-w-md  :늘리고 싶지 않으면  -->
  <Header :headerShowtype="mainRouteName.mapSearch">
    <!-- 검색창 -->
    <div class="relative mt-[3rem] px-[1rem]">
      <LogoSearchBar />
    </div>
  </Header>
  <!-- 지도부분 넣어주세요!!!! -->
  <div class="w-full h-[calc(100vh)] mt-[1.5rem] rounded-xl">
    <!-- 지도 API   -->
    <MapPage />
  </div>

  <Footer />
  <div class="h-15"></div>
</template>
