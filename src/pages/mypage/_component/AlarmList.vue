<script setup lang="ts">
import { ref, onMounted } from "vue";
import type { AlarmResponseDto } from "@/api/autoLoad/data-contracts";
import alarmService from "@/services/alarmService";
import { authStore } from "@/stores/authStore";

const props = defineProps<{
  visible: boolean;
}>();

const emit = defineEmits<{
  (e: "close"): void;
}>();

const alarms = ref<AlarmResponseDto[]>([]);
const isLoading = ref(false);
const unreadCount = ref(0);

// 알림 목록 조회
const fetchAlarms = async () => {
  try {
    isLoading.value = true;
    const token = authStore.token;
    if (!token) return;

    const alarmList = await alarmService.getAlarmList(token);
    alarms.value = alarmList;

    // 미확인 알림 개수 계산
    unreadCount.value = alarmList.filter(alarm => alarm.isChecked === 0).length;

  } catch (error) {
    console.error('알림 목록 조회 실패:', error);
  } finally {
    isLoading.value = false;
  }
};

// 알림 읽음 처리
const markAsRead = async (alarmId: number) => {
  try {
    const token = authStore.token;
    if (!token) return;

    const success = await alarmService.markAlarmAsRead(alarmId, token);
    if (success) {
      // 로컬 상태 업데이트
      const alarm = alarms.value.find(a => a.id === alarmId);
      if (alarm) {
        alarm.isChecked = 1;
        unreadCount.value = Math.max(0, unreadCount.value - 1);
      }
    }
  } catch (error) {
    console.error('알림 읽음 처리 실패:', error);
  }
};

// 알림 타입에 따른 텍스트 반환
const getAlarmTypeText = (type: number): string => {
  switch (type) {
    case 1:
      return '계약 진행';
    case 2:
      return '위험도 변동';
    case 3:
      return '계약 만료';
    case 4:
      return '관심 지역';
    case 5:
      return '시세 변동';
    default:
      return '기타';
  }
};

// 날짜 포맷팅
const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString('ko-KR', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  });
};

// 컴포넌트 마운트 시 알림 목록 조회
onMounted(() => {
  if (props.visible) {
    fetchAlarms();
  }
});

// visible이 변경될 때 알림 목록 조회
const watchVisible = () => {
  if (props.visible) {
    fetchAlarms();
  }
};
</script>

<template>
  <div v-if="visible" class="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
    <div class="bg-white rounded-lg w-full max-w-md mx-4 max-h-[80vh] overflow-hidden">
      <!-- 헤더 -->
      <div class="flex justify-between items-center p-4 border-b">
        <h2 class="text-lg font-semibold">알림</h2>
        <button @click="emit('close')" class="text-gray-500 hover:text-gray-700">
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
          </svg>
        </button>
      </div>

      <!-- 로딩 상태 -->
      <div v-if="isLoading" class="flex justify-center items-center p-8">
        <div class="text-gray-500">알림을 불러오는 중...</div>
      </div>

      <!-- 알림 목록 -->
      <div v-else class="overflow-y-auto max-h-[60vh]">
        <div v-if="alarms.length === 0" class="p-8 text-center text-gray-500">
          새로운 알림이 없습니다.
        </div>

        <div v-else class="divide-y">
          <div
            v-for="alarm in alarms"
            :key="alarm.id"
            class="p-4 hover:bg-gray-50 cursor-pointer"
            :class="{ 'bg-blue-50': alarm.isChecked === 0 }"
            @click="markAsRead(alarm.id!)"
          >
            <div class="flex justify-between items-start">
              <div class="flex-1">
                <div class="flex items-center gap-2 mb-1">
                  <span class="text-sm font-medium text-blue-600">
                    {{ getAlarmTypeText(alarm.type!) }}
                  </span>
                  <span v-if="alarm.isChecked === 0" class="w-2 h-2 bg-red-500 rounded-full"></span>
                </div>
                <div class="text-sm text-gray-800 mb-2">
                  {{ alarm.text }}
                </div>
                <div class="text-xs text-gray-500">
                  {{ formatDate(alarm.regDate!) }}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 푸터 -->
      <div class="p-4 border-t bg-gray-50">
        <div class="text-sm text-gray-600">
          미확인 알림: {{ unreadCount }}개
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* 추가 스타일이 필요한 경우 여기에 작성 */
</style>
