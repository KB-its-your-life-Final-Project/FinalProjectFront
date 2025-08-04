<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { Api } from '@/api/autoLoad/Api';
import type { RecentSafeReportResponseDto } from '@/api/autoLoad/data-contracts';
import { mainRouteName } from '@/router/mainRoute';
import Header from "@/components/layout/header/Header.vue";

const router = useRouter();
const api = new Api();

// 상태 관리
const recentReports = ref<RecentSafeReportResponseDto[]>([]);
const allReports = ref<RecentSafeReportResponseDto[]>([]); // 전체 데이터 저장
const isLoading = ref(true);
const error = ref<string | null>(null);
const MAX_DISPLAY_COUNT = 5; // 최대 표시 개수

// 최근 본 레포트 목록 가져오기
const fetchRecentReports = async () => {
  try {
    isLoading.value = true;
    error.value = null;

    const response = await api.getRecentReportsUsingGet();

    if (response.data?.data) {
      allReports.value = response.data.data;
      // 최대 5개만 표시
      recentReports.value = response.data.data.slice(0, MAX_DISPLAY_COUNT);
    } else {
      allReports.value = [];
      recentReports.value = [];
    }
  } catch (err) {
    console.error('최근 본 레포트 조회 실패:', err);
    error.value = '최근 본 레포트를 불러오는데 실패했습니다.';
  } finally {
    isLoading.value = false;
  }
};

// 특정 레포트 삭제
const deleteReport = async (reportId: number) => {
  try {
    await api.deleteRecentReportUsingDelete(reportId);

    // 전체 목록에서 제거
    allReports.value = allReports.value.filter(report => report.id !== reportId);

    // 표시 목록 업데이트 (최대 5개)
    recentReports.value = allReports.value.slice(0, MAX_DISPLAY_COUNT);
  } catch (err) {
    console.error('레포트 삭제 실패:', err);
    alert('레포트 삭제에 실패했습니다.');
  }
};

// 레포트 상세 보기
const viewReport = async (report: RecentSafeReportResponseDto) => {
  try {
    // 상세 데이터 조회
    const detailResponse = await api.getRecentReportDetailUsingGet(report.id!);

    if (detailResponse.data?.data) {
      // localStorage에 데이터 저장
      localStorage.setItem('savedReportData', JSON.stringify(detailResponse.data.data));
      localStorage.setItem('fromRecentReports', 'true');

      // 건물명과 예산 정보도 함께 저장
      localStorage.setItem('buildingName', report.buildingName || '');
      localStorage.setItem('budget', report.budget?.toString() || '');
      localStorage.setItem('roadAddress', report.roadAddress || '');

      // SafeReportResult.vue로 이동
      router.push({
        name: 'safeReportResult'
      });
    } else {
      alert('상세 데이터를 불러올 수 없습니다.');
    }
  } catch (err) {
    console.error('상세 데이터 조회 실패:', err);
    alert('상세 데이터를 불러오는데 실패했습니다.');
  }
};

// 날짜 포맷팅
const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return `${date.getFullYear()}.${String(date.getMonth() + 1).padStart(2, '0')}.${String(date.getDate()).padStart(2, '0')}`;
};

// 등급별 색상 클래스 반환
const getGradeColorClass = (grade: string | undefined) => {
  switch (grade) {
    case '안전':
      return 'bg-yellow-100 text-yellow-800';
    case '주의':
      return 'bg-orange-100 text-orange-800';
    case '위험':
      return 'bg-error text-error';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};



onMounted(() => {
  fetchRecentReports();
});
</script>

<template>
  <Header :headerShowtype="mainRouteName.recentSafeReport">
    <div class="mt-15"></div>
  </Header>
  <div class="relative z-0">
    <!-- 로딩 상태 -->
    <div v-if="isLoading" class="flex flex-col items-center justify-center min-h-[60vh]">
      <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
      <p class="text-gray-600">최근 본 레포트를 불러오는 중...</p>
    </div>

    <!-- 에러 상태 -->
    <div v-else-if="error" class="flex flex-col items-center justify-center min-h-[60vh] px-4">
      <div class="text-center">
        <svg class="mx-auto h-12 w-12 text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
        </svg>
        <h3 class="text-lg font-medium text-gray-900 mb-2">오류가 발생했습니다</h3>
        <p class="text-gray-600 mb-4">{{ error }}</p>
        <button @click="fetchRecentReports" class="bg-blue-600 text-white px-4 py-2 rounded-lg">
          다시 시도
        </button>
      </div>
    </div>

    <!-- 빈 상태 -->
    <div v-else-if="recentReports.length === 0" class="flex flex-col items-center justify-center min-h-[60vh] px-4">
      <div class="text-center">
        <svg class="mx-auto h-16 w-16 text-gray-300 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
        <h3 class="text-lg font-medium text-kb-ui-02 mb-2">최근 본 레포트가 없습니다</h3>
        <p class="text-kb-ui-03 mb-4">안심 진단을 진행하면 여기에 기록됩니다.</p>
        <button @click="router.push({ name: 'safeReport' })" class="bg-kb-yellow-positive text-white px-6 py-3 rounded-lg font-medium">
          안심 진단 시작하기
        </button>
      </div>
    </div>

    <!-- 레포트 목록 -->
    <div v-else class="p-4 h-[calc(100vh-180px)] overflow-y-auto pb-6">

      <div v-for="report in recentReports" :key="report.id" class="bg-kb-ui-11 rounded-lg shadow-sm border border-kb-ui-06 overflow-hidden mb-4 last:mb-0">
        <!-- 카드 헤더 -->
        <div class="flex items-center justify-between p-4 border-b border-kb-ui-07">
          <div class="flex items-center space-x-2">
            <span :class="`${getGradeColorClass(report.resultGrade)} text-sm font-bold px-3 py-2 rounded`">
              {{ report.resultGrade || '건물' }}
            </span>
          </div>
          <button
            @click.stop="deleteReport(report.id!)"
            class="text-gray-400 hover:text-red-500 transition-colors"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <!-- 카드 본문 -->
        <div @click="viewReport(report)" class="p-4 cursor-pointer hover:bg-gray-50 transition-colors">
          <!-- 건물 정보 -->
          <div class="mb-3">
            <h3 class="text-lg font-semibold text-kb-ui-02 mb-1">
              {{ report.buildingName }}
            </h3>
            <p class="text-sm text-kb-ui-03 leading-relaxed">
              {{ report.roadAddress }}
            </p>
          </div>

          <!-- 하단 정보 -->
          <div class="flex items-center justify-between pt-3 border-t border-kb-ui-07">
            <span class="text-sm text-kb-ui-04">
              열람일: {{ formatDate(report.updatedAt || '') }}
            </span>
            <span class="text-sm font-medium text-green-600">
              안심심진단 완료
            </span>
          </div>
        </div>
      </div>
    </div>
  </div>


</template>

