<!-- Header -->

<script setup lang="ts">
import { useRouter } from 'vue-router'
import { defineProps, ref } from 'vue'

const props = defineProps<{
  title?: string
  showBack?: boolean     // 뒤로가기 버튼 표시 여부
  showAlarm?: boolean    // 알림 아이콘 표시 여부
}>()

const router = useRouter()

function goBack() {
  router.back()
}

function goToAlarmPage() {
  router.push('/alarmpage')
}
</script>

<template>
  <header class="bg-yellow-300 w-full px-[1rem] pt-[4rem] pb-[4.375rem] relative">
    <!-- 왼쪽: 뒤로가기 아이콘 or 타이틀 -->
    <div class="absolute top-[1rem] left-[1rem] flex items-center space-x-[1rem] text-gray-700 text-[1.25rem]">
      <font-awesome-icon
        v-if="showBack"
        :icon="['fas', 'arrow-left']"
        class="text-[1.125rem] cursor-pointer"
        @click="goBack"
      />
      <span
        v-if="title"
        :class="['text-base font-semibold text-black', showBack ? 'ml-4' : '']"
      >
  {{ title }}
</span>    </div>


    <div
      v-if="showAlarm"
      class="absolute top-[1rem] right-[1rem] flex items-center space-x-[1rem] text-gray-700 text-xl"
    >
      <font-awesome-icon
        :icon="['fas', 'bell']"
        class="cursor-pointer"
        @click="goToAlarmPage"
      />
    </div>


    <slot />
  </header>
</template>















<!--뒤로가기가 없는 헤더 ex) 메인 페이지-->
<!--
<script setup lang="ts">
import { useRouter } from 'vue-router';
import { defineProps } from 'vue'
import Header from "@/components/common/Header.vue";
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

-->
