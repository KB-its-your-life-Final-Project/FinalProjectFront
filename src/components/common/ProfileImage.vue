<script setup lang="ts">
/**
 * 원형 프로필 이미지 컴포넌트.
 * props.src로 이미지 경로를 받아 표시하며, 흰색 테두리와 정사각형 비율 유지.
 * 부모로 감싸서 크기를 지정하여 원하는 크기로 조절 가능
 */
defineProps<{
  src: string;
}>();
</script>
<template>
  <img :src="src" alt="Profile" class="aspect-square w-1/1 rounded-full border-4 border-white" />
</template>
