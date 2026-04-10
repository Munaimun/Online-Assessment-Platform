import Link from "next/link";
import { BadgeCheck } from "lucide-react";
import { CandidateTestShell } from "@/components/candidate/candidate-test-shell";

export default function CandidateExamCompletedPage() {
  return (
    <CandidateTestShell centerTitle="Akij Resource">
      <section className="rounded-3xl border border-[#dde2ea] bg-white px-6 py-14 text-center md:px-10 md:py-16">
        <div className="mx-auto mb-4 inline-flex h-12 w-12 items-center justify-center rounded-full bg-[#2f8ae4] text-white">
          <BadgeCheck size={26} />
        </div>
        <h1 className="text-[44px] font-semibold text-[#344154] md:text-[46px]">Test Completed</h1>
        <p className="mx-auto mt-3 max-w-4xl text-[30px] text-[#63728a] md:text-[34px]">
          Congratulations! Md. Naimur Rahman, You have completed your MCQ Exam for Probationary Officer.
          Thank you for participating.
        </p>
        <Link
          href="/candidate/dashboard"
          className="mt-6 inline-flex h-11 items-center justify-center rounded-xl border border-[#d1d8e4] px-5 text-[18px] font-semibold text-[#364255] md:text-[32px]"
        >
          Back to Dashboard
        </Link>
      </section>
    </CandidateTestShell>
  );
}
