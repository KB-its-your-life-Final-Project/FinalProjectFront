<script setup lang="ts">

import SearchBuilding from "@/pages/safeReport/SearchBuilding.vue";
import SelectBudget from "@/pages/safeReport/SelectBudget.vue";
import SafeReportResult from "@/pages/safeReport/SafeReportResult.vue";
import Header from "@/components/layout/header/Header.vue";
import { mainRouteName } from "@/router/mainRoute";
import { safeReportStore } from "@/stores/safeReportStore";

const store = safeReportStore();
const steps = [SearchBuilding, SelectBudget, SafeReportResult]
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

</script>

<template>
  <Header :headerShowtype="mainRouteName.recentSafeReport">
    <div class="mt-[3rem]">

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
