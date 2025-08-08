<script setup lang="ts">
import { ref, onMounted, toRaw, watch } from "vue";
import mapUtil from "@/utils/naverMap/naverMap";
import { useRoute } from "vue-router";
import MapFilter from "@/pages/mapSearch/_components/MapFilter.vue";
import MapDetailList from "@/pages/mapSearch/_components/MapDetailList.vue";
import { MarkerDataType } from "@/types/markerDataType";

//지도 필수 변수
const mapEl = ref<HTMLDivElement | null>(null);
const markers = ref<Array<MarkerDataType>>([]);
let map: any;
let markerManager: any;
let mapMoveTimer: any;

const route = useRoute();
const mapDetailShow = ref(false);

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

// 지도 영역 상태 추적
const mapBounds = ref<any>(null);

// 마커 로드 함수
const loadMarkers = async () => {
  if (!map) return;

  // 기존 마커/클러스터 제거
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
  //아무것도 못받으면 그냥 현재 주변 건물 표시
  else if (
    (!addresssList.value || addresssList.value.length === 0) &&
    (!latlngList.value || latlngList.value.length === 0)
  ) {
    try {
      // 주변 건물들 가져오기 (지도 중심 이동 후)
      const buildings = await mapUtil.searchBuildingsInBounds(map);
      console.log(buildings);

      if (buildings.length > 0) {
        markers.value = buildings;
      }
    } catch (error) {
      console.error("건물 정보 로드 실패:", error);
    }
  }

  // 줌 레벨에 따른 마커/클러스터 관리
  markerManager = mapUtil.createMarkersWithZoomControl(
    map,
    toRaw(markers.value),
    "MapSearchMarker",
  );
};

// 지도 이동 시 마커 업데이트 함수
const updateMarkersOnMapMove = () => {
  // 기존 타이머가 있으면 제거
  if (mapMoveTimer) {
    clearTimeout(mapMoveTimer);
  }

  // 마커 업데이트 (화면 이동이 끝나면 실행)
  mapMoveTimer = setTimeout(async () => {
    await loadMarkers();
  }, 1000);
};

onMounted(async () => {
  //지도 생성
  try {
    await mapUtil.loadNaverMapScript();

    if (!mapEl.value) return;

    map = mapUtil.createMap(mapEl.value);

    //초기 마커 생성
    naver.maps.Event.addListener(map, "init", async function () {
      //아무것도 없으면 현재주소
      if (!addresssList.value?.length && !latlngList.value?.length && !searchInput.value) {
        const currentLatLng = await mapUtil.getCurrentLocation();
        map.setCenter(currentLatLng);
      }

      await loadMarkers();

      // 지도 영역 변화 감지
      watch(
        //mapBounds 가 시작부터 변화해서 watch가 onMounted 안에 위치
        mapBounds,
        () => {
          if (mapBounds.value !== null) {
            updateMarkersOnMapMove();
          }
        },
        { deep: true },
      );
    });

    // 지도 이동 감지
    naver.maps.Event.addListener(map, "bounds_changed", () => {
      mapBounds.value = map.getBounds();
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
  <MapFilter />
  <!--  지도 표시-->
  <div id="map" ref="mapEl" class="relative w-full h-full">
    <div v-if="mapDetailShow" class="absolute bottom-0 z-10 w-full h-65 border-1">
      <MapDetailList :markers="markers">
        <template v-slot:mapDetailShow>
          <div @click="mapDetailShow = false">X</div>
        </template>
      </MapDetailList>
    </div>
  </div>
</template>

<style scoped></style>
