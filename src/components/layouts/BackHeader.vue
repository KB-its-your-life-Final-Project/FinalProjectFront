<!--뒤로가기가 포함된 헤더 뒤로가기 아이콘 -->

<script setup lang="ts">

import { useRouter } from 'vue-router';
import { defineProps } from 'vue'
import Header from "@/components/layouts/Header.vue";
const props = defineProps<{
  title: string;
}>();

const router = useRouter();
function goBack() {
  router.back(); //뒤로가기
/*  router.push('/'); 홈으로 가면*/
}
function goToAlarmPage() {
  router.push('/alarmpage');
}

</script>

<template>


  <header class="bg-yellow-300 w-full px-[1rem] pt-[4rem] pb-[4.375rem] relative">
    <!--    <div class="absolute top-4 right-4">
          <font-awesome-icon :icon="['fas', 'bell']" class="text-xl text-gray-700" />
        </div>-->
    <div class="flex justify-between items-center text-black">



      <div class="absolute top-[1rem] left-[1rem] flex items-center space-x-[1rem] text-gray-700 text-[1.25rem]">
      <font-awesome-icon
        :icon="['fas', 'arrow-left']"
        class="text-[1.125rem] mr-[1rem] cursor-pointer"
        @click="goBack"
      />
      <span class="text-base font-semibold text-black">{{ title }}</span>
    </div>

      <div class="absolute top-[1rem] right-[1rem] flex items-center space-x-[1rem] text-gray-700 text-[1.25rem]">
      <font-awesome-icon
        :icon="['fas', 'bell']"
        class="cursor-pointer"
        @click="goToAlarmPage"
      />
    </div>
    </div>
    <slot />
  </header>
</template>
