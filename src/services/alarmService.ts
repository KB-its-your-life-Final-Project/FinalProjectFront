import { Api } from "@/api/autoLoad/Api";
import type {
  AlarmSettingRequestDto,
  AlarmResponseDto,
  ApiResponseListAlarmResponseDto,
  ApiResponseInt,
  ApiResponseVoid
} from "@/api/autoLoad/data-contracts";
import axios from 'axios';

class AlarmService {
  private api: Api;

  constructor() {
    this.api = new Api();
  }

  /**
   * 미확인 알림 개수 조회
   */
  async getUnreadAlarmCount(): Promise<number> {
    try {
      const response = await this.api.getUnreadAlarmCountUsingGet("");
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
      // 디버깅: 요청 데이터 로그
      console.log('알림 설정 변경 요청 데이터:', requestData);
      console.log('현재 쿠키:', document.cookie);

      // Api.ts의 파라미터 순서 문제를 우회하기 위해 직접 axios 사용
      const response = await axios.post('/api/alarm/settings', requestData, {
        withCredentials: true, // 쿠키 포함
        headers: {
          'Content-Type': 'application/json'
        }
      });

      console.log('알림 설정 변경 응답:', response);
      return response.data.success || false;
    } catch (error) {
      console.error('알림 설정 변경 실패:', error);
      console.error('에러 상세 정보:', {
        message: error.message,
        status: error.response?.status,
        statusText: error.response?.statusText,
        data: error.response?.data,
        headers: error.response?.headers
      });
      return false;
    }
  }

  /**
   * 알림 읽음 처리
   */
  async markAlarmAsRead(alarmId: number): Promise<boolean> {
    try {
      // Api.ts의 파라미터 순서 문제를 우회하기 위해 직접 axios 사용
      const response = await axios.put(`/api/alarm/${alarmId}/read`, {}, {
        withCredentials: true, // 쿠키 포함
        headers: {
          'Content-Type': 'application/json'
        }
      });
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
   * 알림 삭제 (백엔드 API가 구현되면 실제 호출)
   */
  async deleteAlarm(alarmId: number): Promise<boolean> {
    try {
      // TODO: 백엔드에 삭제 API가 구현되면 실제 호출
      // const response = await this.api.deleteAlarmUsingDelete(alarmId, "");
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
