<script setup lang="ts">
import { RouterLink } from "vue-router";
import HomeCard from "@/components/home/HomeCard.vue";
import Footer from "@/components/layouts/Footer.vue";
import NavBar from "@/components/layouts/NavBar.vue";

import { HomeCardTypes } from "@/components/home/HomeMenu.ts";
</script>

<template>
  <!--
  home type =props 그대로 둘 건데, 과정을 어떻게 변화시킬 것인지
-->
  <div class="min-h-screen flex flex-col items-center bg-gray-50">
    <div class="w-full flex flex-col flex-1">
      <!--      max-w-md-->

      <Header />
      <main class="flex-1 px-4 pt-4 space-y-4 overflow-auto pb-24">
        <div class="grid grid-cols-2 gap-4 mt-15">
          <RouterLink v-for="(menu, idx) in HomeCardTypes" :key="idx" :to="menu.path">
            <HomeCard :data="menu" />
            <!--        <HomeCard
          :title="menu.title"
          :info="menu.info"
          :imgSrc="menu.imgSrc"
        />-->
          </RouterLink>
        </div>
        <div class="bg-white rounded-xl shadow-md p-4 sm:p-6 text-center mt-6 min-h-[15.625rem]">
          <p class="text-gray-700 text-sm">Recent news events coverage</p>
        </div>

        <Footer />
      </main>

      <NavBar />
    </div>
  </div>
</template>

<style scoped></style>
