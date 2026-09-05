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
      const preservedKeys = new Set(["jewelry-cart", "sacred-sanctuary-theme"]);

      for (const key of Object.keys(localStorage)) {
        if (!preservedKeys.has(key)) {
          localStorage.removeItem(key);
        }
      }

      sessionStorage.clear();
    }
  },
}));
