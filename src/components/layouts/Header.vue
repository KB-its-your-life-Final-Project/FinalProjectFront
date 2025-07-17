<!-- Header -->
<!--뒤로가기가 없는 헤더 ex) 메인 페이지-->
<script setup lang="ts">
import { useRouter } from 'vue-router';
import { defineProps } from 'vue'
import Header from "@/components/layouts/Header.vue";
const props = defineProps<{
  title: string;
}>();

const router = useRouter();
function goToAlarmPage() {
  router.push('/alarmpage');
}

</script>

<template>
  <header class="bg-yellow-300 w-full px-[1rem] pt-[4rem] pb-[4.375rem] relative">
    <div class="absolute top-[1rem] left-[1rem] flex items-center space-x-[1rem] text-gray-700 text-[1.25rem]">

      <span class="text-base font-semibold text-black">{{ title }}</span>
    </div>
    <div class="absolute top-[1rem] right-[1rem] flex items-center space-x-[1rem] text-gray-700 text-xl">
      <font-awesome-icon
        :icon="['fas', 'bell']"
        class="cursor-pointer"
        @click="goToAlarmPage"
      />
    </div>
    <slot />
  </header>
</template>

