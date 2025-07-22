<!--예시입니다.... -->

<script setup lang="ts">
import { reactive, ref } from 'vue'
import SearchBuilding from "@/pages/safeReport/SearchBuilding.vue";
import SelectBudget from "@/pages/safeReport/SelectBudget.vue";
import SafeReportResult from "@/pages/safeReport/SafeReportResult.vue";
import Header from "@/components/layout/header/Header.vue";
import Section from "@/components/nav/BottomNav.vue";
import { mainRouteName } from "@/router/mainRoute";

const steps = [SearchBuilding, SelectBudget, SafeReportResult]
const currentStep = ref(0) //현재 렌더링할 컴포넌트 순서

const formData = reactive({
  buildingName: '',
  roadAddress: '', //도로명주소
  jibunAddress: '', //지번주소
  dongName: '',//법정동주소
  budget: null,
  // 필요하면 추가 필드
})

const resultData = ref(null)
function onUpdate(updated) {
  Object.assign(formData, updated)
}

function nextStep(payload?:any) {
  if (payload?.resultData) {
    resultData.value = payload.resultData
  }
  currentStep.value++
}

function prevStep() {
  const from = currentStep.value;
  currentStep.value--;
  if (from === 1) {
    // 1→0
    formData.buildingName = '';
  } else if (from === 2) {
    // 2→1
    formData.budget = null;
    console.log("초기화된 budget 값:", formData.budget);
  }
}
</script>



<template>
  <div class="pb-24">
    <Header :headerShowtype="mainRouteName.safeReport">
      <font-awesome-icon :icon="['fas', 'arrow-left']" />
      <span class="text-sm font-semibold">안심 진단 리포트</span>
    </Header>


    <component
      :is="steps[currentStep]"
      :form-data="formData"
      :result-data="resultData"
      @update="onUpdate"
      @next="nextStep"
      @prev="prevStep"
    />
  </div>
  <Section />
</template>
