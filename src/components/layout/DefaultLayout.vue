<!--
기본 레이아웃 컴포넌트
1. 페이지 전체를 감싸서 스크롤과 레이아웃 관리에 사용
2. slot에 페이지 콘텐츠를 삽입하면 자동으로 flex 레이아웃 적용
3. BottomNav는 route.name 기반으로 show/hide 처리
   - withoutBottomNavPages 목록에 있으면 숨김
4. min-h-screen + flex 설정으로 화면 전체 높이 확보
5. 하단 내비게이션이 필요 없는 페이지에서 자동으로 제거됨
-->

<script setup lang="ts">
import { computed } from "vue";
import { useRoute } from "vue-router";
import BottomNav from "../nav/BottomNav.vue";
import bottomNavList from "@/components/nav/BottomNavData";

const route = useRoute();

const showBottomNav = computed(() => {
  return !bottomNavList.withoutBottomNavPages.some((page) => page.name === route.name);
});
</script>

<template>
  <div class="min-h-screen flex flex-col items-center">
    <div class="w-full flex flex-col flex-1">
      <div class="flex-1 overflow-auto">
        <slot></slot>
        <BottomNav v-if="showBottomNav" />
      </div>
    </div>
  </div>
</template>
