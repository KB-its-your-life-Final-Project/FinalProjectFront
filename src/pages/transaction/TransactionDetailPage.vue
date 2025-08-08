<template>
  <div class="pb-24">
    <!-- 동적 헤더: 건물 명이 없다면 주소 표기 -->
    <Header :headerShowtype="mainRouteName.transactionDetail" :title="buildingName || jibunAddress">
      <div class="pl-3 pr-8 pt-8 pb-8"></div>
    </Header>

    <div class="relative w-[85%] mx-auto mt-4">
      <div class="absolute right-0 w-7 h-7">
        <WishButton target-type="building" :jibun-addr="jibunAddress" :estate-id="estateId" />
      </div>

      <p class="text-base mb-1 text-kb-ui-04">거래 형식</p>

      <!-- 필터: 매매/전월세 -->
      <RadioListButton
        class="mt-4"
        v-model="selectedType"
        :options="typeOptions"
        @change="changeType"
      />
    </div>

    <!-- 날짜 범위 필터 -->
    <div class="w-[85%] mx-auto gap-2 mt-6">
      <h1 class="text-base mb-1 text-kb-ui-04">기간 설정</h1>

      <!-- 기간 설정 필터 -->
      <RadioListButton
        class="mt-4"
        v-model="selectedPeriod"
        :options="periodOptions"
        @change="changePeriod"
      />

      <div class="flex items-center justify-center gap-[16px] mt-5">
        <DatePicker
          placeholder="시작일"
          v-model="startDate"
          :input-class="'text-sm py-2 px-2 border border-gray-400 text-center rounded-none h-[30px] w-[150px]'"
          @update:modelValue="handleDateChange"
        />

        <div class="flex text-sm justify-center mx-[8px]">~</div>

        <DatePicker
          placeholder="종료일"
          v-model="endDate"
          :input-class="'text-sm py-2 px-2 border border-gray-400 text-center rounded-none h-[30px] w-[150px]'"
          @update:modelValue="handleDateChange"
        />
      </div>
    </div>

    <!-- 그래프 -->

    <TransactionGraph
      v-if="graphData.length > 0"
      :graphData="graphData"
      :selectedType="selectedType"
    />
    <div v-else>
      <NoData></NoData>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRoute, useRouter, LocationQueryValueRaw } from "vue-router";
import Header from "@/components/layout/header/Header.vue";
import TransactionGraph from "@/pages/transaction/TransactionGraph.vue";
import { watchEffect, ref, watch, computed } from "vue";
import { Api } from "@/api/autoLoad/Api";
import { mainRouteName } from "@/router/mainRoute.ts";
import DatePicker from "@/components/common/DatePicker.vue";
import WishButton from "@/components/common/WishButton.vue";
import RadioListButton from "@/components/common/RadioListButton.vue";
import { TransactionRequestDTO } from "@/api/autoLoad/data-contracts";
import NoData from "./_component/NoData.vue";
//import mapUtil from "@/utils/naverMap/naverMap";

const route = useRoute();
const router = useRouter();

const jibunAddress = computed(() => {
  const addr = getQueryString(route.query.jibunAddress);
  console.log("jibunAddress computed:", addr); // 디버깅용
  return addr || "";
});

const buildingName = ref("");
const estateId = ref<number | undefined>();

const latlng = computed<{ lat: number; lng: number }>(() => {
  const lat = Number(getQueryString(route.query.lat));
  const lng = Number(getQueryString(route.query.lng));

  // NaN 방지: 좌표 값이 없으면 0 반환
  return {
    lat: isNaN(lat) ? 0 : lat,
    lng: isNaN(lng) ? 0 : lng,
  };
});

const input = computed(() => ({
  jibunAddress: jibunAddress.value,
  roadAddress: getQueryString(route.query.roadAddress) || "",
  lat: latlng.value.lat,
  lng: latlng.value.lng,
}));

const api = new Api();

const selectedType = ref("전체");
const selectedPeriod = ref("1");

//날짜의 기본값- 아무것도 없는 값
const now = new Date();
const startDate = ref<Date | null>(new Date(now.getFullYear() - 1, now.getMonth(), now.getDate()));
const endDate = ref<Date | null>(new Date());
const graphData = ref<{ date: string; price: number; type: string }[]>([]);

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

// API 호출
const filteredData = async (markerData: {
  jibunAddress?: string;
  roadAddress?: string;
  lat?: number;
  lng?: number;
}) => {
  if (
    !markerData.jibunAddress &&
    !markerData.roadAddress &&
    (markerData.lat === undefined || markerData.lng === undefined)
  ) {
    console.error("markerData가 불완전합니다:", markerData);
    return;
  }

  const request: TransactionRequestDTO = {
    jibunAddress: markerData.jibunAddress ?? undefined,
    lat: markerData.lat ?? undefined,
    lng: markerData.lng ?? undefined,
    tradeType: getTradeTypeCode(selectedType.value) || undefined,
    startDate: startDate.value ? formatDateLocal(startDate.value) : undefined,
    endDate: endDate.value ? formatDateLocal(endDate.value) : undefined,
  };

  console.log("API 요청 데이터:", request);

  try {
    const res = await api.getFilteredDataUsingPost(request);
    console.log("응답 데이터:", res);
    buildingName.value = res.data[0].buildingName || "";
    graphData.value = res.data as { date: string; price: number; type: string }[];
  } catch (error) {
    console.error("데이터 요청 실패:", error);
    graphData.value = [];
  }
};

const periodOptions = [
  { label: "전체", value: "전체" },
  { label: "1년", value: "1" },
  { label: "3년", value: "3" },
  { label: "5년", value: "5" },
];

//연도 버튼 클릭으로 필터링 기능
const changePeriod = () => {
  console.log("변경된 기간: ", selectedPeriod.value);
  if (selectedPeriod.value === "전체") {
    startDate.value = null;
    endDate.value = null;
  } else {
    const now = new Date();
    const past = new Date();
    past.setFullYear(now.getFullYear() - Number(selectedPeriod.value));

    // 날짜 입력란 자동 설정
    startDate.value = past;
    endDate.value = now;
  }

  updateURLQuery();
  filteredData(input.value);
};

const typeOptions = [
  { label: "전체", value: "전체" },
  { label: "매매", value: "매매" },
  { label: "전월세", value: "전월세" },
];

const changeType = () => {
  console.log("거래 형식 선택됨:", selectedType.value);
  updateURLQuery();
  filteredData(input.value);
};
//수동으로 버튼 누르면... 해제
const handleDateChange = () => {
  selectedPeriod.value = "전체";
  //startDate.value = null
  // endDate.value = null
  updateURLQuery();
  filteredData(input.value);
};
// URL Query 업데이트
const updateURLQuery = () => {
  router.push({
    query: {
      jibunAddress: input.value.jibunAddress || "",
      startDate: startDate.value ? formatDateLocal(startDate.value) : undefined,
      endDate: endDate.value ? formatDateLocal(endDate.value) : undefined,
    },
  });
};

//url은 변경되어있지만, 컴포넌트는 남아있는 경우를 방지
watch(
  () => route.query,
  (newQuery) => {
    if (newQuery.type !== undefined) {
      selectedType.value = newQuery.type as string;
    }
    if (newQuery.year !== undefined) {
      selectedPeriod.value = String(newQuery.year);
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

watchEffect(() => {
  if (jibunAddress.value || input.value.roadAddress) {
    filteredData({
      jibunAddress: jibunAddress.value,
      roadAddress: input.value.roadAddress,
      lat: latlng.value.lat,
      lng: latlng.value.lng,
    });
  }
});

function getQueryString(
  queryValue: LocationQueryValueRaw | LocationQueryValueRaw[] | undefined,
): string | undefined {
  if (!queryValue) return undefined;
  if (Array.isArray(queryValue)) return queryValue[0]?.toString();
  return queryValue.toString();
}
</script>
