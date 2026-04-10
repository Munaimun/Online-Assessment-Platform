import { NextResponse } from "next/server";
import { createExam, getCandidateExams, getEmployerExams } from "@/lib/mock-db";
import type { CreateExamPayload } from "@/types";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const panel = searchParams.get("panel");
  const candidateEmail = searchParams.get("candidateEmail") ?? "";

  if (panel === "candidate") {
    return NextResponse.json(getCandidateExams(candidateEmail));
  }

  return NextResponse.json(getEmployerExams());
}

export async function POST(request: Request) {
  const body = (await request.json()) as CreateExamPayload;
  const created = createExam(body);
  return NextResponse.json(created, { status: 201 });
}
