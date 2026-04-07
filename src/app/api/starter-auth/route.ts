import { NextRequest, NextResponse } from "next/server";
import { setSession, checkSession } from "@/lib/auth";

export async function POST(request: NextRequest) {
  const body = await request.json();
  const { password } = body;

  const expected = process.env.STARTER_PASSWORD;
  if (!expected) {
    return NextResponse.json(
      { error: "Starter password not configured" },
      { status: 500 }
    );
  }

  if (password !== expected) {
    return NextResponse.json({ error: "Invalid password" }, { status: 401 });
  }

  await setSession();
  return NextResponse.json({ ok: true });
}

export async function GET() {
  const valid = await checkSession();
  if (!valid) {
    return NextResponse.json({ authenticated: false }, { status: 401 });
  }
  return NextResponse.json({ authenticated: true });
}
