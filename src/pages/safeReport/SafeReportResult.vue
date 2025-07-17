<script setup lang="ts">
import {toRefs} from 'vue'
import {useRouter} from 'vue-router'

interface FormData{
  buildingName: string
  transactionType: string
  budget:number|null
}

const props = defineProps<{formData:FormData}>()

const {buildingName, transactionType, budget} = toRefs(props.formData)
const router = useRouter()

function goHome(){
  router.push({name:'home'})
}

</script>

<template>
  <section class="flex flex-col items-center mt-[-50px]">
    <div class="w-28 h-28 rounded-full bg-yellow-100 flex flex-col items-center justify-center shadow-md">
      <p class="text-xl font-bold text-yellow-600">85/<span class="text-sm">100</span></p>
      <p class="text-sm text-gray-700 mt-1">주의</p>
    </div>
  </section>


  <section class="grid grid-cols-3 gap-2 px-4 mt-6 text-center text-xs font-medium">
    <div class="bg-green-100 text-green-700 py-2 rounded">법적문제 없음</div>
    <div class="bg-yellow-100 text-yellow-700 py-2 rounded">깡통전세 주의</div>
    <div class="bg-green-100 text-green-700 py-2 rounded">불법건축물 없음</div>
  </section>

  <ul class="space-y-2">
    <li>🏢 건물명: {{ buildingName }}</li>
    <li>🔄 거래 유형: {{ transactionType }}</li>
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
