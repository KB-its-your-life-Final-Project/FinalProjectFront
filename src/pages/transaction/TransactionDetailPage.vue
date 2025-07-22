<template>
  <div class="pb-24">
    <!-- 동적 헤더: 아파트명 -->
    <Header :headerShowtype="mainRouteName.transactionDetail" />
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
<!--
    <TransactionGraph :graphData="graphData" />
-->
    <TransactionGraph :graphData="graphData" :selectedType="selectedType" />

    <!-- 연도 필터 -->
    <div class="flex space-x-3 justify-center mt-4">
      <button
        v-for="year in ['전체',1, 3, 5]"
        :key="year"
        @click="setYear(year)"
        :class="[
          'px-4 py-1 rounded-full',
          selectedYear === year ? 'bg-kb-yellow text-white' : 'bg-gray-200 text-black'
        ]"
      >
        {{ typeof year === 'number' ? `${year}년` : year }}
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRoute } from "vue-router"
import Header from "@/components/layout/header/Header.vue"
import TransactionGraph from "@/components/TransactionGraph.vue"
import { onMounted, ref, watch } from "vue"
import { useTransactionStore } from "@/stores/useTransactionStore"
import {mainRouteName} from "@/router/mainRoute.ts";
// 백엔드 작업전 임의의 더미 데이터를 설정한 것

const dummyData = [
  // ✅ 2020년 (5년 전)
  { date: "2020-03", price: 2.5, type: "매매" },
  { date: "2020-06", price: 2.8, type: "전월세" },
  { date: "2020-10", price: 2.9, type: "매매" },
  { date: "2020-12", price: 3.0, type: "전월세" },

  // ✅ 2021년 (4년 전)
  { date: "2021-02", price: 3.0, type: "매매" },
  { date: "2021-04", price: 1.3, type: "전월세" },
  { date: "2021-07", price: 3.2, type: "매매" },
  { date: "2021-09", price: 1.4, type: "전월세" },

  // ✅ 2022년 (3년 전)
  { date: "2022-01", price: 3.3, type: "매매" },
  { date: "2022-03", price: 1.5, type: "전월세" },
  { date: "2022-08", price: 3.5, type: "매매" },
  { date: "2022-11", price: 1.6, type: "전월세" },

  // ✅ 2023년 (2년 전)
  { date: "2023-01", price: 3.6, type: "매매" },
  { date: "2023-04", price: 1.7, type: "전월세" },
  { date: "2023-07", price: 3.7, type: "매매" },
  { date: "2023-10", price: 1.8, type: "전월세" },

  // ✅ 2024년 (1년 전)
  { date: "2024-01", price: 3.2, type: "매매" },
  { date: "2024-02", price: 3.1, type: "매매" },
  { date: "2024-03", price: 3.3, type: "매매" },
  { date: "2024-04", price: 3.35, type: "매매" },
  { date: "2024-05", price: 3.4, type: "매매" },
  { date: "2024-06", price: 3.55, type: "매매" },
  { date: "2024-07", price: 3.6, type: "매매" },
  { date: "2024-08", price: 3.65, type: "매매" },
  { date: "2024-09", price: 3.7, type: "매매" },
  { date: "2024-10", price: 3.75, type: "매매" },
  { date: "2024-11", price: 3.8, type: "매매" },
  { date: "2024-12", price: 3.85, type: "매매" },

  { date: "2024-01", price: 1.2, type: "전월세" },
  { date: "2024-02", price: 1.1, type: "전월세" },
  { date: "2024-03", price: 1.4, type: "전월세" },
  { date: "2024-04", price: 1.35, type: "전월세" },
  { date: "2024-05", price: 1.38, type: "전월세" },
  { date: "2024-06", price: 1.4, type: "전월세" },
  { date: "2024-07", price: 1.42, type: "전월세" },
  { date: "2024-08", price: 1.45, type: "전월세" },
  { date: "2024-09", price: 1.47, type: "전월세" },
  { date: "2024-10", price: 1.48, type: "전월세" },
  { date: "2024-11", price: 1.5, type: "전월세" },
  { date: "2024-12", price: 1.52, type: "전월세" },

  // ✅ 2025년 (올해)
  { date: "2025-01", price: 3.9, type: "매매" },
  { date: "2025-01", price: 1.55, type: "전월세" },
  { date: "2025-04", price: 1.62, type: "전월세" },
  { date: "2025-05", price: 1.65, type: "전월세" },
  { date: "2025-06", price: 4.15, type: "매매" },
  { date: "2025-07", price: 4.2, type: "매매" },

]

const selectedType = ref("전체")
const selectedYear = ref(1)
const graphData = ref(dummyData)

const filterByYear = () => {
  if (selectedYear.value === "전체") {
    graphData.value = [...dummyData]
    return
  }
  const now = new Date()
  const start = new Date()
  start.setFullYear(now.getFullYear() - Number(selectedYear.value))

  graphData.value = dummyData.filter(item => {
    const date = new Date(item.date + "-01")
    return date >= start && date <= now
  })
}


const setType = (type: string) => {
  selectedType.value = type
  filterByYear()
}

const setYear = (year: number | string) => {
  selectedYear.value = year
  filterByYear()
}


/*const route = useRoute()
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

const graphData = store.graphData*/
</script>
