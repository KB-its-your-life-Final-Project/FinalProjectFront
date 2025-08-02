<script setup lang="ts">
import { ref, onMounted, watch, computed } from "vue";
import type { InfoCardType } from "@/pages/localInfo/_component/InfoCard.ts";

const props = defineProps<{
  info: InfoCardType;
  regionCd?: string; // 지역 코드 추가
}>();

const dynamicData = ref<string>("");
const loading = ref(false);
const error = ref("");

// 동적 데이터 가져오기
const fetchDynamicData = async (regionCd: string) => {
  if (!props.info.apiCall) return; // API 호출 함수가 없으면 실행 안함

  console.log("동적 데이터 가져오기:", regionCd, "카드 제목:", props.info.title);

  loading.value = true;
  error.value = "";

  try {
    const result = await props.info.apiCall(regionCd);
    dynamicData.value = result;
    console.log("동적 데이터 설정됨:", dynamicData.value);
  } catch (err: unknown) {
    console.error("동적 데이터 조회 실패:", err);
    error.value = "데이터를 불러올 수 없습니다.";
    dynamicData.value = "--";
  } finally {
    loading.value = false;
  }
};

// 지역 코드가 변경될 때마다 동적 데이터 다시 가져오기
watch(
  () => props.regionCd,
  (newRegionCd) => {
    console.log("regionCd 변경 감지:", newRegionCd, "카드 제목:", props.info.title);
    if (newRegionCd && props.info.apiCall) {
      fetchDynamicData(newRegionCd);
    }
  },
);

// 컴포넌트 마운트 시 초기 데이터 로드
onMounted(() => {
  console.log("InfoCard 마운트됨:", props.regionCd, "카드 제목:", props.info.title);
  if (props.regionCd && props.info.apiCall) {
    fetchDynamicData(props.regionCd);
  }
});

// 표시할 값 계산
const displayValue = computed(() => {
  if (props.info.apiCall) {
    // API 호출이 있는 카드의 경우 동적 데이터 우선
    if (loading.value) {
      return "로딩중...";
    }
    if (dynamicData.value) {
      return dynamicData.value;
    }
    // 동적 데이터가 없으면 정적 데이터 사용
    return props.info.value;
  }
  // API 호출이 없는 카드들은 정적 데이터 사용
  return props.info.value;
});
</script>

<template>
  <div
    class="flex flex-col bg-kb-ui-11 rounded-xl border-1 border-blue-200 shadow-md p-4 gap-5 min-h-[10.625rem]"
  >
    <!-- 상단: 타이틀 & 아이콘 -->
    <div class="flex items-center justify-between px-4 mt-4">
      <div class="font-pretendard-bold text-3xl text-kb-ui-01">{{ info.title }}</div>
      <div
        :class="`rounded-xl w-10 h-10 flex items-center justify-center ${info.bgColor} shadow-md`"
      >
        <font-awesome-icon :icon="info.icon" class="text-[20px] text-white" />
      </div>
    </div>
    <!-- 본문: 값/설명 -->
    <div class="flex items-center justify-between flex-col gap-10">
      <div class="font-pretendard-bold text-3xl text-kb-ui-02">
        {{ displayValue }}
      </div>
      <div class="w-full bg-kb-ui-08 rounded-xl border-2 border-kb-ui-08 text-center text-kb-ui-04">
        {{ info.description }}
      </div>
    </div>
  </div>
</template>
