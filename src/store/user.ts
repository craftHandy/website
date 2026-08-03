import { create } from "zustand";
import { persist } from "zustand/middleware";

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

export const useUserStore = create<UserState>()(
  persist(
    (set) => ({
      user: null,
      setUser: (user) => set({ user }),
      clearUser: () => set({ user: null }),
    }),
    {
      name: "jewelry-user",
    }
  )
);
