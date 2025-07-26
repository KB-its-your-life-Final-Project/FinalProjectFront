<script setup lang="ts">
import LogoSearchBar from "@/pages/home/_component/LogoSearchBar.vue";
import movePage from "@/utils/movePage";
</script>

<template>
  <div class="w-full flex items-center justify-start pl-6">
    <LogoSearchBar
      placeholder="어느 지역이 궁금하세요?"
      @click="movePage.localInfoSearch({ searchInput: searchInput })"
    />
  </div>
</template>
