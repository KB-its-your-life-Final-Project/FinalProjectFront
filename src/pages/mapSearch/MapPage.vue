<script setup lang="ts">
import { ref, onMounted, onUnmounted, toRaw, watch } from "vue";
import mapUtil from "@/utils/naverMap/naverMap";
import { useRoute } from "vue-router";
import MapDetailList from "@/pages/mapSearch/_components/MapDetailList.vue";
import { MarkerDataType } from "@/types/markerDataType";

//지도 필수 변수
const mapEl = ref<HTMLDivElement | null>(null);
const markers = ref<Array<MarkerDataType>>([]);
let map: any;
let markerManager: any;
let mapMoveTimer: any;

// 클러스터 클릭 시 건물 리스트 표시
const clusterMarkers = ref<Array<MarkerDataType>>([]);
const showClusterList = ref(false);

// 클러스터 클릭 이벤트 리스너
const handleClusterClick = (event: CustomEvent) => {
  const { markers } = event.detail;
  clusterMarkers.value = markers;
  showClusterList.value = true;
};

const route = useRoute();
const mapDetailShow = ref(false);

// 이전 검색값 저장
const previousSearchInput = ref("");

//주소 검색시
const searchInput = route.query.searchInput
  ? ref(decodeURIComponent(route.query.searchInput as string))
  : ref("");

// 지도 영역 상태 추적
const mapBounds = ref<any>(null);

// 마커 로드 함수
const loadMarkers = async () => {
  if (!map) return;

  // 기존 마커/클러스터 제거
  if (markerManager) {
    markerManager.updateMarkersByZoom();
  }

  try {
    // 주변 건물들 가져오기 (지도 중심 이동 후)
    const buildings = await mapUtil.searchBuildingsInBounds(map);

    if (buildings.length > 0) {
      markers.value = buildings;
    }
  } catch (error) {
    console.error("건물 정보 로드 실패:", error);
  }

  //검색 결과가 존재할 경우
  if (searchInput.value) {
    const atcResult = await mapUtil.searchAddressToCoordinate(searchInput.value);
    // 검색값이 변경되었을 때만 center 설정
    if (previousSearchInput.value !== searchInput.value) {
      map.setCenter(atcResult.latlng);
      previousSearchInput.value = searchInput.value;
    }

    // 검색 결과가 기존 마커에 있는지 확인
    const existingMarker = markers.value.find(
      (marker) =>
        marker.jibunAddress === atcResult.jibunAddress ||
        marker.roadAddress === atcResult.roadAddress,
    );

    // 검색 결과가 기존 마커에 없으면 네이버 검색 결과 추가
    if (!existingMarker && atcResult) {
      const naverMarker = {
        jibunAddress: atcResult.jibunAddress,
        roadAddress: atcResult.roadAddress,
        latlng: atcResult.latlng,
        buildingName: atcResult.buildingName || atcResult.jibunAddress,
        // 네이버 검색 결과임을 표시하는 플래그
        isNaverSearch: true,
      };

      markers.value.push(naverMarker);
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
      const currentLatLng = await mapUtil.getCurrentLocation();
      map.setCenter(currentLatLng);

      await loadMarkers();
    });

    // 지도 이동 감지
    naver.maps.Event.addListener(map, "bounds_changed", () => {
      mapBounds.value = map.getBounds();
    });
  } catch (error) {
    console.error("Failed initializing Maps:", error);
  }
});

onMounted(() => {
  document.addEventListener("clusterClick", handleClusterClick as EventListener);
});

onUnmounted(() => {
  document.removeEventListener("clusterClick", handleClusterClick as EventListener);
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

// 지도 영역 변화 감지
watch(
  mapBounds,
  () => {
    updateMarkersOnMapMove();
  },
  { deep: true },
);
</script>

<template>
  <!-- <MapFilter /> -->
  <!--  지도 표시-->
  <div id="map" ref="mapEl" class="relative w-full h-full">
    <div v-if="mapDetailShow" class="absolute bottom-0 z-10 w-full h-65 border-1">
      <MapDetailList :markers="markers">
        <template v-slot:mapDetailShow>
          <div @click="mapDetailShow = false">X</div>
        </template>
      </MapDetailList>
    </div>
    <!-- 클러스터 건물 리스트 -->
    <div
      v-if="showClusterList"
      class="absolute bottom-0 left-0 right-0 z-50 p-3 pointer-events-none"
    >
      <div
        class="bg-white rounded-lg w-full h-96 max-w-2xl mx-auto flex flex-col shadow-lg pointer-events-auto"
      >
        <div class="flex justify-between items-center p-4 bg-kb-yellow-native">
          <h3 class="text-lg font-bold">지역 내 건물 목록 ({{ clusterMarkers.length }}개)</h3>
          <button
            @click="showClusterList = false"
            class="text-gray-500 hover:text-gray-700 text-xl"
          >
            ✕
          </button>
        </div>
        <div class="flex-1 overflow-y-auto p-4">
          <MapDetailList :markers="clusterMarkers" />
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped></style>
