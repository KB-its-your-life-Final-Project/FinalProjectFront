<script setup lang="ts">
import { ref, onMounted } from "vue";
import { Api } from "@/api/autoLoad/Api";
import type { EstateDTO } from "@/api/autoLoad/data-contracts";
import movePage from "@/utils/movePage";

const api = new Api();

interface AiRecommendItem {
  jibunAddress: string;
  positiveFactor: string;
  reason: string;
}

const props = defineProps<{
  item: AiRecommendItem;
  index: number;
}>();

// 상태 관리
const estateData = ref<EstateDTO | null>(null);
const isLoading = ref<boolean>(true);
const error = ref<string>("");

// 부동산 정보 가져오기
const fetchEstateData = async () => {
  try {
    isLoading.value = true;
    error.value = "";

    console.log("부동산 정보 조회 주소:", props.item.jibunAddress);

    // 주소로 부동산 정보 조회
    const estateResponse = await api.getEstateByAddressUsingGet(props.item.jibunAddress);
    console.log("부동산 API 응답:", estateResponse);

    if (estateResponse.data?.data) {
      estateData.value = estateResponse.data.data;
      console.log("부동산 데이터 설정:", estateData.value);
    } else {
      console.log("부동산 데이터가 없습니다:", estateResponse);
    }
  } catch (err) {
    console.error("부동산 데이터 가져오기 실패:", err);
    error.value = "부동산 정보를 가져오는데 실패했습니다.";
  } finally {
    isLoading.value = false;
  }
};

// 카드 클릭 시 거래 상세 페이지로 이동
const handleCardClick = () => {
  const encodedAddress = encodeURIComponent(props.item.jibunAddress);
  movePage.transactionDetail({ jibunAddress: encodedAddress });
};

onMounted(() => {
  fetchEstateData();
});
</script>

<template>
  <div
    class="bg-white rounded-xl p-4 shadow-sm border border-gray-200 cursor-pointer hover:shadow-lg transition-all duration-200 active:scale-95"
    @click="handleCardClick"
  >
    <!-- 주소 -->
    <div class="mb-4">
      <h3 class="text-lg font-pretendard-bold text-gray-900 mb-1">{{ item.jibunAddress }}</h3>
      <p class="text-sm text-gray-500">AI 추천 매물</p>
    </div>

    <!-- 로딩 상태 -->
    <div v-if="isLoading" class="text-center py-6">
      <div
        class="animate-spin rounded-full h-6 w-6 border-2 border-kb-yellow border-t-transparent mx-auto mb-2"
      ></div>
      <p class="text-sm text-gray-600">부동산 정보를 불러오는 중...</p>
    </div>

    <!-- 에러 상태 -->
    <div v-else-if="error" class="text-center py-4">
      <div class="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-2">
        <svg class="w-5 h-5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
          ></path>
        </svg>
      </div>
      <p class="text-sm text-red-600 mb-2">{{ error }}</p>
      <button
        @click="fetchEstateData"
        class="px-3 py-1.5 bg-kb-yellow rounded-lg text-gray-900 font-medium hover:bg-opacity-90 transition-colors text-sm"
      >
        다시 시도
      </button>
    </div>

    <!-- 부동산 정보 -->
    <div v-else-if="estateData" class="mb-4">
      <div class="bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl p-4 mb-4">
        <h4 class="text-base font-pretendard-bold mb-3 text-gray-900 flex items-center gap-2">
          <svg class="w-5 h-5 text-kb-yellow" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
            ></path>
          </svg>
          부동산 정보
        </h4>
        <div class="grid grid-cols-1 gap-2 text-sm">
          <!-- 건물명 -->
          <div
            v-if="estateData.buildingName"
            class="flex justify-between items-center py-1.5 border-b border-gray-200 last:border-b-0"
          >
            <span class="text-gray-600 font-medium">건물명</span>
            <span class="font-pretendard-bold text-gray-900">{{ estateData.buildingName }}</span>
          </div>

          <!-- 지번 주소 -->
          <div
            v-if="estateData.jibunAddr"
            class="flex justify-between items-center py-1.5 border-b border-gray-200 last:border-b-0"
          >
            <span class="text-gray-600 font-medium">지번 주소</span>
            <span class="text-gray-900">{{ estateData.jibunAddr }}</span>
          </div>

          <!-- 지번 -->
          <div
            v-if="estateData.jibun"
            class="flex justify-between items-center py-1.5 border-b border-gray-200 last:border-b-0"
          >
            <span class="text-gray-600 font-medium">지번</span>
            <span class="text-gray-900">{{ estateData.jibun }}</span>
          </div>

          <!-- 건축년도 -->
          <div
            v-if="estateData.buildYear"
            class="flex justify-between items-center py-1.5 border-b border-gray-200 last:border-b-0"
          >
            <span class="text-gray-600 font-medium">건축년도</span>
            <span class="text-gray-900">{{ estateData.buildYear }}년</span>
          </div>

          <!-- 건물타입 -->
          <div
            v-if="estateData.buildingType"
            class="flex justify-between items-center py-1.5 border-b border-gray-200 last:border-b-0"
          >
            <span class="text-gray-600 font-medium">건물타입</span>
            <span class="text-gray-900">{{
              estateData.buildingType === 1
                ? "아파트"
                : estateData.buildingType === 2
                  ? "빌라"
                  : estateData.buildingType === 3
                    ? "연립/다세대"
                    : "정보 없음"
            }}</span>
          </div>

          <!-- 다세대/연립 타입 -->
          <div
            v-if="estateData.mhouseType"
            class="flex justify-between items-center py-1.5 border-b border-gray-200 last:border-b-0"
          >
            <span class="text-gray-600 font-medium">다가구/연립 타입</span>
            <span class="text-gray-900">{{ estateData.mhouseType }}</span>
          </div>

          <!-- 다가구/단독 타입 -->
          <div
            v-if="estateData.shouseType"
            class="flex justify-between items-center py-1.5 border-b border-gray-200 last:border-b-0"
          >
            <span class="text-gray-600 font-medium">다가구/단독 타입</span>
            <span class="text-gray-900">{{ estateData.shouseType }}</span>
          </div>

          <!-- 시군구명 -->
          <div
            v-if="estateData.sggNm"
            class="flex justify-between items-center py-1.5 border-b border-gray-200 last:border-b-0"
          >
            <span class="text-gray-600 font-medium">시군구</span>
            <span class="text-gray-900">{{ estateData.sggNm }}</span>
          </div>

          <!-- 읍면동명 -->
          <div
            v-if="estateData.umdNm"
            class="flex justify-between items-center py-1.5 border-b border-gray-200 last:border-b-0"
          >
            <span class="text-gray-600 font-medium">읍면동</span>
            <span class="text-gray-900">{{ estateData.umdNm }}</span>
          </div>
        </div>
      </div>
    </div>

    <!-- 긍정적 요소 -->
    <div class="mb-4">
      <h4 class="text-base font-pretendard-bold mb-2 text-gray-900 flex items-center gap-2">
        <svg class="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
          ></path>
        </svg>
        주요 장점
      </h4>
      <p class="text-sm leading-relaxed text-gray-700 bg-green-50 rounded-lg p-3">
        {{ item.positiveFactor }}
      </p>
    </div>

    <!-- 추천 이유 -->
    <div>
      <h4 class="text-base font-pretendard-bold mb-2 text-gray-900 flex items-center gap-2">
        <svg class="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          ></path>
        </svg>
        추천 이유
      </h4>
      <p class="text-sm leading-relaxed text-gray-700 bg-blue-50 rounded-lg p-3">
        {{ item.reason }}
      </p>
    </div>
  </div>
</template>
