<script setup lang="ts">
import { ref, onMounted, watch } from "vue";
import { Api } from "@/api/autoLoad/Api";
import type { WeatherDTO } from "@/api/autoLoad/data-contracts";

const api = new Api();

// Props 정의
interface Props {
  region?: string;
  regionCd?: string;
  weatherData?: WeatherDTO | null;
}

const props = withDefaults(defineProps<Props>(), {
  region: "서울",
  regionCd: "",
  weatherData: null,
});

// 날씨 정보 타입 정의
interface WeatherInfo {
  temperature: string;
  maxTemperature: string;
  minTemperature: string;
  skyCondition: string;
}

// 지역 정보 상태
const weatherInfo = ref<WeatherInfo | null>(null);
const loading = ref(false);
const error = ref("");

// weatherData prop이 변경될 때마다 날씨 정보 업데이트
watch(
  () => props.weatherData,
  (newWeatherData) => {
    console.log("WeatherCard에서 받은 weatherData:", newWeatherData);

    if (newWeatherData) {
      // weatherData에서 직접 정보 추출
      weatherInfo.value = {
        temperature: newWeatherData.temperature?.toString() || "--",
        maxTemperature: newWeatherData.maxTemperature?.toString() || "--",
        minTemperature: newWeatherData.minTemperature?.toString() || "--",
        skyCondition: newWeatherData.skyCondition?.toString() || "--",
      };

      console.log("WeatherCard에서 설정된 weatherInfo:", weatherInfo.value);
    }
  },
  { immediate: true },
);

// regionCd prop이 변경될 때만 API 호출 (weatherData가 없을 때)
watch(
  () => props.regionCd,
  (newRegionCd) => {
    if (newRegionCd && !props.weatherData) {
      fetchWeatherInfo(newRegionCd);
    }
  },
);

// 날씨 정보 가져오기 (fallback용)
const fetchWeatherInfo = async (regionCd: string) => {
  loading.value = true;
  error.value = "";

  try {
    // 백엔드 API를 통해 날씨 정보 조회
    const response = await api.getWeatherUsingGet({ regionCd: regionCd }, {});

    const weatherData = response.data?.data;

    if (weatherData) {
      weatherInfo.value = {
        temperature: weatherData.temperature?.toString() || "--",
        maxTemperature: weatherData.maxTemperature?.toString() || "--",
        minTemperature: weatherData.minTemperature?.toString() || "--",
        skyCondition: weatherData.skyCondition?.toString() || "--",
      };
    } else {
      // 기본값 설정
      weatherInfo.value = {
        temperature: "22",
        maxTemperature: "25",
        minTemperature: "18",
        skyCondition: "1",
      };
    }
  } catch (err: unknown) {
    console.error("날씨 정보 조회 실패:", err);
    error.value = "날씨 정보를 불러올 수 없습니다.";
    // 날씨 API 실패 시 기본값으로 설정
    weatherInfo.value = {
      temperature: "22",
      maxTemperature: "25",
      minTemperature: "18",
      skyCondition: "1",
    };
  } finally {
    loading.value = false;
  }
};

// 날씨 상태에 따른 아이콘 반환 (기상청 API 코드 기준)
const getWeatherIcon = (skyCondition: string | undefined) => {
  if (!skyCondition || skyCondition === "--") return "🌤️ --"; // 데이터가 없으면 기본 아이콘 + --

  // 기상청 API SKY 코드에 따른 아이콘 반환
  switch (skyCondition) {
    case "1":
    case "맑음":
      return "☀️ 맑음"; // 맑음
    case "3":
    case "구름많음":
      return "⛅ 구름많음"; // 구름많음
    case "4":
    case "흐림":
      return "☁️ 흐림"; // 흐림
    default:
      return "🌤️ --"; // 기본값
  }
};

// 컴포넌트 마운트 시 데이터 가져오기 (weatherData가 없을 때만)
onMounted(() => {
  if (props.regionCd && !props.weatherData) {
    fetchWeatherInfo(props.regionCd);
  }
});
</script>

<template>
  <div class="rounded-2xl border-1 border-blue-200 bg-white shadow-sm w-full">
    <div class="flex items-center justify-between mt-3">
      <!-- 온도 정보 -->
      <div class="flex flex-col items-center w-full">
        <div v-if="loading" class="font-pretendard-bold text-4xl text-gray-800">로딩중...</div>
        <div v-else-if="error" class="font-pretendard-bold text-sm text-red-500">
          {{ error }}
        </div>
        <div
          v-else-if="weatherInfo?.temperature && weatherInfo.temperature !== '--'"
          class="font-pretendard-bold text-4xl text-gray-800"
        >
          {{ weatherInfo.temperature }}°
        </div>
        <div v-else class="font-pretendard-bold text-4xl text-gray-800">--°</div>
        <div class="font-pretendard-bold text-sm text-kb-ui-04">
          최고 {{ weatherInfo?.maxTemperature || "--" }}°
        </div>
        <div class="font-pretendard-bold text-sm text-kb-ui-04">
          최저 {{ weatherInfo?.minTemperature || "--" }}°
        </div>
      </div>
      <!-- 날씨 이미지 -->
      <div class="flex flex-col items-center w-full gap-3">
        <div class="text-4xl">{{ getWeatherIcon(weatherInfo?.skyCondition) }}</div>
        <div class="text-xs text-kb-ui-05">출처 : 기상청</div>
      </div>
    </div>
  </div>
</template>
