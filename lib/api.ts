import { apiClient } from "@/lib/api-client";
import type {
  CreateExamPayload,
  Exam,
  LoginPayload,
  LoginResponse,
  SubmitExamPayload,
  SubmitExamResponse,
} from "@/types";

export async function login(payload: LoginPayload) {
  const { data } = await apiClient.post<LoginResponse>("/auth/login", payload);
  return data;
}

export async function fetchExams(panel: "employer" | "candidate", candidateEmail?: string) {
  const { data } = await apiClient.get<Exam[]>("/exams", {
    params: {
      panel,
      candidateEmail,
    },
  });

  return data;
}

export async function fetchExamById(examId: string) {
  const { data } = await apiClient.get<Exam | null>(`/exams/${examId}`);
  return data;
}

export async function createOnlineTest(payload: CreateExamPayload) {
  const { data } = await apiClient.post<Exam>("/exams", payload);
  return data;
}

export async function submitOnlineExam(examId: string, payload: SubmitExamPayload) {
  const { data } = await apiClient.post<SubmitExamResponse>(`/exams/${examId}/submit`, payload);
  return data;
}
