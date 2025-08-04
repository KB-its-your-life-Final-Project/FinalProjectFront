<script setup lang="ts">
import type { MarkerDataType } from "@/utils/naverMap/naverMapCustomType";
import MapDetailCard from "./MapDetailCard.vue";

defineProps<{
  markers: Array<MarkerDataType>;
}>();
</script>

<template>
  <div class="w-full h-full p-3 bg-white">
    <div class="flex justify-end">
      <slot name="mapDetailShow"></slot>
    </div>
    <div class="flex flex-col gap-4 p-2">
      <div v-for="marker in markers">
        <div class="border-1 p-4 rounded-2xl min-h-20">
          <MapDetailCard :marker="marker" />
        </div>
      </div>
    </div>
  </div>
</template>
