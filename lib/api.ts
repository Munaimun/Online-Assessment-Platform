import { apiClient } from "@/lib/api-client";
import type {
  CreateExamPayload,
  Exam,
  LoginPayload,
  LoginResponse,
  SubmitExamPayload,
  SubmitExamResponse,
} from "@/types";

const LOCAL_EXAMS_KEY = "akij-local-exams";

function readLocalExams() {
  if (typeof window === "undefined") {
    return [] as Exam[];
  }

  try {
    const raw = window.localStorage.getItem(LOCAL_EXAMS_KEY);
    if (!raw) {
      return [] as Exam[];
    }

    const parsed = JSON.parse(raw) as Exam[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [] as Exam[];
  }
}

function writeLocalExams(exams: Exam[]) {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.setItem(LOCAL_EXAMS_KEY, JSON.stringify(exams));
}

function upsertLocalExam(exam: Exam) {
  const current = readLocalExams();
  const next = [exam, ...current.filter((item) => item.id !== exam.id)];
  writeLocalExams(next);
}

export async function login(payload: LoginPayload) {
  const { data } = await apiClient.post<LoginResponse>("/auth/login", payload);
  return data;
}

export async function fetchExams(panel: "employer" | "candidate", candidateEmail?: string) {
  let remoteExams: Exam[] = [];

  try {
    const { data } = await apiClient.get<Exam[]>("/exams", {
      params: {
        panel,
        candidateEmail,
      },
    });
    remoteExams = data;
  } catch {
    remoteExams = [];
  }

  const localExams = readLocalExams();
  const merged = [...localExams, ...remoteExams].filter(
    (exam, index, all) => all.findIndex((item) => item.id === exam.id) === index,
  );

  if (panel === "candidate") {
    return merged.filter((exam) => exam.candidates.includes(candidateEmail ?? ""));
  }

  return merged;
}

export async function fetchExamById(examId: string) {
  try {
    const { data } = await apiClient.get<Exam | null>(`/exams/${examId}`);
    if (data) {
      upsertLocalExam(data);
      return data;
    }
  } catch {
    // fallback to local cache
  }

  const localExam = readLocalExams().find((exam) => exam.id === examId);
  return localExam ?? null;
}

export async function createOnlineTest(payload: CreateExamPayload) {
  const { data } = await apiClient.post<Exam>("/exams", payload);
  upsertLocalExam(data);
  return data;
}

export async function submitOnlineExam(examId: string, payload: SubmitExamPayload) {
  const { data } = await apiClient.post<SubmitExamResponse>(`/exams/${examId}/submit`, payload);
  return data;
}
