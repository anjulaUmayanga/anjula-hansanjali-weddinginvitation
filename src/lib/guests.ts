import "server-only";

import guestsData from "@/data/guests.json";
import {
  formatGuestDisplay,
  type GuestGender,
  type GuestType,
} from "@/lib/guest-display";
import type { ClientGuest } from "@/types/guest";

export type { GuestGender, GuestType };
export { formatGuestDisplay, guestLabel } from "@/lib/guest-display";

export type GuestRecord = {
  type: GuestType;
  name: string;
  maxGuests: number;
  /** Required for individuals. Null/omitted for couples and families. */
  gender?: GuestGender | null;
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
    const formatted = formatGuestDisplay(fromSlug.type, fromSlug.name, fromSlug.gender);
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
      gender: type === "one" ? "male" : null,
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
    gender: null,
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
  const formatted = formatGuestDisplay(record.type, record.name, record.gender);
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
