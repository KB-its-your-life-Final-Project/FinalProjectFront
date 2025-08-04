<script setup lang="ts">
defineProps<{
  src: string;
}>();
</script>
<template>
  <img :src="src" alt="Profile" class="aspect-square w-1/1 rounded-full" />
</template>
