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
    <div class="px-10 mt-8">
      <div class="font-pretendard-bold text-5xl text-kb-ui-10">화양동 동네이야기</div>
    </div>
  </Header>
  <div class="px-4 mt-16">
    <!-- 날씨 정보 박스 -->
    <div class="mt-8">
      <WeatherCard />
    </div>

    <!-- 카드 4개 2x2 그리드로 표시 -->
    <div class="grid grid-cols-2 gap-8 mt-8">
      <InfoCard v-for="(card, i) in InfoCardList" :key="i" :info="card" />
    </div>
  </div>
</template>
