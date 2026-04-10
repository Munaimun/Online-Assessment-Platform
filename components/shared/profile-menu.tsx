"use client";

import { ChevronDown } from "lucide-react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/stores/auth-store";

interface ProfileMenuProps {
  name: string;
  refId: string;
  compact?: boolean;
}

export function ProfileMenu({ name, refId, compact = false }: ProfileMenuProps) {
  const router = useRouter();
  const logout = useAuthStore((state) => state.logout);

  const onLogout = () => {
    logout();
    router.replace("/");
  };

  return (
    <details className="relative">
      <summary className="list-none">
        <span className="flex cursor-pointer items-center gap-2 text-left">
          <span className="h-9 w-9 rounded-full bg-zinc-200 md:h-10 md:w-10" />
          <span className={compact ? "hidden" : "hidden md:block"}>
            <span className="block text-sm font-semibold text-[#3a4658]">{name}</span>
            <span className="block text-xs text-[#7d8696]">Ref.ID: {refId}</span>
          </span>
          <ChevronDown size={16} className="text-[#6f7784]" />
        </span>
      </summary>

      <div className="absolute right-0 z-50 mt-2 min-w-40 rounded-xl border border-[#d8dde7] bg-white p-1.5 shadow-xl">
        <button
          type="button"
          onClick={onLogout}
          className="block w-full rounded-lg px-3 py-2 text-left text-sm font-semibold text-[#374356] hover:bg-[#f3f5f9]"
        >
          Logout
        </button>
      </div>
    </details>
  );
}
