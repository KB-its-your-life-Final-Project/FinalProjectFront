<script setup lang="ts">

import SearchBuilding from "@/pages/safeReport/SearchBuilding.vue";
import SelectBudget from "@/pages/safeReport/SelectBudget.vue";
import SafeReportResult from "@/pages/safeReport/SafeReportResult.vue";
import Header from "@/components/layout/header/Header.vue";
import { mainRouteName } from "@/router/mainRoute";
import { safeReportStore } from "@/stores/safeReportStore";

const store = safeReportStore();
const steps = [SearchBuilding, SelectBudget, SafeReportResult];
import { useRouter } from 'vue-router';
import { onMounted } from 'vue';

const router = useRouter()

// SafeReport 페이지 진입 시 Store 초기화
onMounted(() => {
  store.resetStore();
});

function nextStep() {
  store.currentStep++;
}

function prevStep() {
  store.prevStep();
}

function handleSafeReportBack() {
  router.push({ name: "homeMain" });
}
</script>

<template>
  <Header :headerShowtype="mainRouteName.safeReport" @back-click="handleSafeReportBack">
    <div class="mt-23">
      <img
        src="@/assets/imgs/safereport.png"
        alt="AI 안심 진단 리포트"
        class="absolute right-1 top-13/20 -translate-y-1/2 h-30"
        style="z-index:1;"
      />
    </div>

  </Header>

  <div class="mt-6">
    <component
      :is="steps[store.currentStep]"
      @next="nextStep"
      @prev="prevStep"
    />
  </div>

</template>
