<script setup lang="ts">
import { computed } from "vue";
import { useRoute } from "vue-router";
import BottomNav from "../nav/BottomNav.vue";
import bottomNavList from "@/components/nav/BottomNavData";

const route = useRoute();

const showBottomNav = computed(() => {
  return !bottomNavList.withoutBottomNavPages.some((page) => page.name === route.name);
});
</script>

<template>
  <div class="min-h-screen flex flex-col items-center">
    <div class="w-full flex flex-col flex-1">
      <div class="flex-1 overflow-auto">
        <slot></slot>
        <BottomNav v-if="showBottomNav" />
      </div>
    </div>
  </div>
</template>
