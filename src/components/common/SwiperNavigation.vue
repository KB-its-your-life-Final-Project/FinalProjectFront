<script setup lang="ts">
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
