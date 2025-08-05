<script setup lang="ts">
import { ref, watch, computed } from "vue";
import { Api } from "@/api/autoLoad/Api";

const api = new Api();

// Props 정의
interface Props {
  region?: string;
  regionCd?: string;
  weatherData?: Weather | null;
}

const props = withDefaults(defineProps<Props>(), {
  region: "서울",
  regionCd: "",
  weatherData: null,
});

// Weather 엔티티 타입 정의 (백엔드 Entity와 동일)
interface Weather {
  id?: number;
  sidoCd?: string;
  sggCd?: string;
  region?: string;
  regionCd?: string;
  gridX?: number;
  gridY?: number;
  locataddNm?: string;
  skyCondition?: string;
  temperature?: number;
  maxTemperature?: number;
  minTemperature?: number;
  baseDate?: string;
  baseTime?: string;
  fcstDate?: string;
  fcstTime?: string;
  createdAt?: string;
  updatedAt?: string;
}

// 내부 날씨 데이터 상태
const internalWeatherData = ref<Weather | null>(null);
const loading = ref(false);
const error = ref("");

// 목데이터를 중앙에서 관리하여 중복 제거
const MOCK_WEATHER_DATA: Weather = {
  temperature: 22,
  maxTemperature: 25,
  minTemperature: 18,
  skyCondition: "맑음",
};

// 날씨 정보를 가져오는 핵심 함수
const fetchWeatherInfo = async (regionCd: string) => {
  loading.value = true;
  error.value = "";

  console.log("fetchWeatherInfo 호출됨, regionCd:", regionCd);

  try {
    // regionCd가 유효한지 확인
    if (!regionCd || regionCd.trim() === "") {
      throw new Error("유효하지 않은 regionCd입니다.");
    }

    console.log("API 호출 시작:", regionCd);
    const response = await api.getWeatherByRegionCdUsingGet({ regionCd: regionCd }, {});
    console.log("API 응답:", response);

    const data = response.data?.data;
    if (data && data.temperature != null) {
      internalWeatherData.value = data;
      console.log("날씨 데이터 설정됨:", data);
    } else {
      error.value = "날씨 정보가 없습니다.";
      internalWeatherData.value = MOCK_WEATHER_DATA;
      console.log("날씨 데이터 없음, 목데이터 사용");
    }
  } catch (err: unknown) {
    console.error("날씨 정보 조회 실패:", err);
    console.error("에러 타입:", typeof err);
    console.error("에러 상세:", err);

    if (err instanceof Error) {
      error.value = `날씨 정보를 불러올 수 없습니다: ${err.message}`;
    } else {
      error.value = "날씨 정보를 불러올 수 없습니다.";
    }

    internalWeatherData.value = MOCK_WEATHER_DATA;
  } finally {
    loading.value = false;
  }
};

// Props 변경을 감지하여 데이터를 업데이트하는 단일 Watcher
watch(
  () => [props.weatherData, props.regionCd],
  ([newWeatherData, newRegionCd]: [Weather | null, string]) => {
    if (newWeatherData) {
      internalWeatherData.value = newWeatherData;
      error.value = "";
    } else if (newRegionCd) {
      fetchWeatherInfo(newRegionCd);
    }
  },
  { immediate: true },
);

// 날씨 아이콘 computed 속성
const weatherIcon = computed(() => {
  const sky = internalWeatherData.value?.skyCondition;
  if (!sky) return "--";
  switch (sky) {
    case "맑음":
      return "☀️";
    case "구름많음":
      return "⛅";
    case "흐림":
      return "☁️";
    default:
      return "--";
  }
});

// 온도 정보 computed 속성들
const temperature = computed(() => internalWeatherData.value?.temperature?.toString() || "--");
const maxTemperature = computed(
  () => internalWeatherData.value?.maxTemperature?.toString() || "--",
);
const minTemperature = computed(
  () => internalWeatherData.value?.minTemperature?.toString() || "--",
);
</script>

<template>
  <div class="bg-kb-ui-11 rounded-xl border-1 border-kb-yellow shadow-md p-4 w-full">
    <div class="flex items-center justify-between mt-3">
      <!-- 온도 정보 -->
      <div class="flex flex-col items-center w-full gap-3">
        <div v-if="loading" class="font-pretendard-bold text-4xl text-kb-ui-02">로딩중...</div>
        <div v-else-if="error" class="font-pretendard-bold text-sm text-red-500">
          {{ error }}
        </div>
        <div
          v-else-if="temperature && temperature !== '--'"
          class="font-pretendard-bold text-4xl text-kb-ui-02"
        >
          {{ temperature }}°
        </div>
        <div class="flex items-center gap-2">
          <div class="font-pretendard-medium text-kb-ui-02">최고 {{ maxTemperature }}°</div>
          <div class="font-pretendard-medium text-kb-ui-02">최저 {{ minTemperature }}°</div>
        </div>
      </div>

      <!-- 날씨 이미지 -->
      <div class="flex flex-col items-center w-full gap-3">
        <div class="text-5xl">{{ weatherIcon }}</div>
        <div class="text-xs text-kb-ui-05">출처 : 기상청</div>
      </div>
    </div>
  </div>
</template>
