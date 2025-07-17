<script setup lang="ts">
import { ref, watch } from 'vue'
const props = defineProps({ formData: Object })
const emit = defineEmits(['update','next','prev'])

const budget = ref<number | null>(props.formData.budget)

watch(budget, val => {
  emit('update', { budget: val })
})

function next() {
  const budget_val = Number(budget.value)
  if(budget.value==null||budget_val<=0||!Number.isFinite(budget_val)){
    alert('예산을 올바르게 입력해주세요!')
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
      <!--  search bar -->
      <input
        v-model="budget"
        type="text"
        placeholder="보증금 예산 입력"
        class="w-full border border-kb-ui-06 rounded-full py-2 pl-4 pr-12 focus:outline-none"
      />
      <span
        class="absolute inset-y-0 right-4 flex items-center text-kb-ui-04 pointer-events-none"
      >
      만원
    </span>
    </div>
    <div class="fixed z-10 inset-x-0 bottom-6 flex justify-between px-6 pb-24">
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
