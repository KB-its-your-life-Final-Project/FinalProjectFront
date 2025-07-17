<!--예시입니다.... -->

<script setup lang="ts">
import BackHeader from "@/components/layouts/BackHeader.vue";
import { reactive, ref } from 'vue'
import SelectBuilding from "@/pages/safeReport/SelectBuilding.vue";
import SelectBudget from "@/pages/safeReport/SelectBudget.vue";
import SafeReportResult from "@/pages/safeReport/SafeReportResult.vue";

const steps = [SelectBuilding, SelectBudget, SafeReportResult]
const currentStep = ref(0) //현재 렌더링할 컴포넌트 순서

const formData = reactive({
  buildingName: '',
  budget: null,
  // 필요하면 추가 필드
})

function onUpdate(updated) {
  Object.assign(formData, updated)
}

function nextStep() {
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
  }
}
</script>

<template>
  <div class="pb-8">

    <BackHeader title="안심 진단 리포트">
    </BackHeader>
  </div>
<!--  동적 컴포넌트 렌더링 : is: 할당받을 컴포넌트-->
<!--  form-data(props 속성)dp formData 객체 바인딩 -> 자식에서 defineProps({formData:Object})로 받아 사용-->

  <component
    :is="steps[currentStep]"
    :form-data="formData"
    @update="onUpdate"
    @next="nextStep"
    @prev="prevStep"
  />

</template>
