import { NextResponse } from "next/server";
import { authenticateUser } from "@/lib/mock-db";
import type { LoginPayload } from "@/types";

export async function POST(request: Request) {
  const body = (await request.json()) as LoginPayload;
  const user = authenticateUser(body.email, body.password, body.role);

  if (!user) {
    return NextResponse.json({ message: "Invalid credentials" }, { status: 401 });
  }

  return NextResponse.json({
    token: `mock-token-${user.id}`,
    user,
  });
}
