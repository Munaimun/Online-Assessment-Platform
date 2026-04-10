"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { BehaviorEvent } from "@/types";

interface ExamAttemptState {
  answersByExam: Record<string, Record<string, string | string[]>>;
  behaviorByExam: Record<string, BehaviorEvent[]>;
  setAnswer: (examId: string, questionId: string, value: string | string[]) => void;
  pushBehaviorEvent: (examId: string, event: BehaviorEvent) => void;
  clearExamAttempt: (examId: string) => void;
}

export const useExamAttemptStore = create<ExamAttemptState>()(
  persist(
    (set) => ({
      answersByExam: {},
      behaviorByExam: {},
      setAnswer: (examId, questionId, value) =>
        set((state) => ({
          answersByExam: {
            ...state.answersByExam,
            [examId]: {
              ...(state.answersByExam[examId] ?? {}),
              [questionId]: value,
            },
          },
        })),
      pushBehaviorEvent: (examId, event) =>
        set((state) => ({
          behaviorByExam: {
            ...state.behaviorByExam,
            [examId]: [...(state.behaviorByExam[examId] ?? []), event],
          },
        })),
      clearExamAttempt: (examId) =>
        set((state) => {
          const answersByExam = { ...state.answersByExam };
          const behaviorByExam = { ...state.behaviorByExam };
          delete answersByExam[examId];
          delete behaviorByExam[examId];

          return {
            answersByExam,
            behaviorByExam,
          };
        }),
    }),
    {
      name: "akij-exam-attempt-store",
    },
  ),
);
