import "server-only";

import { createHash, timingSafeEqual } from "crypto";
import { cookies } from "next/headers";

const COOKIE_NAME = "wedding_admin_session";

function sessionToken(password: string): string {
  return createHash("sha256").update(`wedding-admin:${password}`).digest("hex");
}

export function verifyAdminPassword(password: string): boolean {
  const expected = process.env.ADMIN_PASSWORD;
  if (!expected || !password) return false;
  const a = Buffer.from(sessionToken(password));
  const b = Buffer.from(sessionToken(expected));
  if (a.length !== b.length) return false;
  return timingSafeEqual(a, b);
}

export async function setAdminSession() {
  const password = process.env.ADMIN_PASSWORD;
  if (!password) throw new Error("ADMIN_PASSWORD not set");
  const jar = await cookies();
  jar.set(COOKIE_NAME, sessionToken(password), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 12,
  });
}

export async function clearAdminSession() {
  const jar = await cookies();
  jar.delete(COOKIE_NAME);
}

export async function isAdminAuthenticated(): Promise<boolean> {
  const password = process.env.ADMIN_PASSWORD;
  if (!password) return false;
  const jar = await cookies();
  const value = jar.get(COOKIE_NAME)?.value;
  if (!value) return false;
  const expected = sessionToken(password);
  try {
    const a = Buffer.from(value);
    const b = Buffer.from(expected);
    if (a.length !== b.length) return false;
    return timingSafeEqual(a, b);
  } catch {
    return false;
  }
}
