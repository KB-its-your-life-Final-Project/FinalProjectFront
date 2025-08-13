<script setup lang="ts">
/*
  현재는 TransactionRequestDTO 로 모든걸 받아오고 있는데 이 페이지는 아래 로직처럼 작동해야함

  1. TransactionRequestDTO 로 값을 보내서 해당하는 esate 와 esateSales 가 존재하는지 확인
  2-1. 확인되면 그 값은 esatetDTO 와 estateSalesDTO 값으로 반환
  2-2. 만약 확인되지 않으면 네이버를 통해 지도 정보를 반환

  3. 2번에서 가져온 정보들 기반으로 상황에 맞춰 데이터표기

  사유: TransactionRequestDTO 로 받아오면 추후 해당 건물에 대한 추가 정보 요청이 있을시 작업이 매우 번거로워짐
  만약 이 외의 추가적인 정보가 더 필요하다면 위 작업 이후 한번 더 쿼리를 날리는게 맞음
*/
import { useRoute, useRouter } from "vue-router";
import Header from "@/components/layout/header/Header.vue";
import TransactionGraph from "@/pages/transaction/TransactionGraph.vue";
import { ref, watch, computed } from "vue";
import { Api } from "@/api/autoLoad/Api";
import { mainRouteName } from "@/router/mainRoute.ts";
import DatePicker from "@/components/common/DatePicker.vue";
import WishButton from "@/components/common/WishButton.vue";
import RadioListButton from "@/components/common/RadioListButton.vue";
import { TransactionRequestDTO } from "@/api/autoLoad/data-contracts";
import queryUtil from "@/utils/queryUtils";
import { transactionPeriodOptions } from "@/types/tansactionType";
import { estateTradeOptions } from "@/types/estateType";
import { classifyRentType, GraphItemInput, GraphItemOutput } from "@/utils/transactionUtils";
import estateUtils from "@/utils/estateUtils";
import { EstateDTO } from "@/api/autoLoad/data-contracts";

const route = useRoute();
const router = useRouter();
const api = new Api();

// 모든 쿼리 데이터를 computed로 관리 (Single Source of Truth)
const queryData = computed(() => ({
  jibunAddress: queryUtil.getQueryString(route.query.jibunAddress) || "",
  roadAddress: queryUtil.getQueryString(route.query.roadAddress) || "",
  type: (route.query.type as string) || "전체",
  startDate: route.query.startDate ? new Date(route.query.startDate as string) : null,
  endDate: route.query.endDate ? new Date(route.query.endDate as string) : null,
}));

const estateDTO = ref<EstateDTO>();

// 좌표 정보
const latlng = computed<{ lat: number; lng: number }>(() => {
  const lat = Number(queryUtil.getQueryString(route.query.lat));
  const lng = Number(queryUtil.getQueryString(route.query.lng));

  return {
    lat: isNaN(lat) ? 0 : lat,
    lng: isNaN(lng) ? 0 : lng,
  };
});

// UI 전용 상태들
const buildingName = ref<string | undefined>(route.query.aptName as string);
const selectedPeriod = ref("12"); // UI에서만 사용하는 기간 선택 상태
const graphData = ref<GraphItemOutput[]>([]);

// computed로 관리되는 상태들을 v-model에서 사용할 수 있도록 writable computed 생성
const selectedType = computed({
  get: () => queryData.value.type,
  set: (value: string) => {
    updateQuery({ type: value !== "전체" ? value : undefined });
  },
});

const startDate = computed({
  get: () => queryData.value.startDate,
  set: (value: Date | null) => {
    selectedPeriod.value = "0"; // 날짜 직접 변경시 기간 리셋
    updateQuery({
      startDate: value ? formatDateLocal(value) : undefined,
    });
  },
});

const endDate = computed({
  get: () => queryData.value.endDate,
  set: (value: Date | null) => {
    selectedPeriod.value = "0"; // 날짜 직접 변경시 기간 리셋
    updateQuery({
      endDate: value ? formatDateLocal(value) : undefined,
    });
  },
});

const formatDateLocal = (date: Date): string => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

const getTradeTypeCode = (label: string | null): number | null => {
  if (label === "매매") return 1;
  if (label === "전세" || label === "월세") return 2;
  return null;
};

// 쿼리 업데이트 헬퍼 함수
const updateQuery = (updates: Record<string, any>) => {
  router
    .replace({
      query: {
        ...route.query,
        ...updates,
      },
    })
    .catch(() => {});
};

// API 호출 함수
const filteredData = async () => {
  const data = queryData.value;

  if (
    !data.jibunAddress &&
    !data.roadAddress &&
    (latlng.value.lat === 0 || latlng.value.lng === 0)
  ) {
    console.error("쿼리 데이터가 불완전합니다:", data);
    return;
  }

  const request: TransactionRequestDTO = {
    jibunAddress: data.jibunAddress || undefined,
    lat: latlng.value.lat || undefined,
    lng: latlng.value.lng || undefined,
    buildingName: buildingName.value,
    tradeType: getTradeTypeCode(data.type) || undefined,
    startDate: data.startDate ? formatDateLocal(data.startDate) : undefined,
    endDate: data.endDate ? formatDateLocal(data.endDate) : undefined,
  };

  // console.log("API 요청 데이터:", request);

  try {
    const res = await api.getFilteredDataUsingPost(request);
    // console.log("응답 데이터:", res);

    if (res.data && res.data.length > 0) {
      buildingName.value = res.data[0].buildingName;

      const inputData = res.data.map((item) => ({
        ...item,
        date: item.date ?? "",
        deposit: item.deposit ?? 0,
        monthlyRent: item.monthlyRent ?? 0,
        type: item.type,
      })) as GraphItemInput[];

      const filtered = classifyRentType(inputData, data.type as "전체" | "매매" | "전세" | "월세");

      graphData.value = filtered;
    } else {
      graphData.value = [];
    }
  } catch (error) {
    console.error("데이터 요청 실패:", error);
    graphData.value = [];
  }

  // 건물 정보
  // 나중에 빼든 다른곳에 써먹든 해야함 순서 뒤에 위치하여 강제로 buildingName 변경중
  try {
    const estateData = await api.getEstateByElementUsingGet({
      latitude: latlng.value.lat,
      longitude: latlng.value.lng,
    });
    if (estateData.data?.data && estateData.data.success) {
      estateDTO.value = estateData.data.data[0];
    }

    if (estateDTO.value?.buildingName) {
      buildingName.value = estateUtils.formatBuildingName(estateDTO.value) || undefined;
    }
  } catch (error) {
    console.error("부동산 정보 조회 실패:", error);
  }
};

// 단일 watcher - queryData 변경시에만 API 호출
watch(
  queryData,
  async () => {
    await filteredData();
  },
  { immediate: true, deep: true },
);

// UI 이벤트 핸들러
const changeType = (val: string) => {
  selectedType.value = val;
};

const changePeriod = (val: string) => {
  const numVal = val;
  if (isNaN(Number(numVal))) {
    selectedPeriod.value = "0";
    return;
  }

  selectedPeriod.value = numVal;

  if (numVal !== "0") {
    const now = new Date();
    const past = new Date();
    past.setMonth(now.getMonth() - Number(numVal));

    // 한번에 두 날짜를 모두 업데이트
    updateQuery({
      startDate: formatDateLocal(past),
      endDate: formatDateLocal(now),
    });
  }
};

const handleDateChange = () => {
  selectedPeriod.value = "0";
};
</script>

<template>
  <div class="pb-24">
    <!-- 동적 헤더: 아파트명 -->
    <Header :headerShowtype="mainRouteName.transactionDetail">
      <div class="relatvie h-25 flex flex-col justify-center p-2">
        <div class="flex justify-center text-2xl text-bold">
          {{ buildingName ? buildingName : queryData.jibunAddress }}
        </div>
      </div>
    </Header>

    <div class="relative w-[85%] mx-auto mt-4">
      <div class="absolute right-0 w-7 h-7">
        <WishButton
          target-type="building"
          :jibun-addr="queryData.jibunAddress"
          :building-name="buildingName"
        />
      </div>

      <p class="text-base mb-1 text-kb-ui-04">거래 형식</p>

      <!-- 필터: 매매/전월세 -->
      <RadioListButton
        class="mt-4"
        v-model="selectedType"
        :options="estateTradeOptions"
        @change="changeType"
      />
    </div>

    <!-- 날짜 범위 필터 -->
    <div class="w-[85%] mx-auto gap-2 mt-6">
      <h1 class="text-base mb-1 text-kb-ui-04">기간 설정</h1>

      <!-- 기간 설정 필터 -->
      <RadioListButton
        v-model="selectedPeriod"
        :options="transactionPeriodOptions"
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
    <TransactionGraph :graphData="graphData" :selectedType="queryData.type" />
  </div>
</template>
