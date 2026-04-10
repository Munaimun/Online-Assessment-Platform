import { NextResponse } from "next/server";
import { getExamById } from "@/lib/mock-db";

interface RouteContext {
  params: Promise<{ examId: string }>;
}

export async function GET(_request: Request, context: RouteContext) {
  const params = await context.params;
  const exam = getExamById(params.examId);

  if (!exam) {
    return NextResponse.json(null, { status: 200 });
  }

  return NextResponse.json(exam);
}
