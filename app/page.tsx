import Link from "next/link";
import { ArrowRight, BriefcaseBusiness, UserRoundSearch } from "lucide-react";
import { Card } from "@/components/ui/card";

export default function Home() {
  return (
    <main className="mx-auto min-h-screen w-full max-w-6xl px-4 py-12">
      <div className="mb-10 rounded-3xl border border-zinc-200 bg-white/85 p-8 shadow-[0_16px_44px_rgba(0,0,0,0.08)] backdrop-blur">
        <p className="text-xs font-bold uppercase tracking-[0.25em] text-zinc-600">Assessment Platform</p>
        <h1 className="mt-3 text-4xl font-black tracking-tight text-zinc-900 md:text-5xl">
          Akij Online Assessment
        </h1>
        <p className="mt-4 max-w-3xl text-sm text-zinc-600 md:text-base">
          A simplified yet complete interview assessment system with dedicated Employer and Candidate
          workflows, multi-step test creation, timed exam sessions, and behavior tracking.
        </p>
      </div>

      <section className="grid gap-5 md:grid-cols-2">
        <Card className="space-y-4 border-amber-200 bg-linear-to-br from-[#fff5de] to-[#ffdca7]">
          <BriefcaseBusiness className="text-zinc-900" size={26} />
          <h2 className="text-2xl font-bold text-zinc-900">Employer Panel</h2>
          <p className="text-sm text-zinc-700">
            Login, view exams, inspect candidates, and create online tests through a two-step form with
            editable question sets.
          </p>
          <Link
            href="/employer/login"
            className="inline-flex items-center gap-2 rounded-xl bg-zinc-900 px-4 py-2 text-sm font-semibold text-white"
          >
            Open Employer Panel <ArrowRight size={16} />
          </Link>
        </Card>

        <Card className="space-y-4 border-teal-200 bg-linear-to-br from-[#dbfffb] to-[#b1f4ea]">
          <UserRoundSearch className="text-zinc-900" size={26} />
          <h2 className="text-2xl font-bold text-zinc-900">Candidate Panel</h2>
          <p className="text-sm text-zinc-700">
            Login, browse available assessments, attempt exams with countdown timer, and auto-submit on
            timeout.
          </p>
          <Link
            href="/candidate/login"
            className="inline-flex items-center gap-2 rounded-xl bg-zinc-900 px-4 py-2 text-sm font-semibold text-white"
          >
            Open Candidate Panel <ArrowRight size={16} />
          </Link>
        </Card>
      </section>
    </main>
  );
}
