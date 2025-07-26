<script setup lang="ts"></script>

<template>
  <div class="flex items-center rounded-2xl border-1 border-blue-200 bg-white shadow-sm w-full">
    <!-- 온도 정보 -->
    <div class="flex flex-col items-center w-full mt-8">
      <div class="font-pretendard-bold text-6xl text-gray-800 mb-2">34°</div>
      <div class="text-lg font-pretendard-regular mb-2">
        <div class="font-pretendard-bold text-kb-ui-04">최고 36°</div>
        <div class="font-pretendard-bold text-kb-ui-04">최저 26°</div>
      </div>
    </div>
    <div class="flex flex-col items-center w-full">
      <div class="text-7xl mb-2">🌤️</div>
      <div class="text-xs text-kb-ui-05 mt-5">출처 : 기상청</div>
    </div>
  </div>
</template>
