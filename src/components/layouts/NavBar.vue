<!-- 하단 고정 메뉴바 -->
<script setup lang="ts">
import appConfig from "@/config";
import { RouterLink } from "vue-router";
</script>

<template>
  <nav class="fixed bottom-0 left-0 w-full h-16 bg-white flex justify-around z-50">
    <RouterLink
      v-for="(menu, index) in appConfig.navBarMenus"
      :key="index"
      :to="menu.url"
      class="flex flex-col items-center text-sm mt-2"
    >
      <font-awesome-icon :icon="menu.icon" class="text-xl" />
      {{ menu.title }}
    </RouterLink>
  </nav>
</template>


<style scoped>
li {
  padding: 12px;
}
</style>
