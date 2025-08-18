<script setup lang="ts">
/**
 * 모달 레이아웃
 * 1. 모달 창을 띄우기 위한 카드 형태 레이아웃으로 사용
 * 2. verticalAlign prop으로 모달 세로 위치 지정 가능: "top", "middle", "bottom" (기본: middle)
 * 3. offset prop으로 top/bottom 위치 간격 조정 가능 (픽셀 단위, 기본: 32px)
 * 4. 내부 내용은 <slot>에 삽입하여 자유롭게 구성
 * 5. 화면 중앙 정렬 및 그림자/둥근 모서리 적용, 배경과 겹쳐서 모달 UI 구현 가능
 */
import { computed } from "vue";

const props = defineProps<{
  verticalAlign?: "top" | "middle" | "bottom";
  offset?: number;
}>();

// Tailwind가 동적 클래스로는 적용되지 않아 직접 스타일 지정
const styleValue = computed(() => {
  const offset = props.offset ?? 32; // 기본 32px
  switch (props.verticalAlign) {
    case "top":
      return { top: `${offset}px` };
    case "bottom":
      return { bottom: `${offset}px` };
    case "middle":
    default:
      return { top: "50%", transform: "translateY(-50%)" };
  }
});
</script>

<template>
  <div class="absolute left-1/2 -translate-x-1/2 w-full px-4 max-w-md" :style="styleValue">
    <div class="bg-white rounded-xl shadow-lg p-8">
      <slot></slot>
    </div>
  </div>
</template>
