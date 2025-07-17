<script setup lang="ts">
import { ref, watch } from 'vue'
const props = defineProps({ formData: Object })
const emit = defineEmits(['update','next','prev'])

const transactionType = ref(props.formData.transactionType)

watch(transactionType, val => {
  emit('update', { transactionType: val })
})

function next() {
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
        거래 유형을 알려주세요!
      </h1>
      <p class="text-kb-ui-05">
        원하는 유형으로 선택해주세요.
      </p>
    </div>

    <div class="relative w-full max-w-lg mx-auto">
      <!--  필터 바 -->
      <button
        @click="transactionType = '매매'"
        :class="[
          'px-6 py-2 rounded-full border',
          transactionType === '매매'
            ? 'bg-kb-yellow text-kb-ui-11'
            : 'bg-gray-100 text-kb-ui-04 border-gray-200'
        ]"
      >
        매매
      </button>
      <button
        @click="transactionType = '전월세'"
        :class="[
          'ml-4 px-6 py-2 rounded-full border',
          transactionType === '전월세'
            ? 'bg-kb-yellow text-kb-ui-11'
            : 'bg-gray-100 text-kb-ui-04 border-gray-200'
        ]"
      >
        전월세
      </button>
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
        :disabled="!transactionType"
        class="px-4 py-2 bg-kb-yellow rounded text-kb-ui-11 disabled:opacity-50"
      >
        다음
      </button>
    </div>
  </div>

</template>

<style scoped>

</style>
