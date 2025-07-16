<script setup lang="ts">

import { RouterLink } from 'vue-router'
import HomeCard from "@/components/home/HomeCard.vue"
import HomeHeader from '@/components/home/HomeHeader.vue'
import Footer from "@/components/layouts/Footer.vue";
import NavBar from "@/components/layouts/NavBar.vue";


import { HomeCardTypes } from '@/components/home/HomeMenu.ts';
</script>

<template>

<!--
  home type =props 그대로 둘 건데, 과정을 어떻게 변화시킬 것인지
-->
  <HomeHeader />
  <div class="flex flex-col h-full px-4 pt-4 space-y-4 overflow-auto">


    <div class="grid grid-cols-2 gap-4 mt-15">
      <RouterLink
        v-for="(menu, idx) in HomeCardTypes"
        :key="idx"
        :to="menu.path"
      >
        <HomeCard :data="menu" />
<!--        <HomeCard
          :title="menu.title"
          :info="menu.info"
          :imgSrc="menu.imgSrc"
        />-->
      </RouterLink>


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
