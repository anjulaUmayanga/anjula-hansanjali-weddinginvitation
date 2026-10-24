import { NextResponse } from "next/server";

import { getClientIp, rateLimit } from "@/lib/rate-limit";
import { rsvpSchema } from "@/lib/rsvp-schema";
import { getSupabaseAdmin } from "@/lib/supabase";

export const runtime = "nodejs";

const MAX_BODY = 12_000;

export async function POST(request: Request) {
  try {
    const ip = getClientIp(request);
    const limited = rateLimit(`rsvp:${ip}`, 5, 10 * 60 * 1000);
    if (!limited.ok) {
      return NextResponse.json(
        { ok: false, error: "Too many requests. Please try again later." },
        { status: 429 },
      );
    }

    const raw = await request.text();
    if (raw.length > MAX_BODY) {
      return NextResponse.json({ ok: false, error: "Request too large." }, { status: 413 });
    }

    let json: unknown;
    try {
      json = JSON.parse(raw);
    } catch {
      return NextResponse.json({ ok: false, error: "Invalid request." }, { status: 400 });
    }

    const parsed = rsvpSchema.safeParse(json);
    if (!parsed.success) {
      return NextResponse.json({ ok: false, error: "Please check your details." }, { status: 400 });
    }

    const data = parsed.data;
    if (data.website && data.website.length > 0) {
      return NextResponse.json({ ok: true });
    }

    const supabase = getSupabaseAdmin();
    if (!supabase) {
      console.error("[rsvp] Supabase env missing");
      return NextResponse.json(
        { ok: false, error: "RSVP service is temporarily unavailable." },
        { status: 503 },
      );
    }

    const slug = data.slug?.trim() || null;
    const row = {
      slug,
      name: data.name,
      email: data.email?.trim() || null,
      phone: data.phone?.trim() || null,
      attending: data.attending === "yes",
      guest_count: data.attending === "yes" ? data.guestCount : 0,
      message: data.message?.trim() || "",
      public_wish: data.publicWish,
      updated_at: new Date().toISOString(),
    };

    const result = slug
      ? await supabase.from("rsvps").upsert(row, { onConflict: "slug" })
      : await supabase.from("rsvps").insert(row);

    if (result.error) {
      console.error("[rsvp] supabase", result.error.message);
      return NextResponse.json(
        { ok: false, error: "Something went wrong. Please try again." },
        { status: 500 },
      );
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("[rsvp]", err);
    return NextResponse.json(
      { ok: false, error: "Something went wrong. Please try again." },
      { status: 500 },
    );
  }
}
