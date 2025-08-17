import { ref, onMounted, onUnmounted } from "vue";
import { useAlarmStore } from "@/stores/alarmStore";
/*
useAlarmPolling 훅

1. 알람 데이터를 주기적으로 조회하기 위한 커스텀 훅
2. 기본 조회 간격: 30초(intervalMs=30000), 필요 시 숫자를 변경 가능
3. 자동으로 컴포넌트 마운트 시 시작, 언마운트 시 정지
4. startPolling / stopPolling / restartPolling 함수 제공으로 수동 제어 가능
5. 내부적으로 alarmStore의 fetchAlarms와 fetchUnreadCount를 호출
*/
export function useAlarmPolling(intervalMs: number = 30000) {
  // 기본 30초마다 조회
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
    restartPolling,
  };
}
