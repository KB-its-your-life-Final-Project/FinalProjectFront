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
          @click="setYear(year as number | '전체')"
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
import { useRoute, useRouter } from "vue-router";
import Header from "@/components/layout/header/Header.vue";
import TransactionGraph from "@/pages/transaction/TransactionGraph.vue";
import { onMounted, ref, watch } from "vue";
import axios from "axios";
import { mainRouteName } from "@/router/mainRoute.ts";

import DatePicker from "@/components/common/DatePicker.vue";
import type { MarkerDataType } from "@/types/marker";

// Props 정의
interface Props {
  marker?: MarkerDataType;
}

const props = withDefaults(defineProps<Props>(), {
  marker: undefined,
});

const route = useRoute();
const router = useRouter();

const selectedAptName = ref<string>((route.query.aptName as string) || "");

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

//const allData = ref<{ date: string; price: number; type: string; buildingName: string }[]>([])

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

  // 임시 테스트 데이터 사용
  const allTestData = [
    { date: "2024-01", price: 50000, type: "매매" },
    { date: "2024-02", price: 52000, type: "매매" },
    { date: "2024-03", price: 48000, type: "전월세" },
    { date: "2024-04", price: 51000, type: "매매" },
    { date: "2023-11", price: 49000, type: "매매" },
    { date: "2023-12", price: 47000, type: "전월세" },
    { date: "2022-06", price: 45000, type: "매매" },
    { date: "2022-08", price: 46000, type: "전월세" },
  ];

  // 거래 형식 필터링
  let filteredData = allTestData;
  if (selectedType.value !== "전체") {
    filteredData = allTestData.filter((item) => item.type === selectedType.value);
  }

  // 날짜 범위 필터링
  if (startDate.value && endDate.value) {
    const startDateStr = formatDateLocal(startDate.value).substring(0, 7); // YYYY-MM 형식
    const endDateStr = formatDateLocal(endDate.value).substring(0, 7);

    filteredData = filteredData.filter((item) => {
      return item.date >= startDateStr && item.date <= endDateStr;
    });
  }

  console.log("필터링된 데이터:", filteredData);
  graphData.value = filteredData;

  // 실제 API 호출은 나중에 활성화
  /*
  const body = {
    jibunAddress: props.marker?.jibunAddress || "서울특별시 광명시",
    lat: props.marker?.latlng?.lat() || 37.5665,
    lng: props.marker?.latlng?.lng() || 126.978,
    buildingName: props.marker?.buildingName || aptName,
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
  */
};

//연도 버튼 클릭으로 필터링 기능
const setYear = (year: number | "전체") => {
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
  // URL 업데이트
  router.push({
    query: {
      ...route.query,
      year: year === "전체" ? undefined : year.toString(),
    },
  });

  filteredData(selectedAptName.value);
};

const setType = (type: string) => {
  console.log("거래 형식 선택됨:", type);
  selectedType.value = type;

  // URL 업데이트
  router.push({
    query: {
      ...route.query,
      type: type === "전체" ? undefined : type,
    },
  });
  filteredData(selectedAptName.value);
};
//수동으로 버튼 누르면... 해제
const handleDateChange = () => {
  selectedYear.value = "전체";
  //startDate.value = null
  // endDate.value = null

  // URL 업데이트
  router.push({
    query: {
      ...route.query,
      startDate: startDate.value ? formatDateLocal(startDate.value) : undefined,
      endDate: endDate.value ? formatDateLocal(endDate.value) : undefined,
      year: undefined, // 수동 날짜 선택 시 year 파라미터 제거
    },
  });

  filteredData(selectedAptName.value);
};

//url은 변경되어있지만, 컴포넌트는 남아있는 경우를 방지
watch(
  () => route.query,
  (newQuery) => {
    if (newQuery.type !== undefined) {
      selectedType.value = newQuery.type as string;
    }
    if (newQuery.year !== undefined) {
      selectedYear.value = Number(newQuery.year);
    }
    // 날짜 필터도 URL에서 읽어올 수 있음
    if (newQuery.startDate) {
      startDate.value = new Date(newQuery.startDate as string);
    }
    if (newQuery.endDate) {
      endDate.value = new Date(newQuery.endDate as string);
    }
  },
  { deep: true },
);

onMounted(() => {
  const aptName = route.query.aptName as string;
  if (aptName) {
    selectedAptName.value = aptName;
    filteredData(aptName);
  }
});
</script>
