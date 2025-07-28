<script setup lang="ts">
import Header from "@/components/layout/header/Header.vue";
import AlarmSettingItem from "./_component/AlarmSettingItem.vue";
import { mainRouteName } from "@/router/mainRoute";
import { ref } from "vue";
// 개별 상태 변수
const setting1 = ref(false);
const setting2 = ref(true);
const setting3 = ref(false);
const setting4 = ref(true);
const setting5 = ref(false);
</script>

<template>
  <Header :headerShowtype="mainRouteName.myPage" class="h-25" />
  <div class="mx-4 mt-10">
    <AlarmSettingItem
      :main="'계약 진행 단계별 알림'"
      :sub="'전입신고, 보증보험 가입 알림'"
      v-model:setting="setting1"
    />
    <AlarmSettingItem
      :main="'주택 위험도 변동 알림'"
      :sub="'주변 시세 변동, 권리관계 변동 알림'"
      v-model:setting="setting2"
    />
    <AlarmSettingItem :main="'계약 만료 및 갱신 알림'" v-model:setting="setting3" />
    <AlarmSettingItem :main="'관심 지역 변동 알림'" v-model:setting="setting4" />
    <AlarmSettingItem v-model:setting="setting5" />
  </div>
</template>
