<script setup lang="ts">
import { ref, onMounted, toRaw, watch } from "vue";
import mapUtil from "@/utils/naverMap/naverMap";
import { useRoute } from "vue-router";

const mapEl = ref<HTMLDivElement | null>(null);
const markers = ref<Array<any>>([]);
let map: any;
let markerManager: any;
const route = useRoute();

//주소 검색시
const searchInput = route.query.searchInput
  ? ref(decodeURIComponent(route.query.searchInput as string))
  : ref("");

const props = defineProps<{
  // address?: string;
  // latlng?: naver.maps.LatLng;
  addresssList: Array<string>;
  latlngList?: Array<naver.maps.LatLng>;
}>();

const addresssList = ref(props.addresssList);
const latlngList = ref(props.latlngList);

// 마커 로드 함수
const loadMarkers = async () => {
  if (!map) return;

  // 기존 마커/클러스터 제거 (markerManager의 updateMarkersByZoom 활용)
  if (markerManager) {
    markerManager.updateMarkersByZoom();
  }

  //주소 배열을 받았을 경우
  if (addresssList.value && addresssList.value.length > 0) {
    const newMarkers = [];
    for (const address of addresssList.value) {
      const atcResult = await mapUtil.searchAddressToCoordinate(address);
      newMarkers.push({
        jibunAddress: atcResult.jibunAddress,
        roadAddress: atcResult.roadAddress,
        latlng: atcResult.latlng,
      });
    }
    markers.value = newMarkers;
  }
  //위도경도 배열을 받았을 경우
  else if (latlngList.value && latlngList.value.length > 0) {
    const newMarkers = [];
    for (const latlng of latlngList.value) {
      const ctaResult = await mapUtil.searchCoordinateToAddress(latlng);
      newMarkers.push({
        jibunAddress: ctaResult.jibunAddress,
        roadAddress: ctaResult.roadAddress,
        latlng: ctaResult.latlng,
      });
    }
    markers.value = newMarkers;
  }
  //검색 결과가 존재할 경우
  else if (searchInput.value) {
    console.log(searchInput.value);
    const atcResult = await mapUtil.searchAddressToCoordinate(searchInput.value);
    markers.value = [
      {
        jibunAddress: atcResult.jibunAddress,
        roadAddress: atcResult.roadAddress,
        latlng: atcResult.latlng,
      },
    ];

    map.setCenter(atcResult.latlng);
  }
  //아무것도 못받으면 그냥 현재 주소 표기
  else {
    const currentLatLng = await mapUtil.getCurrentLocation();
    const ctaResult = await mapUtil.searchCoordinateToAddress(currentLatLng);
    markers.value = [
      {
        jibunAddress: ctaResult.jibunAddress,
        roadAddress: ctaResult.roadAddress,
        latlng: ctaResult.latlng,
      },
    ];

    map.setCenter(currentLatLng);
  }

  // 줌 레벨에 따른 마커/클러스터 관리
  markerManager = mapUtil.createMarkersWithZoomControl(
    map,
    toRaw(markers.value),
    "MapSearchMarker",
  );
};

onMounted(async () => {
  //지도 생성
  try {
    await mapUtil.loadNaverMapScript();

    if (!mapEl.value) return;

    map = mapUtil.createMap(mapEl.value);

    naver.maps.Event.addListener(map, "init", async function () {
      await loadMarkers();
    });
  } catch (error) {
    console.error("Failed initializing Maps:", error);
  }
});

//  searchInput 변화 감지
watch(
  () => route.query.searchInput,
  async (newSearchInput) => {
    searchInput.value = newSearchInput ? decodeURIComponent(newSearchInput as string) : "";
    if (map) {
      await loadMarkers();
    }
  },
  { immediate: false },
);

// List 변화감지
watch(
  [addresssList, latlngList],
  async () => {
    if (map) {
      await loadMarkers();
    }
  },
  { deep: true, immediate: false },
);
</script>

<template>
  <!--  지도 표시-->
  <div id="map" ref="mapEl" class="relative w-full h-full"></div>
</template>

<style scoped></style>
