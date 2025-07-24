<script setup lang="ts">
import { ref, watch } from 'vue'
import { Api } from "@/api/autoLoad/Api.ts";
import axios from "axios";
//import axios from "axios";

const props = defineProps({ formData: Object })
const emit = defineEmits(['update','next','prev'])


const rawInput = ref('')           // 사용자가 입력한 숫자 문자열
const budget = ref<number | null>(null)
const displayValue = ref('')       // 변환된 한글 금액

// 숫자 입력 처리
function handleKeydown(e: KeyboardEvent) {
  const key = e.key

  if (!/[0-9]/.test(key)) {
    // 숫자가 아니면 입력 막기
    if (key !== 'Backspace') e.preventDefault()
    return
  }

  // 숫자 누르면 rawInput 업데이트
  rawInput.value += key
  e.preventDefault() // 기본 입력 막고 아래서 표시

  updateDisplay()
}

function handleBackspace(e: KeyboardEvent) {
  if (e.key === 'Backspace') {
    rawInput.value = rawInput.value.slice(0, -1)
    updateDisplay()
    e.preventDefault()
  }
}

function handleInput(e: Event) {
  const val = (e.target as HTMLInputElement).value;
  // 숫자가 아닌 문자가 하나라도 포함되어 있으면 전체 삭제
  if (/[^0-9]/.test(val)) {
    // input 값을 강제로 ''로 만듦
    (e.target as HTMLInputElement).value = '';
    rawInput.value = '';
    displayValue.value = '';
    budget.value = null;
  } else {
    rawInput.value = val;
    updateDisplay();
  }
}

// rawInput → 한글 금액으로 변환
function updateDisplay() {
  if (rawInput.value === '') {
    budget.value = null
    displayValue.value = ''
    return
  }

  const numeric = Number(rawInput.value)
  budget.value = numeric * 100;
  displayValue.value = numberToKorean(numeric * 1000000,'만')
}

watch(budget, val => {
  emit('update', { budget: val })
})

// 한글 금액 변환
function numberToKorean(num: number, removeUnit = ''): string {
  if (num === 0) return removeUnit ? '' : '영원'

  const unitWords = ['', '만', '억', '조', '경']
  const smallUnitWords = ['', '십', '백', '천']
  const numberWords = ['영', '일', '이', '삼', '사', '오', '육', '칠', '팔', '구']
  const result = []
  let unitPos = 0

  while (num > 0) {
    const part = num % 10000
    if (part > 0) {
      let section = ''
      const digits = part.toString().padStart(4, '0').split('').map(Number)
      digits.forEach((digit, idx) => {
        if (digit !== 0) {
          section += numberWords[digit] + smallUnitWords[3 - idx]
        }
      })

      const unit = unitWords[unitPos]
      if (unit !== removeUnit) {
        result.unshift(section + unit)
      } else {
        result.unshift(section)
      }
    }
    unitPos++
    num = Math.floor(num / 10000)
  }

  return result.join('')
}


async function next() {
  const budget_val = Number(budget.value)
  // 100만원(=100) 이하 또는 100억원(=1,000,000) 이상은 불가
  if(budget.value==null||budget_val<=0||!Number.isFinite(budget_val)){
    alert('예산을 올바르게 입력해주세요!')
    return
  }
  if (budget_val < 10) {
    alert('예산은 100만원(1백만원) 이상이어야 합니다!')
    return
  }
  if (budget_val >= 1000000) {
    alert('예산은 100억원 미만이어야 합니다!')
    return
  }
  try{
    console.log("보낼 데이터",{...props.formData})
    const response = await axios.post('/api/report/requestData',{...props.formData})
    console.log('서버 응답:', response.data)
    emit('next',{
      formData: props.formData,
      resultData: response.data.data
    })
  }catch (error){
    console.error('전송 실패:', error)
    alert('DB에 데이터가 없습니다')
  }
}

function prev(){
  emit('prev')
}
</script>


<template>
  <div class="relative flex flex-col flex-1 min-h-screen px-6 gap-6">
    <div>
      <h1 class="text-2xl font-pretendard-bold mb-1">
        예산은 얼마인가요?
      </h1>
      <h1 class="text-2xl font-pretendard-bold mb-1">
        더 상세한 리포트를 제공해드릴게요!
      </h1>
    </div>

    <div class="relative w-full max-w-lg mx-auto">
      <!--  search bar -->
      <input
        :value="displayValue"
        @keydown="handleKeydown"
        @keydown.backspace="handleBackspace"
        @input="handleInput"
        type="text"
        placeholder="보증금 예산 입력"
        class="w-full border border-kb-ui-06 rounded-full py-2 pl-4 pr-12 focus:outline-none bg-white cursor-text"
      />
      <span class="absolute inset-y-0 right-4 flex items-center text-kb-ui-04 pointer-events-none">
      만원
    </span>
    </div>
    <div class="fixed z-auto inset-x-0 bottom-6 flex justify-between px-6 pb-24">
      <button
        @click="prev"
        class="px-4 py-2 bg-kb-yellow rounded text-kb-ui-11"
      >
        이전
      </button>
      <button
        @click="next"
        :disabled="!budget"
        class="px-4 py-2 bg-kb-yellow rounded text-kb-ui-11 disabled:opacity-50"
      >
        레포트 보기
      </button>
    </div>
  </div>

</template>
<style scoped>

</style>
