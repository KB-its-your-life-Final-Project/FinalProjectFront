<script setup lang="ts">
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";

defineProps<{
  title: string;
  icon: [string, string];
}>();
</script>

<template>
  <div
    class="cursor-pointer flex py-5 border-b-1 border-gray-300 gap-3 items-center hover:bg-gray-100"
  >
    <font-awesome-icon class="rounded-full bg-gray-200 p-1 ml-2" :icon="icon"></font-awesome-icon>
    <div class="title">{{ title }}</div>
  </div>
</template>
