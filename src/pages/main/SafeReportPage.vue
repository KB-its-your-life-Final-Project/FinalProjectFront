<!--예시입니다.... -->

<script setup lang="ts">
import Header from "@/components/layouts/Header.vue";
import { reactive, ref } from 'vue'
import SelectBuilding from "@/pages/safeReport/SelectBuilding.vue";
import SelectType from "@/pages/safeReport/SelectType.vue";
import SelectBudget from "@/pages/safeReport/SelectBudget.vue";
import SafeReportResult from "@/pages/safeReport/SafeReportResult.vue";

const steps = [SelectBuilding, SelectType, SelectBudget, SafeReportResult]
const currentStep = ref(0) //현재 렌더링할 컴포넌트 순서

const formData = reactive({
  buildingName: '',
  transactionType: '',
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
  currentStep.value--
}
</script>

<template>
  <div class="pb-8">

    <Header>

        <font-awesome-icon :icon="['fas', 'arrow-left']" />
        <span class="text-sm font-pretendard-bold">AI 안심 진단 리포트</span>

    </Header>
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
