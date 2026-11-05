import "server-only";

import guestsData from "@/data/guests.json";
import type { GuestGender, GuestRecord, GuestType } from "@/lib/guests";
import { sanitiseText } from "@/lib/guests";
import { titleCaseName } from "@/lib/text";
import { getSupabaseAdmin } from "@/lib/supabase";

export type DirectoryGuest = GuestRecord & {
  slug: string;
  source: "admin" | "file";
};

const fileGuests = guestsData as Record<string, GuestRecord>;

export function slugifyGuest(name: string, type: GuestType): string {
  let base = name
    .toLowerCase()
    .replace(/&/g, " ")
    .replace(/\band\b/g, " ")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 32);

  if (!base) base = "guest";
  if (type === "family" && !base.endsWith("-family")) {
    base = `${base}-family`.slice(0, 40);
  }
  return base;
}

function normaliseSlug(slug: string): string {
  return sanitiseText(slug, 40).toLowerCase().replace(/[^a-z0-9-]/g, "");
}

function normaliseGender(value: unknown): GuestGender | null {
  if (value === "male" || value === "female") return value;
  return null;
}

type DbGuest = {
  slug: string;
  type: string;
  name: string;
  max_guests: number;
  gender?: string | null;
};

function fromDb(row: DbGuest): DirectoryGuest | null {
  if (row.type !== "one" && row.type !== "two" && row.type !== "family") return null;
  const gender = row.type === "one" ? normaliseGender(row.gender) : null;
  return {
    slug: row.slug,
    type: row.type,
    name: titleCaseName(row.name),
    maxGuests: row.max_guests || 10,
    gender,
    source: "admin",
  };
}

async function listDbGuests(): Promise<DirectoryGuest[] | null> {
  const supabase = getSupabaseAdmin();
  if (!supabase) return null;

  const { data, error } = await supabase
    .from("guests")
    .select("slug, type, name, max_guests, gender")
    .order("created_at", { ascending: true });

  if (error) {
    console.error("[guests]", error.message);
    return null;
  }

  return (data ?? [])
    .map((row) => fromDb(row as DbGuest))
    .filter((row): row is DirectoryGuest => row !== null);
}

export async function listDirectoryGuests(): Promise<DirectoryGuest[]> {
  const db = await listDbGuests();
  const bySlug = new Map<string, DirectoryGuest>();

  for (const [slug, guest] of Object.entries(fileGuests)) {
    bySlug.set(slug, {
      ...guest,
      gender: guest.type === "one" ? (guest.gender ?? "male") : null,
      slug,
      source: "file",
    });
  }

  for (const guest of db ?? []) {
    bySlug.set(guest.slug, guest);
  }

  return [...bySlug.values()];
}

export async function findGuestRecord(slug: string | null | undefined): Promise<GuestRecord | null> {
  if (!slug) return null;
  const key = normaliseSlug(slug);
  if (!key) return null;

  const db = await listDbGuests();
  const saved = db?.find((guest) => guest.slug === key);
  if (saved) {
    return {
      type: saved.type,
      name: saved.name,
      maxGuests: saved.maxGuests,
      gender: saved.gender ?? null,
    };
  }

  const file = fileGuests[key];
  if (!file) return null;
  return {
    ...file,
    gender: file.type === "one" ? (file.gender ?? "male") : null,
  };
}

export async function createDirectoryGuest(input: {
  name: string;
  type: GuestType;
  slug?: string;
  gender?: GuestGender | null;
}): Promise<{ ok: true; guest: DirectoryGuest } | { ok: false; error: string; status: number }> {
  const supabase = getSupabaseAdmin();
  if (!supabase) {
    return { ok: false, error: "Supabase is not configured.", status: 503 };
  }

  const name = titleCaseName(sanitiseText(input.name, 60));
  if (!name) return { ok: false, error: "Enter a guest name.", status: 400 };

  if (input.type === "one" && input.gender !== "male" && input.gender !== "female") {
    return { ok: false, error: "Select gender for an individual guest.", status: 400 };
  }

  const slug = normaliseSlug(input.slug?.trim() || slugifyGuest(name, input.type));
  if (!slug) return { ok: false, error: "Enter a valid link name.", status: 400 };

  const gender = input.type === "one" ? input.gender : null;

  const row = {
    slug,
    type: input.type,
    name,
    max_guests: 10,
    gender,
  };

  const { error } = await supabase.from("guests").insert(row);
  if (error) {
    if (error.code === "23505") {
      return { ok: false, error: "That invite link already exists.", status: 409 };
    }
    console.error("[guests] insert", error.message);
    if (error.message.toLowerCase().includes("gender")) {
      return {
        ok: false,
        error: "Add the gender column in Supabase first. Run supabase/schema.sql.",
        status: 503,
      };
    }
    if (error.message.toLowerCase().includes("guests")) {
      return {
        ok: false,
        error: "Create the guests table in Supabase first. Run supabase/schema.sql.",
        status: 503,
      };
    }
    return { ok: false, error: "Could not save this guest.", status: 500 };
  }

  return {
    ok: true,
    guest: {
      slug,
      type: input.type,
      name,
      maxGuests: 10,
      gender,
      source: "admin",
    },
  };
}

export async function deleteDirectoryGuest(slug: string): Promise<{ ok: boolean; error?: string }> {
  const supabase = getSupabaseAdmin();
  if (!supabase) return { ok: false, error: "Supabase is not configured." };

  const key = normaliseSlug(slug);
  const { error } = await supabase.from("guests").delete().eq("slug", key);
  if (error) {
    console.error("[guests] delete", error.message);
    return { ok: false, error: "Could not remove this guest." };
  }
  return { ok: true };
}
