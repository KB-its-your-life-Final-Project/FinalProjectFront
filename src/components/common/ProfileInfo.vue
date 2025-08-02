<script setup lang="ts">
defineProps<{
  name: string;
  email: string;
}>();
</script>
<template>
  <div class="flex-1 flex flex-col items-center">
    <p class="text-lg font-pretendard-bold">{{ name }}</p>
    <p class="text-lg font-pretendard-bold flex items-center gap-1">
      {{ email }}
      <font-awesome-icon
        class="border rounded-full p-[2px] w-2 h-2 text-success"
        :icon="['fas', 'check']"
      />
    </p>
  </div>
</template>
