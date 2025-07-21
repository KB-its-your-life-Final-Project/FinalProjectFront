<template>
  <div class="px-4 pt-6">
    <!-- 동적 헤더: 아파트명 -->
    <Header :title="aptName" />
    <div class="text mt-4 mb-2">
      <h1 class="text-2xl font-bold">실거래가</h1>
    </div>
    <!-- 필터: 매매/전월세 -->
    <div class="flex space-x-10 mt-4">

      <button
        v-for="type in ['전체', '매매', '전월세']"
        :key="type"
        :class="[
          'px-3 py-1 rounded-full border',
          selectedType === type ? 'bg-kb-yellow text-white' : 'bg-white text-gray-700'
        ]"
        @click="setType(type)"
      >
        {{ type }}
      </button>
    </div>

    <!-- 그래프 -->
    <TransactionGraph :graphData="graphData" />

    <!-- 연도 필터 -->
    <div class="flex space-x-3 justify-center mt-4">
      <button
        v-for="year in [1, 3, 5]"
        :key="year"
        @click="setYear(year)"
        :class="[
          'px-4 py-1 rounded-full',
          selectedYear === year ? 'bg-kb-yellow text-white' : 'bg-gray-200 text-black'
        ]"
      >
        {{ year }}년
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRoute } from "vue-router"
import Header from "@/components/layouts/Header.vue"
import TransactionGraph from "@/components/TransactionGraph.vue"
import { onMounted, ref, watch } from "vue"
import { useTransactionStore } from "@/stores/useTransactionStore"

const route = useRoute()
const store = useTransactionStore()

// 동적으로 아파트 이름 가져오기
const aptName = ref<string>(route.params.aptName as string || "아파트")

const selectedType = ref("전체")
const selectedYear = ref(1)

const setType = (type: string) => {
  selectedType.value = type
  store.fetchGraphData(aptName.value, type, selectedYear.value)
}

const setYear = (year: number) => {
  selectedYear.value = year
  store.fetchGraphData(aptName.value, selectedType.value, year)
}

onMounted(() => {
  store.fetchGraphData(aptName.value, selectedType.value, selectedYear.value)
})

watch(() => route.params.aptName, (newName) => {
  aptName.value = newName as string
  store.fetchGraphData(aptName.value, selectedType.value, selectedYear.value)
})

const graphData = store.graphData
</script>
