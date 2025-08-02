<!-- LocalInfoPage.vue 동네.zip  레이아웃 -->

<script setup lang="ts">
import Header from "@/components/layout/header/Header.vue";
import RegionSearch from "@/pages/localInfo/_component/RegionSearch.vue";
import WeatherCard from "@/pages/localInfo/_component/WeatherCard.vue";
import InfoCard from "@/pages/localInfo/_component/InfoCard.vue";
import { InfoCardList } from "@/pages/localInfo/_component/InfoCard.ts";
import Footer from "@/components/layout/Footer.vue";
import { ref } from "vue";
import type { LocalInfoResponseDTO } from "@/api/autoLoad/data-contracts";

// 선택된 지역 정보
const selectedRegion = ref<string>("서울특별시");
const selectedRegionCd = ref<string>("1100000000");
const selectedRegionData = ref<LocalInfoResponseDTO | null>(null);

// 지역 선택 핸들러
const handleRegionSelected = async (region: LocalInfoResponseDTO) => {
  console.log("선택된 지역:", region);

  // 선택된 지역 정보 저장
  selectedRegion.value = region.locataddNm || "서울특별시";
  selectedRegionCd.value = region.regionCd || "1100000000";
  selectedRegionData.value = region;
};

// 지역명에서 마지막 동(洞) 부분만 추출
const getLastDong = (fullAddress: string) => {
  // "동"으로 끝나는 부분을 찾기
  const parts = fullAddress.split(" ");
  for (let i = parts.length - 1; i >= 0; i--) {
    if (parts[i].endsWith("동")) {
      return parts[i];
    }
  }

  // "동"이 없으면 마지막 부분 반환
  return parts[parts.length - 1] || fullAddress;
};
</script>

<template>
  <Header headerShowtype="localInfo">
    <div class="mt-23">
      <div class="font-pretendard-bold text-5xl text-kb-ui-10">
        {{ getLastDong(selectedRegion) }} 동네이야기
      </div>
    </div>
  </Header>

  <div class="w-full h-full flex-col px-4 mt-4">
    <RegionSearch @region-selected="handleRegionSelected" />
  </div>

  <div class="px-4 mt-16">
    <!-- 날씨 정보 박스 -->
    <div class="mt-8">
      <WeatherCard :region="selectedRegion" :regionCd="selectedRegionCd" :weather-data="null" />
    </div>

    <!-- 카드 4개 2x2 그리드로 표시 -->
    <div class="grid grid-cols-2 gap-8 mt-8">
      <InfoCard
        v-for="(card, i) in InfoCardList"
        :key="i"
        :info="card"
        :regionCd="selectedRegionCd"
      />
    </div>
  </div>

  <Footer />
  <div class="h-15"></div>
</template>
