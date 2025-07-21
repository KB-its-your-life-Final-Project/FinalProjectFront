<script setup lang="ts">
import BottomNav from "../nav/BottomNav.vue";
</script>

<template>
  <div class="min-h-screen flex flex-col items-center">
    <div class="w-full flex flex-col flex-1">
      <div class="flex-1 overflow-auto">
        <slot></slot>
        <BottomNav />
      </div>
    </div>
  </div>
</template>
