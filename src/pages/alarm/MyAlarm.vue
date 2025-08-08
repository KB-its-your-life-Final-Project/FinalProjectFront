<script setup lang="ts">
import { onMounted, computed } from "vue";
import { mainRouteName } from "@/router/mainRoute";
import { useAlarmStore } from "@/stores/alarmStore";
import type { AlarmResponseDto } from "@/api/autoLoad/data-contracts";
import CardItem from './CardItem.vue';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import Header from "@/components/layout/header/Header.vue";

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
    case 2:
      return '시세변화 알림';
    case 3:
      return '계약만료 알림';
    default:
      return '기타';
  }
};

// 알림 타입에 따른 FontAwesome 아이콘 반환
const getAlarmIcon = (type: number): string => {
  switch (type) {
    case 2:
      return 'fa-solid fa-chart-line';
    case 3:
      return 'fa-solid fa-calendar-exclamation';
    default:
      return 'fa-solid fa-bell';
  }
};

// 알림 타입에 따른 아이콘 색상 반환
const getAlarmIconColor = (type: number): string => {
  switch (type) {
    case 2:
      return 'bg-blue-400'; // 파란색 (시세변화)
    case 3:
      return 'bg-orange-400'; // 주황색 (계약만료)
    default:
      return 'bg-gray-300'; // 회색
  }
};

// 날짜 포맷팅 (이미지와 동일한 형식)
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

// 알림 삭제 (X 버튼 클릭 시)
const deleteAlarm = async (alarm: AlarmResponseDto) => {
  if (alarm.id) {
    await alarmStore.deleteAlarm(alarm.id);
  }
};

// 컴포넌트 마운트 시 알림 목록 조회
onMounted(async () => {
  await alarmStore.fetchAlarms();
});
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
        @delete="deleteAlarm(alarm)"
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
/* 추가 스타일이 필요한 경우 여기에 작성 */
</style>
