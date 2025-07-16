<!-- 하단 고정 메뉴바 -->
<script setup lang="ts">
import appConfig from "@/config";
import { RouterLink } from "vue-router";
</script>

<template>

  <nav
    class="fixed bottom-0 left-1/2 transform -translate-x-1/2 w-full max-w-[26.875rem] h-[4rem] bg-white flex justify-around items-center z-50"
  >

    <RouterLink
      v-for="(menu, index) in appConfig.navBarMenus"
      :key="index"
      :to="menu.url"
      class="flex flex-col items-center text-[0.875rem] mt-[0.5rem]"
    >
      <font-awesome-icon :icon="menu.icon" class="text-[1.25rem]" />
      {{ menu.title }}
    </RouterLink>

  </nav>

</template>

<style scoped>
li {
  padding: 12px;
}
</style>
