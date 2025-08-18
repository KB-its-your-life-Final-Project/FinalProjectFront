<script setup lang="ts">
/**
 * 반응형 Swiper 래퍼 컴포넌트
 * 1. slot으로 슬라이드 내용 전달
 * 2. Navigation과 Pagination 모듈 적용
 * 3. spaceBetween과 breakpoints props로 유연하게 조절 가능
 * 4. 기본 spaceBetween은 8px
 * 5. prev/next 버튼 스타일 커스터마이징
 */
import { Swiper } from "swiper/vue";
import { Navigation, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";

defineProps<{
  breakpoints?: Record<number, any>; // 반응형 설정
  spaceBetween?: number;
}>();
</script>
<template>
  <div class="w-full mx-auto">
    <Swiper
      :modules="[Navigation, Pagination]"
      :space-between="spaceBetween ?? 8"
      :breakpoints="breakpoints"
      navigation
    >
      <slot />
    </Swiper>
  </div>
</template>
<style>
.swiper-button-prev::after,
.swiper-button-next::after {
  font-size: 1rem;
  color: black;
}

.swiper {
  --swiper-navigation-sides-offset: 0px;
}
</style>
