<script setup lang="ts">
import { reactive, ref } from 'vue'
import SelectBuilding from "@/pages/wizard/SelectBuilding.vue";
import SelectType from "@/pages/wizard/SelectType.vue";
import SelectBudget from "@/pages/wizard/SelectBudget.vue";
import WizardResult from "@/pages/wizard/WizardResult.vue";

const steps = [SelectBuilding, SelectType, SelectBudget, WizardResult]
const currentStep = ref(0)

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
  <component
    :is="steps[currentStep]"
    :form-data="formData"
    @update="onUpdate"
    @next="nextStep"
    @prev="prevStep"
  />
</template>

<style scoped>

</style>
