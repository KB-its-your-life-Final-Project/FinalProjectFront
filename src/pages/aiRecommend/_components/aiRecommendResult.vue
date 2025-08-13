<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import { Api } from "@/api/autoLoad/Api";
import ResultCard from "./resultCard.vue";
import LoadingSpinner from "@/components/common/LoadingSpinner.vue";

const api = new Api();
const router = useRouter();

interface AiRecommendItem {
  jibunAddress: string;
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
    // JSON 부분만 추출 (```json과 ``` 사이의 내용)
    const jsonMatch = result.match(/```json\s*([\s\S]*?)\s*```/);
    if (jsonMatch) {
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
      error.value = "로그인 정보가 없습니다. 다시 로그인해주세요.";
      return;
    }

    let memberData;
    try {
      memberData = JSON.parse(storedMember);
    } catch (parseError) {
      error.value = "사용자 정보가 올바르지 않습니다. 다시 로그인해주세요.";
      return;
    }

    const memberId = memberData.id;

    if (!memberId) {
      error.value = "사용자 ID를 찾을 수 없습니다. 다시 로그인해주세요.";
      return;
    }

    const response = await api.getAiRecommendUsingGet(memberId);

    aiRecommendResult.value = response.data?.data || "추천 결과를 가져올 수 없습니다.";

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
  <div class="relative flex flex-col min-h-screen bg-gray-50">
    <!-- 메인 컨텐츠 -->
    <div class="flex-1 px-3 py-3">
      <div class="max-w-md mx-auto">
        <!-- 로딩 상태 -->
        <div v-if="isLoading" class="flex items-center justify-center min-h-48">
          <div class="text-center">
            <LoadingSpinner
              size="h-12 w-12"
              borderWidth="border-4"
              borderColor="border-kb-yellow"
              marginBottom="mb-4"
              borderTopTransparent
            />
            <p class="text-gray-600 font-medium">AI 추천 결과를 생성하고 있습니다...</p>
            <p class="text-gray-500 text-sm mt-1">잠시만 기다려주세요</p>
          </div>
        </div>

        <!-- 에러 상태 -->
        <div v-else-if="error" class="flex items-center justify-center min-h-48">
          <div class="text-center bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <div
              class="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-3"
            >
              <svg
                class="w-6 h-6 text-red-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
                ></path>
              </svg>
            </div>
            <p class="text-red-600 font-medium mb-3">{{ error }}</p>
          </div>
        </div>

        <!-- 결과 표시 -->
        <div v-else>
          <!-- AI 추천 카드들 -->
          <div v-if="parsedResults.length > 0" class="flex flex-col gap-3">
            <ResultCard
              v-for="(item, index) in parsedResults"
              :key="index"
              :item="item"
              :index="index"
            />
          </div>

          <!-- 파싱된 결과가 없는 경우 원본 텍스트 표시 -->
          <div v-else class="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
            <h2 class="text-lg font-pretendard-bold mb-3 text-gray-900">AI 추천 내용</h2>
            <div class="whitespace-pre-wrap text-gray-700 leading-relaxed text-sm">
              {{ aiRecommendResult }}
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
