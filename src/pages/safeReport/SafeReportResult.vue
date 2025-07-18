<script setup lang="ts">
import {toRefs} from 'vue'
import {useRouter} from 'vue-router'

interface FormData{
  buildingName: string
  budget:number|null
}

const props = defineProps<{formData:FormData}>()

const {buildingName, budget} = toRefs(props.formData)
const router = useRouter()

function goHome(){
  router.push({name:'home'})
}

</script>

<template>
  <section class="flex flex-col items-center mt">
    <div class="w-28 h-28 rounded-full bg-yellow-100 flex flex-col items-center justify-center shadow-md">
      <p class="text-xl font-bold text-yellow-600">85/<span class="text-sm">100</span></p>
      <p class="text-sm text-kb-ui-04 mt-1">주의</p>
    </div>
  </section>


  <section class="flex justify-center gap-4 px-4 mt-6 text-center text-xs font-medium">
    <div class="flex flex-col items-center justify-center w-28 h-20 bg-yellow-100 text-yellow-700 rounded">
      <svg class="w-5 h-5 mb-1" fill="currentColor" viewBox="0 0 20 20">
        <path d="M8.257 3.099c.765-1.36 2.72-1.36 3.485 0l6.518 11.597c.75 1.336-.213 2.998-1.742 2.998H3.48c-1.529 0-2.492-1.662-1.742-2.998L8.257 3.1zM11 13a1 1 0 10-2 0 1 1 0 002 0zm-1-2a1 1 0 01-1-1V7a1 1 0 012 0v3a1 1 0 01-1 1z"/>
      </svg>
      <span>깡통전세</span>
      <span class="text-[11px] text-gray-600">주의</span>
    </div>

    <!-- 박스 2 -->
    <div class="flex flex-col items-center justify-center w-28 h-20 bg-green-100 text-green-700 rounded">
      <svg class="w-5 h-5 mb-1" fill="currentColor" viewBox="0 0 20 20">
        <path d="M3 2a1 1 0 011-1h12a1 1 0 011 1v15h-5v-4H8v4H3V2zm2 3v2h2V5H5zm0 4v2h2V9H5zm0 4v2h2v-2H5zm4-8v2h2V5H9zm0 4v2h2V9H9zm0 4v2h2v-2H9zm4-8v2h2V5h-2zm0 4v2h2V9h-2zm0 4v2h2v-2h-2z"/>
      </svg>
      <span>불법건축물</span>
      <span class="text-[11px] text-gray-600">없음</span>
    </div>
  </section>

  <ul class="space-y-2">
    <li>🏢 건물명: {{ buildingName }}</li>
    <li>💰 예산: {{ budget }} 만원</li>
  </ul>
  <section class="px-4 mt-6 flex flex-col gap-2 text-sm">
    <div class="border rounded-lg px-4 py-3 flex justify-between items-center shadow-sm bg-kb-ui-11">
      <span>재정적 안전성 분석</span>
      <font-awesome-icon :icon="['fas', 'chevron-right']" />
    </div>
    <div class="border rounded-lg px-4 py-3 flex justify-between items-center shadow-sm bg-kb-ui-11">
      <span>건축물 정보</span>
      <font-awesome-icon :icon="['fas', 'chevron-right']" />
    </div>
  </section>


  <div class="px-4 mt-8 flex flex-col gap-2">
    <button
      @click="goHome"
      class="w-full bg-kb-yellow text-kb-ui-01 py-3 rounded-lg text-sm font-semibold">
      확인
    </button>
    <button class="w-full bg-kb-yellow text-kb-ui-01 py-3 rounded-lg text-sm font-semibold">
      KB 금융 상품 안내
    </button>
  </div>

</template>

<style scoped>

</style>
