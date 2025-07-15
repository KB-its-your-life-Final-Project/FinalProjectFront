<script setup lang="ts">

import { RouterLink } from 'vue-router'
import HomeCard from "@/components/home/HomeCard.vue"
import HomeHeader from '@/components/home/HomeHeader.vue'
import Footer from "@/components/layouts/Footer.vue";
import NavBar from "@/components/layouts/NavBar.vue";

</script>

<template>

<!--  <div class="relative w-full mt-4">
    <input
      type="text"
      placeholder="어떤 주소가 궁금하세요?"
      class="w-full pl-10 pr-4 py-2 rounded-full border border-gray-300 shadow-sm"
    />
    <span class="absolute left-3 top-2.5 text-xl">🏠</span>
  </div>-->
  <HomeHeader />
  <div class="flex flex-col h-full px-4 pt-4 space-y-4 overflow-auto">

  <div class="grid grid-cols-2 gap-4 mt-15">
      <RouterLink :to="'/map'"><HomeCard title="동네 집값" desc="최근 아파트 실거래가를 확인해보세요" icon="📈주" /></RouterLink>
      <RouterLink :to="'/'"><HomeCard title="AI 홈 매칭" desc="모르는 정보를 쉽게 설명해 줄게요" icon="❓" /></RouterLink>
      <RouterLink :to="'/localinfo'"><HomeCard title="동네.zip" desc="인기 많은 곳은 어디일까?" icon="📍" /></RouterLink>
      <RouterLink :to="'/safereport'"><HomeCard title="AI 안심 레포트" desc="지금 보고 있는 곳 위험하지 않다면?" icon="🔍" /></RouterLink>
    </div>

    <div class="bg-white rounded-xl shadow-md p-4 text-center mt-6 min-h-[250px]">
      <p class="text-gray-700 text-sm">Recent news events coverage</p>
    </div>

    <Footer />
  </div>

  <NavBar />
</template>

<style scoped>

</style>
