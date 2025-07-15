<!-- Footer -->
<script setup lang="ts">
import { RouterLink } from 'vue-router';
</script>

<template>
<!--  <div class="fixed bottom-14 right-4 text-right text-xs text-gray-500 z-50">-->
    <footer class="w-full mt-10 mb-4 text-center text-xs text-gray-500">
    <RouterLink to="/about">서비스 소개</RouterLink>
    <p>All rights reserved.</p>
    <p>Version 1.0.0</p>
    </footer>
<!--  </div>-->
</template>

<style scoped>
.Footer {
  background: white;
  justify-items: center;
}
</style>
