export type UserRole = "employer" | "candidate";

export type QuestionType = "checkbox" | "radio" | "text";

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
}

export interface Question {
  id: string;
  title: string;
  type: QuestionType;
  options?: string[];
}

export interface Exam {
  id: string;
  title: string;
  totalCandidates: number;
  totalSlots: number;
  questionSets: number;
  questionType: QuestionType;
  startTime: string;
  endTime: string;
  duration: number;
  negativeMarking: number;
  candidates: string[];
  questions: Question[];
}

export interface LoginPayload {
  email: string;
  password: string;
  role: UserRole;
}

export interface LoginResponse {
  token: string;
  user: User;
}

export interface CreateExamPayload {
  title: string;
  totalCandidates: number;
  totalSlots: number;
  questionSets: number;
  questionType: QuestionType;
  startTime: string;
  endTime: string;
  duration: number;
  negativeMarking: number;
  questions: Question[];
}

export interface BehaviorEvent {
  type: "tab_switch" | "fullscreen_exit";
  timestamp: string;
  details: string;
}

export interface SubmitExamPayload {
  answers: Record<string, string | string[]>;
  behaviorEvents: BehaviorEvent[];
  submittedAt: string;
}

export interface SubmitExamResponse {
  score: number;
  total: number;
  warnings: number;
  message: string;
}
