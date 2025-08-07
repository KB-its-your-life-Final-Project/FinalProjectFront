<!-- LocalInfoPage.vue 동네.zip  레이아웃 -->

<script setup lang="ts">
import { ref, computed, onMounted, nextTick } from "vue";
import { Api } from "@/api/autoLoad/Api";
import { useRoute } from "vue-router";
import { authStore } from "@/stores/authStore";
import type { LocalInfoResponseDTO } from "@/api/autoLoad/data-contracts";
import Header from "@/components/layout/header/Header.vue";
import RegionSearch from "@/pages/localInfo/_component/RegionSearch.vue";
import WeatherCard from "@/pages/localInfo/_component/WeatherCard.vue";
import InfoCard from "@/pages/localInfo/_component/InfoCard.vue";
import { InfoCardList } from "@/pages/localInfo/_component/InfoCard.ts";
import Footer from "@/components/layout/Footer.vue";
import WishButton from "@/components/common/WishButton.vue";
import { useToast } from "@/utils/useToast";
import ToastList from "@/components/common/ToastList.vue";

const route = useRoute();
const { createToast, addToast } = useToast();
const auth = authStore();
const api = new Api();

const selectedRegionData = ref<LocalInfoResponseDTO | null>(null);
const isLiked = ref<boolean>(false);

const selectedRegion = computed(() => selectedRegionData.value?.locataddNm || "서울특별시");
const selectedRegionCd = computed(() => selectedRegionData.value?.regionCd || "1100000000");

const handleRegionSelected = async (region: LocalInfoResponseDTO) => {
  console.log("LocalInfo에서 선택된 지역:", region);
  console.log("이전 selectedRegionData:", selectedRegionData.value);
  selectedRegionData.value = region;
  console.log("업데이트된 selectedRegionData:", selectedRegionData.value);
  console.log("computed selectedRegion:", selectedRegion.value);
  console.log("computed selectedRegionCd:", selectedRegionCd.value);

  // DOM 업데이트를 보장하기 위해 nextTick 사용
  await nextTick();
  console.log("DOM 업데이트 완료 후 selectedRegion:", selectedRegion.value);
};

// 화양동 자동 선택 (기본값)
const initializeHwayangdong = async () => {
  try {
    const response = await api.searchRegionsUsingGet({ keyword: "화양동" });
    const results = response.data?.data || [];
    if (results.length > 0) {
      const hwayangdong =
        results.find((region) => region.locataddNm?.includes("서울특별시 광진구 화양동")) ||
        results[0];

      handleRegionSelected(hwayangdong);
    }
  } catch (error) {
    console.error("화양동 초기화 실패:", error);
  }
};

// 파라미터로 받은 지역코드로 지역 정보 초기화
const RegionFromParams = async () => {
  const regionCd = route.query.regionCd as string;
  const regionName = route.query.region as string;

  if (regionCd) {
    try {
      // 지역코드로 지역 정보 검색
      const response = await api.searchRegionsUsingGet({ keyword: regionName || "" });
      const results = response.data?.data || [];

      // 지역코드가 일치하는 지역 찾기
      const targetRegion = results.find((region) => region.regionCd === regionCd);

      if (targetRegion) {
        handleRegionSelected(targetRegion);
      } else {
        // 지역코드로 직접 찾지 못한 경우 기본값으로 화양동 설정
        initializeHwayangdong();
      }
    } catch (error) {
      console.error("파라미터 지역 초기화 실패:", error);
      // 에러 시 기본값으로 화양동 설정
      initializeHwayangdong();
    }
  } else {
    // 파라미터가 없으면 기본값으로 화양동 설정
    initializeHwayangdong();
  }
};

// 위시버튼 토글 핸들러
const handleWishToggle = async (payload: { success: boolean; liked: boolean }) => {
  try {
    // 로그인 상태 확인
    await auth.checkLoginStatus();

    if (payload.success) {
      isLiked.value = payload.liked;
      const message = payload.liked ? "찜 목록에 추가되었습니다!" : "찜 목록에서 제거되었습니다.";
      addToast(createToast(message, "success"));
    } else {
      addToast(createToast("찜 기능 사용에 실패했습니다.", "error"));
    }
  } catch {
    // 로그인되지 않은 경우
    addToast(createToast("로그인 후 찜 기능을 이용해보세요!", "info", 3000));
  }
};

// 지역명에서 마지막 동(洞) 부분만 추출
const getLastDong = (fullAddress: string) => {
  // "동"으로 끝나는 부분을 찾기
  const parts = fullAddress.split(" ");
  for (let i = parts.length - 1; i >= 0; i--) {
    if (parts[i].endsWith("동")) {
      return parts[i];
    }
  } // "동"이 없으면 마지막 부분 반환
  return parts[parts.length - 1] || fullAddress;
};

//찜에서 받아오기
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
        :liked="isLiked"
        targetType="region"
        :regionCd="selectedRegionCd"
        @toggle="handleWishToggle"
      />
    </div>
  </div>

  <div class="px-4 mt-8 mb-4">
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
