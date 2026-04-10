import { Mail, Phone } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { ProfileMenu } from "@/components/shared/profile-menu";

interface EmployerShellProps {
  children: React.ReactNode;
  pageTitle: string;
}

export function EmployerShell({ children, pageTitle }: EmployerShellProps) {
  return (
    <div className="flex min-h-screen flex-col bg-[#f4f5f7] text-[#354052]">
      <header className="border-b border-[#eceef2] bg-white">
        <div className="mx-auto flex h-18 w-full max-w-310 items-center justify-between px-6">
          <div className="flex items-center gap-12">
            <Link href="/employer/dashboard" className="leading-none">
              <div className="flex h-8 w-29 items-center">
                <Image
                  src="/logo.svg"
                  alt="AKJ Resource"
                  width={116}
                  height={32}
                  className="h-8 w-29 object-contain"
                  priority
                />
              </div>
            </Link>
            <p className="text-[20px] font-semibold text-[#364253]">{pageTitle}</p>
          </div>

          <div className="flex h-10 w-43 items-center justify-end">
            <ProfileMenu name="Arif Hossain" refId="16101121" />
          </div>
        </div>
      </header>

      <main className="mx-auto w-full max-w-310 flex-1 px-6 py-8">{children}</main>

      <footer className="mt-auto bg-[#14083f] text-white">
        <div className="mx-auto flex w-full max-w-310 flex-col gap-4 px-6 py-4 text-center md:h-21 md:flex-row md:items-center md:justify-between md:py-0 md:text-left">
          <div className="flex items-center justify-center gap-2 md:justify-start md:gap-3">
            <p className="leading-none text-white md:text-[24px]">Powered by</p>
            <Image
              src="/logo.svg"
              alt="AKJ Resource"
              width={116}
              height={32}
              className="h-8 w-29 object-contain"
              priority
            />
          </div>
          <div className="flex flex-col items-center gap-2 text-base md:flex-row md:gap-5 md:text-[16px]">
            <span>Helpline</span>
            <span className="inline-flex items-center gap-2">
              <Phone size={24} /> +88 011020202505
            </span>
            <span className="inline-flex items-center gap-2">
              <Mail size={24} /> support@akij.work
            </span>
          </div>
        </div>
      </footer>
    </div>
  );
}
