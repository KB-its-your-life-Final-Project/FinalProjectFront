<script lang="ts" setup>
defineProps<{ title: string }>();
</script>
<template>
  <div class="px-4 mt-6">
    <div class="font-semibold text-lg">{{ title }}</div>
    <div>
      <slot></slot>
    </div>
  </div>
</template>
