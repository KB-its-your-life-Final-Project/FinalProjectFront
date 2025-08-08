<script setup lang="ts">
import { ref, onMounted } from "vue";
import { mainRouteName } from "@/router/mainRoute";
import Header from "@/components/layout/header/Header.vue";
import { Api } from "@/api/autoLoad/Api";
import { authStore } from "@/stores/authStore";
import ResultCard from "./resultCard.vue";

const api = new Api();
const store = authStore();

interface AiRecommendItem {
  jibunAddres: string;
  positiveFactor: string;
  reason: string;
}

// 상태 관리
const aiRecommendResult = ref<string>("");
const parsedResults = ref<AiRecommendItem[]>([]);
const isLoading = ref<boolean>(true);
const error = ref<string>("");

// JSON 파싱 함수
const parseAiResult = (result: string): AiRecommendItem[] => {
  try {
    console.log("파싱할 원본 데이터:", result);

    // JSON 부분만 추출 (```json과 ``` 사이의 내용)
    const jsonMatch = result.match(/```json\s*([\s\S]*?)\s*```/);
    if (jsonMatch) {
      console.log("JSON 블록 찾음:", jsonMatch[1]);
      const parsed = JSON.parse(jsonMatch[1]);
      // 단일 객체인 경우 배열로 변환
      return Array.isArray(parsed) ? parsed : [parsed];
    }

    // JSON 부분이 없으면 전체를 JSON으로 파싱 시도
    const parsed = JSON.parse(result);
    // 단일 객체인 경우 배열로 변환
    return Array.isArray(parsed) ? parsed : [parsed];
  } catch (err) {
    console.error("JSON 파싱 실패:", err);
    return [];
  }
};

// AI 추천 결과 가져오기
const fetchAiRecommend = async () => {
  try {
    isLoading.value = true;
    error.value = "";

    // 로컬 스토리지에서 사용자 정보 가져오기
    const storedMember = localStorage.getItem("authUser");
    if (!storedMember) {
      throw new Error("로그인 정보가 없습니다.");
    }

    const memberData = JSON.parse(storedMember);
    const memberId = memberData.id;

    if (!memberId) {
      throw new Error("사용자 ID를 찾을 수 없습니다.");
    }

    const response = await api.getAiRecommendUsingGet(memberId);
    aiRecommendResult.value = response.data || "추천 결과를 가져올 수 없습니다.";

    // JSON 파싱
    const parsed = parseAiResult(aiRecommendResult.value);
    parsedResults.value = parsed;
  } catch (err) {
    console.error("AI 추천 결과 가져오기 실패:", err);
    error.value = err instanceof Error ? err.message : "AI 추천 결과를 가져오는데 실패했습니다.";
  } finally {
    isLoading.value = false;
  }
};

onMounted(() => {
  fetchAiRecommend();
});
</script>

<template>
  <div class="relative flex flex-col flex-1 min-h-screen px-6 gap-6 mt-6">
    <div>
      <h1 class="text-2xl font-pretendard-bold mb-1">AI 추천 결과</h1>
      <p class="text-kb-ui-06">입력하신 예산을 바탕으로 추천 결과를 제공합니다.</p>
    </div>

    <!-- 로딩 상태 -->
    <div v-if="isLoading" class="flex-1 flex items-center justify-center">
      <div class="text-center">
        <div
          class="animate-spin rounded-full h-12 w-12 border-b-2 border-kb-yellow mx-auto mb-4"
        ></div>
        <p class="text-kb-ui-06">AI 추천 결과를 생성하고 있습니다...</p>
      </div>
    </div>

    <!-- 에러 상태 -->
    <div v-else-if="error" class="flex-1 flex items-center justify-center">
      <div class="text-center">
        <p class="text-red-500 mb-4">{{ error }}</p>
        <button
          @click="fetchAiRecommend"
          class="px-4 py-2 bg-kb-yellow rounded text-kb-ui-11 hover:bg-opacity-80"
        >
          다시 시도
        </button>
      </div>
    </div>

    <!-- 결과 표시 -->
    <div v-else class="flex-1">
      <!-- AI 추천 카드들 -->
      <div v-if="parsedResults.length > 0" class="space-y-4">
        <ResultCard
          v-for="(item, index) in parsedResults"
          :key="index"
          :item="item"
          :index="index"
        />
      </div>

      <!-- 파싱된 결과가 없는 경우 원본 텍스트 표시 -->
      <div v-else class="bg-white rounded-lg p-6 shadow-sm border border-kb-ui-06">
        <h2 class="text-lg font-pretendard-bold mb-4">AI 추천 내용</h2>
        <div class="whitespace-pre-wrap text-kb-ui-08 leading-relaxed">
          {{ aiRecommendResult }}
        </div>
      </div>
    </div>
  </div>
</template>
