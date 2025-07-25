<template>
  <div class="mb-6">
    <h2 class="text-xs text-kb-ui-03 font-semibold mb-2">{{ title }}</h2>
    <ul class="space-y-3">
      <slot />
    </ul>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  title: string;
}>();
</script>
