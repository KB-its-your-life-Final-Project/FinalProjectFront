<script setup lang="ts">
import Header from "@/components/layout/header/Header.vue";
import AlarmSettingItem from "./_component/AlarmSettingItem.vue";
import { onMounted } from "vue";
import ToolTip from "@/components/common/ToolTip.vue";
import TermsAndConditions from "./_component/TermsAndConditions.vue";
import { myPageRouteName } from "@/router/mypageRoutes";
import { useAlarmStore } from "@/stores/alarmStore";

// 스토어 사용
const alarmStore = useAlarmStore();

// 알림 설정 변경 핸들러
const handleAlarmSettingChange = async (type: number, value: boolean) => {
  await alarmStore.updateAlarmSetting(type, value);
};

// 컴포넌트 마운트 시 알림 설정 조회
onMounted(() => {
  // 스토어에서 알림 설정 초기화 (실제로는 백엔드에서 조회)
  // 현재는 기본값으로 설정
});

// 약관 내용
const title1 = "제1조 (정보의 목적 및 한계)";
const content1 =
  " 본 'LightHouse' 서비스(이하 '서비스')가 제공하는 모든 정보(AI 안심 진단 리포트, 시세 정보, 알림 등)는 사용자가 부동산 거래에 관한 의사결정을 내리는 데 도움을 주기 위한 참고 자료로만 제공됩니다. 서비스는 어떠한 경우에도 사용자의 거래를 보증하거나 법적 책임을 대신하지 않습니다.\n";
const title2 = "제2조 (정보의 출처 및 시차)";
const content2 =
  " 서비스가 제공하는 정보는 국토교통부 등 공공기관의 API를 기반으로 합니다. 공공데이터 제공처의 사정에 따라 데이터의 현행화 주기에는 최대 1개월의 시차가 발생할 수 있으며, 이는 실제 정보와 다를 수 있습니다. 따라서 사용자가 임대차 계약 등 중요한 법률 행위 이전, 반드시 정부24 또는 관할 주민센터/구청을 통해 건축물대장 및 등기부등본 등 공적 장부의 원본을 직접 확인하는 것을 권장드립니다.";
</script>

<template>
  <Header :headerShowtype="myPageRouteName.alarmSetting" class="h-25" />

  <!-- 로딩 상태 -->
  <div v-if="alarmStore.isLoading" class="flex justify-center items-center h-64">
    <div class="text-lg text-gray-500">알림 설정을 불러오는 중...</div>
  </div>

  <!-- 알림 설정 목록 -->
  <div v-else class="mx-4 mt-10">
    <AlarmSettingItem
      :main="'시세변화 알림'"
      :sub="'주변 시세 변동, 권리관계 변동 알림'"
      :setting="alarmStore.alarmSettings.marketChange"
      @update:setting="(value) => handleAlarmSettingChange(2, value)"
    />
    <AlarmSettingItem
      :main="'계약만료 알림'"
      :sub="'계약 만료 및 갱신 알림'"
      :setting="alarmStore.alarmSettings.contractExpiry"
      @update:setting="(value) => handleAlarmSettingChange(3, value)"
    />

    <!-- 저장 중 표시 -->
    <div v-if="alarmStore.isSaving" class="flex justify-center items-center py-4">
      <div class="text-sm text-blue-500">설정을 저장하는 중...</div>
    </div>

    <!-- 약관 및 안내 -->
    <div class="mt-4 bg-terms-bg border border-terms-border rounded-md p-3 flex gap-3">
      <ToolTip class="mt-2 flex flex-[1] justify-center">
        <div class="font-pretendard-bold text-lg">상세 안내</div>
        <div class="font-pretendard-semibold mt-3">{{ title1 }}</div>
        <div class="mt-1">{{ content1 }}</div>
        <div class="font-pretendard-semibold mt-3">{{ title2 }}</div>
        <div class="mt-1">{{ content2 }}</div>
      </ToolTip>
      <TermsAndConditions class="flex-[15]" />
    </div>
  </div>
</template>

<style scoped>
/* 추가 스타일이 필요한 경우 여기에 작성 */
</style>
