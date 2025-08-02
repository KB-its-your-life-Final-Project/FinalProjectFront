<script setup lang="ts">
import { RouterLink } from "vue-router";
import HomeCard from "@/pages/home/_component/HomeCard.vue";
import YouthProgram from "@/pages/home/_component/YouthProgram.vue";

import Header from "@/components/layout/header/Header.vue";
import Footer from "@/components/layout/Footer.vue";
import LogoSearchBar from "@/pages/home/_component/LogoSearchBar.vue";

import { HomeCardTypes } from "@/pages/home/_component/HomeMenu";
import { mainRouteName } from "@/router/mainRoute";
</script>

<template>
  <!-- home type =props 그대로 둘 건데, 과정을 어떻게 변화시킬 것인지 -->

  <div class="min-h-screen flex flex-col items-center bg-kb-ui-11">
    <div class="w-full flex flex-col flex-1">
      <Header :headerShowtype="mainRouteName.homeMain">
        <div class="pl-8 pr-8 pt-14 pb-10">
          <h2 class="text-sm font-bold text-kb-ui-01 font-semibold">
            원룸, 빌라, 오피스텔, 아파트
          </h2>
          <h1 class="text-lg font-bold mt-[0.3rem]">집에 대한 모든 정보를 찾아보세요!</h1>
        </div>

        <div class="px-4 mt-3">
          <LogoSearchBar />
        </div>
      </Header>

      <main class="flex-1 px-4 pt-4 space-y-4 overflow-auto pb-24">
        <div class="grid grid-cols-2 gap-4 mt-15">
          <RouterLink v-for="(menu, idx) in HomeCardTypes" :key="idx" :to="{ name: menu.name }">
            <HomeCard :data="menu" />
          </RouterLink>
        </div>
        <YouthProgram />
        <Footer />
      </main>
    </div>
  </div>
</template>

<style scoped></style>
