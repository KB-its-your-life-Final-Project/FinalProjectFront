import { ref } from "vue";

let idCounter = 0;

/**
 * 토스트 알림 타입
 */
export type ToastType = "success" | "error" | "info";

/**
 * 토스트 알림 객체 인터페이스
 */
export interface Toast {
  id: number;
  message: string;
  type: ToastType;
  duration: number;
}

/**
 * 현재 화면에 표시 중인 토스트 배열
 */
const toasts = ref<Toast[]>([]);

/**
 * 토스트 알림 훅
 * @returns toasts 배열과 토스트 생성/추가/제거 함수
 */
export function useToast() {
  /**
   * 토스트 객체 생성
   * @param message - 표시할 메시지
   * @param type - 토스트 타입 (기본: info)
   * @param duration - 표시 시간 (기본: 1500ms)
   * @returns 생성된 Toast 객체
   */
  const createToast = (message: string, type?: Toast["type"], duration?: number) => {
    return {
      id: idCounter++,
      message,
      type: type ?? "info",
      duration: duration ?? 1500,
    };
  };

  /**
   * 토스트 추가
   * @param toast - 추가할 Toast 객체
   */
  const addToast = (toast: Toast) => {
    toasts.value.push(toast);
    // 지정 시간 후 자동 제거
    setTimeout(() => removeToast(toast.id), toast.duration);
  };

  /**
   * 특정 토스트 제거
   * @param id - 제거할 토스트 ID
   */
  const removeToast = (id: number) => {
    toasts.value = toasts.value.filter((t) => t.id !== id);
  };

  return { toasts, createToast, addToast, removeToast };
}
