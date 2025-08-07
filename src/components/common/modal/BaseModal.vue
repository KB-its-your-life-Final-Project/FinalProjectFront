<script setup lang="ts">
import DimOverlay from "@/components/layout/DimOverlay.vue";
import ModalLayout from "@/components/layout/ModalLayout.vue";
defineProps<{
  verticalAlign?: "top" | "middle" | "bottom";
  offset?: number;
}>();
</script>
<template>
  <DimOverlay @close="$emit('close')">
    <ModalLayout :verticalAlign="verticalAlign" :offset="offset">
      <slot></slot>
    </ModalLayout>
  </DimOverlay>
</template>
