<script setup lang="ts">
import { safeReportStore } from '@/stores/safeReportStore'
import SearchBuilding from "@/pages/safeReport/SearchBuilding.vue";
import SelectBudget from "@/pages/safeReport/SelectBudget.vue";
import SafeReportResult from "@/pages/safeReport/SafeReportResult.vue";
import Header from "@/components/layout/header/Header.vue";
import { mainRouteName } from "@/router/mainRoute";
import { onMounted } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter()

const steps = [SearchBuilding, SelectBudget, SafeReportResult]

const store = safeReportStore()

onMounted(() => {
  store.currentStep = 0
  store.resetStore()
})

function onUpdate(updated: Partial<typeof store.formData>) {
  store.updateFormData(updated)
}

function nextStep(payload?: { resultData?: unknown; buildingInfo?: unknown }) {
  store.nextStep(payload)
}

function prevStep() {
  store.prevStep()
}

function handleSafeReportBack() {
  router.push({ name: "homeMain" });
  // if(store.currentStep > 0){
  //   store.prevStep()
  // }else{
  //   router.back()
  // }
}
</script>

<template>
  <Header :headerShowtype="mainRouteName.safeReport" @back-click="handleSafeReportBack">
    <div class="mt-23">
      <img
      src="@/assets/imgs/safereport.png"
      alt="안심 진단 리포트"
      class="absolute right-1 top-13/20 -translate-y-1/2 h-30"
      style="z-index:1;"
    />
    </div>

  </Header>

  <div class="mt-6">
    <component
      :is="steps[store.currentStep]"
      @update="onUpdate"
      @next="nextStep"
      @prev="prevStep"
    />
  </div>


</template>
