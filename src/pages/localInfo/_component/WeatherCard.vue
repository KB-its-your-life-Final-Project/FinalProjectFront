<script setup lang="ts"></script>

<template>
  <div class="rounded-2xl border-1 border-blue-200 bg-white shadow-sm w-full">
    <div class="flex items-center justify-between mt-3">
      <!-- 온도 정보 -->
      <div class="flex flex-col items-center w-full">
        <div class="font-pretendard-bold text-4xl text-gray-800">34°</div>
        <div class="font-pretendard-bold text-sm text-kb-ui-04">최고 36°</div>
        <div class="font-pretendard-bold text-sm text-kb-ui-04">최저 26°</div>
      </div>
      <!-- 날씨 이미지 -->
      <div class="flex flex-col items-center w-full gap-3">
        <div class="text-4xl">🌤️</div>
        <div class="text-xs text-kb-ui-05">출처 : 기상청</div>
      </div>
    </div>
  </div>
</template>
