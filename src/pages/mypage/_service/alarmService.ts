import { Api } from "@/api/autoLoad/Api";
import type {
  AlarmSettingRequestDto,
  AlarmResponseDto
} from "@/api/autoLoad/data-contracts";

class AlarmService {
  private api: Api;

  constructor() {
    this.api = new Api();
  }

  /**
   * 미확인 알림 개수 조회 (재시도 로직 포함)
   */
  async getUnreadAlarmCount(retryCount = 0): Promise<number> {
    const maxRetries = 2;

    try {
      const response = await this.api.getUnreadAlarmCountUsingGet("");
      if (response.data.success) {
        return response.data.data || 0;
      }
      return 0;
    } catch (error) {
      console.error(`미확인 알림 개수 조회 실패 (시도 ${retryCount + 1}):`, error);

      // 에러 타입에 따른 상세 로깅
      if (error instanceof Error) {
        console.error('에러 메시지:', error.message);
        console.error('에러 스택:', error.stack);
      }

      // 재시도 로직: 네트워크 에러나 타임아웃 에러인 경우에만 재시도
      if (retryCount < maxRetries) {
        const isNetworkError = error instanceof Error &&
          (error.message.includes('Network Error') ||
           error.message.includes('timeout') ||
           error.message.includes('ECONNABORTED'));

        if (isNetworkError) {
          console.log(`${1000 * (retryCount + 1)}ms 후 재시도...`);
          await new Promise(resolve => setTimeout(resolve, 1000 * (retryCount + 1)));
          return this.getUnreadAlarmCount(retryCount + 1);
        }
      }

      return 0;
    }
  }

  /**
   * 알림 목록 조회
   */
  async getAlarmList(): Promise<AlarmResponseDto[]> {
    try {
      const response = await this.api.getAlarmListUsingGet("");
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

      const response = await this.api.updateAlarmSettingUsingPost(requestData);

      console.log('알림 설정 변경 응답:', response);
      return response.data.success || false;
    } catch (error) {
      console.error('알림 설정 변경 실패:', error);
      return false;
    }
  }

  /**
   * 알림 읽음 처리
   */
  async markAlarmAsRead(alarmId: number): Promise<boolean> {
    try {
      const response = await this.api.markAlarmReadUsingPut(alarmId, "");
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
      getAlarm: isChecked ? 1 : 0
    };

    return await this.updateAlarmSetting(requestData);
  }

  /**
   * 알림 삭제제
   */
  async deleteAlarm(alarmId: number): Promise<boolean> {
    try {

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
