<script setup lang="ts">
import { ref, onMounted, watch, computed } from "vue";
import type { InfoCardType } from "@/pages/localInfo/_component/InfoCard.ts";

const props = defineProps<{
  info: InfoCardType;
  regionCd?: string;
}>();

const dynamicData = ref<string>("");
const loading = ref(false);

// 동적 데이터 가져오기
const fetchDynamicData = async (regionCd: string) => {
  if (!props.info.apiCall) return;

  console.log("동적 데이터 가져오기:", regionCd, "카드 제목:", props.info.title);
  loading.value = true;

  try {
    const result = await props.info.apiCall(regionCd);
    dynamicData.value = result;
    console.log("동적 데이터 설정됨:", dynamicData.value);
  } catch (err: unknown) {
    console.error("동적 데이터 조회 실패:", err);
    dynamicData.value = "--";
  } finally {
    loading.value = false;
  }
};

// 지역 코드 변경 감지 및 초기 로드
const handleRegionChange = (newRegionCd: string | undefined) => {
  console.log("regionCd 변경 감지:", newRegionCd, "카드 제목:", props.info.title);
  if (newRegionCd && props.info.apiCall) {
    fetchDynamicData(newRegionCd);
  }
};

// 감시자 설정
watch(() => props.regionCd, handleRegionChange);

// 마운트 시 초기 데이터 로드
onMounted(() => {
  console.log("InfoCard 마운트됨:", props.regionCd, "카드 제목:", props.info.title);
  handleRegionChange(props.regionCd);
});

// 표시할 값 계산
const displayValue = computed(() => {
  if (!props.info.apiCall) return props.info.value;

  if (loading.value) return "로딩중...";
  if (dynamicData.value) return dynamicData.value;

  return props.info.value;
});
</script>

<template>
  <div class="bg-kb-ui-11 rounded-xl border-1 border-kb-ui-09 shadow-md p-2 w-full">
    <!-- 상단: 타이틀 & 아이콘 -->
    <div class="flex items-center justify-between m-2">
      <div class="font-pretendard-semibold text-lg text-kb-ui-02">{{ info.title }}</div>
      <div class="rounded-xl w-10 h-10 flex items-center justify-center bg-kb-ui-09">
        <font-awesome-icon :icon="info.icon" :class="`text-[18px] ${info.color}`" />
      </div>
    </div>
    <!-- 본문: 값/설명 -->
    <div class="flex items-center justify-between flex-col gap-2 mt-3">
      <div class="font-pretendard-regular text-md text-kb-ui-02">
        {{ displayValue }}
      </div>
      <div class="bg-kb-ui-09 rounded-xl border-1 border-kb-ui-09 text-center w-full">
        <div class="font-pretendard-regular text-xs text-kb-ui-04">{{ info.description }}</div>
      </div>
    </div>
  </div>
</template>
