<!-- 하단 고정 메뉴바 -->
<script setup lang="ts">
import bottomNavList from "@/components/nav/BottomNavData";
import { RouterLink } from "vue-router";
</script>

<!--
    class="fixed bottom-0 left-1/2 transform -translate-x-1/2 w-full max-w-[26.875rem] h-[4rem] bg-white flex justify-around items-center z-50"
만약에 넓게 하고 싶다?? 그러면 max 지워-->
<template>
  <nav class="fixed bottom-0 h-[4rem] bg-kb-ui-11 w-full">
    <div class="flex justify-around items-center gap-2 z-50">
      <!--  max-w-[26.875rem] :늘리고 싶지 않으면   -->
      <template v-for="menu in bottomNavList.navBarMenus">
        <div class="max-w-[5rem] w-full">
          <RouterLink :to="menu.url" class="flex flex-col items-center text-[0.875rem] mt-[0.5rem]">
            <font-awesome-icon :icon="menu.icon" class="text-[1.25rem]" />
            {{ menu.title }}
          </RouterLink>
        </div>
      </template>
    </div>
  </nav>
</template>

<style scoped></style>
