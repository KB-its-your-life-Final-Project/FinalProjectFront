<template>
  <div class="flex items-center py-3 cursor-pointer hover:opacity-80" @click="navigate">
    <font-awesome-icon :icon="icon" class="w-5 text-kb-yellow" />
    <span class="ml-3">{{ label }}</span>
    <font-awesome-icon :icon="['fas', 'chevron-right']" class="ml-auto text-kb-ui-06" />
  </div>
</template>

<script setup lang="ts">
import { useRouter } from "vue-router";
import type { IconProp } from "@fortawesome/fontawesome-svg-core";

const props = defineProps<{
  icon: IconProp;
  label: string;
  to?: string;
}>();

const router = useRouter();

function navigate() {
  if (props.to) {
    router.push(props.to);
  }
}
</script>
