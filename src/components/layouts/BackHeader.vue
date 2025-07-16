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
  router.back();
}
function goToAlarmPage() {
  router.push('/alarmpage');
}
function goToMenuPage(){
  router.push('/menupage');
}
</script>

<template>


  <header class="bg-yellow-300 w-full px-4 pt-16 pb-[70px] relative">
    <!--    <div class="absolute top-4 right-4">
          <font-awesome-icon :icon="['fas', 'bell']" class="text-xl text-gray-700" />
        </div>-->
    <div class="flex justify-between items-center text-black">



      <div class="absolute top-4 left-4 flex items-center space-x-4 text-gray-700 text-xl">
      <font-awesome-icon
        :icon="['fas', 'arrow-left']"
        class="text-lg mr-4 cursor-pointer"
        @click="goBack"
      />
      <span class="text-base font-semibold text-black">{{ title }}</span>
    </div>
      <div class="absolute top-4 right-4 flex items-center space-x-4 text-gray-700 text-xl">
      <font-awesome-icon
        :icon="['fas', 'bell']"
        class="cursor-pointer mr-4"
        @click="goToAlarmPage"
      />
      <font-awesome-icon :icon="['fas', 'bars']" class="cursor-pointer"  @click="goToMenuPage"/>
    </div>
    </div>
    <slot />
  </header>
</template>
