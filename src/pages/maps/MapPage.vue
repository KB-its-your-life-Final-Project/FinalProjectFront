<!--하단 네비 바에서 지도 버튼을 클릭했을 시 렌더링되는 뷰페이지입니다.-->



<script setup lang="ts">
import { ref, onMounted } from 'vue';
import {postMapBounds} from "@/api/mapsApi.ts";

const mapEl = ref<HTMLDivElement|null>(null);
const mapInstance = ref<naver.maps.Map|null>(null); //지도 객체 저장

const searchTerm = ref('')//사용자가 검색할 때 입력할 검색어(지역/건물명)
const filters =[
  {label: '가격', value:'price'},
  {label: '면적', value: 'area'},
  {label: '주차',value: 'parking'},
];
const selectedFilter = ref('all'); //선택된 조건들

function initMap() {
  if (mapEl.value && window.naver) {
    //생성된 지도 객체를 mapInstance에 저장
    mapInstance.value = new naver.maps.Map(mapEl.value, {//지도 생성
      center: new naver.maps.LatLng(37.5670135, 126.978374),//지도 속성 초기화 용도
      zoom: 10,
    });
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


// 지도의 좌표 전송
async function loadBounds() {
  if (!mapInstance.value) return;
  const bounds = mapInstance.value.getBounds();
  const sw = bounds.getSW();//지도 남서쪽 모서리
  const ne = bounds.getNE();//지도 북동쪽 모서리

  const params ={
    swLat: sw.lat(),
    swLng: sw.lng(),
    neLat: ne.lat(),
    neLng: ne.lng(),
    filter: selectedFilter.value,
  };

  try{
    const response = await postMapBounds(params);
    console.log('POST 응답:', response.data);
  }catch(e){
    console.error('POST 요청 실패:',e);
  }

  console.log(sw.lat(), sw.lng(), ne.lat(), ne.lng());

}




//사용자가 직접 지역/건물명으로 검색하는 경우
async function onSearch(){
  if(!searchTerm.value.trim())return;
  //장소 검색
  const geocoder = new window.naver.maps.Service.Geocoder;
}

// 사용자가 선택한 필터링 조건들로 필터 설정
function selectFilter(value:string){
  selectedFilter.value=value;

}
</script>

<template>
  <div class="relative w-full h-screen">
    <!--    검색 바-->
    <div
      class="absolute top-4 left-1/2 transform -translate-x-1/2 z-20
             w-3/4 max-w-lg mx-auto"
    >
      <div class="flex items-center bg-white rounded-full shadow-md px-4 py-2">
        <!-- 검색 입력 -->
        <input
          v-model="searchTerm"
          @keyup.enter="onSearch"
          type="text"
          placeholder="검색어를 입력해주세요."
          class="flex-1 bg-transparent focus:outline-none text-gray-700 placeholder-gray-400"
        />
        <!-- 검색 버튼 -->
        <button @click="onSearch" class="ml-2">
          <!-- 아이콘 삽입 -->
        </button>
      </div>
    </div>
    <!--    필터 버튼 그룹-->
    <div
      class="absolute top-20 left-1/2 transform -translate-x-1/2 z-20 flex space-x-2"
    >
      <button
        v-for="opt in filters"
        :key="opt.value"
        @click="selectFilter(opt.value)"
        :class="[
      'flex items-center px-3 py-1 border rounded-full transition',
      selectedFilter === opt.value
        ? 'bg-purple-600 text-white border-purple-600'
        : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
    ]"
      >
        <!-- 레이블 -->
        <span class="text-sm font-medium">{{ opt.label }}</span>
        <!-- 드롭다운 화살표 아이콘 -->
        <svg
          xmlns="http://www.w3.org/2000/svg"
          class="w-4 h-4 ml-1"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </button>
    </div>

    <!--  지도 표시-->
    <div ref="mapEl" class="w-full h-full"></div>
  </div>

</template>

<style scoped>
/* 필요에 따라 지도 컨테이너 스타일 추가 */
</style>
