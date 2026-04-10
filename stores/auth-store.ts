"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { User, UserRole } from "@/types";

interface AuthState {
  token: string | null;
  user: User | null;
  role: UserRole | null;
  setSession: (token: string, user: User) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      token: null,
      user: null,
      role: null,
      setSession: (token, user) =>
        set({
          token,
          user,
          role: user.role,
        }),
      logout: () =>
        set({
          token: null,
          user: null,
          role: null,
        }),
    }),
    {
      name: "akij-auth-store",
    },
  ),
);
