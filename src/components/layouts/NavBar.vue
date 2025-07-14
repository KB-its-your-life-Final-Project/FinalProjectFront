<!-- 하단 고정 메뉴바 -->
<script setup lang="ts">
import appConfig from "@/config";

</script>

<!--<template>
  <div class="fixed bottom-0 bg-yellow-100 w-full">
    <ul class="flex justify-around m-0 list-none">
      <li v-for="(menu, index) in appConfig.navBarMenus" :key="index"
        class="flex-1 text-center hover:bg-yellow-300 transition-colors duration-300">
        <router-link :to="menu.url">{{ menu.title }}</router-link>
      </li>
    </ul>
  </div>
</template>-->
<template>
  <nav class="w-full bg-white flex justify-around">
    <div
      v-for="(menu, index) in appConfig.navBarMenus"
      :key="index"
      class="flex flex-col items-center text-sm"
    >
      <font-awesome-icon :icon="menu.icon" class="text-xl" />
      {{ menu.title }}
    </div>
  </nav>
</template>


<style scoped>
li {
  padding: 12px;
}
</style>
