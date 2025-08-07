<script setup lang="ts">
import { computed } from "vue";
import { mainRouteName } from "@/router/mainRoute";
import { useAlarmStore } from "@/stores/alarmStore";
import type { AlarmResponseDto } from "@/api/autoLoad/data-contracts";
import CardItem from './CardItem.vue';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import Header from "@/components/layout/header/Header.vue";
import { useAlarmPolling } from "@/composables/useAlarmPolling";

// 스토어 사용
const alarmStore = useAlarmStore();

// 필터링된 알림 목록
const filteredAlarms = computed(() => {
  const alarms = alarmStore.alarms;

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
      return '계약 단계별 알림';
    case 2:
      return '시세변화 알림';
    case 3:
      return '계약만료 알림';
    default:
      return '기타';
  }
};

const getAlarmIcon = (type: number): string[] => {
  switch (type) {
    case 1:
      return ['fas', 'clipboard'];
    case 2:
      return ['fas', 'chart-bar'];
    case 3:
      return ['fas', 'house'];
    default:
      return ['fas', 'bell'];
  }
};

const getAlarmIconColor = (type: number): string => {
  switch (type) {
    case 1:
      return 'bg-yellow-200'; // 계약 단계별
    case 2:
      return 'bg-blue-200'; // 시세변화
    case 3:
      return 'bg-green-200'; // 계약만료
    default:
      return 'bg-gray-200';
  }
};

const formatDate = (dateString: string): string => {
  if (!dateString) {
    return '방금 전';
  }

  const date = new Date(dateString);

  // 유효하지 않은 날짜인지 확인
  if (isNaN(date.getTime())) {
    return '방금 전';
  }

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

const handleDeleteAlarm = async (alarm: AlarmResponseDto) => {
  if (alarm.id) {
    await alarmStore.markAlarmAsRead(alarm.id);
    await alarmStore.deleteAlarm(alarm.id);
  }
};

// 주기적 알림 목록 조회 (5초마다)
useAlarmPolling(5000);
</script>

<template>
  <div class="pb-24">
    <Header :headerShowtype="mainRouteName.myAlarm">
      <div class="flex flex-col items-center">
        <img src="@/assets/imgs/profile.jpg" class="w-16 h-16 rounded-full mb-2" />
        <div class="text-center">
          <p class="font-bold">홍길동</p>
          <p class="text-sm text-gray-500">HONGG@MAIL.COM <font-awesome-icon icon="fa-solid fa-circle-check" class="text-green-500" /></p>
        </div>
      </div>
    </Header>
    <div class="p-4 mt-4">
      <CardItem
        v-for="alarm in filteredAlarms"
        :key="alarm.id"
        :icon="getAlarmIcon(alarm.type || 0)"
        :title="getAlarmTypeText(alarm.type || 0)"
        :content="alarm.text || ''"
        :timeAgo="formatDate(alarm.regDate || '')"
        :iconColor="getAlarmIconColor(alarm.type || 0)"
        @click="markAsRead(alarm)"
        @delete="handleDeleteAlarm(alarm)"
      />

      <!-- 알림이 없을 때 -->
      <div v-if="filteredAlarms.length === 0" class="text-center py-12">
        <div class="text-gray-500 mb-2">
          <span class="text-6xl">🔔</span>
        </div>
        <p class="text-gray-500">받은 알림이 없습니다.</p>
      </div>
    </div>
  </div>
</template>

<style scoped>
</style>
