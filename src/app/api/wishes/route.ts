import { NextResponse } from "next/server";

import { getSupabaseAdmin } from "@/lib/supabase";

export const runtime = "nodejs";

const empty = () =>
  NextResponse.json(
    { wishes: [] },
    { headers: { "Cache-Control": "private, no-store" } },
  );

export async function GET() {
  try {
    const supabase = getSupabaseAdmin();
    if (!supabase) return empty();

    const { data, error } = await supabase
      .from("rsvps")
      .select("name, message")
      .eq("public_wish", true)
      .order("created_at", { ascending: false })
      .limit(40);

    if (error) {
      console.error("[wishes]", error.message);
      return empty();
    }

    const wishes = (data ?? [])
      .map((row) => ({
        name: String(row.name ?? "Guest"),
        message: String(row.message ?? "").trim(),
      }))
      .filter((row) => row.message.length > 0);

    return NextResponse.json(
      { wishes },
      { headers: { "Cache-Control": "private, no-store" } },
    );
  } catch (err) {
    console.error("[wishes]", err);
    return NextResponse.json({ wishes: [] });
  }
}
