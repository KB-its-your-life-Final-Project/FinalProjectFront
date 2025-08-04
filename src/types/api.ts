//api 호출시 타입 정의
export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  code: number;
}
