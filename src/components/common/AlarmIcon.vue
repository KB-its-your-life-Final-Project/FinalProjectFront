<!-- 
 알림 버튼 컴포넌트. 
 서버에서 미확인 알림 개수를 조회해 배지로 표시하고 5분마다 갱신. 아이콘 클릭 시 AlarmList 모달을 열고, 닫을 때 다시 개수를 갱신함. 
 props.showBadge로 배지 표시 여부 제어 
 click 이벤트를 부모로 전달. 
-->
<script setup lang="ts">
import { ref, onMounted, onUnmounted } from "vue";
import alarmService from "@/pages/mypage/_service/alarmService";
import AlarmList from "@/pages/mypage/_component/AlarmList.vue";

const props = defineProps<{
  showBadge?: boolean;
}>();

const emit = defineEmits<{
  (e: "click"): void;
}>();

const unreadCount = ref(0);
const showAlarmList = ref(false);
const isLoading = ref(false);

// 미확인 알림 개수 조회
const fetchUnreadCount = async () => {
  try {
    isLoading.value = true;
    const count = await alarmService.getUnreadAlarmCount();
    unreadCount.value = count;
  } catch (error) {
    console.error("미확인 알림 개수 조회 실패:", error);
  } finally {
    isLoading.value = false;
  }
};

// 알림 아이콘 클릭 핸들러
const handleAlarmClick = () => {
  showAlarmList.value = true;
  emit("click");
};

// 알림 목록 닫기
const closeAlarmList = () => {
  showAlarmList.value = false;
  // 알림 목록이 닫힐 때 미확인 개수 다시 조회
  fetchUnreadCount();
};

// 주기적으로 미확인 알림 개수 업데이트 (5분마다)
let intervalId: NodeJS.Timeout | null = null;

onMounted(() => {
  fetchUnreadCount();

  // 5분마다 미확인 알림 개수 업데이트
  intervalId = setInterval(
    () => {
      fetchUnreadCount();
    },
    5 * 60 * 1000,
  );
});

onUnmounted(() => {
  if (intervalId) {
    clearInterval(intervalId);
  }
});
</script>

<template>
  <div class="relative">
    <!-- 알림 아이콘 -->
    <button
      @click="handleAlarmClick"
      class="relative p-2 text-gray-600 hover:text-gray-800 transition-colors"
      :disabled="isLoading"
    >
      <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M15 17h5l-5 5v-5zM10.5 3.75a6 6 0 0 1 6 6v4.5l2.25 2.25a1.5 1.5 0 0 1-1.5 2.25h-13.5a1.5 1.5 0 0 1-1.5-2.25L6 14.25V9.75a6 6 0 0 1 6-6z"
        ></path>
      </svg>

      <!-- 미확인 알림 배지 -->
      <div
        v-if="props.showBadge && unreadCount > 0"
        class="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center min-w-[20px]"
      >
        {{ unreadCount > 99 ? "99+" : unreadCount }}
      </div>
    </button>

    <!-- 알림 목록 모달 -->
    <AlarmList :visible="showAlarmList" @close="closeAlarmList" />
  </div>
</template>

<style scoped>
/* 추가 스타일이 필요한 경우 여기에 작성 */
</style>
