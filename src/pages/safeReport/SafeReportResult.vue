<script setup lang="ts">
import {useRouter} from 'vue-router'
import { computed, ref } from 'vue'

interface FormData{
  buildingName: string
  budget:number|null
}

interface ResultData{
  dealAmount: number
  buildYear:number
  score:number
}
const emit = defineEmits(['update', 'next', 'prev']);
const props = defineProps<{formData:FormData, resultData:ResultData|null}>()

const {formData, resultData} = props
const router = useRouter()
const showModal_financial = ref(false)
const showModal_building = ref(false)

const gradeText = computed(() => {
  if (!resultData || typeof resultData.score !== 'number') return '-';
  if (resultData.score >= 8) return '위험'
  if (resultData.score >= 5) return '주의'
  if (resultData.score >= 3) return '안전'
  return '매우 안전'
})

const gradeColor = computed(() => {
  if (!resultData || typeof resultData.score !== 'number') {
    return {
      bg: 'bg-gray-100',
      text: 'text-gray-400',
      label: '-'
    }
  }
  if (resultData.score >= 8) {
    return {
      bg: 'bg-red-100',
      text: 'text-red-600',
      label: '위험'
    }
  } else if (resultData.score >= 5) {
    return {
      bg: 'bg-orange-100',
      text: 'text-orange-500',
      label: '주의'
    }
  } else if (resultData.score >= 3) {
    return {
      bg: 'bg-yellow-100',
      text: 'text-yellow-600',
      label: '안전'
    }
  } else {
    return {
      bg: 'bg-blue-100',
      text: 'text-blue-600',
      label: '매우 안전'
    }
  }
})

function goHome(){
  router.push({name:'homeMain'})
}
function goToKB(){
  window.open('https://m.naver.com/')
  // window.open('https://obank.kbstar.com/quics?page=C103557#loading', '_blank')
}

function handleBack() {
  if (currentStep.value === 1 || currentStep.value === 2) {
    router.push({ name: 'homeMain' });
  } else {
    prevStep();
  }
}
</script>

<template>

  <section class="flex flex-col gap-9 items-center mt">
    <div class="text-center font-pretendard-bold text-lg foont-semibold">{{ formData.buildingName }}의 안심 진단 리포트입니다.</div>
    <div
      class="w-32 h-32 rounded-full flex flex-col items-center justify-center shadow-md"
      :class="gradeColor.bg"
    >
      <div class="flex flex-col items-center">
        <font-awesome-icon :icon="['fas', 'shield-halved']" class="mb-1 text-4xl" :class="gradeColor.text" />
        <span class="text-xl font-bold" :class="gradeColor.text">
      {{ resultData?.score ?? '-' }}<span class="text-sm">/10</span>
    </span>
      </div>

    </div>
    <div
      class="w-20 h-10 rounded-full flex items-center justify-center mt-2"
      :class="gradeColor.bg"
      style="margin-top:-1.5rem;"
    >
      <span class="text-base font-semibold" :class="gradeColor.text">{{ gradeText }}</span>
    </div>
  </section>

  <section class="flex justify-center gap-4 px-4 mt-6 text-center text-xs font-medium">
<!--    박스1-->
    <div
      class="flex flex-col items-center justify-center w-32 h-24 rounded"
      :class="gradeColor.bg"
    >
      <svg class="w-8 h-8 mb-1" fill="currentColor" viewBox="0 0 20 20" :class="gradeColor.text">
        <path
          d="M8.257 3.099c.765-1.36 2.72-1.36 3.485 0l6.518 11.597c.75 1.336-.213 2.998-1.742 2.998H3.48c-1.529 0-2.492-1.662-1.742-2.998L8.257 3.1zM11 13a1 1 0 10-2 0 1 1 0 002 0zm-1-2a1 1 0 01-1-1V7a1 1 0 012 0v3a1 1 0 01-1 1z"
        />
      </svg>
      <span :class="gradeColor.text" class="text-md">깡통전세</span>
      <span class="text-[11px]" :class="gradeColor.text">{{ gradeText }}</span>
    </div>


    <!-- 박스 2 -->
    <div
      class="flex flex-col items-center justify-center w-32 h-24 bg-green-100 text-green-700 rounded"
    >
      <svg class="w-8 h-8 mb-1" fill="currentColor" viewBox="0 0 20 20">
        <path
          d="M3 2a1 1 0 011-1h12a1 1 0 011 1v15h-5v-4H8v4H3V2zm2 3v2h2V5H5zm0 4v2h2V9H5zm0 4v2h2v-2H5zm4-8v2h2V5H9zm0 4v2h2V9H9zm0 4v2h2v-2H9zm4-8v2h2V5h-2zm0 4v2h2V9h-2zm0 4v2h2v-2h-2z"
        />
      </svg>
      <span class="text-md">불법건축물</span>
      <span class="text-[11px] text-gray-600">없음</span>
    </div>
  </section>


  <div class="text-base font-semibold text-left px-4 mt-6 mb-2">상세 분석 결과</div>
  <section class="px-4 mt-6 flex flex-col gap-3 text-sm">
    <div
      class="border rounded-lg px-4 py-5 flex justify-between items-center shadow-sm bg-kb-ui-11"
    >
      <span class="text-lg">재정적 안전성 분석</span>
      <font-awesome-icon :icon="['fas', 'fa-angle-right']" class="cursor-pointer" @click.stop="showModal_financial=true"/>
    </div>
    <div
      class="border rounded-lg px-4 py-5 flex justify-between items-center shadow-sm bg-kb-ui-11"
    >
      <span class="text-lg">건축물 정보</span>
      <font-awesome-icon :icon="['fas', 'fa-angle-right']" class="cursor-pointer" @click.stop="showModal_building=true"/>
    </div>
  </section>

  <div class="px-4 mt-8 flex flex-col gap-2">
    <button
      @click="goHome"
      class="w-full bg-kb-yellow text-kb-ui-01 py-3 rounded-lg text-lg font-semibold"
    >
      확인
    </button>
    <button
      @click="goToKB"
      class="w-full bg-kb-yellow text-kb-ui-01 py-3 rounded-lg text-lg font-semibold">
      KB 금융 상품 안내
    </button>
  </div>

<!--  모달-->
  <div v-if="showModal_financial" class="fixed inset-0 z-50 flex items-center justify-center bg-transparent bg-opacity-40">
    <div class="rounded-lg shadow-lg p-6 w-100 h-80 relative bg-kb-ui-07">
      <button class="absolute top-2 right-2 text-gray-400 hover:text-gray-600 text-xl" @click="showModal_financial = false">×</button>
      <h2 class="text-lg font-bold mb-4">재정적 안전성 분석</h2>
      <p>이곳에 재정적 안전성 분석에 대한 상세 설명이나 데이터를 보여줄 수 있습니다.</p>
    </div>
  </div>
  <div v-if="showModal_building" class="fixed inset-0 z-50 flex items-center justify-center bg-transparent bg-opacity-40">
    <div class="rounded-lg shadow-lg p-6 w-100 h-80 relative bg-kb-ui-07">
      <button class="absolute top-2 right-2 text-gray-400 hover:text-gray-600 text-xl" @click="showModal_building = false">×</button>
      <h2 class="text-lg font-bold mb-4">건축물 정보</h2>
      <p>이곳에 건축물 정보에 대한 상세 설명이나 데이터를 보여줄 수 있습니다.</p>
    </div>
  </div>
</template>

<style scoped></style>
