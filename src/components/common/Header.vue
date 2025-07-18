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
  <header class="bg-kb-yellow w-full px-[1rem] pt-[4rem] pb-[4.375rem] relative">
    <!-- 왼쪽: 뒤로가기 아이콘 or 타이틀 -->
    <div class="absolute top-[1rem] left-[1rem] flex items-center space-x-[1rem] text-kb-ui-01 text-[1.25rem]">
      <font-awesome-icon
        v-if="showBack"
        :icon="['fas', 'arrow-left']"
        class="text-[1.125rem] cursor-pointer"
        @click="goBack"
      />
      <span
        v-if="title"
        :class="['text-base font-semibold text-kb-ui-01', showBack ? 'ml-4' : '']"
      >
  {{ title }}
</span>    </div>


    <div
      v-if="showAlarm"
      class="absolute top-[1rem] right-[1rem] flex items-center space-x-[1rem] text-kb-ui-01 text-xl"
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


