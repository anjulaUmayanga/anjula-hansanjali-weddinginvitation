import "server-only";

import guestsData from "@/data/guests.json";
import { titleCaseName } from "@/lib/text";
import type { ClientGuest } from "@/types/guest";

export type GuestType = "one" | "two" | "family";

export type GuestRecord = {
  type: GuestType;
  name: string;
  maxGuests: number;
};

export type ResolvedGuest = GuestRecord & {
  slug: string | null;
  title: string;
  displayName: string;
  fullGreeting: string;
  isFallback: boolean;
};

export type { ClientGuest };

const guests = guestsData as Record<string, GuestRecord>;

const MAX_PARAM_LENGTH = 60;
const FALLBACK_NAME = "Dear Guest";

/** Strip HTML-ish characters and control chars; trim; cap length. */
export function sanitiseText(value: unknown, max = MAX_PARAM_LENGTH): string {
  if (typeof value !== "string") return "";
  return value
    .replace(/[<>&"'`]/g, "")
    .replace(/[\u0000-\u001F\u007F]/g, "")
    .trim()
    .slice(0, max);
}

/**
 * Display formats:
 * - one  → Mr. Anjula
 * - two  → Mr. & Mrs. Anjula & Hansa
 * - family → Family of Jayasiri
 */
export function formatGuestDisplay(type: GuestType, name: string): {
  title: string;
  displayName: string;
  fullGreeting: string;
} {
  const n = titleCaseName(name);
  switch (type) {
    case "one":
      return {
        title: "Mr.",
        displayName: `Mr. ${n}`,
        fullGreeting: `Dear Mr. ${n}`,
      };
    case "two":
      return {
        title: "Mr. & Mrs.",
        displayName: `Mr. & Mrs. ${n}`,
        fullGreeting: `Dear Mr. & Mrs. ${n}`,
      };
    case "family":
      return {
        title: "Family of",
        displayName: `Family of ${n}`,
        fullGreeting: `Dear Family of ${n}`,
      };
    default:
      return {
        title: "",
        displayName: n || FALLBACK_NAME,
        fullGreeting: n ? `Dear ${n}` : FALLBACK_NAME,
      };
  }
}

export function getAllGuestSlugs(): string[] {
  return Object.keys(guests);
}

export function getAllGuests(): Record<string, GuestRecord> {
  return guests;
}

export function getGuestBySlug(slug: string | undefined | null): GuestRecord | null {
  if (!slug) return null;
  const key = sanitiseText(slug, 40).toLowerCase();
  return guests[key] ?? null;
}

export type GuestLookupInput = {
  slug?: string | null;
  titleParam?: string | null;
  nameParam?: string | null;
};

/**
 * Resolve guest:
 * (1) slug in guests.json
 * (2) ?g= name with optional ?t=one|two|family
 * (3) fallback
 */
export function getGuest(input: GuestLookupInput = {}): ResolvedGuest {
  const fromSlug = getGuestBySlug(input.slug);
  if (fromSlug) {
    const formatted = formatGuestDisplay(fromSlug.type, fromSlug.name);
    return {
      ...fromSlug,
      ...formatted,
      slug: sanitiseText(input.slug, 40).toLowerCase(),
      isFallback: false,
    };
  }

  const name = sanitiseText(input.nameParam);
  if (name) {
    const typeParam = sanitiseText(input.titleParam, 16).toLowerCase();
    const type: GuestType =
      typeParam === "family" || typeParam === "two" || typeParam === "one"
        ? typeParam
        : name.toLowerCase().includes(" & ") || name.toLowerCase().includes(" and ")
          ? "two"
          : "one";
    const cleanName =
      type === "two"
        ? name.replace(/\s+and\s+/gi, " & ")
        : type === "family"
          ? name.replace(/\s+family$/i, "").trim()
          : name;
    const formatted = formatGuestDisplay(type, cleanName);
    return {
      type,
      name: cleanName,
      maxGuests: type === "family" ? 4 : type === "two" ? 2 : 1,
      slug: null,
      ...formatted,
      isFallback: false,
    };
  }

  return {
    type: "one",
    title: "",
    name: FALLBACK_NAME,
    maxGuests: 2,
    slug: null,
    displayName: FALLBACK_NAME,
    fullGreeting: FALLBACK_NAME,
    isFallback: true,
  };
}

export function toClientGuest(guest: ResolvedGuest): ClientGuest {
  return {
    slug: guest.slug,
    title: guest.title,
    name: guest.name,
    displayName: guest.displayName,
    fullGreeting: guest.fullGreeting,
    maxGuests: guest.maxGuests,
    isFallback: guest.isFallback,
  };
}

export function resolveKnownGuest(slug: string, record: GuestRecord): ResolvedGuest {
  const formatted = formatGuestDisplay(record.type, record.name);
  return {
    ...record,
    ...formatted,
    slug: sanitiseText(slug, 40).toLowerCase(),
    isFallback: false,
  };
}

export function getGuestMetadataTitle(guest: ResolvedGuest): string {
  if (guest.isFallback) return "You are invited";
  return `${guest.displayName}, you are invited`;
}
