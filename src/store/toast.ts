import { create } from "zustand";

export interface ToastItem {
  id: number;
  title: string;
  description?: string;
  variant: "default" | "error" | "success";
}

interface ToastState {
  toasts: ToastItem[];
  push: (toast: Omit<ToastItem, "id">) => void;
  dismiss: (id: number) => void;
}

let toastId = 0;

export const useToastStore = create<ToastState>()((set) => ({
  toasts: [],
  push: (toast) => {
    const id = ++toastId;
    set((state) => ({ toasts: [...state.toasts.slice(-2), { ...toast, id }] }));
    setTimeout(() => {
      set((state) => ({ toasts: state.toasts.filter((t) => t.id !== id) }));
    }, 3200);
  },
  dismiss: (id) =>
    set((state) => ({ toasts: state.toasts.filter((t) => t.id !== id) })),
}));

export function toast(
  title: string,
  opts?: { description?: string; variant?: ToastItem["variant"] }
) {
  useToastStore
    .getState()
    .push({ title, description: opts?.description, variant: opts?.variant ?? "default" });
}
