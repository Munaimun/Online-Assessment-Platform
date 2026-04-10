import { Mail, Phone } from "lucide-react";
import Link from "next/link";

interface EmployerAuthShellProps {
  children: React.ReactNode;
  title?: string;
}

export function EmployerAuthShell({ children, title = "Akij Resource" }: EmployerAuthShellProps) {
  return (
    <div className="min-h-screen bg-[#f4f5f7] text-[#354052]">
      <header className="border-b border-[#eceef2] bg-white">
        <div className="mx-auto flex h-18 w-full max-w-310 items-center justify-between px-4 md:px-6">
          <Link href="/employer/login" className="leading-none">
            <p className="text-[30px] font-black tracking-[-0.06em] text-[#3f3ca8] md:text-[38px]">AKJ</p>
            <p className="-mt-2 text-[8px] font-semibold uppercase tracking-[0.22em] text-[#2f3543] md:text-[10px]">Resource</p>
          </Link>
          <p className="pr-6 text-[18px] font-semibold text-[#364253] md:pr-0 md:text-[44px]">{title}</p>
          <div className="w-10 md:w-[120px]" />
        </div>
      </header>

      <div className="mx-auto w-full max-w-310 px-4 py-8 md:px-6 md:py-12">{children}</div>

      <footer className="mt-10 bg-[#14083f] text-white">
        <div className="mx-auto flex w-full max-w-310 flex-col gap-4 px-4 py-5 md:h-21 md:flex-row md:items-center md:justify-between md:px-6 md:py-0">
          <div className="flex items-center gap-2 md:gap-3">
            <p className="text-[18px] leading-none md:text-[34px]">Powered by</p>
            <p className="text-[28px] font-black leading-none tracking-[-0.06em] md:text-[36px]">AKJ</p>
            <p className="text-[10px] font-semibold uppercase tracking-[0.16em] md:text-sm">Resource</p>
          </div>
          <div className="flex flex-col gap-2 text-sm md:flex-row md:items-center md:gap-5 md:text-[26px]">
            <span>Helpline</span>
            <span className="inline-flex items-center gap-2">
              <Phone size={20} /> +88 011020202505
            </span>
            <span className="inline-flex items-center gap-2">
              <Mail size={20} /> support@akij.work
            </span>
          </div>
        </div>
      </footer>
    </div>
  );
}
