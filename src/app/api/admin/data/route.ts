import { NextResponse } from "next/server";

import { isAdminAuthenticated } from "@/lib/admin-auth";
import { getAllGuests } from "@/lib/guests";
import { getSupabaseAdmin, type RsvpRow } from "@/lib/supabase";

export const runtime = "nodejs";

export async function GET() {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
  }

  const guests = getAllGuests();
  let rows: RsvpRow[] = [];

  const supabase = getSupabaseAdmin();
  if (supabase) {
    const { data, error } = await supabase
      .from("rsvps")
      .select("*")
      .order("created_at", { ascending: false });
    if (error) {
      console.error("[admin/data]", error.message);
    } else {
      rows = (data ?? []) as RsvpRow[];
    }
  }

  const replies = rows.map((row) => ({
    email: row.email ?? "",
    name: row.name ?? "",
    slug: row.slug ?? "",
    status: row.attending ? "attending" : "declined",
    guests: row.guest_count ?? 0,
    message: row.message ?? "",
    phone: row.phone ?? "",
    publicWish: Boolean(row.public_wish),
  }));

  const attending = replies.filter((r) => r.status === "attending");
  const declined = replies.filter((r) => r.status === "declined");
  const totalGuests = attending.reduce((sum, r) => sum + (r.guests || 0), 0);

  const repliedSlugs = new Set(replies.map((r) => r.slug).filter(Boolean));
  const pending = Object.entries(guests)
    .filter(([slug]) => !repliedSlugs.has(slug))
    .map(([slug, g]) => ({ slug, ...g }));

  return NextResponse.json({
    ok: true,
    counts: {
      attending: attending.length,
      declined: declined.length,
      totalGuests,
      pending: pending.length,
      replies: replies.length,
    },
    replies,
    pending,
  });
}
