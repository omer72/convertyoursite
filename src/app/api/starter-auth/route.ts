import { NextRequest, NextResponse } from "next/server";

const COOKIE_NAME = "starter_auth";
const COOKIE_MAX_AGE = 60 * 60 * 24; // 24 hours

export async function POST(req: NextRequest) {
  const { password } = await req.json();
  const expected = process.env.STARTER_PASSWORD;

  if (!expected) {
    return NextResponse.json(
      { error: "STARTER_PASSWORD not configured" },
      { status: 500 }
    );
  }

  if (password !== expected) {
    return NextResponse.json({ error: "Invalid password" }, { status: 401 });
  }

  const res = NextResponse.json({ ok: true });
  res.cookies.set(COOKIE_NAME, "1", {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    maxAge: COOKIE_MAX_AGE,
  });
  return res;
}

export async function GET(req: NextRequest) {
  const cookie = req.cookies.get(COOKIE_NAME);
  if (cookie?.value === "1") {
    return NextResponse.json({ authenticated: true });
  }
  return NextResponse.json({ authenticated: false }, { status: 401 });
}
