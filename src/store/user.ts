import { create } from "zustand";

export interface StoreUser {
  id: string;
  name: string;
  email: string;
  role: string;
}

interface UserState {
  user: StoreUser | null;
  setUser: (user: StoreUser) => void;
  clearUser: () => void;
}

export const useUserStore = create<UserState>()((set) => ({
  user: null,
  setUser: (user) => set({ user }),
  clearUser: () => {
    set({ user: null });
    if (typeof window !== "undefined") {
      localStorage.removeItem("access_token");
    }
  },
}));
