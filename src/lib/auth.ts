import { cookies } from "next/headers";

const SESSION_COOKIE = "starter_session";
// Simple token — in production, use a signed JWT or similar
const SESSION_TOKEN = "authenticated";

export async function setSession() {
  const store = await cookies();
  store.set(SESSION_COOKIE, SESSION_TOKEN, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24, // 24 hours
  });
}

export async function checkSession(): Promise<boolean> {
  const store = await cookies();
  return store.get(SESSION_COOKIE)?.value === SESSION_TOKEN;
}
