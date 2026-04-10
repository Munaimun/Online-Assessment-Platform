import { addHours } from "date-fns";
import {
  type CreateExamPayload,
  type Exam,
  type SubmitExamPayload,
  type SubmitExamResponse,
  type User,
} from "@/types";
import { makeId } from "@/lib/utils";

interface UserRecord extends User {
  password: string;
}

const now = new Date();

const users: UserRecord[] = [
  {
    id: "emp_01",
    name: "Ayesha Rahman",
    email: "employer@akij.com",
    password: "employer123",
    role: "employer",
  },
  {
    id: "cand_01",
    name: "Nafis Islam",
    email: "candidate@akij.com",
    password: "candidate123",
    role: "candidate",
  },
];

let exams: Exam[] = [
  {
    id: "exam_01",
    title: "Frontend Engineer - React Challenge",
    totalCandidates: 30,
    totalSlots: 3,
    questionSets: 1,
    questionType: "radio",
    startTime: now.toISOString(),
    endTime: addHours(now, 4).toISOString(),
    duration: 45,
    negativeMarking: 0.25,
    candidates: ["candidate@akij.com", "candidate2@akij.com", "candidate3@akij.com"],
    questions: [
      {
        id: "q_01",
        title: "Which hook is best for memoizing expensive computed values?",
        type: "radio",
        options: ["useCallback", "useMemo", "useEffect", "useRef"],
      },
      {
        id: "q_02",
        title: "Select all valid HTTP methods for partial updates.",
        type: "checkbox",
        options: ["PATCH", "POST", "PUT", "TRACE"],
      },
      {
        id: "q_03",
        title: "Briefly explain hydration mismatch in Next.js.",
        type: "text",
      },
    ],
  },
];

const submissions = new Map<string, SubmitExamPayload[]>();

export function authenticateUser(email: string, password: string, role: User["role"]) {
  const user = users.find(
    (entry) =>
      entry.email.toLowerCase() === email.toLowerCase() &&
      entry.password === password &&
      entry.role === role,
  );

  if (!user) {
    return null;
  }

  return {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
  };
}

export function getEmployerExams() {
  return exams;
}

export function getCandidateExams(candidateEmail: string) {
  return exams.filter((exam) => exam.candidates.includes(candidateEmail));
}

export function getExamById(examId: string) {
  return exams.find((exam) => exam.id === examId) ?? null;
}

export function createExam(payload: CreateExamPayload) {
  const exam: Exam = {
    id: makeId("exam"),
    title: payload.title,
    totalCandidates: payload.totalCandidates,
    totalSlots: payload.totalSlots,
    questionSets: payload.questionSets,
    questionType: payload.questionType,
    startTime: payload.startTime,
    endTime: payload.endTime,
    duration: payload.duration,
    negativeMarking: payload.negativeMarking,
    candidates: ["candidate@akij.com"],
    questions: payload.questions,
  };

  exams = [exam, ...exams];
  return exam;
}

export function submitExam(examId: string, payload: SubmitExamPayload): SubmitExamResponse {
  const exam = getExamById(examId);
  if (!exam) {
    throw new Error("Exam not found");
  }

  const existing = submissions.get(examId) ?? [];
  submissions.set(examId, [...existing, payload]);

  const total = exam.questions.length;
  const answeredCount = Object.values(payload.answers).filter((value) => {
    if (Array.isArray(value)) {
      return value.length > 0;
    }

    return value.trim().length > 0;
  }).length;

  const warnings = payload.behaviorEvents.length;
  const score = Number(Math.max(answeredCount - warnings * exam.negativeMarking, 0).toFixed(2));

  return {
    score,
    total,
    warnings,
    message: "Exam submitted successfully",
  };
}
