import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import type { AlarmResponseDto } from '@/api/autoLoad/data-contracts';
import alarmService from '@/services/alarmService';
import { authStore } from '@/stores/authStore';

export const useAlarmStore = defineStore('alarm', () => {
  // 상태
  const alarms = ref<AlarmResponseDto[]>([]);
  const unreadCount = ref(0);
  const isLoading = ref(false);
  const isSaving = ref(false);

  // 알림 설정 상태
  const alarmSettings = ref({
    contractProgress: true,    // 계약 진행 단계별 알림 (type: 1)
    riskChange: true,          // 주택 위험도 변동 알림 (type: 2)
    contractExpiry: false,     // 계약 만료 및 갱신 알림 (type: 3)
    regionChange: true,        // 관심 지역 변동 알림 (type: 4)
    marketChange: false        // 시세 변동 알림 (type: 5)
  });

  // 계산된 속성
  const hasUnreadAlarms = computed(() => unreadCount.value > 0);
  const alarmCountText = computed(() => {
    if (unreadCount.value === 0) return '';
    return unreadCount.value > 99 ? '99+' : unreadCount.value.toString();
  });

  // 액션
    const fetchAlarms = async () => {
    try {
      isLoading.value = true;
      const token = authStore.token;
      if (!token) {
        // 테스트용 더미 데이터 (토큰이 없을 때)
        const dummyAlarms: AlarmResponseDto[] = [
          {
            id: 1,
            type: 1,
            text: "[D-14] 전입신고 마감일이 2주 남았어요! 지금 바로 확인해보세요.",
            isChecked: 0,
            regDate: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(), // 1일 전
            memberId: 1,
            getAlarm: 1
          },
          {
            id: 2,
            type: 2,
            text: "계약하신 주택의 불법 거래지수가 하락하여 안심 점수가 85점으로 조정되었어요.",
            isChecked: 0,
            regDate: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(), // 3일 전
            memberId: 1,
            getAlarm: 1
          },
          {
            id: 3,
            type: 3,
            text: "계약 만료 90일 전입니다. 주변 시세와 비교하여 재계약 여부를 점검하세요.",
            isChecked: 1,
            regDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(), // 1주 전
            memberId: 1,
            getAlarm: 1
          },
          {
            id: 4,
            type: 4,
            text: "새로운 기능이 추가되었습니다. 앱을 업데이트하여 새 기능을 이용해보세요.",
            isChecked: 0,
            regDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), // 2일 전
            memberId: 1,
            getAlarm: 1
          },
          {
            id: 5,
            type: 5,
            text: "이번 부동산 시장 통합 리포트가 업데이트되었습니다. 지금 확인해보세요.",
            isChecked: 1,
            regDate: new Date(Date.now() - 21 * 24 * 60 * 60 * 1000).toISOString(), // 3주 전
            memberId: 1,
            getAlarm: 1
          }
        ];
        alarms.value = dummyAlarms;
        unreadCount.value = dummyAlarms.filter(alarm => alarm.isChecked === 0).length;
        return;
      }

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

  const fetchUnreadCount = async () => {
    try {
      const token = authStore.token;
      if (!token) return;

      const count = await alarmService.getUnreadAlarmCount(token);
      unreadCount.value = count;
    } catch (error) {
      console.error('미확인 알림 개수 조회 실패:', error);
    }
  };

  const markAlarmAsRead = async (alarmId: number) => {
    try {
      const token = authStore.token;
      if (!token) return;

      const success = await alarmService.markAlarmAsRead(alarmId, token);
      if (success) {
        // 로컬 상태 업데이트
        const alarm = alarms.value.find(a => a.id === alarmId);
        if (alarm && alarm.isChecked === 0) {
          alarm.isChecked = 1;
          unreadCount.value = Math.max(0, unreadCount.value - 1);
        }
      }
      return success;
    } catch (error) {
      console.error('알림 읽음 처리 실패:', error);
      return false;
    }
  };

  const deleteAlarm = async (alarmId: number) => {
    try {
      const token = authStore.token;
      if (!token) return;

      const success = await alarmService.deleteAlarm(alarmId, token);
      if (success) {
        // 로컬 상태에서 알림 제거
        const alarmIndex = alarms.value.findIndex(a => a.id === alarmId);
        if (alarmIndex !== -1) {
          const alarm = alarms.value[alarmIndex];
          if (alarm.isChecked === 0) {
            unreadCount.value = Math.max(0, unreadCount.value - 1);
          }
          alarms.value.splice(alarmIndex, 1);
        }
      }
      return success;
    } catch (error) {
      console.error('알림 삭제 실패:', error);
      return false;
    }
  };

  const updateAlarmSetting = async (type: number, isChecked: boolean) => {
    try {
      isSaving.value = true;

      const success = await alarmService.updateAlarmSettingByType(type, isChecked);

      if (success) {
        // 로컬 상태 업데이트
        updateLocalAlarmSetting(type, isChecked);
      }

      return success;
    } catch (error) {
      console.error('알림 설정 업데이트 실패:', error);
      return false;
    } finally {
      isSaving.value = false;
    }
  };

  const updateLocalAlarmSetting = (type: number, isChecked: boolean) => {
    switch (type) {
      case 1:
        alarmSettings.value.contractProgress = isChecked;
        break;
      case 2:
        alarmSettings.value.riskChange = isChecked;
        break;
      case 3:
        alarmSettings.value.contractExpiry = isChecked;
        break;
      case 4:
        alarmSettings.value.regionChange = isChecked;
        break;
      case 5:
        alarmSettings.value.marketChange = isChecked;
        break;
    }
  };

  const resetStore = () => {
    alarms.value = [];
    unreadCount.value = 0;
    isLoading.value = false;
    isSaving.value = false;
    alarmSettings.value = {
      contractProgress: true,
      riskChange: true,
      contractExpiry: false,
      regionChange: true,
      marketChange: false
    };
  };

  return {
    // 상태
    alarms,
    unreadCount,
    isLoading,
    isSaving,
    alarmSettings,

    // 계산된 속성
    hasUnreadAlarms,
    alarmCountText,

    // 액션
    fetchAlarms,
    fetchUnreadCount,
    markAlarmAsRead,
    deleteAlarm,
    updateAlarmSetting,
    updateLocalAlarmSetting,
    resetStore
  };
});
