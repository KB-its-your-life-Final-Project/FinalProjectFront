<template>
  <div class="pb-24">
    <!-- 동적 헤더: 아파트명 -->
    <Header :headerShowtype="mainRouteName.transactionDetail" >
      <div class="absolute left-1/2 transform -translate-x-1/2">
        <h2 class="text-lg font-bold text-gray-800">{{ selectedAptName }}</h2>
      </div>
    </Header>
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
import axios from "axios"
import {mainRouteName} from "@/router/mainRoute.ts";


const route = useRoute()
const selectedAptName = ref<string>(route.params.aptName as string || "")

const selectedType = ref("전체")
const selectedYear = ref(1)
/*const graphData = ref(dummyData)*/
const graphData = ref<{ date: string; price: number; type: string }[]>([])
const allData = ref<{ date: string; price: number; type: string, buildingName:string}[]>([])

const fetchTransactionData = async () => {
  try {
    const res = await axios.get('/api/transactions') // 전체 데이터 가져오기
    const rawData = res.data.map((item:any) => {
      const date = `${item.dealYear}-${String(item.dealMonth).padStart(2, '0')}`
      const type = item.tradeType === 1 ? "매매" : "전월세"
      const price = type === "매매"
        ? item.dealAmount / 10000
        : item.deposit != null ? item.deposit / 10000 : 0

      return { date, price, type,
        buildingName: item.buildingName }
    })
    allData.value = selectedAptName.value
      ? rawData.filter(item => item.buildingName === selectedAptName.value)
      : rawData

    filterByYear()
    console.log(res.data)
  } catch (error) {
    console.error("데이터 가져오기 실패", error)
  }
}


/*

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

*/

// 연도 및 유형 필터 적용
const filterByYear = () => {
  let filtered = [...allData.value]

  // 연도 필터
  if (selectedYear.value !== '전체') {
    const now = new Date()
    const start = new Date()
    start.setFullYear(now.getFullYear() - Number(selectedYear.value))

    filtered = filtered.filter(item => {
      const date = new Date(item.date + "-01") // "2023-05" -> "2023-05-01"
      return date >= start && date <= now
    })
  }

  // 유형 필터
  if (selectedType.value !== "전체") {
    filtered = filtered.filter(item => item.type === selectedType.value)
  }

  graphData.value = filtered
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

// 초기 마운트 시 전체 데이터 불러오기
onMounted(() => {
  fetchTransactionData()
})
</script>
