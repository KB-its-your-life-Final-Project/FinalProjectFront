<script setup lang="ts">
import { ref, watch } from "vue";
import { Api } from "@/api/autoLoad/Api";
import type { LocalInfoResponseDTO } from "@/api/autoLoad/data-contracts";

const api = new Api();

// 부모 컴포넌트로 전달할 이벤트 정의
const emit = defineEmits<{
  regionSelected: [region: LocalInfoResponseDTO];
}>();

// 지역 검색 API 호출
const searchRegions = async (keyword: string) => {
  try {
    const response = await api.searchRegionsUsingGet({ keyword: keyword }, {});
    return response.data?.data || [];
  } catch (error) {
    console.error("지역 검색 API 오류:", error);
    throw error;
  }
};

//검색input
const searchInput = ref("");

//검색 input  클리어
const clearSearch = () => {
  searchInput.value = "";
  searchResults.value = [];
  loading.value = false;
  searchKeyword.value = "";
};

const xiconShow = ref(false);
//x표시 보여주기
watch(searchInput, () => {
  if (searchInput.value.length > 0) {
    xiconShow.value = true;
  } else if (searchInput.value.length == 0) {
    xiconShow.value = false;
  }
});

const searchResults = ref<LocalInfoResponseDTO[]>([]);
const searchKeyword = ref("");
const loading = ref(false);

// 실제 API 호출 함수
const fetchRegionData = async (keyword: string): Promise<LocalInfoResponseDTO[]> => {
  try {
    // 실제 API 호출
    const results = await searchRegions(keyword);
    console.log("API 호출 성공:", results);
    return results;
  } catch (error) {
    console.error("지역 검색 API 오류:", error);
    return [];
  }
};

// 검색 입력 핸들러
const handleInput = async () => {
  searchKeyword.value = searchInput.value;

  if (searchKeyword.value.trim() === "") {
    searchResults.value = [];
    return;
  }

  // 자동완성 비활성화 - 엔터키나 클릭으로만 검색
  // 로딩 상태 시작
  // loading.value = true;

  // try {
  //   // 실제 API 호출
  //   const results = await fetchRegionData(searchKeyword.value);
  //   searchResults.value = results;
  // } catch (error) {
  //   console.error("검색 오류:", error);
  //   searchResults.value = [];
  // } finally {
  //   loading.value = false;
  // }
};

// 검색 실행 함수 (엔터키나 클릭 시 호출)
const executeSearch = async () => {
  if (searchKeyword.value.trim() === "") {
    searchResults.value = [];
    return;
  }

  // 로딩 상태 시작
  loading.value = true;

  try {
    // 실제 API 호출
    const results = await fetchRegionData(searchKeyword.value);
    searchResults.value = results;
  } catch (error) {
    console.error("검색 오류:", error);
    searchResults.value = [];
  } finally {
    loading.value = false;
  }
};

// 엔터키 핸들러
const handleKeydown = (event: KeyboardEvent) => {
  if (event.key === "Enter") {
    if (searchResults.value.length > 0) {
      // 첫 번째 결과 선택
      selectRegion(searchResults.value[0]);
    } else {
      // 검색 실행
      executeSearch();
    }
  }
};

// 지역 선택 핸들러
const selectRegion = (region: LocalInfoResponseDTO) => {
  console.log("선택된 지역:", region);

  // 부모 컴포넌트로 선택된 지역 정보 전달
  emit("regionSelected", region);

  // 검색바 초기화
  clearSearch();
};
</script>

<template>
  <div class="relative">
    <!-- 검색 입력창 -->
    <div
      class="flex items-center rounded-xl border-2 border-kb-yellow bg-white shadow-sm px-4 py-2"
    >
      <input
        v-model="searchInput"
        @input="handleInput"
        @keydown="handleKeydown"
        @click="executeSearch"
        :placeholder="'원하는 지역을 검색해주세요'"
        type="text"
        class="w-full focus:outline-none cursor-pointer"
      />
      <font-awesome-icon
        v-if="xiconShow"
        :icon="['far', 'circle-xmark']"
        class="text-kb-ui-06 ml-[0.5rem] cursor-pointer hover:text-kb-ui-08"
        @click="clearSearch()"
      />
    </div>

    <!-- 로딩 상태 -->
    <div
      v-if="loading"
      class="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-50"
    >
      <div class="px-4 py-3 text-gray-500 text-center">검색중...</div>
    </div>

    <!-- 자동완성 드롭다운 -->
    <div
      v-if="searchResults.length > 0"
      class="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-50 max-h-60 overflow-y-auto"
    >
      <div
        v-for="result in searchResults"
        :key="result.regionCd"
        class="px-4 py-3 hover:bg-gray-100 cursor-pointer border-b border-gray-100 last:border-b-0"
        @click="selectRegion(result)"
      >
        <div class="font-medium text-kb-ui-02">
          {{ result.locataddNm }}
        </div>
      </div>
    </div>

    <!-- 검색 결과가 없을 때 -->
    <div
      v-if="searchInput && !loading && searchResults.length === 0"
      class="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-50"
    >
      <div class="px-4 py-3 text-kb-ui-04 text-center">검색 결과가 없습니다.</div>
    </div>
  </div>
</template>
