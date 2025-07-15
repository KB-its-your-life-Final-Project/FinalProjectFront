<script setup lang="ts">
import { ref, onMounted } from 'vue';
import MapFilterTab from "@/components/maps/MapFilterTab.vue";
import {postMapBounds,getMapItems} from "@/api/mapsApi.ts";

const searchTerm = ref('')//사용자가 검색할 때 입력할 검색어(지역/건물명)

// 필터 옵션
const saleOptions = ['매매','전/월세']
const propertyOptions = ['아파트','오피스텔','다세대주택']

// 선택된 필터의 상태
const saleType = ref(saleOptions[0]);
const propertyType = ref(propertyOptions[0]);

// 네이버 지도용 레퍼런스(지도, 마커, 클러스터링)
const mapEl = ref<HTMLDivElement|null>(null);
const mapInstance = ref<naver.maps.Map|null>(null); //지도 객체 저장
const markers = ref<naver.maps.Marker[]>([]);//백엔드로부터 전달받은 위치들(지도에 표시할 마커 위치들)
let clusterer: any = null;



// 지도에 마커들 랜더링하기
function renderMarkers(locs: { lat: number; lng: number }[]) {
  markers.value.forEach(m => m.setMap(null));
  markers.value = [];
  locs.forEach(loc => {
    if (mapInstance.value) {
      const m = new naver.maps.Marker({
        position: new naver.maps.LatLng(loc.lat, loc.lng),
        map: mapInstance.value,
      });
      markers.value.push(m);
    }
  });
}

// 현재 보여지는 지도의 좌표, 사용자가 선택한 탭을 백엔드로 전송
async function loadBounds() {
  if (!mapInstance.value) return;
  const bounds = mapInstance.value.getBounds();
  const sw = bounds.getSW();//지도 남서쪽 모서리
  const ne = bounds.getNE();//지도 북동쪽 모서리

  // 서버로 보낼 현재 보이는 지도의 모서리 점 좌표, 사용자가 선택한 건물 종류
  const params ={
    swLat: sw.lat(), //위치 좌표
    swLng: sw.lng(),
    neLat: ne.lat(),
    neLng: ne.lng(),
    saleType: saleType.value, // 매매, 전/월세
    propertyType: propertyType.value, // 건물 형태
  };

  // 서버로부터 전달받을 위치들 (GET 조회)
  const items = await getMapItems(params);
  // 지도에 마킹
  renderMarkers(items);

  // 서버로 정보 전달
  try{
    const response = await postMapBounds(params);
    console.log('POST 응답:', response.data);
  }catch(e){
    console.error('POST 요청 실패:',e);
  }

  console.log(sw.lat(), sw.lng(), ne.lat(), ne.lng());

}

// 필터 항목 선택
function selectSale(opt: string) {
  saleType.value = opt;
  loadBounds();
}

function selectProperty(opt: string) {
  propertyType.value = opt;
  loadBounds();
}

// 지도 초기화
function initMap() {
  if (mapEl.value && window.naver) {
    //생성된 지도 객체를 mapInstance에 저장
    mapInstance.value = new naver.maps.Map(mapEl.value, {//지도 생성
      center: new naver.maps.LatLng(37.5670135, 126.978374),//지도 속성 초기화 용도
      zoom: 14,
    });
    //테스트용 좌표
    const testLocations = [
      { lat: 37.566535, lng: 126.977969 }, // 서울시청
      { lat: 37.497942, lng: 127.027621 }, // 강남역
      { lat: 37.528611, lng: 126.924500 }, // 여의도 공원
    ];
    renderMarkers(testLocations);
    //처음 랜더링 되었을 때 화면에 보이는 지도의 좌표 백엔드로 전송
    loadBounds();
    // 사용자가 지도를 움직이거나 줌인/줌아웃할 때마다 화면에 보이는 지도의 좌표 백엔드로 전송
    mapInstance.value.addListener('idle',loadBounds);
  }
}

//지도 불러오기
onMounted(() => {
  // 1) 스크립트 중복 로드 방지
  if (!window.naver) {
    const script = document.createElement('script');
    script.src = `https://oapi.map.naver.com/openapi/v3/maps.js?ncpKeyId=55s76chbvh`;
    script.async = true;
    script.defer = true;
    script.onload = initMap;
    document.head.appendChild(script);
  } else {
    // 이미 로드된 경우 바로 초기화
    initMap();
  }
});







// //사용자가 직접 지역/건물명으로 검색하는 경우
// async function onSearch(){
//   if(!searchTerm.value.trim())return;
//   //장소 검색
//   const geocoder = new window.naver.maps.Service.Geocoder;
// }


</script>

<template>
<!--상위 요소-->
  <div class="relative w-full h-screen">
    <!--  필터 탭-->
    <MapFilterTab
      :sale-options="saleOptions"
      :property-options="propertyOptions"
      :sale-type="saleType"
      :property-type="propertyType"
      @update:saleType="selectSale"
      @update:propertyType="selectProperty"
    />
    <!-- 2) 탭 높이(48px)만큼 아래에서 지도가 꽉 차도록 -->
    <div
      ref="mapEl"
      class="absolute inset-x-0 bottom-0 top-12"
    ></div>
<!--    &lt;!&ndash;    검색 바&ndash;&gt;-->
<!--    <div-->
<!--      class="absolute top-12 left-1/2 transform -translate-x-1/2 z-20-->
<!--             w-3/4 max-w-lg mx-auto"-->
<!--    >-->
<!--      <div class="flex items-center bg-white rounded-full shadow-md px-4 py-2">-->
<!--        &lt;!&ndash; 검색 입력 &ndash;&gt;-->
<!--        <input-->
<!--          v-model="searchTerm"-->
<!--          @keyup.enter="onSearch"-->
<!--          type="text"-->
<!--          placeholder="검색어를 입력해주세요."-->
<!--          class="flex-1 bg-transparent focus:outline-none text-gray-700 placeholder-gray-400"-->
<!--        />-->
<!--        &lt;!&ndash; 검색 버튼 &ndash;&gt;-->
<!--        <button @click="onSearch" class="ml-2">-->
<!--          &lt;!&ndash; 아이콘 삽입 &ndash;&gt;-->
<!--        </button>-->
<!--      </div>-->
<!--    </div>-->


    <!--  지도 표시-->
    <div ref="mapEl" class="w-full h-full"></div>
  </div>

</template>

<style scoped>
/* 필요에 따라 지도 컨테이너 스타일 추가 */
</style>
