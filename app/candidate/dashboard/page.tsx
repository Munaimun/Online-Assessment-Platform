"use client";

import { useQuery } from "@tanstack/react-query";
import { CircleX, Clock3, FileText, Search } from "lucide-react";
import Link from "next/link";
import { useMemo } from "react";
import { EmployerShell } from "@/components/employer/employer-shell";
import { useAuthGuard } from "@/hooks/use-auth-guard";
import { fetchExams } from "@/lib/api";
import { useAuthStore } from "@/stores/auth-store";

export default function CandidateDashboardPage() {
  useAuthGuard("candidate", "/candidate/login");
  const user = useAuthStore((state) => state.user);

  const query = useQuery({
    queryKey: ["candidate-exams", user?.email],
    queryFn: () => fetchExams("candidate", user?.email),
    enabled: Boolean(user?.email),
  });

  const exams = useMemo(() => query.data ?? [], [query.data]);

  return (
    <EmployerShell pageTitle="Dashboard">
      <div className="space-y-6">
        <div className="flex flex-col gap-4 md:flex-row md:items-center">
          <h1 className="w-62.5 text-[38px] font-semibold text-[#354052]">Online Tests</h1>

          <div className="relative flex-1">
            <input
              type="text"
              placeholder="Search by exam title"
              className="h-11.5 w-full rounded-xl border border-[#cec6ff] bg-white px-4 pr-12 text-sm outline-none"
            />
            <span className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full bg-[#efe9ff] p-2 text-[#683ef8]">
              <Search size={16} />
            </span>
          </div>
            {query.isLoading ? (
              <section className="grid gap-4 md:grid-cols-2">
                {[0, 1].map((item) => (
                  <article key={item} className="animate-pulse rounded-2xl border border-[#e7e9ee] bg-white p-5">
                    <div className="h-7 w-2/3 rounded bg-[#e8ebf2]" />
                    <div className="mt-4 grid grid-cols-3 gap-2">
                      <div className="h-5 rounded bg-[#eef1f6]" />
                      <div className="h-5 rounded bg-[#eef1f6]" />
                      <div className="h-5 rounded bg-[#eef1f6]" />
                    </div>
                    <div className="mt-5 h-10 w-28 rounded-xl bg-[#ece8ff]" />
                  </article>
                ))}
              </section>
            ) : query.isError ? (
              <section className="rounded-2xl border border-[#e7e9ee] bg-white px-6 py-12 text-center">
                <h2 className="text-2xl font-semibold text-[#364153]">Unable to load tests</h2>
                <p className="mt-2 text-sm text-[#6d7483]">Please refresh the page or try again in a moment.</p>
              </section>
            ) : exams.length === 0 ? (
              <section className="rounded-2xl border border-[#e7e9ee] bg-white px-6 py-12 text-center">
                <h2 className="text-2xl font-semibold text-[#364153]">No tests available</h2>
                <p className="mt-2 text-sm text-[#6d7483]">You do not have any assigned online tests right now.</p>
              </section>
            ) : (
              <section className="grid gap-4 md:grid-cols-2">
                {exams.map((exam) => (
                  <article key={exam.id} className="rounded-2xl border border-[#e7e9ee] bg-white p-5">
                    <h2 className="text-2xl font-semibold leading-tight text-[#364153]">{exam.title}</h2>

                    <div className="mt-4 grid grid-cols-3 gap-2 text-[#637089]">
                      <p className="inline-flex items-center gap-2 text-base">
                        <Clock3 size={16} /> Duration: <span className="font-semibold">{exam.duration} min</span>
                      </p>
                      <p className="inline-flex items-center gap-2 text-base">
                        <FileText size={16} /> Question: <span className="font-semibold">{exam.questions.length}</span>
                      </p>
                      <p className="inline-flex items-center gap-2 text-base">
                        <CircleX size={16} /> Negative Marking: <span className="font-semibold">-{exam.negativeMarking}/wrong</span>
                      </p>
                    </div>

                    <Link
                      href={`/candidate/exam/${exam.id}`}
                      className="mt-5 inline-flex h-10.5 min-w-28 items-center justify-center rounded-xl border border-[#6a41f5] px-5 text-base font-semibold text-[#6a41f5]"
                    >
                      Start
                    </Link>
                  </article>
                ))}
              </section>
            )}
            </button>
          </div>
        </div> */}
      </div>
    </EmployerShell>
  );
}
