<!-- LocalInfoPage.vue 동네.zip  레이아웃 -->

<script setup lang="ts">
import Header from "@/components/layout/header/Header.vue";
import SearchCard from "@/pages/localInfo/_component/SearchCard.vue";
import WeatherCard from "@/pages/localInfo/_component/WeatherCard.vue";
import InfoCard from "@/pages/localInfo/_component/InfoCard.vue";
import { InfoCardList } from "@/pages/localInfo/_component/InfoCard.ts";
</script>
<template>
   <Header headerShowtype="localInfo">
      <SearchCard />
   </Header>
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
