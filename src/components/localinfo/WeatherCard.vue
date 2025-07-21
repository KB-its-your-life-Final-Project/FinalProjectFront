<script setup lang="ts">

</script>

<template>
  <div class="flex flex-col items-center">
    <div
      class="p-6 rounded-xl border-2 border-kb-yellow bg-gray-400 shadow-sm w-full flex flex-col items-center"
    >
<!--      <div class="text-3xl font-pretendard-bold text-white mb-1">{{ currentTemp }}°</div>-->
      <div class="text-3xl font-pretendard-bold text-white mb-1">25°</div>

      <div class="text-xs font-pretendard-regular text-white/80 mb-1">
<!--        최고 {{ maxTemp }}° / 최저 {{ minTemp }}°api로 받아올 정보들 -->
        최고 27/최저 18
      </div>
    </div>
    <div class="mt-2">
      <span class="text-white text-sm font-pretendard-semibold">맑음</span>
<!--      <span class="text-white text-sm font-pretendard-semibold">{{ weatherStatus }}</span>-->

    </div>
  </div>
</template>
