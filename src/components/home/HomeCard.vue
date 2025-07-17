<script setup lang="ts">

import type {HomeCardType} from "@/components/home/HomeMenu.ts";

defineProps<{

  data: HomeCardType;
}>();
</script>

<template>
  <div class="bg-white rounded-xl shadow-md p-4 h-full flex flex-col justify-between relative">
    <img :src="data.imgSrc" alt="카드 아이콘" class="absolute top-4 right-4 w-10 h-10 object-contain"/>

    <!--
        <div class="text-2xl mb-2">{{ icon }}</div>
    -->
    <div class="mt-4">
    <div class="text-base font-semibold">{{ data.title }}</div>
    <div class="text-sm text-gray-500 mt-1">{{ data.info}}</div>
    </div>

  </div>
</template>
