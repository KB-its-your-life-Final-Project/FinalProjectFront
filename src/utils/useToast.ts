import { ref } from "vue";

let idCounter = 0;
export type ToastType = "success" | "error" | "info";
export interface Toast {
  id: number;
  message: string;
  type: ToastType;
  duration: number;
}

const toasts = ref<Toast[]>([]);

export function useToast() {
  const createToast = (message: string, type?: Toast["type"], duration?: number) => {
    return {
      id: idCounter++,
      message,
      type: type ?? "info",
      duration: duration ?? 1500,
    };
  };
  const addToast = (toast: Toast) => {
    toasts.value.push(toast);
    setTimeout(() => removeToast(toast.id), toast.duration);
  };

  const removeToast = (id: number) => {
    toasts.value = toasts.value.filter((t) => t.id !== id);
  };

  return { toasts, createToast, addToast, removeToast };
}
