import { NextResponse } from "next/server";

import { setAdminSession, verifyAdminPassword } from "@/lib/admin-auth";
import { getClientIp, rateLimit } from "@/lib/rate-limit";

export async function POST(request: Request) {
  const ip = getClientIp(request);
  const limited = rateLimit(`admin-login:${ip}`, 8, 10 * 60 * 1000);
  if (!limited.ok) {
    return NextResponse.json({ ok: false, error: "Too many attempts." }, { status: 429 });
  }

  const body = (await request.json().catch(() => null)) as { password?: string } | null;
  if (!body?.password || !verifyAdminPassword(body.password)) {
    return NextResponse.json({ ok: false, error: "Invalid password." }, { status: 401 });
  }

  await setAdminSession();
  return NextResponse.json({ ok: true });
}
