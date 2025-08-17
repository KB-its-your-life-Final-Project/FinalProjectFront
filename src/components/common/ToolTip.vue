<!--
툴팁 컴포넌트
1. info 아이콘 클릭 시 show 상태 토글
2. show가 true면 슬롯 내용 표시
3. 툴팁 외부 클릭 시 자동으로 닫힘
4. transition으로 부드러운 fade-up 애니메이션
5. 화살표(삼각형) 포함, 최대 너비 300px
-->
<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from "vue";
const show = ref(false);
const toggle = () => (show.value = !show.value);

const tooltipRef = ref<HTMLElement | null>(null);

const handleClickOutside = (event: MouseEvent) => {
  if (tooltipRef.value && !tooltipRef.value.contains(event.target as Node)) {
    show.value = false;
  }
};

onMounted(() => {
  document.addEventListener("click", handleClickOutside);
});

onBeforeUnmount(() => {
  document.removeEventListener("click", handleClickOutside);
});
</script>
<template>
  <div ref="tooltipRef">
    <div class="relative">
      <font-awesome-icon
        icon="fas fa-info-circle"
        class="text-terms-text cursor-pointer text-lg"
        @click.stop="toggle"
      />
      <transition name="fade-up" appear>
        <div
          v-if="show"
          class="absolute -left-3 bottom-full mb-2 z-20 bg-white border border-gray-300 rounded-md shadow-lg p-4 text-sm text-gray-800 whitespace-pre-line max-w-[300px] w-max"
        >
          <div class="absolute left-3 bottom-[-6px] w-3 h-3 bg-white rotate-45"></div>
          <slot />
        </div>
      </transition>
    </div>
  </div>
</template>
`
<style scoped>
.fade-up-enter-active,
.fade-up-leave-active {
  transition: all 0.2s ease;
}
.fade-up-enter-from {
  opacity: 0;
  transform: translateY(10px);
}
.fade-up-leave-to {
  opacity: 0;
  transform: translateY(10px);
}
</style>
