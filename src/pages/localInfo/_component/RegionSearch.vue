<script setup lang="ts">
import { ref, watch, computed, onMounted } from "vue";
import { Api } from "@/api/autoLoad/Api";
import type { LocalInfoResponseDTO, SearchHistoryDTO } from "@/api/autoLoad/data-contracts";
import lighthouseIcon from "@/assets/imgs/lighthouse.png";

// 상수 정의
const PLACEHOLDER_TEXT = "원하는 지역을 검색해주세요";
const MIN_SEARCH_LENGTH = 2;

// API 인스턴스
const api = new Api();

// 모든 지역 법정동 코드 리스트
const regionList = ref<LocalInfoResponseDTO[]>([]);

// 이벤트 정의
const emit = defineEmits<{
  regionSelected: [region: LocalInfoResponseDTO];
}>();

// 반응형 상태
const searchInput = ref("");
const searchResults = ref<LocalInfoResponseDTO[]>([]);
const loading = ref(false);
const isSelecting = ref(false);
const dropdownVisible = ref(false); // 드롭다운 표시 여부를 명시적으로 제어

// 계산된 속성
const showNoResults = computed(
  () =>
    dropdownVisible.value &&
    searchResults.value.length === 0 &&
    searchInput.value.trim().length >= MIN_SEARCH_LENGTH &&
    !loading.value,
);

// 지역 검색 함수
const searchRegions = (keyword: string) => {
  const trimmed = keyword.trim();
  if (trimmed.length < MIN_SEARCH_LENGTH) {
    searchResults.value = [];
    dropdownVisible.value = false;
    return;
  }

  loading.value = true;
  dropdownVisible.value = true;

  // 공백으로 분리해서 각 단어별로 검색
  const searchTerms = trimmed
    .toLowerCase()
    .split(/\s+/)
    .filter((term) => term.length > 0);

  searchResults.value = regionList.value
    .filter((region) => {
      if (!region.locataddNm) return false;

      const regionName = region.locataddNm.toLowerCase();

      // 모든 검색어가 지역명에 포함되어야 함 (순서 무관)
      return searchTerms.every((term) => regionName.includes(term));
    })
    .slice(0, 10); // 결과 제한 (최대 10개)

  loading.value = false;
};

// 검색 입력 감시 - 디바운스 없이 즉시 검색
watch(searchInput, (newKeyword: string) => {
  if (isSelecting.value) return;

  if (newKeyword.trim().length < MIN_SEARCH_LENGTH) {
    searchResults.value = [];
    dropdownVisible.value = false;
    return;
  }

  // 디바운스 없이 즉시 API 호출
  searchRegions(newKeyword);
});

//검색 기록 저장
const saveSearchHistory = async (keyword: string) => {
  if (!keyword.trim()) return;

  try {
    const searchHistoryData: SearchHistoryDTO = {
      keyword: keyword.trim(),
      type: 1,
    };

    await new Api().saveSearchHistoryUsingPost(searchHistoryData);
  } catch (error) {
    console.error("검색 기록 저장 실패:", error);
  }
};

// 검색 초기화
const clearSearch = () => {
  searchInput.value = "";
  searchResults.value = [];
  dropdownVisible.value = false;
};

// 지역 선택
const selectRegion = (region: LocalInfoResponseDTO) => {
  if (isSelecting.value) return;

  isSelecting.value = true;
  searchResults.value = [];
  dropdownVisible.value = false; // 선택 시 드롭다운 명시적으로 숨김
  emit("regionSelected", region);
  searchInput.value = region.locataddNm || "";

  saveSearchHistory(region.locataddNm || "");
  setTimeout(() => {
    isSelecting.value = false;
  }, 300);
};

onMounted(async () => {
  const response = await api.getAllRegionsUsingGet();
  regionList.value = response.data.data || [];
});
</script>
<template>
  <div
    class="absolute left-1/2 bottom-0 translate-y-1/2 -translate-x-1/2 w-[85%] bg-kb-ui-11 flex items-center px-[1rem] py-[0.5rem] rounded-full shadow-md"
  >
    <img
      :src="lighthouseIcon"
      alt="검색 아이콘"
      class="h-full w-auto max-h-[2rem] mr-[0.5rem] object-contain"
    />
    <input
      v-model="searchInput"
      :placeholder="PLACEHOLDER_TEXT"
      class="w-full font-italic focus:outline-none placeholder-kb-ui-07 text-sm"
      type="text"
      @click="clearSearch"
    />
    <font-awesome-icon
      v-if="searchInput.length > 0"
      :icon="['far', 'circle-xmark']"
      class="text-kb-ui-06 ml-[0.5rem] cursor-pointer hover:text-kb-ui-08"
      @click="clearSearch"
    />

    <!-- 검색 결과 드롭다운 -->
    <div
      v-if="loading || searchResults.length > 0 || showNoResults"
      class="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-50"
      :class="{ 'max-h-60 overflow-y-auto': searchResults.length > 0 }"
    >
      <div v-if="loading" class="px-4 py-3 text-gray-500 text-center">검색중...</div>

      <template v-else-if="searchResults.length > 0">
        <div
          v-for="result in searchResults"
          :key="result.regionCd"
          class="px-4 py-3 hover:bg-gray-100 cursor-pointer border-b border-gray-100 last:border-b-0"
          @click="selectRegion(result)"
        >
          <div class="font-medium text-kb-ui-02">{{ result.locataddNm }}</div>
        </div>
      </template>

      <div v-else-if="showNoResults" class="px-4 py-3 text-kb-ui-04 text-center">
        검색 결과가 없습니다.
      </div>
    </div>
  </div>
</template>
