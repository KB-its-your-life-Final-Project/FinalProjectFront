<script setup lang="ts">
/**
 * 모달 컴포넌트
 * - DimOverlay: 화면 전체를 덮는 반투명 배경 (dim 처리)
 * - ModalLayout: 모달의 레이아웃(위치, 간격 등)을 담당
 *
 * Props:
 * @prop verticalAlign - 모달의 세로 정렬 위치 ("top" | "middle" | "bottom"), 기본값: "middle"
 * @prop offset        - 모달 위치 보정값 (px 단위, optional)
 */
import DimOverlay from "@/components/layout/DimOverlay.vue";
import ModalLayout from "@/components/layout/ModalLayout.vue";
defineProps<{
  verticalAlign?: "top" | "middle" | "bottom";
  offset?: number;
}>();
</script>
<template>
  <DimOverlay @close="$emit('close')">
    <ModalLayout :verticalAlign="verticalAlign" :offset="offset">
      <slot></slot>
    </ModalLayout>
  </DimOverlay>
</template>
