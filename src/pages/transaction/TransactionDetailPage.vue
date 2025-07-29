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

const isFavorite = ref(false);

const toggleFavorite = () => {
  isFavorite.value = !isFavorite.value;

  if (isFavorite.value) {
    // 찜 추가해주세요
  } else {
    // 찜 해제
  }
};
const route = useRoute();
const selectedAptName = ref<string>((route.params.aptName as string) || "");

const selectedType = ref("전체");
const selectedYear = ref(1);

//날짜의 기본값- 아무것도 없는 값
const startDate = ref<string | null>(null);
const endDate = ref<string | null>(null);

// 오늘 날찌를 기본값으로 하고 싶다면?
/*
const today = new Date()
const formatDate = (date: Date) => date.toISOString().slice(0, 10)
const startDate = ref<string>(formatDate(today))
const endDate = ref<string>(formatDate(today))
*/

//전체 거래 데이터 및 그래프들 데이터

const graphData = ref<{ date: string; price: number; type: string }[]>([]);
const allData = ref<{ date: string; price: number; type: string; buildingName: string }[]>([]);

//수동으로 버튼 누르면... 해제
const handleDateChange = () => {
  selectedYear.value = "전체";
  filterByDate();
};
const fetchTransactionData = async () => {
  try {
    const res = await axios.get("/api/transactions"); // 전체 데이터 가져오기
    const rawData = res.data.map((item: any) => {
      const date = `${item.dealYear}-${String(item.dealMonth).padStart(2, "0")}-${String(item.dealDay).padStart(2, "0")}`;
      const type = item.tradeType === 1 ? "매매" : "전월세";
      const price =
        type === "매매" ? item.dealAmount / 10000 : item.deposit != null ? item.deposit / 10000 : 0;

      return { date, price, type, buildingName: item.buildingName };
    });
    allData.value = selectedAptName.value
      ? rawData.filter((item) => item.buildingName === selectedAptName.value)
      : rawData;

    filterByDate();
    console.log(res.data);
  } catch (error) {
    console.error("데이터 가져오기 실패", error);
  }
};

// 연도 및 유형 필터 적용
const filterByDate = () => {
  let filtered = [...allData.value];

  if (startDate.value && endDate.value) {
    const start = new Date(startDate.value);
    const end = new Date(endDate.value);
    end.setHours(23, 59, 59, 999);

    filtered = filtered.filter(item => {
      const itemDate = new Date(item.date);
      return itemDate >= start && itemDate <= end;
    });
  }

  if (selectedType.value !== "전체") {
    filtered = filtered.filter((item) => item.type === selectedType.value);
  }
  graphData.value = filtered.sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime(),
  );
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

    // 년-월-일 형식으로 만들어줌
    startDate.value = past.toISOString().slice(0, 10);
    endDate.value = now.toISOString().slice(0, 10);
  }
  filterByDate();
};

const setType = (type: string) => {
  selectedType.value = type;
  filterByDate();
};

//url은 변경되어있지만, 컴포넌트는 남아있는 경우를 방지
watch(
  () => route.params.aptName,
  (newName) => {
    selectedAptName.value = newName as string;
    fetchTransactionData();
  },
);

onMounted(() => {
  fetchTransactionData();
});
</script>
