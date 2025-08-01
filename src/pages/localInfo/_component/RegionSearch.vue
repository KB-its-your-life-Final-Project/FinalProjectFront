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
    console.log("Mock 데이터 사용");
    // API 오류 시 임시로 하드코딩된 데이터 사용 (개발용)
    return getMockData(keyword);
  }
};

// 개발용 임시 데이터 (API 연결 전까지 사용)
const getMockData = (keyword: string): LocalInfoResponseDTO[] => {
  const mockData: LocalInfoResponseDTO[] = [
    {
      region: "서울특별시 강남구 역삼동",
      regionCd: "1168010100",
      gridX: 127.028,
      gridY: 37.497,
      locataddNm: "서울특별시 강남구 역삼동",
    },
    {
      region: "서울특별시 강남구 삼성동",
      regionCd: "1168010200",
      gridX: 127.047,
      gridY: 37.508,
      locataddNm: "서울특별시 강남구 삼성동",
    },
    {
      region: "서울특별시 강남구 청담동",
      regionCd: "1168010300",
      gridX: 127.049,
      gridY: 37.519,
      locataddNm: "서울특별시 강남구 청담동",
    },
    {
      region: "서울특별시 강남구 신사동",
      regionCd: "1168010400",
      gridX: 127.02,
      gridY: 37.516,
      locataddNm: "서울특별시 강남구 신사동",
    },
    {
      region: "서울특별시 서초구 서초동",
      regionCd: "1165010100",
      gridX: 127.016,
      gridY: 37.491,
      locataddNm: "서울특별시 서초구 서초동",
    },
    {
      region: "서울특별시 서초구 반포동",
      regionCd: "1165010200",
      gridX: 127.012,
      gridY: 37.504,
      locataddNm: "서울특별시 서초구 반포동",
    },
    {
      region: "서울특별시 서초구 방배동",
      regionCd: "1165010300",
      gridX: 127.0,
      gridY: 37.486,
      locataddNm: "서울특별시 서초구 방배동",
    },
    {
      region: "서울특별시 서초구 양재동",
      regionCd: "1165010400",
      gridX: 127.038,
      gridY: 37.47,
      locataddNm: "서울특별시 서초구 양재동",
    },
    {
      region: "서울특별시 마포구 합정동",
      regionCd: "1144010100",
      gridX: 126.914,
      gridY: 37.549,
      locataddNm: "서울특별시 마포구 합정동",
    },
    {
      region: "서울특별시 마포구 상암동",
      regionCd: "1144010200",
      gridX: 126.891,
      gridY: 37.578,
      locataddNm: "서울특별시 마포구 상암동",
    },
    {
      region: "서울특별시 마포구 공덕동",
      regionCd: "1144010300",
      gridX: 126.951,
      gridY: 37.544,
      locataddNm: "서울특별시 마포구 공덕동",
    },
    {
      region: "서울특별시 마포구 신공덕동",
      regionCd: "1144010400",
      gridX: 126.958,
      gridY: 37.544,
      locataddNm: "서울특별시 마포구 신공덕동",
    },
    {
      region: "서울특별시 송파구 잠실동",
      regionCd: "1171010100",
      gridX: 127.1,
      gridY: 37.513,
      locataddNm: "서울특별시 송파구 잠실동",
    },
    {
      region: "서울특별시 송파구 문정동",
      regionCd: "1171010200",
      gridX: 127.124,
      gridY: 37.486,
      locataddNm: "서울특별시 송파구 문정동",
    },
    {
      region: "서울특별시 송파구 가락동",
      regionCd: "1171010300",
      gridX: 127.128,
      gridY: 37.495,
      locataddNm: "서울특별시 송파구 가락동",
    },
    {
      region: "서울특별시 송파구 송파동",
      regionCd: "1171010400",
      gridX: 127.112,
      gridY: 37.504,
      locataddNm: "서울특별시 송파구 송파동",
    },
  ];

  const keywordLower = keyword.toLowerCase().trim();

  // 검색어와 관련된 결과 필터링
  const filteredResults = mockData.filter((item) => {
    const address = item.locataddNm?.toLowerCase() || "";

    // 정확한 단어 매칭 우선
    if (address.includes(keywordLower)) {
      return true;
    }

    // 부분 단어 매칭 (예: "강남" -> "강남구")
    const words = keywordLower.split(/\s+/);
    return words.some((word) => address.includes(word));
  });

  // 관련성 순으로 정렬 (검색어가 앞에 있는 것 우선)
  const sortedResults = filteredResults.sort((a, b) => {
    const aIndex = (a.locataddNm?.toLowerCase() || "").indexOf(keywordLower);
    const bIndex = (b.locataddNm?.toLowerCase() || "").indexOf(keywordLower);

    // 검색어가 앞에 있는 것 우선
    if (aIndex !== bIndex) {
      return aIndex - bIndex;
    }

    // 길이가 짧은 것 우선
    return (a.locataddNm?.length || 0) - (b.locataddNm?.length || 0);
  });

  return sortedResults.slice(0, 2);
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
        <div class="font-medium text-gray-800">
          {{ result.locataddNm }}
        </div>
      </div>
    </div>

    <!-- 검색 결과가 없을 때 -->
    <div
      v-if="searchInput && !loading && searchResults.length === 0"
      class="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-50"
    >
      <div class="px-4 py-3 text-gray-500 text-center">검색 결과가 없습니다.</div>
    </div>
  </div>
</template>
