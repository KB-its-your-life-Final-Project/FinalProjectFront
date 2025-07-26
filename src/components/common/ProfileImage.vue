<script setup lang="ts">
defineProps<{
  src: string;
}>();
</script>
<template>
  <img :src="src" alt="Profile" class="aspect-square w-25 rounded-full" />
</template>
