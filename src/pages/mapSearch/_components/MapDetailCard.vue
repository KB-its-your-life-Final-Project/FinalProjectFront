<script setup lang="ts">
import { MarkerDataType } from "@/types/markerDataType";
import { onMounted, ref } from "vue";
import { Api } from "@/api/autoLoad/Api";
import { estateBuildingOptions } from "@/types/estateType";
import movePage from "@/utils/movePage";

const props = defineProps<{
  marker: MarkerDataType;
}>();

const estateData = ref<any>(null);
const loading = ref(false);

const fetchEstateData = async () => {
  try {
    loading.value = true;
    const api = new Api();
    const response = await api.getEstateByAddressUsingGet(props.marker.roadAddress);
    estateData.value = response.data;
  } catch (error) {
    console.error("부동산 정보 조회 실패:", error);
  } finally {
    loading.value = false;
  }
};

const getBuildingImage = (buildingType: number) => {
  const buildingOption = estateBuildingOptions.find((option) => option.value === buildingType);
  return buildingOption?.image;
};

onMounted(() => {
  fetchEstateData();
});
</script>

<template>
  <div>
    <div v-if="loading">로딩 중...</div>
    <div v-else>
      <div
        v-if="estateData"
        class="flex"
        @click="movePage.transactionDetail({ jibunAddress: props.marker.jibunAddress })"
      >
        <div class="w-4/7">
          <div>주소: {{ marker.roadAddress }}</div>
          <div v-if="estateData.data.buildingName">
            건물 이름: {{ estateData.data.buildingName }}
          </div>
          <div v-if="estateData.data.buildYear">건축 년도: {{ estateData.data.buildYear }}</div>
          <div v-if="estateData.data.buildingType" class="building-info">
            <span>건물 유형: {{ estateData.data.buildingType }}</span>
          </div>
          <div v-if="estateData.data.mhouseType">
            연립/다세대 유형: {{ estateData.data.mhouseType }}
          </div>
          <div v-if="estateData.data.shouseType">
            다가구/단독 유형: {{ estateData.data.shouseType }}
          </div>
        </div>
        <div class="w-3/7">
          <img
            v-if="getBuildingImage(estateData.data.buildingType)"
            :src="getBuildingImage(estateData.data.buildingType)"
            :alt="estateData.data.buildingType"
            class="building-icon"
          />
        </div>
      </div>
    </div>
  </div>
</template>
