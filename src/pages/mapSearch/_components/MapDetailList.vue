<script setup lang="ts">
import type { MarkerDataType } from "@/types/markerDataType";
import MapDetailCard from "./MapDetailCard.vue";

defineProps<{
  markers: Array<MarkerDataType>;
}>();
</script>

<template>
  <div class="w-full h-full bg-white flex flex-col">
    <div class="flex justify-end mb-3">
      <slot name="mapDetailShow"></slot>
    </div>
    <div class="flex-1 overflow-y-auto">
      <div class="flex flex-col gap-4 p-2">
        <div v-for="marker in markers" :key="marker.jibunAddress">
          <div class="border-1 p-4 rounded-2xl min-h-20">
            <MapDetailCard :marker="marker" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
