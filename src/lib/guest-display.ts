import { titleCaseName } from "@/lib/text";

export type GuestType = "one" | "two" | "family";
/** Only used for individual guests (`type: "one"`). */
export type GuestGender = "male" | "female";

function individualTitle(gender?: GuestGender | null): string {
  return gender === "female" ? "Ms." : "Mr.";
}

/**
 * Display formats:
 * - one + male   → Mr. Kasun
 * - one + female → Ms. Nethmi
 * - two          → Mr. & Mrs. Anjula & Hansa
 * - family       → Family of Jayasiri
 */
export function formatGuestDisplay(
  type: GuestType,
  name: string,
  gender?: GuestGender | null,
): {
  title: string;
  displayName: string;
  fullGreeting: string;
} {
  const n = titleCaseName(name);
  switch (type) {
    case "one": {
      const title = individualTitle(gender);
      return {
        title,
        displayName: `${title} ${n}`,
        fullGreeting: `Dear ${title} ${n}`,
      };
    }
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
        displayName: n || "Dear Guest",
        fullGreeting: n ? `Dear ${n}` : "Dear Guest",
      };
  }
}

/** Admin list / pending label helper. */
export function guestLabel(guest: {
  type: GuestType | string;
  name: string;
  gender?: GuestGender | null;
}): string {
  if (guest.type === "family") return `Family of ${guest.name}`;
  if (guest.type === "two") return `Mr. & Mrs. ${guest.name}`;
  return `${individualTitle(guest.gender)} ${guest.name}`;
}
