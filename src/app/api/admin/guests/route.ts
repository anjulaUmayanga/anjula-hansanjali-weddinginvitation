import { NextResponse } from "next/server";
import { z } from "zod";

import { isAdminAuthenticated } from "@/lib/admin-auth";
import {
  createDirectoryGuest,
  deleteDirectoryGuest,
  listDirectoryGuests,
} from "@/lib/guest-directory";

export const runtime = "nodejs";

const createSchema = z.object({
  name: z.string().trim().min(1).max(60),
  type: z.enum(["one", "two", "family"]),
  slug: z.string().trim().max(40).optional(),
});

export async function GET() {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
  }

  const guests = await listDirectoryGuests();
  return NextResponse.json({ ok: true, guests });
}

export async function POST(request: Request) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json().catch(() => null);
  const parsed = createSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ ok: false, error: "Check the name and guest type." }, { status: 400 });
  }

  const result = await createDirectoryGuest(parsed.data);
  if (!result.ok) {
    return NextResponse.json({ ok: false, error: result.error }, { status: result.status });
  }

  return NextResponse.json({ ok: true, guest: result.guest });
}

export async function DELETE(request: Request) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
  }

  const slug = new URL(request.url).searchParams.get("slug") ?? "";
  if (!slug) {
    return NextResponse.json({ ok: false, error: "Missing guest link." }, { status: 400 });
  }

  const result = await deleteDirectoryGuest(slug);
  if (!result.ok) {
    return NextResponse.json({ ok: false, error: result.error }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
