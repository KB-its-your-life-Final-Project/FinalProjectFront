<!-- src/components/common/SearchContainer.vue -->
<script setup lang="ts">
import { ref, watch } from "vue";
import lighthouseIcon from "@/assets/imgs/lighthouse.png";
import movePage from "@/utils/movePage";
import { Api } from "@/api/autoLoad/Api";
import { SearchHistoryDTO } from "@/api/autoLoad/data-contracts";

//검색input
const searchInput = ref("");

//검색 input  클리어
const clearSearch = () => {
  searchInput.value = "";
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

//검색 기록 저장
const saveSearchHistory = async (keyword: string) => {
  if (!keyword.trim()) return;

  try {
    const searchHistoryData: SearchHistoryDTO = {
      keyword: keyword.trim(),
      type: 1, // 검색 타입 (1: 일반 검색)
    };

    await new Api().saveSearchHistoryUsingPost(searchHistoryData);
  } catch (error) {
    console.error("검색 기록 저장 실패:", error);
  }
};

//검색 실행
const handleSearch = async () => {
  if (searchInput.value.trim()) {
    try {
      await saveSearchHistory(searchInput.value);
      movePage.mapSearch({ searchInput: searchInput.value });
    } catch (error) {
      // 검색 기록 저장에 실패해도 페이지 이동은 진행
      movePage.mapSearch({ searchInput: searchInput.value });
    }
  }
};

defineProps<{
  placeholder: string;
}>();
</script>

<template>
  <div
    class="absolute left-1/2 bottom-0 translate-y-1/2 -translate-x-1/2 w-[85%] bg-kb-ui-11 flex items-center px-[1rem] py-[0.5rem] rounded-full shadow-md"
  >
    <img
      :src="lighthouseIcon"
      alt="검색 아이콘"
      class="h-full w-auto max-h-[2rem] mr-[0.5rem] object-contain"
      @click="handleSearch"
    />
    <input
      v-model="searchInput"
      :placeholder="placeholder || '어떤 주소가 궁금하세요?'"
      class="w-full font-italic focus:outline-none placeholder-kb-ui-07 text-sm"
      type="text"
      @keyup.enter="handleSearch"
    />
    <font-awesome-icon
      v-if="xiconShow"
      :icon="['far', 'circle-xmark']"
      class="text-kb-ui-06 ml-[0.5rem] cursor-pointer hover:text-kb-ui-08"
      @click="clearSearch()"
    />
  </div>
</template>
