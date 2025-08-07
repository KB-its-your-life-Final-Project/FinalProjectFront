<script lang="ts" setup>
defineProps<{
  subtitle?: string;
}>();
</script>
<template>
  <div class="mt-3 h-20 flex justify-center items-center rounded-lg bg-kb-ui-10 shdow-xl">
    {{ subtitle ?? "관심 목록" }}이 없습니다.
  </div>
</template>
