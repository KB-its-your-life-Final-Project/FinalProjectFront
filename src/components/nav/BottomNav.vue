<!--
BottomNav 컴포넌트

1. 화면 하단에 고정되는 메뉴바(nav bar) 구현
2. bottomNavList.navBarMenus 배열을 기반으로 각 메뉴 항목 생성
3. RouterLink 사용으로 페이지 이동 가능, 현재 경로와 일치하면 강조 색상 적용
4. 기본 높이 4rem, 전체 너비, 필요시 max-width로 제한 가능
5. 반응형으로 flex와 gap 적용, 아이콘과 텍스트 세로 정렬
-->

<!-- 하단 고정 메뉴바 -->
<script setup lang="ts">
import bottomNavList from "@/components/nav/BottomNavData";
import { RouterLink } from "vue-router";
</script>

<template>
  <nav class="fixed bottom-0 h-[4rem] w-full border-t border-kb-ui-09 z-100 bg-white">
    <div class="flex justify-around items-center gap-2 z-50">
      <!--  max-w-[26.875rem] :늘리고 싶지 않으면   -->
      <template v-for="menu in bottomNavList.navBarMenus" :key="menu.title">
        <div class="max-w-[5rem] w-full">
          <RouterLink
            :to="menu.url"
            class="flex flex-col items-center text-[0.875rem] mt-[0.5rem]"
            :class="{ 'text-kb-yellow-positive': $route.path === menu.url }"
          >
            <font-awesome-icon :icon="menu.icon" class="text-[1.25rem]" />
            <div>{{ menu.title }}</div>
          </RouterLink>
        </div>
      </template>
    </div>
  </nav>
</template>

<style scoped></style>
