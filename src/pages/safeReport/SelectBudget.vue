<script setup lang="ts">
import { ref, watch } from 'vue'
import { Api } from "@/api/autoLoad/Api.ts";
import axios from "axios";
import { safeReportStore } from '@/stores/safeReportStore'

const store = safeReportStore()
const emit = defineEmits(['update','next','prev'])

const rawInput = ref('')           // 사용자가 입력한 숫자 문자열
const budget = ref<number | null>(store.formData.budget)
const displayValue = ref('')       // 변환된 한글 금액
const showError = ref(false)

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
  let val = (e.target as HTMLInputElement).value;
  // 숫자 이외 입력 불가
  if (/[^0-9]/.test(val)) {
    val = val.replace(/[^0-9]/g, '');
  }
  if (val === '') {
    rawInput.value = '';
    showError.value = false;
    updateDisplay();
    return;
  }
  if (Number(val) > 999999) {
    showError.value = true;
    rawInput.value = '999999'; // val이 아니라 바로 999999로!
    updateDisplay();
    return; // 여기서 return!
  } else {
    showError.value = false;
  }
  rawInput.value = val;
  updateDisplay();
}

function updateDisplay() {
  if (rawInput.value === '') {
    displayValue.value = '';
    budget.value = null;
    return;
  }
  const numeric = Number(rawInput.value);
  displayValue.value = numberToKorean(numeric * 10000);
  budget.value = numeric;
}

watch(budget, val => {
  store.updateFormData({ budget: val })
})

// 한글 금액 변환
function numberToKorean(num: number, removeUnit = ''): string {
  if (num === 0) return removeUnit ? '' : '영원';
  const unitWords = ['', '만', '억'];
  const smallUnitWords = ['', '십', '백', '천'];
  const numberWords = ['영', '일', '이', '삼', '사', '오', '육', '칠', '팔', '구'];
  const result = [];
  let unitPos = 0;
  while (num > 0) {
    const part = num % 10000;
    if (part > 0) {
      let section = '';
      const digits = part.toString().padStart(4, '0').split('').map(Number);
      digits.forEach((digit, idx) => {
        if (digit !== 0) {
          if (!(digit === 1 && idx !== 3)) {
            section += numberWords[digit];
          }
          section += smallUnitWords[3 - idx];
        }
      });
      const unit = unitWords[unitPos];
      if (unit !== removeUnit) {
        result.unshift(section + unit);
      } else {
        result.unshift(section);
      }
    }
    unitPos++;
    num = Math.floor(num / 10000);
  }
  return result.join('');
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

  emit('next')
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
      <!-- 한글 금액 표시 (input 위) -->
      <span
        v-if="rawInput.length >= 3"
        class="absolute right-4 -top-6 text-s text-kb-ui-04 mt-1"
      >
        {{ displayValue }}원
      </span>
      <div class="flex items-center w-full">
        <input
        v-model="rawInput"
        @input="handleInput"
        type="text"
        maxlength="6"
        placeholder="보증금 예산 입력"
        class="w-full border border-kb-ui-06 rounded-full pl-4 pr-14 focus:outline-none bg-white cursor-text mt-1 text-base"
        style="height: 2.5rem; line-height: 2.5rem; padding-top: 0; padding-bottom: 0;"
      />
      <!-- input의 오른쪽 안에 "만원"을 배치 -->
      <span
        class="absolute right-4 top-0 bottom-0 flex items-center text-kb-ui-04 pointer-events-none text-base"
        style="height: 3.0rem; line-height: 2.5rem;"
      >
        만원
      </span>
      </div>

      <!-- 경고 메시지는 input 아래에 block으로! -->
      <div class="text-xs text-kb-ui-04 mt-2 text-right">
        예산은 100억원 미만이어야 합니다
      </div>
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
        :disabled="!budget || showError || budget < 100"
        class="px-4 py-2 bg-kb-yellow rounded text-kb-ui-11 disabled:opacity-50"
      >
        레포트 보기
      </button>
    </div>
  </div>

</template>
<style scoped>

</style>
