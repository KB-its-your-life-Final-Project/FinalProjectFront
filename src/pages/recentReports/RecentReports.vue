<template>
  <div class="min-h-screen bg-gray-50">
    <!-- 헤더 -->
    <div class="bg-white shadow-sm border-b">
      <div class="px-6 py-4 flex items-center justify-between">
        <div class="flex items-center">
          <button @click="goBack" class="mr-4">
            <svg class="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"></path>
            </svg>
          </button>
          <h1 class="text-xl font-pretendard-bold text-gray-900">최근 본 레포트</h1>
        </div>
        <button
          v-if="recentReportsStore.sortedReports.length > 0"
          @click="clearAllReports"
          class="text-sm text-red-600 hover:text-red-800"
        >
          전체 삭제
        </button>
      </div>
    </div>

    <!-- 레포트 목록 -->
    <div class="px-6 py-4">
      <div v-if="recentReportsStore.sortedReports.length === 0" class="text-center py-12">
        <div class="mb-4">
          <svg class="mx-auto h-16 w-16 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
          </svg>
        </div>
        <h3 class="text-lg font-medium text-gray-900 mb-2">최근 본 레포트가 없습니다</h3>
        <p class="text-gray-500 mb-6">건물을 검색하여 레포트를 생성해보세요.</p>
        <button
          @click="goToSafeReport"
          class="bg-kb-yellow text-kb-ui-01 px-6 py-3 rounded-lg font-semibold hover:bg-yellow-500"
        >
          레포트 생성하기
        </button>
      </div>

      <div v-else class="space-y-4">
        <div
          v-for="report in recentReportsStore.sortedReports"
          :key="report.id"
          class="bg-white rounded-lg shadow-sm border p-4 hover:shadow-md transition-shadow"
        >
          <div class="flex items-start justify-between">
            <div class="flex-1">
              <div class="flex items-center mb-2">
                <h3 class="text-lg font-pretendard-bold text-gray-900 mr-3">
                  {{ report.buildingName }}
                </h3>
                <div
                  class="px-2 py-1 rounded-full text-xs font-medium"
                  :class="getScoreColor(report.score).bg"
                >
                  {{ report.score }}/10
                </div>
              </div>

              <p class="text-sm text-gray-600 mb-2">{{ report.address }}</p>

              <div class="flex items-center space-x-4 text-sm">
                <span class="text-gray-500">
                  등급: <span :class="getScoreColor(report.score).text + ' font-semibold'">{{ report.gradeText }}</span>
                </span>
                <span class="text-gray-500">
                  위반여부:
                  <span
                    :class="report.violationStatus === '위반건축물' ? 'text-red-600 font-semibold' : 'text-green-600 font-semibold'"
                  >
                    {{ report.violationStatus === '위반건축물' ? '위반' : '정상' }}
                  </span>
                </span>
              </div>

              <p class="text-xs text-gray-400 mt-2">
                {{ formatDate(report.timestamp) }}
              </p>
            </div>

            <div class="flex items-center space-x-2 ml-4">
              <button
                @click="viewReport(report)"
                class="px-3 py-1 bg-kb-yellow text-kb-ui-01 rounded text-sm font-medium hover:bg-yellow-500"
              >
                보기
              </button>
              <button
                @click="removeReport(report.id)"
                class="p-1 text-gray-400 hover:text-red-600"
              >
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRecentReportsStore, type RecentReport } from '@/stores/recentReportsStore';
import { useRouter } from 'vue-router';

const recentReportsStore = useRecentReportsStore();
const router = useRouter();

// 점수에 따른 색상 반환
function getScoreColor(score: number) {
  if (score >= 8) {
    return { bg: 'bg-red-100 text-red-800', text: 'text-red-600' };
  } else if (score >= 5) {
    return { bg: 'bg-orange-100 text-orange-800', text: 'text-orange-500' };
  } else if (score >= 3) {
    return { bg: 'bg-yellow-100 text-yellow-800', text: 'text-yellow-600' };
  } else {
    return { bg: 'bg-blue-100 text-blue-800', text: 'text-blue-600' };
  }
}

// 날짜 포맷팅
function formatDate(timestamp: number) {
  const date = new Date(timestamp);
  const now = new Date();
  const diffTime = now.getTime() - date.getTime();
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays === 0) {
    return '오늘';
  } else if (diffDays === 1) {
    return '어제';
  } else if (diffDays < 7) {
    return `${diffDays}일 전`;
  } else {
    return date.toLocaleDateString('ko-KR');
  }
}

// 뒤로 가기
function goBack() {
  router.back();
}

// 안전 레포트 페이지로 이동
function goToSafeReport() {
  router.push({ name: 'searchBuilding' });
}

// 레포트 상세 보기
function viewReport(report: RecentReport) {
  // TODO: 레포트 상세 페이지로 이동하거나 모달로 표시
  console.log('레포트 상세 보기:', report);
  // 임시로 안전 레포트 페이지로 이동
  router.push({ name: 'searchBuilding' });
}

// 개별 레포트 삭제
function removeReport(id: string) {
  if (confirm('이 레포트를 삭제하시겠습니까?')) {
    recentReportsStore.removeReport(id);
  }
}

// 모든 레포트 삭제
function clearAllReports() {
  if (confirm('모든 최근 레포트를 삭제하시겠습니까?')) {
    recentReportsStore.clearAllReports();
  }
}
</script>
