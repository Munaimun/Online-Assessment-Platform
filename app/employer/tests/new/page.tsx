"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { zodResolver } from "@hookform/resolvers/zod";
import { Check, Circle, Clock3, Pencil, Plus, Trash2 } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import { z } from "zod";
import { EmployerShell } from "@/components/employer/employer-shell";
import { useAuthGuard } from "@/hooks/use-auth-guard";
import { createOnlineTest } from "@/lib/api";
import { makeId } from "@/lib/utils";

type Step = 1 | 2;
type LocalQuestionType = "radio" | "checkbox" | "text";

interface LocalOption {
  id: string;
  label: string;
  content: string;
  isCorrect: boolean;
}

interface LocalQuestion {
  id: string;
  questionTitle: string;
  score: number;
  type: LocalQuestionType;
  prompt: string;
  options: LocalOption[];
}

const basicInfoSchema = z.object({
  title: z.string().min(1, "Required"),
  totalCandidates: z.number().min(1, "Required"),
  totalSlots: z.number().min(1, "Required"),
  questionSets: z.number().min(1, "Required"),
  questionType: z.enum(["radio", "checkbox", "text"]),
  startTime: z.string().min(1, "Required"),
  endTime: z.string().min(1, "Required"),
  duration: z.number().min(1, "Required"),
});

type BasicInfoForm = z.infer<typeof basicInfoSchema>;

const LETTERS = ["A", "B", "C", "D", "E", "F", "G"];

function getNewOption(index: number): LocalOption {
  return {
    id: makeId("opt"),
    label: LETTERS[index] ?? String.fromCharCode(65 + index),
    content: "",
    isCorrect: index === 0,
  };
}

function getEmptyQuestion(type: LocalQuestionType): LocalQuestion {
  const baseOptions = type === "text" ? [getNewOption(0)] : [getNewOption(0), getNewOption(1), getNewOption(2)];
  return {
    id: makeId("question"),
    questionTitle: "Question 1",
    score: 1,
    type,
    prompt: "",
    options: baseOptions,
  };
}

export default function CreateTestPage() {
  useAuthGuard("employer", "/employer/login");
  const router = useRouter();
  const queryClient = useQueryClient();

  const [step, setStep] = useState<Step>(1);
  const [isBasicInfoSaved, setIsBasicInfoSaved] = useState(false);
  const [isQuestionModalOpen, setIsQuestionModalOpen] = useState(false);
  const [questions, setQuestions] = useState<LocalQuestion[]>([]);
  const [currentQuestion, setCurrentQuestion] = useState<LocalQuestion>(getEmptyQuestion("radio"));
  const [editingQuestionId, setEditingQuestionId] = useState<string | null>(null);
  const [publishError, setPublishError] = useState<string | null>(null);

  const basicForm = useForm<BasicInfoForm>({
    resolver: zodResolver(basicInfoSchema),
    defaultValues: {
      title: "",
      totalCandidates: 10000,
      totalSlots: 3,
      questionSets: 2,
      questionType: "radio",
      startTime: "",
      endTime: "",
      duration: 30,
    },
  });

  const values = useWatch({
    control: basicForm.control,
  });

  const stepClass = (target: Step) => {
    const isDone = target < step || (target === 1 && isBasicInfoSaved);
    const isCurrent = target === step;

    if (isDone || isCurrent) {
      return "bg-[#5f32f1] text-white";
    }

    return "bg-[#d6dae2] text-[#80889a]";
  };

  const questionTypeLabel = (type: LocalQuestionType | undefined) => {
    if (type === "radio") {
      return "MCQ";
    }

    if (type === "checkbox") {
      return "Checkbox";
    }

    return "Text";
  };

  const updateQuestion = (next: Partial<LocalQuestion>) => {
    setCurrentQuestion((prev) => ({
      ...prev,
      ...next,
    }));
  };

  const updateOption = (optionId: string, next: Partial<LocalOption>) => {
    setCurrentQuestion((prev) => ({
      ...prev,
      options: prev.options.map((option) =>
        option.id === optionId
          ? {
              ...option,
              ...next,
            }
          : option,
      ),
    }));
  };

  const setCorrectAnswer = (optionId: string, checked: boolean) => {
    setCurrentQuestion((prev) => {
      if (prev.type === "checkbox") {
        return {
          ...prev,
          options: prev.options.map((option) =>
            option.id === optionId
              ? {
                  ...option,
                  isCorrect: checked,
                }
              : option,
          ),
        };
      }

      return {
        ...prev,
        options: prev.options.map((option) => ({
          ...option,
          isCorrect: option.id === optionId,
        })),
      };
    });
  };

  const onSaveBasicInfo = basicForm.handleSubmit(() => {
    setIsBasicInfoSaved(true);
  });

  const openAddQuestion = () => {
    const type = values.questionType ?? "radio";
    setEditingQuestionId(null);
    setCurrentQuestion(getEmptyQuestion(type));
    setIsQuestionModalOpen(true);
  };

  const openEditQuestion = (question: LocalQuestion) => {
    setEditingQuestionId(question.id);
    setCurrentQuestion(question);
    setIsQuestionModalOpen(true);
  };

  const persistQuestion = (openNew: boolean) => {
    const questionToSave: LocalQuestion = {
      ...currentQuestion,
      questionTitle: currentQuestion.questionTitle || `Question ${questions.length + 1}`,
    };

    if (editingQuestionId) {
      setQuestions((prev) => prev.map((question) => (question.id === editingQuestionId ? questionToSave : question)));
    } else {
      setQuestions((prev) => [...prev, questionToSave]);
    }

    if (openNew) {
      const type = values.questionType ?? "radio";
      setEditingQuestionId(null);
      setCurrentQuestion(getEmptyQuestion(type));
      return;
    }

    setIsQuestionModalOpen(false);
  };

  const sortedQuestions = useMemo(
    () =>
      questions.map((question, index) => ({
        ...question,
        displayTitle: question.questionTitle || `Question ${index + 1}`,
      })),
    [questions],
  );

  const publishMutation = useMutation({
    mutationFn: createOnlineTest,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["employer-exams"] });
      router.push("/employer/dashboard");
    },
  });

  const publishTest = async () => {
    setPublishError(null);

    if (questions.length === 0) {
      setPublishError("Add at least one question before publishing.");
      return;
    }

    const valid = await basicForm.trigger();
    if (!valid) {
      setPublishError("Please complete Basic Info fields before publishing.");
      setStep(1);
      return;
    }

    const payload = basicForm.getValues();

    publishMutation.mutate({
      title: payload.title,
      totalCandidates: payload.totalCandidates,
      totalSlots: payload.totalSlots,
      questionSets: payload.questionSets,
      questionType: payload.questionType,
      startTime: payload.startTime,
      endTime: payload.endTime,
      duration: payload.duration,
      negativeMarking: 0.25,
      questions: questions.map((question) => ({
        id: question.id,
        title: question.prompt || question.questionTitle,
        type: question.type,
        options:
          question.type === "text"
            ? undefined
            : question.options
                .map((option) => option.content.trim() || option.label)
                .filter(Boolean),
      })),
    });
  };

  return (
    <EmployerShell pageTitle="Online Test">
      <div className="space-y-4">
        <section className="rounded-2xl border border-[#e2e5ec] bg-white p-5">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h1 className="text-[30px] font-semibold text-[#354052]">Manage Online Test</h1>
              <div className="mt-4 flex items-center gap-4 text-base font-medium text-[#6d7382]">
                <div className="inline-flex items-center gap-2">
                  <span className={`inline-flex h-6 w-6 items-center justify-center rounded-full text-xs ${stepClass(1)}`}>
                    {isBasicInfoSaved ? <Check size={14} /> : "1"}
                  </span>
                  <span className={step === 1 ? "text-[#5f32f1]" : ""}>Basic Info</span>
                </div>
                <span className="h-px w-20 bg-[#5d6574]" />
                <div className="inline-flex items-center gap-2">
                  <span className={`inline-flex h-6 w-6 items-center justify-center rounded-full text-xs ${stepClass(2)}`}>
                    {step === 2 ? <Check size={14} /> : "2"}
                  </span>
                  <span className={step === 2 ? "text-[#5f32f1]" : ""}>Questions Sets</span>
                </div>
              </div>
            </div>

            <Link
              href="/employer/dashboard"
              className="inline-flex h-10.5 items-center justify-center rounded-xl border border-[#d8dce5] px-8 text-sm font-semibold text-[#4a5566]"
            >
              Back to Dashboard
            </Link>
          </div>
        </section>

        {step === 1 ? (
          <>
            {!isBasicInfoSaved ? (
              <section className="mx-auto max-w-245 rounded-2xl bg-white p-5">
                <h2 className="text-[28px] font-semibold text-[#364355]">Basic Information</h2>
                <form className="mt-4 grid gap-3 md:grid-cols-2">
                  <div className="md:col-span-2">
                    <label className="mb-1.5 block text-sm font-medium text-[#4f5869]">Online Test Title *</label>
                    <input
                      className="h-10 w-full rounded-xl border border-[#e0e4ec] px-3 text-sm outline-none"
                      placeholder="Enter online test title"
                      {...basicForm.register("title")}
                    />
                  </div>

                  <div>
                    <label className="mb-1.5 block text-sm font-medium text-[#4f5869]">Total Candidates *</label>
                    <input
                      type="number"
                      className="h-10 w-full rounded-xl border border-[#e0e4ec] px-3 text-sm outline-none"
                      placeholder="Enter total candidates"
                      {...basicForm.register("totalCandidates", { valueAsNumber: true })}
                    />
                  </div>

                  <div>
                    <label className="mb-1.5 block text-sm font-medium text-[#4f5869]">Total Slots *</label>
                    <input
                      type="number"
                      className="h-10 w-full rounded-xl border border-[#e0e4ec] px-3 text-sm outline-none"
                      placeholder="Select total slots"
                      {...basicForm.register("totalSlots", { valueAsNumber: true })}
                    />
                  </div>

                  <div>
                    <label className="mb-1.5 block text-sm font-medium text-[#4f5869]">Total Question Set *</label>
                    <input
                      type="number"
                      className="h-10 w-full rounded-xl border border-[#e0e4ec] px-3 text-sm outline-none"
                      placeholder="Select total question set"
                      {...basicForm.register("questionSets", { valueAsNumber: true })}
                    />
                  </div>

                  <div>
                    <label className="mb-1.5 block text-sm font-medium text-[#4f5869]">Question Type *</label>
                    <select
                      className="h-10 w-full rounded-xl border border-[#e0e4ec] px-3 text-sm outline-none"
                      {...basicForm.register("questionType")}
                    >
                      <option value="radio">MCQ</option>
                      <option value="checkbox">Checkbox</option>
                      <option value="text">Text</option>
                    </select>
                  </div>

                  <div>
                    <label className="mb-1.5 block text-sm font-medium text-[#4f5869]">Start Time *</label>
                    <div className="relative">
                      <input
                        type="datetime-local"
                        className="h-10 w-full rounded-xl border border-[#e0e4ec] px-3 text-sm outline-none"
                        {...basicForm.register("startTime")}
                      />
                      <Clock3 size={16} className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[#97a0b0]" />
                    </div>
                  </div>

                  <div>
                    <label className="mb-1.5 block text-sm font-medium text-[#4f5869]">End Time *</label>
                    <div className="relative">
                      <input
                        type="datetime-local"
                        className="h-10 w-full rounded-xl border border-[#e0e4ec] px-3 text-sm outline-none"
                        {...basicForm.register("endTime")}
                      />
                      <Clock3 size={16} className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[#97a0b0]" />
                    </div>
                  </div>

                  <div>
                    <label className="mb-1.5 block text-sm font-medium text-[#4f5869]">Duration</label>
                    <input
                      type="number"
                      className="h-10 w-full rounded-xl border border-[#e0e4ec] px-3 text-sm outline-none"
                      placeholder="Duration Time"
                      {...basicForm.register("duration", { valueAsNumber: true })}
                    />
                  </div>
                </form>
              </section>
            ) : (
              <section className="mx-auto max-w-245 rounded-2xl bg-white p-5">
                <div className="flex items-center justify-between">
                  <h2 className="text-[28px] font-semibold text-[#364355]">Basic Information</h2>
                  <button
                    type="button"
                    onClick={() => setIsBasicInfoSaved(false)}
                    className="inline-flex items-center gap-2 text-base font-semibold text-[#5f32f1]"
                  >
                    <Pencil size={18} /> Edit
                  </button>
                </div>

                <div className="mt-4 grid gap-4 text-[#4d5567] md:grid-cols-4">
                  <div className="md:col-span-4">
                    <p className="text-sm text-[#7b8495]">Online Test Title</p>
                    <p className="text-[34px] font-semibold">{values.title || "Psychometric Test for Management Trainee Officer"}</p>
                  </div>
                  <div>
                    <p className="text-sm text-[#7b8495]">Total Candidates</p>
                    <p className="text-[28px] font-semibold">{(values.totalCandidates ?? 0).toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="text-sm text-[#7b8495]">Total Slots</p>
                    <p className="text-[28px] font-semibold">{values.totalSlots ?? 0}</p>
                  </div>
                  <div>
                    <p className="text-sm text-[#7b8495]">Total Question Set</p>
                    <p className="text-[28px] font-semibold">{values.questionSets ?? 0}</p>
                  </div>
                  <div>
                    <p className="text-sm text-[#7b8495]">Duration Per Slots (Minutes)</p>
                    <p className="text-[28px] font-semibold">{values.duration ?? 0}</p>
                  </div>
                  <div className="md:col-span-4">
                    <p className="text-sm text-[#7b8495]">Question Type</p>
                    <p className="text-[28px] font-semibold">{questionTypeLabel(values.questionType).toUpperCase()}</p>
                  </div>
                </div>
              </section>
            )}

            <section className="mx-auto flex max-w-245 items-center justify-between rounded-2xl bg-white p-5">
              <button
                type="button"
                onClick={() => {
                  setStep(1);
                  setIsBasicInfoSaved(false);
                }}
                className="inline-flex h-10 min-w-45 items-center justify-center rounded-xl border border-[#d8dde7] px-6 text-sm font-semibold text-[#4f596c]"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={() => {
                  if (!isBasicInfoSaved) {
                    onSaveBasicInfo();
                    return;
                  }
                  setStep(2);
                }}
                className="inline-flex h-10 min-w-47.5 items-center justify-center rounded-xl bg-linear-to-r from-[#5d2ff0] to-[#6f3bf7] px-6 text-sm font-semibold text-white"
              >
                Save & Continue
              </button>
            </section>
          </>
        ) : null}

        {step === 2 ? (
          <section className="mx-auto max-w-245 rounded-2xl bg-white p-5">
            {sortedQuestions.length === 0 ? (
              <button
                type="button"
                onClick={openAddQuestion}
                className="inline-flex h-12 w-full items-center justify-center rounded-xl bg-linear-to-r from-[#5d2ff0] to-[#6f3bf7] text-lg font-semibold text-white"
              >
                Add Question
              </button>
            ) : (
              <>
                <div className="space-y-3">
                  {sortedQuestions.map((question, index) => (
                    <article key={question.id} className="rounded-2xl border border-[#e6e8ee] p-4">
                      <div className="flex items-start justify-between border-b border-[#edf0f5] pb-2.5">
                        <h3 className="text-xl font-semibold text-[#364153]">Question {index + 1}</h3>
                        <div className="inline-flex gap-2">
                          <span className="rounded-full border border-[#dce0e8] px-3 py-1 text-xs text-[#7c8492]">
                            {questionTypeLabel(question.type)}
                          </span>
                          <span className="rounded-full border border-[#dce0e8] px-3 py-1 text-xs text-[#7c8492]">
                            {question.score} pt
                          </span>
                        </div>
                      </div>

                      <p className="mt-3 text-base font-semibold text-[#202938]">{question.prompt || "Capital of Bangladesh?"}</p>

                      <div className="mt-3 space-y-2">
                        {question.options.map((option) => (
                          <div
                            key={option.id}
                            className={`flex min-h-10 items-center justify-between rounded-lg px-3 text-sm ${
                              option.isCorrect ? "bg-[#eff0f3]" : "bg-white"
                            }`}
                          >
                            <p>
                              {option.label}. {option.content || "Option"}
                            </p>
                            {option.isCorrect ? <Check size={16} className="rounded-full bg-[#24c263] p-0.5 text-white" /> : null}
                          </div>
                        ))}
                      </div>

                      <div className="mt-3 flex items-center justify-between border-t border-[#edf0f5] pt-2.5">
                        <button
                          type="button"
                          onClick={() => openEditQuestion(question)}
                          className="text-xs font-medium text-[#5f32f1]"
                        >
                          Edit
                        </button>
                        <button
                          type="button"
                          onClick={() => setQuestions((prev) => prev.filter((item) => item.id !== question.id))}
                          className="text-xs font-medium text-[#ef4444]"
                        >
                          Remove
                        </button>
                      </div>
                    </article>
                  ))}
                </div>

                <button
                  type="button"
                  onClick={openAddQuestion}
                  className="mt-3 inline-flex h-11 w-full items-center justify-center rounded-xl bg-linear-to-r from-[#5d2ff0] to-[#6f3bf7] text-base font-semibold text-white"
                >
                  Add Question
                </button>

                <div className="mt-4 flex items-center justify-between gap-3">
                  <button
                    type="button"
                    onClick={() => setStep(1)}
                    className="inline-flex h-11 items-center justify-center rounded-xl border border-[#d3d9e4] px-4 text-sm font-semibold text-[#344154]"
                  >
                    Back
                  </button>

                  <button
                    type="button"
                    onClick={publishTest}
                    disabled={publishMutation.isPending}
                    className="inline-flex h-11 items-center justify-center rounded-xl bg-linear-to-r from-[#5d2ff0] to-[#6f3bf7] px-5 text-sm font-semibold text-white disabled:opacity-60"
                  >
                    {publishMutation.isPending ? "Publishing..." : "Publish Test"}
                  </button>
                </div>

                {publishError ? <p className="mt-2 text-sm text-red-600">{publishError}</p> : null}
                {publishMutation.isError ? (
                  <p className="mt-2 text-sm text-red-600">Failed to publish test. Try again.</p>
                ) : null}
              </>
            )}
          </section>
        ) : null}
      </div>

      {isQuestionModalOpen ? (
        <div className="fixed inset-0 z-50 bg-black/40 p-4">
          <div className="mx-auto mt-10 max-h-[86vh] w-full max-w-245 overflow-y-auto rounded-2xl bg-white p-5">
            <div className="flex items-center justify-between">
              <div className="inline-flex items-center gap-3">
                <Circle size={18} className="text-[#9ca3b1]" />
                <input
                  value={currentQuestion.questionTitle}
                  onChange={(event) => updateQuestion({ questionTitle: event.target.value })}
                  className="w-55 border-none bg-transparent text-2xl font-semibold text-[#303a4c] outline-none"
                />
              </div>

              <div className="inline-flex items-center gap-4">
                <div className="inline-flex items-center gap-2 text-sm font-semibold text-[#4b5465]">
                  Score:
                  <input
                    type="number"
                    value={currentQuestion.score}
                    onChange={(event) => updateQuestion({ score: Number(event.target.value) || 1 })}
                    className="h-8 w-16 rounded-lg border border-[#d8dde7] px-2 text-sm"
                  />
                </div>
                <select
                  value={currentQuestion.type}
                  onChange={(event) => {
                    const nextType = event.target.value as LocalQuestionType;
                    updateQuestion({
                      type: nextType,
                      options: nextType === "text" ? [getNewOption(0)] : [getNewOption(0), getNewOption(1), getNewOption(2)],
                    });
                  }}
                  className="h-8 rounded-lg border border-[#d8dde7] px-2 text-sm"
                >
                  <option value="radio">Radio</option>
                  <option value="checkbox">Checkbox</option>
                  <option value="text">Text</option>
                </select>

                <button
                  type="button"
                  onClick={() => {
                    if (editingQuestionId) {
                      setQuestions((prev) => prev.filter((question) => question.id !== editingQuestionId));
                    }
                    setIsQuestionModalOpen(false);
                  }}
                  className="text-[#8b94a4]"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            </div>

            <div className="mt-3 rounded-xl border border-[#eceef3]">
              <div className="h-10 rounded-t-xl bg-[#f8f9fb]" />
              <textarea
                value={currentQuestion.prompt}
                onChange={(event) => updateQuestion({ prompt: event.target.value })}
                className="h-30 w-full resize-none rounded-b-xl p-3 text-sm outline-none"
              />
            </div>

            <div className="mt-4 space-y-3">
              {currentQuestion.options.map((option, index) => (
                <div key={option.id}>
                  <div className="mb-2 inline-flex items-center gap-2 text-sm text-[#5f697a]">
                    <span className="inline-flex h-5 w-5 items-center justify-center rounded-full border border-[#b8c0cf] text-xs">
                      {option.label || LETTERS[index]}
                    </span>
                    {currentQuestion.type !== "text" ? (
                      <>
                        <input
                          type={currentQuestion.type === "checkbox" ? "checkbox" : "radio"}
                          checked={option.isCorrect}
                          onChange={(event) => setCorrectAnswer(option.id, event.target.checked)}
                        />
                        <span>Set as correct answer</span>
                      </>
                    ) : null}
                  </div>

                  <div className="rounded-xl border border-[#eceef3]">
                    <div className="h-10 rounded-t-xl bg-[#f8f9fb]" />
                    <textarea
                      value={option.content}
                      onChange={(event) => updateOption(option.id, { content: event.target.value })}
                      className="h-25 w-full resize-none rounded-b-xl p-3 text-sm outline-none"
                    />
                  </div>
                </div>
              ))}
            </div>

            {currentQuestion.type !== "text" ? (
              <button
                type="button"
                onClick={() => {
                  setCurrentQuestion((prev) => ({
                    ...prev,
                    options: [...prev.options, getNewOption(prev.options.length)],
                  }));
                }}
                className="mt-3 inline-flex items-center gap-2 text-sm font-medium text-[#5f32f1]"
              >
                <Plus size={14} /> Add option
              </button>
            ) : null}

            <div className="mt-5 flex items-center justify-end gap-3 border-t border-[#eceef3] pt-3">
              <button
                type="button"
                onClick={() => persistQuestion(false)}
                className="inline-flex h-10.5 min-w-37.5 items-center justify-center rounded-xl border border-[#7b66f7] text-sm font-semibold text-[#5f32f1]"
              >
                Save
              </button>
              <button
                type="button"
                onClick={() => persistQuestion(true)}
                className="inline-flex h-10.5 min-w-42.5 items-center justify-center rounded-xl bg-linear-to-r from-[#5d2ff0] to-[#6f3bf7] text-sm font-semibold text-white"
              >
                Save & Add
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </EmployerShell>
  );
}
