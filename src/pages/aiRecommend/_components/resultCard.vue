<script setup lang="ts">
import { ref, onMounted } from "vue";
import { Api } from "@/api/autoLoad/Api";
import type { EstateDTO, EstateSalesDTO } from "@/api/autoLoad/data-contracts";
import movePage from "@/utils/movePage";

const api = new Api();

interface AiRecommendItem {
  jibunAddres: string;
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

    // 주소로 부동산 정보 조회
    const estateResponse = await api.getEstateByAddressUsingGet(props.item.jibunAddres);
    if (estateResponse.data?.data) {
      estateData.value = estateResponse.data.data;
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
  const encodedAddress = encodeURIComponent(props.item.jibunAddres);
  movePage.transactionDetail({ aptName: encodedAddress });
};

onMounted(() => {
  fetchEstateData();
});
</script>

<template>
  <div
    class="bg-white rounded-lg p-6 shadow-sm border border-kb-ui-06 mb-4 cursor-pointer hover:shadow-md transition-shadow"
    @click="handleCardClick"
  >
    <!-- 순번 및 주소 -->
    <div class="flex items-center justify-between mb-4">
      <div class="flex items-center gap-3">
        <div
          class="w-8 h-8 bg-kb-yellow rounded-full flex items-center justify-center text-kb-ui-11 font-pretendard-bold text-sm"
        >
          {{ index + 1 }}
        </div>
        <h3 class="text-lg font-pretendard-bold text-kb-ui-11">{{ item.jibunAddres }}</h3>
      </div>
    </div>

    <!-- 로딩 상태 -->
    <div v-if="isLoading" class="text-center py-4">
      <div class="animate-spin rounded-full h-6 w-6 border-b-2 border-kb-yellow mx-auto mb-2"></div>
      <p class="text-xs">부동산 정보를 불러오는 중...</p>
    </div>

    <!-- 에러 상태 -->
    <div v-else-if="error" class="text-center py-4">
      <p class="text-xs text-red-500 mb-2">{{ error }}</p>
      <button
        @click="fetchEstateData"
        class="text-xs px-3 py-1 bg-kb-yellow rounded text-kb-ui-11 hover:bg-opacity-80"
      >
        다시 시도
      </button>
    </div>

    <!-- 부동산 정보 -->
    <div v-else-if="estateData" class="mb-4">
      <div class="bg-kb-ui-12 rounded-lg p-4 mb-4">
        <h4 class="text-sm font-pretendard-bold mb-3">부동산 정보</h4>
        <div class="grid grid-cols-1 gap-3 text-xs">
          <!-- 건물명 -->
          <div v-if="estateData.buildingName" class="flex justify-between items-center">
            <span>건물명:</span>
            <span class="font-pretendard-bold">{{ estateData.buildingName }}</span>
          </div>

          <!-- 지번 주소 -->
          <div v-if="estateData.jibunAddr" class="flex justify-between items-center">
            <span>지번 주소:</span>
            <span>{{ estateData.jibunAddr }}</span>
          </div>

          <!-- 지번 -->
          <div v-if="estateData.jibun" class="flex justify-between items-center">
            <span>지번:</span>
            <span>{{ estateData.jibun }}</span>
          </div>

          <!-- 건축년도 -->
          <div v-if="estateData.buildYear" class="flex justify-between items-center">
            <span>건축년도:</span>
            <span>{{ estateData.buildYear }}년</span>
          </div>

          <!-- 건물타입 -->
          <div v-if="estateData.buildingType" class="flex justify-between items-center">
            <span>건물타입:</span>
            <span>{{
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
          <div v-if="estateData.mhouseType" class="flex justify-between items-center">
            <span>다가구/연립 타입:</span>
            <span>{{ estateData.mhouseType }}</span>
          </div>

          <!-- 다가구/단독 타입 -->
          <div v-if="estateData.shouseType" class="flex justify-between items-center">
            <span>다가구/단독 타입:</span>
            <span>{{ estateData.shouseType }}</span>
          </div>

          <!-- 시군구명 -->
          <div v-if="estateData.sggNm" class="flex justify-between items-center">
            <span>시군구:</span>
            <span>{{ estateData.sggNm }}</span>
          </div>

          <!-- 읍면동명 -->
          <div v-if="estateData.umdNm" class="flex justify-between items-center">
            <span>읍면동:</span>
            <span>{{ estateData.umdNm }}</span>
          </div>
        </div>
      </div>
    </div>

    <!-- 긍정적 요소 -->
    <div class="mb-4">
      <h4 class="text-sm font-pretendard-bold mb-2 flex items-center gap-2">주요 장점</h4>
      <p class="text-sm leading-relaxed">{{ item.positiveFactor }}</p>
    </div>

    <!-- 추천 이유 -->
    <div>
      <h4 class="text-sm font-pretendard-bold mb-2 flex items-center gap-2">추천 이유</h4>
      <p class="text-sm leading-relaxed">{{ item.reason }}</p>
    </div>
  </div>
</template>
