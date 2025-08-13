<script setup lang="ts">
import { ref } from "vue";
import { mainRouteName } from "@/router/mainRoute";
import SelectBudget from "./SelectBudget.vue";
import aiRecommendResult from "./_components/aiRecommendResult.vue";
import Header from "@/components/layout/header/Header.vue";

// 현재 표시할 컴포넌트 상태 관리
const currentStep = ref<"budget" | "result">("budget");

// AI 추천 확인 버튼 클릭 시 결과 페이지로 전환
const handleNext = () => {
  currentStep.value = "result";
};
</script>

<template>
  <Header :headerShowtype="mainRouteName.aiRecommend">
    <div class="flex h-25">
      <div>
        <!-- 헤더 섹션 -->
        <div class="px-4 py-6">
          <div class="max-w-md mx-auto">
            <h1 class="text-2xl font-pretendard-bold mb-2 text-gray-900">AI 추천 결과</h1>
            <p class="text-gray-600 text-sm">입력하신 예산을 바탕으로 추천 결과를 제공합니다.</p>
          </div>
        </div>
      </div>
      <div>
        <img
          src="@/assets/imgs/homematch.png"
          class="absolute right-1 top-12/20 -translate-y-1/2 h-25"
        />
      </div>
    </div>
  </Header>

  <!-- 예산 입력 단계 -->
  <SelectBudget v-if="currentStep === 'budget'" @next="handleNext" />

  <!-- AI 추천 결과 단계 -->
  <aiRecommendResult v-else />
</template>
