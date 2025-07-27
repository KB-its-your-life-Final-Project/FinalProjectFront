<script setup lang="ts">
import { ref, onMounted } from "vue";
import $ from "jquery";
import mapUtil from "@/utils/naverMap/naverMap";

import addressApi from "@/api/mapAddressApi";

import type { MapAddressType } from "@/types/mapAddressType"; //temp
const addressData = ref<MapAddressType[]>([
  { umdNm: "홍파동", jibun: 199, aptNm: "경희궁자이 (2단지)" },
  { umdNm: "명륜 2가", jibun: 4, aptNm: "아남1" },
  { umdNm: "평동", jibun: 233, aptNm: "경희궁자이 (3단지)" },
]);

const mapEl = ref<HTMLDivElement | null>(null);
const markers = ref<Array<any>>([]);
let map: any;
let infoWindow: any;

markers.value = [
  { title: "테스트마커", lat: 37.3595704, lng: 127.105399 },
  { title: "테스트마커", lat: 37.3696805, lng: 127.105399 },
];

onMounted(async () => {
  //지도 생성
  try {
    await mapUtil.loadNaverMapScript();

    map = mapUtil.createMap(mapEl.value);

    naver.maps.Event.addListener(map, "init", function () {
      // 줌 레벨에 따른 마커/클러스터 관리
      const markerManager = mapUtil.createMarkersWithZoomControl(
        map,
        markers.value,
        "MapSearchMarker",
      );
    });
  } catch (error) {
    console.error("Failed initializing Maps:", error);
  }
});
</script>

<template>
  <!--  지도 표시-->
  <div id="map" ref="mapEl" class="relative w-full h-full"></div>
</template>

<style scoped></style>
