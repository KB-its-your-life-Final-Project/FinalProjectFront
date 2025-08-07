<script setup lang="ts">
import { ref, onMounted, computed } from "vue";
import { useRouter } from "vue-router";
import Section from "@/components/nav/BottomNav.vue";
import { useAlarmStore } from "@/stores/alarmStore";
import type { AlarmResponseDto } from "@/api/autoLoad/data-contracts";

// 라우터 및 스토어 사용
const router = useRouter();
const alarmStore = useAlarmStore();

// 필터 상태
const selectedFilter = ref<'all' | 'unread' | 'read'>('all');
const selectedType = ref<number | 'all'>('all');

// 알림 타입 옵션
const alarmTypeOptions = [
  { value: 'all', label: '전체' },
  { value: 1, label: '계약 진행' },
  { value: 2, label: '위험도 변동' },
  { value: 3, label: '계약 만료' },
  { value: 4, label: '관심 지역' },
  { value: 5, label: '시세 변동' }
];

// 필터링된 알림 목록
const filteredAlarms = computed(() => {
  let alarms = alarmStore.alarms;

  // 읽음 상태 필터
  if (selectedFilter.value === 'unread') {
    alarms = alarms.filter(alarm => alarm.isChecked === 0);
  } else if (selectedFilter.value === 'read') {
    alarms = alarms.filter(alarm => alarm.isChecked === 1);
  }

  // 타입 필터
  if (selectedType.value !== 'all') {
    alarms = alarms.filter(alarm => alarm.type === selectedType.value);
  }

  // 최신순 정렬
  return alarms.sort((a, b) => {
    const dateA = new Date(a.regDate || '').getTime();
    const dateB = new Date(b.regDate || '').getTime();
    return dateB - dateA;
  });
});

// 알림 타입에 따른 텍스트 반환
const getAlarmTypeText = (type: number): string => {
  switch (type) {
    case 1:
      return '계약 필수 체크리스트';
    case 2:
      return '주택 위험도 변동 알림';
    case 3:
      return '계약 갱신 정보';
    case 4:
      return '관심 지역 변동 알림';
    case 5:
      return '시세 변동 알림';
    default:
      return '기타';
  }
};

// 알림 타입에 따른 아이콘 반환
const getAlarmIcon = (type: number): string => {
  switch (type) {
    case 1:
      return '📋'; // 체크리스트 아이콘
    case 2:
      return '⚠️'; // 경고 아이콘
    case 3:
      return '📅'; // 캘린더 아이콘
    case 4:
      return '🔄'; // 새로고침 아이콘
    case 5:
      return '📈'; // 차트 아이콘
    default:
      return '🔔'; // 기본 알림 아이콘
  }
};

// 날짜 포맷팅 (이미지와 동일한 형식)
const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  const now = new Date();
  const diffTime = now.getTime() - date.getTime();
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays === 0) {
    return '오늘';
  } else if (diffDays === 1) {
    return '1일 전';
  } else if (diffDays < 7) {
    return `${diffDays}일 전`;
  } else if (diffDays < 14) {
    return '1주 전';
  } else if (diffDays < 21) {
    return '2주 전';
  } else if (diffDays < 28) {
    return '3주 전';
  } else {
    return date.toLocaleDateString('ko-KR', {
      month: '2-digit',
      day: '2-digit'
    });
  }
};

// 알림 읽음 처리
const markAsRead = async (alarm: AlarmResponseDto) => {
  if (alarm.id) {
    await alarmStore.markAlarmAsRead(alarm.id);
  }
};



// 알림 설정 페이지로 이동
const goToAlarmSettings = () => {
  router.push('/mypage/alarm-setting');
};

// 컴포넌트 마운트 시 알림 목록 조회
onMounted(async () => {
  await alarmStore.fetchAlarms();
});
</script>

<template>
  <!-- 헤더 (MyMainPage.vue와 동일한 구조) -->
  <div class="bg-yellow-400 h-32 relative">
    <!-- 뒤로가기 버튼 -->
    <div class="absolute top-4 left-4">
      <button @click="router.back()" class="text-2xl">←</button>
    </div>

    <!-- 제목 -->
    <div class="absolute top-4 left-12 text-xl font-bold">
      알람
    </div>

    <!-- 프로필 정보 (중앙) -->
    <div class="absolute top-8 left-1/2 transform -translate-x-1/2 text-center">
      <div class="w-16 h-16 bg-yellow-300 rounded-full mx-auto mb-2 flex items-center justify-center overflow-hidden">
        <img
          src="https://via.placeholder.com/64x64/FFD700/000000?text=👤"
          alt="프로필"
          class="w-full h-full object-cover"
        />
      </div>
      <div class="text-sm font-medium">홍길동</div>
      <div class="text-xs text-gray-600">HONGG@MAIL.COM</div>
    </div>

    <!-- 알림 아이콘 -->
    <div class="absolute top-4 right-4">
      <button @click="goToAlarmSettings" class="text-2xl">🔔</button>
    </div>
  </div>

  <div class="mx-4 mt-6">
    <!-- 필터 섹션 -->
    <div class="mb-6 p-4 bg-gray-50 rounded-lg">
      <div class="flex flex-wrap gap-4">
        <!-- 읽음 상태 필터 -->
        <div class="flex items-center gap-2">
          <label class="text-sm font-medium text-gray-700">상태:</label>
          <select
            v-model="selectedFilter"
            class="px-3 py-1 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">전체</option>
            <option value="unread">미확인</option>
            <option value="read">확인함</option>
          </select>
        </div>

        <!-- 타입 필터 -->
        <div class="flex items-center gap-2">
          <label class="text-sm font-medium text-gray-700">타입:</label>
          <select
            v-model="selectedType"
            class="px-3 py-1 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option
              v-for="option in alarmTypeOptions"
              :key="option.value"
              :value="option.value"
            >
              {{ option.label }}
            </option>
          </select>
        </div>
      </div>
    </div>

    <!-- 로딩 상태 -->
    <div v-if="alarmStore.isLoading" class="flex justify-center items-center h-64">
      <div class="text-lg text-gray-500">알림을 불러오는 중...</div>
    </div>

    <!-- 알림 목록 -->
    <div v-else>
      <!-- 알림이 없을 때 -->
      <div v-if="filteredAlarms.length === 0" class="text-center py-12">
        <div class="text-gray-500 mb-2">
          <span class="text-6xl">🔔</span>
        </div>
        <p class="text-gray-500">
          {{ selectedFilter === 'all' ? '받은 알림이 없습니다.' :
             selectedFilter === 'unread' ? '미확인 알림이 없습니다.' : '확인한 알림이 없습니다.' }}
        </p>
      </div>

      <!-- 알림 목록 (카드 형태) -->
      <div v-else class="space-y-4">
        <div
          v-for="alarm in filteredAlarms"
          :key="alarm.id"
          class="bg-white rounded-lg shadow-sm border border-gray-200 p-4 cursor-pointer hover:shadow-md transition-shadow"
          :class="{ 'bg-blue-50 border-blue-200': alarm.isChecked === 0 }"
          @click="markAsRead(alarm)"
        >
          <div class="flex items-start gap-3">
            <!-- 아이콘 -->
            <div class="text-2xl mt-1">
              {{ getAlarmIcon(alarm.type || 0) }}
            </div>

            <!-- 알림 내용 -->
            <div class="flex-1">
              <div class="flex justify-between items-start mb-2">
                <h3 class="font-bold text-gray-900">
                  {{ getAlarmTypeText(alarm.type || 0) }}
                </h3>
                <span class="text-xs text-gray-500">{{ formatDate(alarm.regDate || '') }}</span>
              </div>
              <p class="text-sm text-gray-700 leading-relaxed">
                {{ alarm.text }}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>

  <!-- 하단 네비게이션 -->
  <Section />
</template>

<style scoped>
/* 추가 스타일이 필요한 경우 여기에 작성 */
</style>
