"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useAuthStore } from "@/stores/auth-store";
import type { UserRole } from "@/types";

export function useAuthGuard(expectedRole: UserRole, redirectPath: string) {
  const router = useRouter();
  const role = useAuthStore((state) => state.role);
  const token = useAuthStore((state) => state.token);

  useEffect(() => {
    if (!token || role !== expectedRole) {
      router.replace(redirectPath);
    }
  }, [expectedRole, redirectPath, role, router, token]);
}
