import { Api } from "@/api/autoLoad/Api";
import type {
  AlarmSettingRequestDto,
  AlarmResponseDto,
  ApiResponseListAlarmResponseDto,
  ApiResponseInt,
  ApiResponseVoid
} from "@/api/autoLoad/data-contracts";

class AlarmService {
  private api: Api;

  constructor() {
    this.api = new Api();
  }

  /**
   * 미확인 알림 개수 조회
   */
  async getUnreadAlarmCount(token: string): Promise<number> {
    try {
      const response = await this.api.getUnreadAlarmCountUsingGet(token);
      if (response.data.success) {
        return response.data.data || 0;
      }
      return 0;
    } catch (error) {
      console.error('미확인 알림 개수 조회 실패:', error);
      return 0;
    }
  }

  /**
   * 알림 목록 조회
   */
  async getAlarmList(token: string): Promise<AlarmResponseDto[]> {
    try {
      const response = await this.api.getAlarmListUsingGet(token);
      if (response.data.success) {
        return response.data.data || [];
      }
      return [];
    } catch (error) {
      console.error('알림 목록 조회 실패:', error);
      return [];
    }
  }

  /**
   * 알림 설정 변경
   */
  async updateAlarmSetting(requestData: AlarmSettingRequestDto): Promise<boolean> {
    try {
      const response = await this.api.updateAlarmSettingUsingPut(requestData);
      return response.data.success || false;
    } catch (error) {
      console.error('알림 설정 변경 실패:', error);
      return false;
    }
  }

  /**
   * 알림 읽음 처리
   */
  async markAlarmAsRead(alarmId: number, token: string): Promise<boolean> {
    try {
      const response = await this.api.markAlarmReadUsingPut(alarmId, token);
      return response.data.success || false;
    } catch (error) {
      console.error('알림 읽음 처리 실패:', error);
      return false;
    }
  }

  /**
   * 특정 타입의 알림 설정 변경
   */
  async updateAlarmSettingByType(type: number, isChecked: boolean): Promise<boolean> {
    const requestData: AlarmSettingRequestDto = {
      type: type,
      isChecked: isChecked ? 1 : 0
    };

    return await this.updateAlarmSetting(requestData);
  }

  /**
   * 알림 삭제 (백엔드 API가 구현되면 실제 호출)
   */
  async deleteAlarm(alarmId: number, token: string): Promise<boolean> {
    try {
      // TODO: 백엔드에 삭제 API가 구현되면 실제 호출
      // const response = await this.api.deleteAlarmUsingDelete(alarmId, token);
      // return response.data.success || false;

      console.log('알림 삭제 요청:', alarmId);
      return true; // 임시로 성공 반환
    } catch (error) {
      console.error('알림 삭제 실패:', error);
      return false;
    }
  }
}

export const alarmService = new AlarmService();
export default alarmService;
