import { siteConfig } from "@/data/config";

function pad(n: number) {
  return String(n).padStart(2, "0");
}

/** Format Date as UTC ICS timestamp */
export function toIcsUtc(date: Date): string {
  return (
    date.getUTCFullYear() +
    pad(date.getUTCMonth() + 1) +
    pad(date.getUTCDate()) +
    "T" +
    pad(date.getUTCHours()) +
    pad(date.getUTCMinutes()) +
    pad(date.getUTCSeconds()) +
    "Z"
  );
}

export function buildWeddingIcs(): string {
  const start = new Date(siteConfig.weddingDateISO);
  const end = new Date(start.getTime() + 14 * 60 * 60 * 1000);
  const stamp = toIcsUtc(new Date());
  const uid = `wedding-${siteConfig.couple.initials.replace("&", "")}@invite`;

  const lines = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Wedding Invite//EN",
    "CALSCALE:GREGORIAN",
    "METHOD:PUBLISH",
    "BEGIN:VEVENT",
    `UID:${uid}`,
    `DTSTAMP:${stamp}`,
    `DTSTART:${toIcsUtc(start)}`,
    `DTEND:${toIcsUtc(end)}`,
    `SUMMARY:${siteConfig.couple.displayNames} Wedding`,
    `DESCRIPTION:${siteConfig.welcomeMessage.replace(/\n/g, "\\n")}`,
    `LOCATION:${siteConfig.venue.name}\\, ${siteConfig.venue.address}`,
    "END:VEVENT",
    "END:VCALENDAR",
  ];

  return lines.join("\r\n");
}

export function googleCalendarUrl(): string {
  const start = new Date(siteConfig.weddingDateISO);
  const end = new Date(start.getTime() + 14 * 60 * 60 * 1000);
  const fmt = (d: Date) =>
    `${d.getUTCFullYear()}${pad(d.getUTCMonth() + 1)}${pad(d.getUTCDate())}T${pad(d.getUTCHours())}${pad(d.getUTCMinutes())}${pad(d.getUTCSeconds())}Z`;

  const params = new URLSearchParams({
    action: "TEMPLATE",
    text: `${siteConfig.couple.displayNames} Wedding`,
    dates: `${fmt(start)}/${fmt(end)}`,
    details: siteConfig.welcomeMessage,
    location: `${siteConfig.venue.name}, ${siteConfig.venue.address}`,
  });

  return `https://calendar.google.com/calendar/render?${params.toString()}`;
}

export function downloadIcs() {
  if (typeof window === "undefined") return;
  const blob = new Blob([buildWeddingIcs()], { type: "text/calendar;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "wedding.ics";
  a.click();
  URL.revokeObjectURL(url);
}
