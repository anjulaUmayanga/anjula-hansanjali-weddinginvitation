/** Client-safe guest shape — never include the full guest list. */
export type ClientGuest = {
  slug: string | null;
  title: string;
  name: string;
  displayName: string;
  fullGreeting: string;
  maxGuests: number;
  isFallback: boolean;
};
