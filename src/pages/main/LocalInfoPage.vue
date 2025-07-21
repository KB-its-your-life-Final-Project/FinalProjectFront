<!-- LocalInfoPage.vue 동네.zip  레이아웃 -->

<script setup lang="ts">
import BackHeader from "@/components/layouts/BackHeader.vue";
// import NavBar from "@/components/layouts/NavBar.vue";
import SearchCard from "@/components/localinfo/SearchCard.vue";
import InfoCard from "@/components/localinfo/InfoCard.vue";
import { InfoCardList } from "@/components/localinfo/InfoCard.ts";
import WeatherCard from "@/components/localinfo/WeatherCard.vue";
</script>
<template>
  <BackHeader>
    <SearchCard />
  </BackHeader>
  <div class="px-4">
    <!-- 날씨 정보 박스 -->
    <div class="gap-8 mt-8">
      <WeatherCard />
    </div>

    <!-- 카드 4개 2x2 그리드로 표시 -->
    <div class="grid grid-cols-2 gap-8 mt-8">
      <InfoCard v-for="(card, i) in InfoCardList" :key="i" :info="card" />
    </div>
  </div>
</template>
