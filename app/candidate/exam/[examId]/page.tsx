"use client";

import { useMutation, useQuery } from "@tanstack/react-query";
import { Redo2, Undo2 } from "lucide-react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useCallback, useMemo, useRef, useState } from "react";
import { CandidateTestShell } from "@/components/candidate/candidate-test-shell";
import { useAuthGuard } from "@/hooks/use-auth-guard";
import { useBehaviorTracking } from "@/hooks/use-behavior-tracking";
import { useExamTimer } from "@/hooks/use-exam-timer";
import { fetchExamById, submitOnlineExam } from "@/lib/api";
import { useExamAttemptStore } from "@/stores/exam-attempt-store";
import type { BehaviorEvent } from "@/types";

const EMPTY_ANSWERS: Record<string, string | string[]> = {};
const EMPTY_BEHAVIOR_EVENTS: BehaviorEvent[] = [];

export default function CandidateExamPage() {
  useAuthGuard("candidate", "/candidate/login");

  const router = useRouter();
  const params = useParams<{ examId: string }>();
  const examId = params.examId;

  const [index, setIndex] = useState(0);
  const [timeoutOpen, setTimeoutOpen] = useState(false);

  const answersByExam = useExamAttemptStore((state) => state.answersByExam);
  const behaviorByExam = useExamAttemptStore((state) => state.behaviorByExam);
  const answers = answersByExam[examId] ?? EMPTY_ANSWERS;
  const behaviorEvents = behaviorByExam[examId] ?? EMPTY_BEHAVIOR_EVENTS;
  const setAnswer = useExamAttemptStore((state) => state.setAnswer);
  const pushBehaviorEvent = useExamAttemptStore((state) => state.pushBehaviorEvent);
  const clearExamAttempt = useExamAttemptStore((state) => state.clearExamAttempt);

  const query = useQuery({
    queryKey: ["exam", examId],
    queryFn: () => fetchExamById(examId),
    retry: false,
  });

  const timedOutRef = useRef(false);
  const hasSubmittedRef = useRef(false);

  const submitMutation = useMutation({
    mutationFn: () =>
      submitOnlineExam(examId, {
        answers,
        behaviorEvents,
        submittedAt: new Date().toISOString(),
      }),
    onSuccess: () => {
      clearExamAttempt(examId);
      if (!timedOutRef.current) {
        router.push("/candidate/exam/completed");
      }
    },
  });

  const submitNow = useCallback(() => {
    if (hasSubmittedRef.current || submitMutation.isPending) {
      return;
    }

    hasSubmittedRef.current = true;
    submitMutation.mutate();
  }, [submitMutation]);

  const handleTimeout = useCallback(() => {
    timedOutRef.current = true;
    setTimeoutOpen(true);
    submitNow();
  }, [submitNow]);

  const timer = useExamTimer(query.data?.duration ?? 1, handleTimeout);

  useBehaviorTracking({
    onEvent: (event) => {
      pushBehaviorEvent(examId, event);
    },
  });

  const questions = query.data?.questions ?? [];
  const currentQuestion = questions[index];

  const statusCode = (query.error as { response?: { status?: number } } | undefined)?.response?.status;

  const formattedTime = useMemo(() => {
    const parts = timer.formatted.split(":");
    if (parts.length !== 2) {
      return timer.formatted;
    }

    return `${parts[0]}:${parts[1]} left`;
  }, [timer.formatted]);

  if (query.isLoading) {
    return (
      <CandidateTestShell centerTitle="Akij Resource">
        <div className="mx-auto flex min-h-[60vh] max-w-3xl items-center justify-center px-4">
          <div className="w-full rounded-3xl border border-[#dbe0e9] bg-white p-8 text-center shadow-[0_18px_50px_rgba(18,24,40,0.08)]">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-[#efeaff]">
              <div className="h-7 w-7 animate-spin rounded-full border-4 border-[#cbbcff] border-t-[#5d2ff0]" />
            </div>
            <h2 className="mt-5 text-2xl font-semibold text-[#344154]">Loading exam</h2>
            <p className="mt-2 text-sm text-[#63728a]">Preparing your test and restoring your session. Please wait a moment.</p>

            <div className="mt-6 space-y-3 text-left">
              <div className="h-4 w-24 rounded-full bg-[#e9edf4]" />
              <div className="h-20 rounded-2xl bg-[#f6f8fc]" />
              <div className="grid gap-3 md:grid-cols-2">
                <div className="h-12 rounded-xl bg-[#f6f8fc]" />
                <div className="h-12 rounded-xl bg-[#f6f8fc]" />
              </div>
            </div>
          </div>
        </div>
      </CandidateTestShell>
    );
  }

  if (query.isError || !query.data) {
    return (
      <CandidateTestShell centerTitle="Akij Resource">
        <div className="mx-auto max-w-2xl rounded-2xl border border-[#dbe0e9] bg-white p-8 text-center">
          <h2 className="text-2xl font-semibold text-[#344154]">
            {statusCode === 404 ? "Exam not available" : "Unable to load exam"}
          </h2>
          <p className="mt-2 text-sm text-[#5b6677]">
            {statusCode === 404
              ? "This exam was not found or is no longer available. Please go back to the dashboard."
              : "Something went wrong while loading the exam. Please try again."}
          </p>
          <div className="mt-6 flex justify-center gap-3">
            <button
              type="button"
              onClick={() => query.refetch()}
              className="inline-flex h-10 items-center justify-center rounded-xl border border-[#d3d9e4] px-5 text-sm font-semibold text-[#344154]"
            >
              Retry
            </button>
            <Link
              href="/candidate/dashboard"
              className="inline-flex h-10 items-center justify-center rounded-xl bg-linear-to-r from-[#5d2ff0] to-[#6f3bf7] px-5 text-sm font-semibold text-white"
            >
              Back to Dashboard
            </Link>
          </div>
        </div>
      </CandidateTestShell>
    );
  }

  if (!currentQuestion) {
    return (
      <CandidateTestShell centerTitle="Akij Resource">
        <div className="mx-auto max-w-2xl rounded-2xl border border-[#dbe0e9] bg-white p-8 text-center">
          <h2 className="text-2xl font-semibold text-[#344154]">No questions found</h2>
          <p className="mt-2 text-sm text-[#5b6677]">This exam is empty right now. Please contact support or return to the dashboard.</p>
          <Link
            href="/candidate/dashboard"
            className="mt-6 inline-flex h-10 items-center justify-center rounded-xl bg-linear-to-r from-[#5d2ff0] to-[#6f3bf7] px-5 text-sm font-semibold text-white"
          >
            Back to Dashboard
          </Link>
        </div>
      </CandidateTestShell>
    );
  }

  const currentValue = answers[currentQuestion.id];

  return (
    <CandidateTestShell centerTitle="Akij Resource">
      <div className="mx-auto w-full max-w-4xl space-y-4 md:space-y-6">
        <section className="flex items-center justify-between rounded-2xl border border-[#dbe0e9] bg-white px-4 py-3 md:px-5 md:py-4">
          <h2 className="text-[16px] font-semibold text-[#364255] md:text-[28px]">
            Question ({index + 1}/{questions.length})
          </h2>
          <div className="rounded-xl bg-[#eef0f4] px-4 py-2 text-[16px] font-semibold text-[#364255] md:text-[28px]">
            {formattedTime}
          </div>
        </section>

        <section className="rounded-2xl border border-[#dbe0e9] bg-white p-4 md:p-5">
          <p className="text-[18px] font-semibold leading-tight text-[#364255] md:text-[28px]">
            Q{index + 1}. {currentQuestion.title}
          </p>

          {currentQuestion.type === "radio" ? (
            <div className="mt-4 space-y-3">
              {currentQuestion.options?.map((option) => (
                <label key={option} className="flex min-h-10 cursor-pointer items-center gap-3 rounded-xl border border-[#d5d9e2] px-3 text-[14px] text-[#415065] md:text-[20px]">
                  <input
                    type="radio"
                    name={currentQuestion.id}
                    checked={currentValue === option}
                    onChange={() => setAnswer(examId, currentQuestion.id, option)}
                    className="h-5 w-5"
                  />
                  {option}
                </label>
              ))}
            </div>
          ) : null}

          {currentQuestion.type === "checkbox" ? (
            <div className="mt-4 space-y-3">
              {currentQuestion.options?.map((option) => {
                const selected = (currentValue as string[] | undefined) ?? [];
                return (
                  <label key={option} className="flex min-h-10 cursor-pointer items-center gap-3 rounded-xl border border-[#d5d9e2] px-3 text-[14px] text-[#415065] md:text-[20px]">
                    <input
                      type="checkbox"
                      checked={selected.includes(option)}
                      onChange={(event) => {
                        if (event.target.checked) {
                          setAnswer(examId, currentQuestion.id, [...selected, option]);
                        } else {
                          setAnswer(
                            examId,
                            currentQuestion.id,
                            selected.filter((value) => value !== option),
                          );
                        }
                      }}
                      className="h-5 w-5"
                    />
                    {option}
                  </label>
                );
              })}
            </div>
          ) : null}

          {currentQuestion.type === "text" ? (
            <div className="mt-4 rounded-xl border border-[#d5d9e2]">
              <div className="flex h-12 items-center gap-3 rounded-t-xl bg-[#f8f9fb] px-4 text-sm text-[#354052]">
                <Undo2 size={14} />
                <Redo2 size={14} />
                <span>Normal text</span>
                <span className="font-bold">B</span>
                <span className="italic">I</span>
                <span className="underline">U</span>
              </div>
              <textarea
                rows={5}
                placeholder="Type questions here.."
                value={(currentValue as string | undefined) ?? ""}
                onChange={(event) => setAnswer(examId, currentQuestion.id, event.target.value)}
                className="h-44 w-full resize-none rounded-b-xl p-3 text-sm outline-none md:text-[18px]"
              />
            </div>
          ) : null}

          <div className="mt-4 hidden items-center justify-between md:flex">
            <button
              type="button"
              onClick={() => setIndex((prev) => (prev + 1 < questions.length ? prev + 1 : prev))}
              className="inline-flex h-10 items-center justify-center rounded-xl border border-[#d3d9e4] px-4 text-sm font-semibold text-[#344154] md:text-base"
            >
              Skip this Question
            </button>

            <button
              type="button"
              onClick={() => {
                if (index + 1 < questions.length) {
                  setIndex((prev) => prev + 1);
                  return;
                }

                submitNow();
              }}
              className="inline-flex h-10 items-center justify-center rounded-xl bg-linear-to-r from-[#5d2ff0] to-[#6f3bf7] px-5 text-sm font-semibold text-white"
            >
              Save & Continue
            </button>
          </div>

          <div className="mt-4 flex flex-col gap-3 md:hidden">
            <button
              type="button"
              onClick={() => {
                if (index + 1 < questions.length) {
                  setIndex((prev) => prev + 1);
                  return;
                }

                submitNow();
              }}
              className="inline-flex h-11 items-center justify-center rounded-xl bg-linear-to-r from-[#5d2ff0] to-[#6f3bf7] text-base font-semibold text-white"
            >
              Save & Continue
            </button>
            <button
              type="button"
              onClick={() => setIndex((prev) => (prev + 1 < questions.length ? prev + 1 : prev))}
              className="inline-flex h-11 items-center justify-center rounded-xl border border-[#d3d9e4] text-base font-semibold text-[#344154]"
            >
              Skip this Question
            </button>
          </div>
        </section>
      </div>

      {timeoutOpen ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/55 p-4 backdrop-blur-sm">
          <div className="w-full max-w-xl overflow-hidden rounded-3xl bg-white shadow-[0_22px_70px_rgba(0,0,0,0.2)]">
            <div className="h-2 bg-linear-to-r from-[#5d2ff0] via-[#7a56f4] to-[#2f8ae4]" />
            <div className="p-6 text-center md:p-8">
              <div className="mx-auto inline-flex h-16 w-16 items-center justify-center rounded-full bg-[#eff4ff] text-[#2f8ae4] shadow-inner">
                <span className="text-3xl font-black leading-none">!</span>
              </div>
              <h3 className="mt-5 text-3xl font-semibold text-[#344154]">Timeout</h3>
              <p className="mt-3 text-base leading-7 text-[#63728a] md:text-lg">
                Dear Md. Naimur Rahman, your exam time has finished. Your submission has been saved and you can return to the dashboard.
              </p>

              <div className="mt-7 flex flex-col justify-center gap-3 sm:flex-row">
                <Link
                  href="/candidate/dashboard"
                  className="inline-flex h-11 items-center justify-center rounded-xl bg-linear-to-r from-[#5d2ff0] to-[#6f3bf7] px-5 text-sm font-semibold text-white"
                >
                  Back to Dashboard
                </Link>
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </CandidateTestShell>
  );
}
