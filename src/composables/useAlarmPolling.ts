import { ref, onMounted, onUnmounted } from 'vue';
import { useAlarmStore } from '@/stores/alarmStore';

export function useAlarmPolling(intervalMs: number = 30000) { // 기본 30초마다 조회
  const isPolling = ref(false);
  let pollInterval: NodeJS.Timeout | null = null;
  const alarmStore = useAlarmStore();

  const startPolling = () => {
    if (isPolling.value) return;

    isPolling.value = true;

    // 즉시 한 번 조회
    alarmStore.fetchAlarms();
    alarmStore.fetchUnreadCount();

    // 주기적으로 조회
    pollInterval = setInterval(() => {
      alarmStore.fetchAlarms();
      alarmStore.fetchUnreadCount();
    }, intervalMs);
  };

  const stopPolling = () => {
    if (pollInterval) {
      clearInterval(pollInterval);
      pollInterval = null;
    }
    isPolling.value = false;
  };

  const restartPolling = () => {
    stopPolling();
    startPolling();
  };

  // 컴포넌트 마운트 시 자동 시작
  onMounted(() => {
    startPolling();
  });

  // 컴포넌트 언마운트 시 자동 정지
  onUnmounted(() => {
    stopPolling();
  });

  return {
    isPolling,
    startPolling,
    stopPolling,
    restartPolling
  };
}
