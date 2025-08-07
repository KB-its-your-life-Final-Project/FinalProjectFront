<script setup lang="ts">
import Header from "@/components/layout/header/Header.vue";
import { Ref, ref, onMounted } from "vue";
import Section from "@/components/nav/BottomNav.vue";
import LogoSearchBar from "@/pages/home/_component/LogoSearchBar.vue";
import { mainRouteName } from "@/router/mainRoute";
import movePage from "@/utils/movePage";

import SubjectSection from "./_component/SubjectSection.vue";
import WishButton from "@/components/common/WishButton.vue";
import ListItem from "./_component/ListItem.vue";
import CardItem from "./_component/CardItem.vue";
import Nodata from "./_component/NoData.vue";
import SwiperNavigation from "@/components/common/SwiperNavigation.vue";
import { SwiperSlide } from "swiper/vue";

import { Api } from "@/api/autoLoad/Api";
import {
  EstateWishlistResponseDTO,
  RegionWishlistResponseDTO,
  SearchHistoryDTO,
} from "@/api/autoLoad/data-contracts";
import ToastList from "@/components/common/ToastList.vue";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import { faSmile } from "@fortawesome/free-solid-svg-icons";

const api = new Api();

// 관심 지역 리스트
const favoriteRegions: Ref<{ name: string; liked: boolean; regionCd: string }[]> = ref([]);

const favoriteBuildings: Ref<
  {
    name?: string | undefined;
    type: number;
    jibunAddr: string;
    liked: boolean;
    estateId?: number;
    amount?: number | undefined;
    deposit?: number | undefined;
    monthlyRent?: number | undefined;
  }[]
> = ref([]);

const searchHistories: Ref<{ keyword: string; type: number }[]> = ref([]);
onMounted(async () => {
  try {
    const regionRes = await api.getRegionsByMemberIdUsingGet();
    const regions = regionRes.data.data || [];
    favoriteRegions.value = regions.map((item: RegionWishlistResponseDTO) => ({
      name: item.umdNm || "",
      liked: true,
      regionCd: item.regionCd || "",
    }));
  } catch (error) {
    console.error("관심 지역 데이터 불러오기 실패:", error);
  }
  try {
    const buildingRes = await api.getEstateIdsByMemberIdUsingGet();
    const buildings = buildingRes.data.data || [];
    favoriteBuildings.value = buildings.map((item: EstateWishlistResponseDTO) => ({
      name: item.buildingName,
      type: item.buildingType || 5,
      jibunAddr: item.jibunAddr || "",
      deposit: item.deposit,
      monthlyRent: item.monthlyRent,
      amount: item.amount,
      liked: true,
      estateId: item.estateId,
    }));
  } catch (error) {
    console.error("관심 지역 데이터 불러오기 실패:", error);
  }

  try {
    const res = await api.getSearchHistoryUsingGet();
    const datas = res.data.data || [];
    searchHistories.value = datas.map((item: SearchHistoryDTO) => ({
      keyword: item.keyword || "",
      type: item.type || 0,
    }));
  } catch (error) {
    console.error("검색 기록 불러오기 실패", error);
  }
});
</script>

<template>
  <div class="pb-24">
    <Header class="h-30 mb-10" :headerShowtype="mainRouteName.wishlist">
      <div class="px-4 mt-3">
        <LogoSearchBar placeholder="지역 또는 매물 검색" />
      </div>
    </Header>
    <SubjectSection title="관심 지역">
      <ul v-if="favoriteRegions.length > 0">
        <ListItem
          class="cursor-pointer"
          @click="movePage.localInfo({ regionCd: region.regionCd })"
          v-for="(region, index) in favoriteRegions"
          :key="index"
          :name="region.name"
        >
          <WishButton
            targetType="region"
            :regionCd="region.regionCd"
            :liked="true"
            :name="region.name"
            @click.stop
          />
        </ListItem>
      </ul>
      <Nodata v-else subtitle="관심 지역"></Nodata>
    </SubjectSection>

    <SubjectSection title="관심 매물">
      <div class="mt-3">
        <SwiperNavigation
          v-if="favoriteBuildings.length > 0"
          :breakpoints="{
            0: { slidesPerView: 2 },
            640: { slidesPerView: 3 },
          }"
          :spaceBetween="16"
        >
          <SwiperSlide v-for="building in favoriteBuildings" :key="building.jibunAddr">
            <CardItem class="mx-auto" :building="building"></CardItem>
          </SwiperSlide>
        </SwiperNavigation>
        <Nodata v-else subtitle="관심 매물"></Nodata>
      </div>
    </SubjectSection>

    <SubjectSection title="검색 기록">
      <ul v-if="true">
        <ListItem v-for="(item, index) in searchHistories" :key="index" :name="item.keyword">
          <div class="flex justify-center items-center">
            <font-awesome-icon
              v-if="item.type === 1"
              :icon="['fas', 'location-dot']"
              class="rounded-full w-4 h-4 bg-kb-ui-08 p-1"
            />
            <font-awesome-icon
              v-else
              :icon="['fas', 'building']"
              class="rounded-full w-8 h-8 bg-kb-ui-08"
            />
          </div>
        </ListItem>
      </ul>
      <Nodata v-else subtitle="최근 검색 기록"></Nodata>
    </SubjectSection>
    <Section />
  </div>
  <ToastList></ToastList>
</template>
