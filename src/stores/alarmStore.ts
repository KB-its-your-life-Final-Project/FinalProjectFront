import { defineStore } from "pinia";
import { ref, computed } from "vue";
import type { AlarmResponseDto } from "@/api/autoLoad/data-contracts";
import alarmService from "@/services/alarmService";

export const useAlarmStore = defineStore("alarm", () => {
  // 상태
  const alarms = ref<AlarmResponseDto[]>([]);
  const unreadCount = ref(0);
  const isLoading = ref(false);
  const isSaving = ref(false);

  // 알림 설정 상태 (백엔드 API 변경에 따라 type 2, 3만 지원)
  const alarmSettings = ref({
    marketChange: true, // 시세변화 알림 (type: 2)
    contractExpiry: false, // 계약만료 알림 (type: 3)
  });

  // 계산된 속성
  const hasUnreadAlarms = computed(() => unreadCount.value > 0);
  const alarmCountText = computed(() => {
    if (unreadCount.value === 0) return "";
    return unreadCount.value > 99 ? "99+" : unreadCount.value.toString();
  });

  // 액션
  const fetchAlarms = async () => {
    try {
      isLoading.value = true;

      // 쿠키에서 토큰 확인 (브라우저가 자동으로 쿠키를 전송)
      const alarmList = await alarmService.getAlarmList();
      alarms.value = alarmList;

      // 미확인 알림 개수 계산
      unreadCount.value = alarmList.filter((alarm) => alarm.isChecked === 0).length;
    } catch (error) {
      console.error("알림 목록 조회 실패:", error);
      // 에러 발생 시 테스트용 더미 데이터 사용
      const dummyAlarms: AlarmResponseDto[] = [
        {
          id: 1,
          type: 2,
          text: "계약하신 주택의 주변 실거래가가 하락하여 안심 점수가 85점으로 조정되었어요.",
          isChecked: 0,
          regDate: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(), // 1일 전
          memberId: 1,
          getAlarm: 1,
        },
        {
          id: 2,
          type: 3,
          text: "계약 만료 90일 전입니다. 주변 시세와 비교하여 재계약 여부를 결정하세요.",
          isChecked: 0,
          regDate: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(), // 3일 전
          memberId: 1,
          getAlarm: 1,
        },
        {
          id: 3,
          type: 2,
          text: "관심 지역의 시세가 상승하여 투자 가치가 높아졌습니다.",
          isChecked: 1,
          regDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(), // 1주 전
          memberId: 1,
          getAlarm: 1,
        },
      ];
      alarms.value = dummyAlarms;
      unreadCount.value = dummyAlarms.filter((alarm) => alarm.isChecked === 0).length;
    } finally {
      isLoading.value = false;
    }
  };

  const fetchUnreadCount = async () => {
    try {
      const count = await alarmService.getUnreadAlarmCount();
      unreadCount.value = count;
    } catch (error) {
      console.error("미확인 알림 개수 조회 실패:", error);
    }
  };

  const markAlarmAsRead = async (alarmId: number) => {
    try {
      const success = await alarmService.markAlarmAsRead(alarmId);
      if (success) {
        // 로컬 상태 업데이트
        const alarm = alarms.value.find((a) => a.id === alarmId);
        if (alarm && alarm.isChecked === 0) {
          alarm.isChecked = 1;
          unreadCount.value = Math.max(0, unreadCount.value - 1);
        }
      }
      return success;
    } catch (error) {
      console.error("알림 읽음 처리 실패:", error);
      return false;
    }
  };

  const deleteAlarm = async (alarmId: number) => {
    try {
      const success = await alarmService.deleteAlarm(alarmId);
      if (success) {
        // 로컬 상태에서 알림 제거
        const alarmIndex = alarms.value.findIndex((a) => a.id === alarmId);
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
      console.error("알림 삭제 실패:", error);
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
      console.error("알림 설정 업데이트 실패:", error);
      return false;
    } finally {
      isSaving.value = false;
    }
  };

  const updateLocalAlarmSetting = (type: number, isChecked: boolean) => {
    switch (type) {
      case 2:
        alarmSettings.value.marketChange = isChecked;
        break;
      case 3:
        alarmSettings.value.contractExpiry = isChecked;
        break;
    }
  };

  const resetStore = () => {
    alarms.value = [];
    unreadCount.value = 0;
    isLoading.value = false;
    isSaving.value = false;
    alarmSettings.value = {
      marketChange: true,
      contractExpiry: false,
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
    resetStore,
  };
});
