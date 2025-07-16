<!--MapPage 레이아웃-->
<script setup lang="ts">
import { ref } from "vue";
import Header from "@/components/layouts/Header.vue";
import NavBar from "@/components/layouts/NavBar.vue";
import BackHeader from "@/components/layouts/BackHeader.vue";

const searchQuery = ref("");
function clearSearch() {
  searchQuery.value = "";
}
</script>


<template>

  <div class="min-h-screen flex flex-col items-center bg-gray-50">
    <div class="w-full  flex flex-col flex-1 pb-[6rem]">
<!--  max-w-md  :늘리고 싶지 않으면  -->
    <BackHeader title="아파트 검색">


      <!-- 검색창 -->
      <div class="relative mt-[1rem] px-[1rem]">
      <div class="w-full bg-white flex items-center px-4 py-2 rounded-full shadow-md">
          <font-awesome-icon :icon="['fas', 'house']" class="text-gray-400 mr-2" />
          <input
              v-model="searchQuery"
              type="text"
              placeholder="어떤 주소가 궁금하세요?"
              class="w-full focus:outline-none placeholder-gray-400 text-sm"
          />
          <font-awesome-icon
              v-if="searchQuery"
              :icon="['far', 'circle-xmark']"
              class="text-gray-400 ml-2 cursor-pointer hover:text-gray-600"
              @click="clearSearch"
          />
        </div>
      </div>

    </BackHeader>
    <!-- 지도부분 넣어주세요!!!! -->
    <div class="w-full h-[25rem] bg-gray-200 mt-[1.5rem] rounded-xl">
<!-- 지도 API   -->
      <p class="text-center pt-[5rem] text-gray-500">지도 불러오는 영역</p>
    </div>
      </div>
      <NavBar />
  </div>
</template>

