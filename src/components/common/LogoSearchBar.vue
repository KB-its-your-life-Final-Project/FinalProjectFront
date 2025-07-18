<!-- src/components/common/SearchContainer.vue -->
<script setup lang="ts">
import { defineProps } from 'vue'
import lighthouseIcon from "@/assets/imgs/lighthouse.png";

defineProps<{
  modelValue: string
  placeholder?: string
}>()

const emit = defineEmits(['update:modelValue', 'clear'])


</script>


<template>
<div class="absolute left-1/2 bottom-0 translate-y-1/2 -translate-x-1/2 w-[85%] bg-kb-ui-11 flex items-center px-[1rem] py-[0.5rem] rounded-full shadow-md">

<img
  :src="lighthouseIcon"
  alt="검색 아이콘"
  class="h-full w-auto max-h-[2rem] mr-[0.5rem] object-contain"
/>
<input
  :value="modelValue"
  @input="$emit('update:modelValue', ($event.target as HTMLInputElement).value)"
  :placeholder="placeholder"
  class="w-full font-italic focus:outline-none placeholder-kb-ui-07 text-sm"
  type="text"
/>
<font-awesome-icon
  v-if="modelValue"
  :icon="['far','circle-xmark']"
  class="text-kb-ui-06 ml-[0.5rem] cursor-pointer hover:text-kb-ui-08"
  @click="$emit('clear')"
/>
</div>
</template>
