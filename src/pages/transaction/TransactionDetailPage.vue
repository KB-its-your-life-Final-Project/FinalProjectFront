<template>
  <div class="pb-24">
    <!-- 동적 헤더: 아파트명 -->
    <Header :headerShowtype="mainRouteName.transactionDetail" :title="selectedAptName">
      <div class="pl-3 pr-8 pt-8 pb-8"></div>
    </Header>

    <div class="w-[85%] mx-auto mt-4">
      <div class="absolute top-27 right-3">
        <font-awesome-icon
          :icon="isFavorite ? ['fas', 'star'] : ['far', 'star']"
          :class="isFavorite ? 'text-kb-yellow' : 'text-kb-ui-05'"
          class="text-xl cursor-pointer"
          @click="toggleFavorite"
        />
      </div>

      <p class="text-base mb-1 text-kb-ui-04">거래 형식</p>

      <!-- 필터: 매매/전월세 -->

      <div class="grid grid-cols-3">
        <button
          v-for="type in ['전체', '매매', '전월세']"
          :key="type"
          :class="[
            'text-sm py-2 border text-center rounded-none',
            'w-full h-[30px] rounded-none',
            selectedType === type
              ? 'bg-kb-yellow text-white border border-kb-yellow'
              : 'bg-white text-kb-ui-03 border-kb-ui-05',
          ]"
          @click="setType(type)"
        >
          {{ type }}
        </button>
      </div>
    </div>

    <!-- 날짜 범위 필터 -->
    <div class="w-[85%] mx-auto gap-2 mt-6">
      <h1 class="text-base mb-1 text-kb-ui-04">기간 설정</h1>

      <!-- 기간 설정 필터 -->
      <div class="grid grid-cols-4 mb-2">
        <button
          v-for="year in ['전체', 1, 3, 5]"
          :key="year"
          @click="setYear(year)"
          :class="[
            'text-sm py-2 border text-center rounded-none w-full h-[30px]',
            selectedYear === year
              ? 'bg-kb-yellow text-white border-kb-yellow'
              : 'bg-white text-kb-ui-03 border-kb-ui-05',
          ]"
        >
          {{ typeof year === "number" ? `${year}년` : year }}
        </button>
      </div>

      <div class="flex items-center justify-center gap-[16px] mt-5">
        <DatePicker
          label="시작일"
          v-model="startDate"
          :input-class="'text-sm py-2 px-2 border border-gray-400 text-center rounded-none h-[30px] w-[150px]'"
          @update:modelValue="handleDateChange"
        />

        <div class="flex text-sm justify-center mx-[8px]">~</div>

        <DatePicker
          label="종료일"
          v-model="endDate"
          :input-class="'text-sm py-2 px-2 border border-gray-400 text-center rounded-none h-[30px] w-[150px]'"
          @update:modelValue="handleDateChange"
        />
      </div>
    </div>

    <!-- 그래프 -->

    <TransactionGraph :graphData="graphData" :selectedType="selectedType" />
  </div>
</template>

<script setup lang="ts">
import { useRoute } from "vue-router";
import Header from "@/components/layout/header/Header.vue";
import TransactionGraph from "@/pages/transaction/TransactionGraph.vue";
import { onMounted, ref, watch } from "vue";
import axios from "axios";
import { mainRouteName } from "@/router/mainRoute.ts";

import DatePicker from "@/components/common/DatePicker.vue";

const route = useRoute();
const selectedAptName = ref<string>((route.params.aptName as string) || "");

const selectedType = ref("전체");
const selectedYear = ref<number | "전체">(1);

//날짜의 기본값- 아무것도 없는 값
const startDate = ref<Date | null>(null);
const endDate = ref<Date | null>(null);
const graphData = ref<{ date: string; price: number; type: string }[]>([]);

const isFavorite = ref(false);

const toggleFavorite = () => {
  isFavorite.value = !isFavorite.value;

  if (isFavorite.value) {
    // 찜 추가해주세요
  } else {
    // 찜 해제
  }
};

//전체 거래 데이터 및 그래프들 데이터

//const allData = ref<{ date: string; price: number; type: string; buildingName: string }[]>([]);

//날짜 달력
const formatDateLocal = (date: Date): string => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

const getTradeTypeCode = (label: string | null): number | null => {
  console.log("getTradeTypeCode 호출:", label);
  if (label === "매매") return 1;
  if (label === "전월세") return 2;
  return null; // "전체" 혹은 그 외
};

const filteredData = async (aptName: string) => {
  console.log("실제 axios 요청 발생!", selectedAptName.value, startDate.value, endDate.value);

  const body = {
    buildingName: selectedAptName.value,
    tradeType: getTradeTypeCode(selectedType.value),
    startDate: startDate.value ? formatDateLocal(startDate.value) : null,
    endDate: endDate.value ? formatDateLocal(endDate.value) : null,
  };

  try {
    const res = await axios.post("/api/transactions/detail", body);
    console.log("백엔드 응답 받음:", res.data);
    graphData.value = res.data;
  } catch (error) {
    console.error("데이터 가져오기 실패", error);
  }
};

//연도 버튼 클릭으로 필터링 기능
const setYear = (year) => {
  selectedYear.value = year;

  if (year === "전체") {
    startDate.value = null;
    endDate.value = null;
  } else {
    const now = new Date();
    const past = new Date();
    past.setFullYear(now.getFullYear() - Number(year));

    startDate.value = past;
    endDate.value = now;
  }
  filteredData(selectedAptName.value);
  //filteredData();
};

const setType = (type: string) => {
  console.log("거래 형식 선택됨:", type);
  selectedType.value = type;
  filteredData(selectedAptName.value);
};
//수동으로 버튼 누르면... 해제
const handleDateChange = () => {
  selectedYear.value = "전체";
  //startDate.value = null
  // endDate.value = null
  filteredData(selectedAptName.value);
};

//url은 변경되어있지만, 컴포넌트는 남아있는 경우를 방지
watch(
  () => route.params.aptName,
  (newName) => {
    if (newName) {
      selectedAptName.value = newName as string;
      filteredData(newName as string);
    }
  },
);

onMounted(() => {
  const aptName = route.params.aptName as string;
  if (aptName) {
    selectedAptName.value = aptName;
    filteredData(aptName);
  }
});
</script>
