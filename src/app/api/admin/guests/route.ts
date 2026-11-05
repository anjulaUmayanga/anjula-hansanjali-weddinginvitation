import { NextResponse } from "next/server";
import { z } from "zod";

import { isAdminAuthenticated } from "@/lib/admin-auth";
import {
  createDirectoryGuest,
  deleteDirectoryGuest,
  listDirectoryGuests,
} from "@/lib/guest-directory";

export const runtime = "nodejs";

const createSchema = z
  .object({
    name: z.string().trim().min(1).max(60),
    type: z.enum(["one", "two", "family"]),
    slug: z.string().trim().max(40).optional(),
    gender: z.enum(["male", "female"]).nullable().optional(),
  })
  .superRefine((value, ctx) => {
    if (value.type === "one" && value.gender !== "male" && value.gender !== "female") {
      ctx.addIssue({
        code: "custom",
        path: ["gender"],
        message: "Gender is required for an individual guest.",
      });
    }
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
    const genderIssue = parsed.error.issues.find((issue) => issue.path[0] === "gender");
    return NextResponse.json(
      {
        ok: false,
        error: genderIssue?.message || "Check the name, guest type, and gender.",
      },
      { status: 400 },
    );
  }

  const result = await createDirectoryGuest({
    name: parsed.data.name,
    type: parsed.data.type,
    slug: parsed.data.slug,
    gender: parsed.data.type === "one" ? parsed.data.gender : null,
  });
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
