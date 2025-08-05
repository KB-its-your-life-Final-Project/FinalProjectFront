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
import { RegionWishlistResponseDTO } from "@/api/autoLoad/data-contracts";
import { useToast } from "@/utils/useToast";
import ToastList from "@/components/common/ToastList.vue";

const api = new Api();

// 관심 지역 리스트
const favoriteRegions: Ref<{ name: string; liked: boolean; regionCd: string }[]> = ref([]);
const toast = useToast();

const favoriteApts = [
  /*임의의 데이터입니다.*/
  { id: 1, name: "아파트1", address: "3 구의역 필루시드", price: "₩200,000,000" },
  { id: 2, name: "아파트2", address: "4 성수역 필루시드", price: "₩250,000,000" },
  { id: 3, name: "아파트3", address: "5 뚝섬역 필루시드", price: "₩180,000,000" },
];

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
    console.error("관심 데이터 불러오기 실패:", error);
  }
});

const handleToggle = (
  region: { liked: boolean; name: string },
  result: { success: boolean; liked: boolean },
) => {
  const toast = useToast();

  if (result.success) {
    region.liked = result.liked;
    toast.addToast(
      toast.createToast(
        `${region.name} : 관심 지역${result.liked ? "에 추가" : "에서 제거"}되었습니다.`,
        "success",
      ),
    );
  } else {
    toast.addToast(
      toast.createToast(
        `${region.name} : ${result.liked ? "해제" : "등록"}에 실패했습니다. 다시 시도해주세요.`,
        "error",
      ),
    );
  }
};
</script>

<template>
  <div class="pb-24">
    <Header class="h-30 mb-10" :headerShowtype="mainRouteName.wishlist">
      <div class="px-4 mt-3">
        <LogoSearchBar placeholder="지역 또는 단지 검색" />
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
            :liked="region.liked"
            @toggle="(result) => handleToggle(region, result)"
            :regionCd="region.regionCd"
          />
        </ListItem>
      </ul>
      <Nodata v-else subtitle="지역"></Nodata>
    </SubjectSection>

    <SubjectSection title="관심 단지">
      <div class="flex overflow-x-auto mt-3"></div>
      <SwiperNavigation
        :breakpoints="{
          0: { slidesPerView: 2 },
          640: { slidesPerView: 3 },
        }"
        :spaceBetween="16"
      >
        <SwiperSlide v-for="apt in favoriteApts" :key="apt.id">
          <CardItem class="mx-auto" :apt="apt"></CardItem>
        </SwiperSlide>
      </SwiperNavigation>
    </SubjectSection>

    <SubjectSection title="최근 본 단지">
      <ul class="space-y-2">
        <ListItem name="YY아파트 5층" subName="₩200,000,000">
          <div class="rounded-full bg-gray-300 aspect-square p-1">Img</div>
        </ListItem>
        <ListItem name="ZZ아파트 1층" subName="₩300,000,000">
          <div class="rounded-full bg-gray-300 aspect-square p-1">Img</div>
        </ListItem>
      </ul>
    </SubjectSection>
    <Section />
  </div>
  <ToastList></ToastList>
</template>
