<script setup lang="ts">
import Header from '@/components/layouts/Header.vue'
import { ref } from 'vue';
import lighthouseIcon from '@/assets/imgs/lighthouse.png';

// 검색어 상태 변수 선언 (입력값 바인딩)
const searchQuery = ref('');

// 검색어를 지우는 함수
function clearSearch() {
  searchQuery.value = '';
}
</script>

<template>
  <Header>

    <div class="mt-0 pl-[1.5rem]">
      <h2 class="text-sm text-gray-800 font-semibold">원룸, 빌라, 오피스텔, 아파트</h2>
      <h1 class="text-lg font-bold mt-[0.25rem]">집에 대한 모든 정보를 찾아보세요!</h1>
    </div>


    <div class="absolute left-1/2 bottom-0 translate-y-1/2 -translate-x-1/2 w-[85%] bg-white flex items-center px-[1rem] py-[0.5rem] rounded-full shadow-md">
<!--
      <font-awesome-icon :icon="['fas', 'magnifying-glass']" class="text-gray-400 mr-2" />
-->
      <img
        :src="lighthouseIcon"
        alt="검색 아이콘"
        class="h-full w-auto max-h-[2rem] mr-[0.5rem] object-contain"
      />
      <input
        v-model="searchQuery"
        type="text"
        placeholder="어떤 주소가 궁금하세요?"
        class="w-full focus:outline-none placeholder-gray-400 text-sm"
      />
      <font-awesome-icon
        v-if="searchQuery"
        :icon="['far','circle-xmark']"
        class="text-gray-400 ml-[0.5rem] cursor-pointer hover:text-gray-600"
        @click="clearSearch"
      />

    </div>
  </Header>
</template>




<!--
<template>
  &lt;!&ndash;  <div class="HomePage">&ndash;&gt;

  <header class="bg-yellow-300 w-full px-6 pt-6 pb-25">
    <div class="flex justify-between items-start">
      &lt;!&ndash;  <div class="flex justify-between items-center mb-3">&ndash;&gt;
      <div class="mt-4">
        <h2 class="text-sm text-gray-800 font-semibold">원룸, 빌라, 오피스텔, 아파트</h2>
        <h1 class="text-lg font-bold mt-1">집에 대한 모든 정보를 찾아보세요!</h1>
      </div>
      &lt;!&ndash;        <div>
                  <font-awesome-icon :icon="['far', 'bell']" class="text-xl text-gray-700" />
                </div>&ndash;&gt;
    </div>
    &lt;!&ndash; 검색창 &ndash;&gt;
    <div class="w-[80%] bg-white flex items-center px-4 py-2 rounded-full shadow-md mx-auto mt-6">
      <font-awesome-icon :icon="['fas', 'magnifying-glass']" class="text-gray-400 mr-2" />
      <input
        type="text"
        placeholder="어떤 주소가 궁금하세요?"
        class="w-full focus:outline-none placeholder-gray-400 text-sm"
      />
    </div>


  </header>

</template>-->

<style scoped>

input::placeholder {
  font-style: italic;
}
/*.Header {
  background: lightgrey;
  justify-items: center;
}*/
</style>
