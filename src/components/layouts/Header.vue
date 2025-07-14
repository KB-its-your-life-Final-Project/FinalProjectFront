<!-- Header -->
<script setup lang="ts">
</script>

<template>
<!--  <div class="HomePage">-->

  <header class="bg-yellow-300 w-full px-6 pt-6 pb-4">
    <div class="flex justify-between items-start">
<!--  <div class="flex justify-between items-center mb-3">-->
        <div>
      <h2 class="text-sm text-gray-800 font-semibold">원룸, 빌라, 오피스텔, 아파트</h2>
      <h1 class="text-lg font-bold mt-1">집에 대한 모든 정보를 찾아보세요!</h1>
          </div>
<!--        <div>
            <font-awesome-icon :icon="['far', 'bell']" class="text-xl text-gray-700" />
          </div>-->
        </div>
        <!-- 검색창 -->
<!--
        <div class="w-full bg-white flex items-center px-4 py-2 rounded-full shadow-md">
          <font-awesome-icon :icon="['fas', 'magnifying-glass']" class="text-gray-400 mr-2" />
          <input
            type="text"
            placeholder="어떤 주소가 궁금하세요?"
            class="w-full focus:outline-none placeholder-gray-400 text-sm"
          />
        </div>
-->


    </header>

</template>

<style scoped>

input::placeholder {
  font-style: italic;
}
.Header {
  background: lightgrey;
  justify-items: center;
}
</style>
