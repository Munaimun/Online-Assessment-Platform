"use client";

import { useQuery } from "@tanstack/react-query";
import { FileText, Search, Users, Waypoints } from "lucide-react";
import Link from "next/link";
import { useMemo, useState } from "react";
import { EmployerShell } from "@/components/employer/employer-shell";
import { Modal } from "@/components/ui/modal";
import { useAuthGuard } from "@/hooks/use-auth-guard";
import { fetchExams } from "@/lib/api";
import type { Exam } from "@/types";

export default function EmployerDashboardPage() {
  useAuthGuard("employer", "/employer/login");

  const [selectedExam, setSelectedExam] = useState<Exam | null>(null);

  const query = useQuery({
    queryKey: ["employer-exams"],
    queryFn: () => fetchExams("employer"),
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

          <Link
            href="/employer/tests/new"
            className="inline-flex h-11.5 min-w-47.5 items-center justify-center rounded-xl bg-linear-to-r from-[#5d2ff0] to-[#6f3bf7] px-6 text-[24px] font-semibold text-white"
          >
            Create Online Test
          </Link>
        </div>

        {query.isLoading ? <p className="text-sm text-[#6d7483]">Loading exams...</p> : null}

        {exams.length === 0 ? (
          <div className="rounded-2xl border border-[#eceef2] bg-white px-6 py-16 text-center">
            <div className="mx-auto mb-4 h-16 w-16 rounded-full bg-[#edf3ff]" />
            <h2 className="text-[42px] font-semibold text-[#334055]">No Online Test Available</h2>
            <p className="mt-2 text-[24px] text-[#7c8491]">
              Currently, there are no online tests available. Please check back later for updates.
            </p>
          </div>
        ) : (
          <section className="grid gap-4 md:grid-cols-2">
            {exams.map((exam) => (
              <article key={exam.id} className="rounded-2xl border border-[#e7e9ee] bg-white p-6">
                <h2 className="text-[28px] font-semibold leading-tight text-[#364153]">{exam.title}</h2>

                <div className="mt-4 grid grid-cols-3 gap-2 text-[#637089]">
                  <p className="inline-flex items-center gap-2 text-base">
                    <Users size={20} /> Candidates: <span className="font-semibold">{exam.totalCandidates.toLocaleString()}</span>
                  </p>
                  <p className="inline-flex items-center gap-2 text-base">
                    <FileText size={20} /> Question Set: <span className="font-semibold">{exam.questionSets}</span>
                  </p>
                  <p className="inline-flex items-center gap-2 text-base">
                    <Waypoints size={20} /> Exam Slots: <span className="font-semibold">{exam.totalSlots}</span>
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => setSelectedExam(exam)}
                  className="mt-5 inline-flex h-10.5 items-center justify-center rounded-xl border border-[#6a41f5] px-5 text-base font-semibold text-[#6a41f5]"
                >
                  View Cadidates
                </button>
              </article>
            ))}
          </section>
        )}

        <div className="flex items-center justify-between text-[20px] text-[#7b8494]">
          <div className="inline-flex items-center gap-4">
            <button type="button" className="h-8 w-8 rounded-lg border border-[#e4e8ef] bg-white">
              &lt;
            </button>
            <span>1</span>
            <button type="button" className="h-8 w-8 rounded-lg border border-[#e4e8ef] bg-white">
              &gt;
            </button>
          </div>
          {/* <div className="inline-flex items-center gap-3">
            <span>Online Test Per Page</span>
            <button type="button" className="rounded-lg border border-[#e4e8ef] bg-white px-3 py-1 text-[18px]">
              8
            </button>
          </div> */}
        </div>
      </div>

      <Modal open={Boolean(selectedExam)} title="Candidate List" onClose={() => setSelectedExam(null)}>
        <div className="space-y-2">
          <p className="text-sm text-zinc-600">{selectedExam?.title}</p>
          {selectedExam?.candidates.map((email) => (
            <div key={email} className="rounded-lg border border-zinc-200 bg-zinc-50 px-3 py-2 text-sm">
              {email}
            </div>
          ))}
        </div>
      </Modal>
    </EmployerShell>
  );
}
