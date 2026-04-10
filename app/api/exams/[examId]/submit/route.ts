import { NextResponse } from "next/server";
import { submitExam } from "@/lib/mock-db";
import type { SubmitExamPayload } from "@/types";

interface RouteContext {
  params: Promise<{ examId: string }>;
}

export async function POST(request: Request, context: RouteContext) {
  try {
    const params = await context.params;
    const body = (await request.json()) as SubmitExamPayload;
    const result = submitExam(params.examId, body);
    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json(
      {
        message: error instanceof Error ? error.message : "Submission failed",
      },
      { status: 400 },
    );
  }
}
