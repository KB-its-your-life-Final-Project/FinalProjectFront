<script setup lang="ts">
import { ref } from "vue";
import { RouterLink } from "vue-router";
import HomeCard from "@/components/home/HomeCard.vue";

import Header from "@/components/common/Header.vue";
import Footer from "@/components/common/Footer.vue";
import Section from "@/components/common/Section.vue";
import LogoSearchBar from "@/components/common/LogoSearchBar.vue";

import { useSearch } from "@/utils/useSearch";
import { HomeCardTypes } from "@/components/home/HomeMenu.ts";
import lighthouseIcon from "@/assets/imgs/lighthouse.png";

const { searchQuery, clearSearch } = useSearch();
</script>

<template>
  <!--
  home type =props 그대로 둘 건데, 과정을 어떻게 변화시킬 것인지
-->
  <div class="min-h-screen flex flex-col items-center bg-kb-ui-11">
    <div class="w-full flex flex-col flex-1">
      <Header :showAlarm="true">
        <div class="mt-0 pl-[1.5rem]">
          <h2 class="text-sm text-kb-ui-01 font-semibold">원룸, 빌라, 오피스텔, 아파트</h2>
          <h1 class="text-lg font-bold mt-[0.25rem]">집에 대한 모든 정보를 찾아보세요!</h1>
        </div>

        <div class="px-4 mt-3">
          <LogoSearchBar v-model="searchQuery" placeholder="어떤 주소가 궁금하세요?" />
        </div>
      </Header>

      <main class="flex-1 px-4 pt-4 space-y-4 overflow-auto pb-24">
        <div class="grid grid-cols-2 gap-4 mt-15">
          <RouterLink v-for="(menu, idx) in HomeCardTypes" :key="idx" :to="menu.path">
            <HomeCard :data="menu" />
          </RouterLink>
        </div>
        <div class="bg-kb-ui-11 rounded-xl shadow-md p-4 sm:p-6 text-center mt-6 min-h-[15.625rem]">
          <p class="text-kb-ui-01 text-sm">Recent news events coverage</p>
        </div>

        <Footer />
      </main>

      <Section />
    </div>
  </div>
</template>

<style scoped></style>
