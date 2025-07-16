<script setup lang="ts">
import { ref, onMounted } from "vue";
import MapFilterTab from "@/components/maps/MapFilterTab.vue";
import { postMapBounds, getMapItems } from "@/api/mapsApi.ts";
import $ from "jquery";

const mapEl = ref(null);

let map = null;

onMounted(() => {
  // 네이버 지도 API 스크립트 로드
  if (!window.naver) {
    const script = document.createElement("script");
    script.src = `https://oapi.map.naver.com/openapi/v3/maps.js?ncpKeyId=55s76chbvh`;
    script.async = true;
    script.onload = initMap;
    document.head.appendChild(script);
  } else {
    initMap();
  }
});

function initMap() {
  // jQuery로 요소 선택
  const $mapEl = $("#map");

  // 지도 생성
  map = new naver.maps.Map($mapEl[0], {
    center: new naver.maps.LatLng(37.3595704, 127.105399),
    zoom: 13,
    zoomControl: true,
    zoomControlOptions: {
      position: naver.maps.Position.TOP_RIGHT,
    },
  });

  var marker = new naver.maps.Marker({
    position: new naver.maps.LatLng(37.3595704, 127.105399),
    map: map,
  });
}


</script>

<template>
  <!--상위 요소-->
  <div class="relative w-full h-screen">
    <!--  지도 표시-->
    <div id="map" class="w-full h-full"></div>
  </div>
</template>

<style scoped>
/* 필요에 따라 지도 컨테이너 스타일 추가 */
</style>
