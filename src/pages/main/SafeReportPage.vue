<!--예시입니다.... -->

<script setup lang="ts">
import Header from "@/components/layouts/Header.vue";
</script>

<template>
  <div class="pb-24">

    <Header>

        <font-awesome-icon :icon="['fas', 'arrow-left']" />
        <span class="text-sm font-semibold">AI 안심 진단 리포트</span>

    </Header>


    <section class="flex flex-col items-center mt-[-50px]">
      <div class="w-28 h-28 rounded-full bg-yellow-100 flex flex-col items-center justify-center shadow-md">
        <p class="text-xl font-bold text-yellow-600">85/<span class="text-sm">100</span></p>
        <p class="text-sm text-gray-700 mt-1">주의</p>
      </div>
    </section>


    <section class="grid grid-cols-3 gap-2 px-4 mt-6 text-center text-xs font-medium">
      <div class="bg-green-100 text-green-700 py-2 rounded">법적문제 없음</div>
      <div class="bg-yellow-100 text-yellow-700 py-2 rounded">깡통전세 주의</div>
      <div class="bg-green-100 text-green-700 py-2 rounded">불법건축물 없음</div>
    </section>


    <section class="px-4 mt-6 space-y-2 text-sm">
      <div class="border rounded-lg px-4 py-3 flex justify-between items-center shadow-sm bg-white">
        <span>법적 권리 분석</span>
        <font-awesome-icon :icon="['fas', 'chevron-right']" />
      </div>
      <div class="border rounded-lg px-4 py-3 flex justify-between items-center shadow-sm bg-white">
        <span>재정적 안전성 분석</span>
        <font-awesome-icon :icon="['fas', 'chevron-right']" />
      </div>
      <div class="border rounded-lg px-4 py-3 flex justify-between items-center shadow-sm bg-white">
        <span>건축물 정보</span>
        <font-awesome-icon :icon="['fas', 'chevron-right']" />
      </div>
    </section>


    <div class="px-4 mt-8">
      <button class="w-full bg-indigo-900 text-white py-3 rounded-lg text-sm font-semibold">
        확인
      </button>
    </div>
  </div>
</template>
