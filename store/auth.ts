import { create } from "zustand";
import { persist } from "zustand/middleware";
import Cookies from "js-cookie";

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
}

interface AuthStore {
  user: User | null;
  accessToken: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  setUser: (user: User) => void;
  setTokens: (accessToken: string, refreshToken: string) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set) => ({
      user: null,
      accessToken: null,
      refreshToken: null,
      isAuthenticated: false,

      setUser: (user) => set({ user, isAuthenticated: true }),

      setTokens: (accessToken, refreshToken) => {
        Cookies.set("accessToken", accessToken, { sameSite: "strict" });
        Cookies.set("refreshToken", refreshToken, { sameSite: "strict" });
        set({ accessToken, refreshToken });
      },

      logout: () => {
        // Clear Zustand state
        set({
          user: null,
          accessToken: null,
          refreshToken: null,
          isAuthenticated: false,
        });

        // Remove cookies
        Cookies.remove("accessToken");
        Cookies.remove("refreshToken");
      },
    }),
    {
      name: "auth-store",
    }
  )
);
