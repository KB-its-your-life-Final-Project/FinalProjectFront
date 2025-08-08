<!-- LocalInfoPage.vue 동네.zip  레이아웃 -->

<script setup lang="ts">
import { ref, computed, onMounted, nextTick } from "vue";

import { useRoute } from "vue-router";
import type { LocalInfoResponseDTO } from "@/api/autoLoad/data-contracts";
import Header from "@/components/layout/header/Header.vue";
import RegionSearch from "@/pages/localInfo/_component/RegionSearch.vue";
import WeatherCard from "@/pages/localInfo/_component/WeatherCard.vue";
import InfoCard from "@/pages/localInfo/_component/InfoCard.vue";
import { InfoCardList } from "@/pages/localInfo/_component/InfoCard.ts";
import Footer from "@/components/layout/Footer.vue";
import WishButton from "@/components/common/WishButton.vue";
import ToastList from "@/components/common/ToastList.vue";

const route = useRoute();
const selectedRegionData = ref<LocalInfoResponseDTO | null>({
  regionCd: "1121510700",
  locataddNm: "서울시 광진구 화양동",
});

const selectedRegion = computed(() => selectedRegionData.value?.locataddNm || "");
const selectedRegionCd = computed(() => selectedRegionData.value?.regionCd || "");

// 지역이 변경될 때 데이터를 업데이트하는 핵심 함수
const handleRegionSelected = async (region: LocalInfoResponseDTO) => {
  selectedRegionData.value = region;
  await nextTick();
};

// 쿼리 파라미터로 지역 정보를 초기화
const RegionFromParams = async () => {
  const regionCd = route.query.regionCd as string;
  const regionName = route.query.regionNm as string;

  if (regionCd && regionName) {
    handleRegionSelected({ regionCd, locataddNm: regionName });
  }
};

// 지역명에서 마지막 동(洞) 부분만 추출
const getLastDong = (fullAddress: string) => {
  const parts = fullAddress.split(" ");
  for (let i = parts.length - 1; i >= 0; i--) {
    if (parts[i].endsWith("동")) {
      return parts[i];
    }
  }
  return parts[parts.length - 1] || fullAddress;
};

// 컴포넌트 마운트 시 초기 파라미터 처리
onMounted(() => {
  RegionFromParams();
});
</script>

<template>
  <Header class="h-35 mb-12" headerShowtype="localInfo">
    <!-- 검색창 -->
    <div class="px-6 mt-3">
      <RegionSearch @region-selected="handleRegionSelected" />
    </div>
  </Header>
  <div class="h-20 ml-12 mr-6 flex items-center justify-center">
    <div
      class="bg-gray-50 border-1 border-kb-ui-09 h-full w-full gap-2 flex items-center justify-center rounded-xl shadow-md"
    >
      <div class="font-pretendard-bold text-3xl text-blue-600">
        {{ getLastDong(selectedRegion) }}
      </div>
      <div class="font-pretendard-bold text-2xl text-kb-ui-02">동네정보</div>
    </div>
    <div class="h-[30%] w-[20%] flex items-center">
      <WishButton
        :key="selectedRegionCd + String(isLiked)"
        targetType="region"
        :regionCd="selectedRegionCd"
      />
    </div>
  </div>

  <div v-if="selectedRegionData" class="px-4 mt-8 mb-4">
    <!-- 날씨 정보 박스 -->
    <div class="mt-4 mb-6">
      <WeatherCard :region="selectedRegion" :regionCd="selectedRegionCd" />
    </div>

    <!-- 카드 4개 2x2 그리드로 표시 -->
    <div class="grid grid-cols-2 gap-2 mt-2">
      <InfoCard
        v-for="(card, i) in InfoCardList"
        :key="i"
        :info="card"
        :regionCd="selectedRegionCd"
      />
    </div>
  </div>

  <div class="h-15"><Footer /></div>
  <ToastList />
</template>
