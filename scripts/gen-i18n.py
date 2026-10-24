#!/usr/bin/env python3
"""Generate src/i18n/index.ts with unicode-escaped messages."""
from pathlib import Path

def esc(s: str) -> str:
    out = []
    for c in s:
        o = ord(c)
        if c == "\\":
            out.append("\\\\")
        elif c == '"':
            out.append('\\"')
        elif o > 127:
            out.append(f"\\u{o:04X}")
        else:
            out.append(c)
    return "".join(out)

en = {
    "youAreInvited": "You are invited",
    "tapSeal": "Tap the seal",
    "skip": "Skip",
    "dearGuest": "Dear Guest",
    "enterName": "Enter your name",
    "scroll": "Scroll",
    "welcome": "Welcome",
    "ourStory": "Our Story",
    "families": "Families",
    "weddingDay": "Wedding Day",
    "gallery": "Gallery",
    "venue": "Venue",
    "dressCode": "Dress Code",
    "rsvp": "RSVP",
    "getDirections": "Get Directions",
    "shareLocation": "Share live location",
    "addToCalendar": "Add to Calendar",
    "googleCalendar": "Google Calendar",
    "downloadIcs": "Download .ics",
    "musicOn": "Music on",
    "musicOff": "Music off",
    "share": "Share",
    "replay": "Replay invitation",
    "thankYou": "Thank you",
    "nextUp": "Next up",
    "attending": "Will you attend?",
    "yes": "Joyfully accept",
    "no": "Respectfully decline",
    "guests": "Number of guests",
    "meal": "Meal preference",
    "veg": "Vegetarian",
    "nonVeg": "Non-vegetarian",
    "other": "Other",
    "message": "Message to the couple",
    "publicWish": "Show my wish publicly",
    "submit": "Send RSVP",
    "submitting": "Sending\u2026",
    "success": "Thank you, we can't wait to celebrate with you",
    "parking": "Parking",
    "hotels": "Stay",
    "weddingDayBanner": "It's wedding day \u2014 watch the livestream",
    "wishes": "Wishes",
}

si = {
    "youAreInvited": "\u0D94\u0DB6\u0DA7 \u0D86\u0DBB\u0DCF\u0DB0\u0DB1\u0DCF\u0DBA\u0DD2",
    "tapSeal": "\u0DB8\u0DD4\u0DAF\u0DCA\u200D\u0DBB\u0DCF\u0DC0 \u0DAD\u0DA7\u0DCA\u0DA7\u0DD4 \u0D9A\u0DBB\u0DB1\u0DCA\u0DB1",
    "skip": "\u0DB8\u0D9F\u0DC4\u0DBB\u0DD2\u0DB1\u0DCA\u0DB1",
    "dearGuest": "\u0DB4\u0DCA\u200D\u0DBB\u0DD2\u0DBA \u0D86\u0D9C\u0DB1\u0DCA\u0DAD\u0DD4\u0D9A\u0DBA\u0DCF",
    "enterName": "\u0D94\u0DB6\u0DDA \u0DB1\u0DB8 \u0D87\u0DAD\u0DD4\u0DC5\u0DAD\u0DCA \u0D9A\u0DBB\u0DB1\u0DCA\u0DB1",
    "scroll": "\u0DB4\u0DC4\u0DC5\u0DA7",
    "welcome": "\u0DC3\u0DCF\u0DAF\u0DBB\u0DBA\u0DD9\u0DB1\u0DCA \u0DB4\u0DD2\u0DC5\u0DD2\u0D9C\u0DB1\u0DD2\u0DB8\u0DD4",
    "ourStory": "\u0D85\u0DB4\u0DDA \u0D9A\u0DAD\u0DCF\u0DC0",
    "families": "\u0DB4\u0DC0\u0DD4\u0DBD\u0DCA",
    "weddingDay": "\u0DB8\u0D82\u0D9C\u0DBD \u0DAF\u0DD2\u0DB1\u0DBA",
    "gallery": "\u0DA1\u0DCF\u0DBA\u0DCF\u0DBB\u0DD6\u0DB4",
    "venue": "\u0DC3\u0DCA\u0DAE\u0DCF\u0DB1\u0DBA",
    "dressCode": "\u0D87\u0DB3\u0DD4\u0DB8\u0DCA \u0DBB\u0DA7\u0DCF\u0DC0",
    "rsvp": "RSVP",
    "getDirections": "\u0DAF\u0DD2\u0DC1\u0DCF\u0DC0\u0DB1\u0DCA \u0DBD\u0DB6\u0DCF\u0D9C\u0DB1\u0DCA\u0DB1",
    "shareLocation": "\u0DC3\u0DA2\u0DD3\u0DC0\u0DD3 \u0DC3\u0DCA\u0DAE\u0DCF\u0DB1\u0DBA \u0DB6\u0DD9\u0DAF\u0DCF\u0D9C\u0DB1\u0DCA\u0DB1",
    "addToCalendar": "\u0DAF\u0DD2\u0DB1 \u0DAF\u0DBB\u0DCA\u0DC1\u0DB1\u0DBA\u0DA7 \u0D91\u0D9A\u0DAD\u0DD4 \u0D9A\u0DBB\u0DB1\u0DCA\u0DB1",
    "googleCalendar": "Google Calendar",
    "downloadIcs": ".ics \u0DB6\u0DCF\u0D9C\u0DAD \u0D9A\u0DBB\u0DB1\u0DCA\u0DB1",
    "musicOn": "\u0DC3\u0D82\u0D9C\u0DD3\u0DAD\u0DBA \u0DC3\u0D9A\u0DCA\u200D\u0DBB\u0DD3\u0DBA\u0DBA\u0DD2",
    "musicOff": "\u0DC3\u0D82\u0D9C\u0DD3\u0DAD\u0DBA \u0DB1\u0DD2\u0DC4\u0DAC\u0DBA\u0DD2",
    "share": "\u0DB6\u0DD9\u0DAF\u0DCF\u0D9C\u0DB1\u0DCA\u0DB1",
    "replay": "\u0D86\u0DBB\u0DCF\u0DB0\u0DB1\u0DCF\u0DC0 \u0DB1\u0DD0\u0DC0\u0DAD \u0DB6\u0DBD\u0DB1\u0DCA\u0DB1",
    "thankYou": "\u0DC3\u0DCA\u0DAD\u0DD6\u0DAD\u0DD2\u0DBA\u0DD2",
    "nextUp": "\u0D8A\u0DC5\u0D9F\u0DA7",
    "attending": "\u0D94\u0DB6 \u0DB4\u0DD0\u0DB8\u0DD2\u0DAB\u0DDA\u0DC0\u0DD2\u0DAF?",
    "yes": "\u0DC3\u0DAD\u0DD4\u0DA7\u0DD2\u0DB1\u0DCA \u0DB4\u0DD2\u0DC5\u0DD2\u0D9C\u0DB1\u0DD2\u0DB8\u0DD4",
    "no": "\u0D9A\u0DAB\u0D9C\u0DCF\u0DA7\u0DD4\u0DC0\u0DD9\u0DB1\u0DCA \u0D89\u0DC0\u0DAD\u0DCA \u0DC0\u0DD9\u0DB8\u0DD4",
    "guests": "\u0D86\u0D9C\u0DB1\u0DCA\u0DAD\u0DD4\u0D9A \u0DC3\u0D82\u0D9B\u0DCA\u200D\u0DBA\u0DCF\u0DC0",
    "meal": "\u0D86\u0DC4\u0DCF\u0DBB \u0DB8\u0DB1\u0DCF\u0DB4\u0DBA",
    "veg": "\u0DB1\u0DD2\u0DBB\u0DCA\u0DB8\u0DCF\u0D82\u0DC1",
    "nonVeg": "\u0DB8\u0DCF\u0D82\u0DC1",
    "other": "\u0DC0\u0DD9\u0DB1\u0DAD\u0DCA",
    "message": "\u0DAF\u0DD9\u0DB4\u0DC5\u0DA7 \u0DB4\u0DAB\u0DD2\u0DC0\u0DD2\u0DA9\u0DBA\u0D9A\u0DCA",
    "publicWish": "\u0DB8\u0D9C\u0DDA \u0DB4\u0DCA\u200D\u0DBB\u0DCF\u0DBB\u0DCA\u0DAE\u0DB1\u0DCF\u0DC0 \u0DB4\u0DCA\u200D\u0DBB\u0DC3\u0DD2\u0DAF\u0DCA\u0DB0 \u0D9A\u0DBB\u0DB1\u0DCA\u0DB1",
    "submit": "RSVP \u0DBA\u0DC0\u0DB1\u0DCA\u0DB1",
    "submitting": "\u0DBA\u0DC0\u0DB8\u0DD2\u0DB1\u0DCA\u2026",
    "success": "\u0DC3\u0DCA\u0DAD\u0DD6\u0DAD\u0DD2\u0DBA\u0DD2, \u0D94\u0DB6 \u0DC3\u0DB8\u0D9F \u0DC3\u0DD0\u0DB8\u0DBB\u0DD3\u0DB8\u0DA7 \u0D85\u0DB4\u0DD2 \u0DB6\u0DBD\u0DCF\u0DB4\u0DDC\u0DBB\u0DDC\u0DAD\u0DCA\u0DAD\u0DD4 \u0DC0\u0DD9\u0DB8\u0DD4",
    "parking": "\u0DC0\u0DCF\u0DC4\u0DB1 \u0DB1\u0DD0\u0DC0\u0DD0\u0DAD\u0DCA\u0DC0\u0DD3\u0DB8",
    "hotels": "\u0DB1\u0DC0\u0DCF\u0DAD\u0DD0\u0DB1\u0DCA",
    "weddingDayBanner": "\u0D85\u0DAF \u0DB8\u0D82\u0D9C\u0DBD \u0DAF\u0DD2\u0DB1\u0DBA\u0DBA\u0DD2 \u2014 \u0DC3\u0DA2\u0DD3\u0DC0\u0DD3 \u0DC0\u0DD2\u0D9A\u0DCF\u0DC1\u0DB1\u0DBA \u0DB6\u0DBD\u0DB1\u0DCA\u0DB1",
    "wishes": "\u0DB4\u0DCA\u200D\u0DBB\u0DCF\u0DBB\u0DCA\u0DAE\u0DB1\u0DCF",
}

ta = {
    "youAreInvited": "\u0BA8\u0BC0\u0B99\u0BCD\u0B95\u0BB3\u0BCD \u0B85\u0BB4\u0BC8\u0B95\u0BCD\u0B95\u0BAA\u0BCD\u0BAA\u0B9F\u0BCD\u0B9F\u0BC1\u0BB3\u0BCD\u0BB3\u0BC0\u0BB0\u0BCD\u0B95\u0BB3\u0BCD",
    "tapSeal": "\u0BAE\u0BC1\u0BA4\u0BCD\u0BA4\u0BBF\u0BB0\u0BC8\u0BAF\u0BC8\u0BA4\u0BCD \u0BA4\u0B9F\u0BCD\u0B9F\u0BB5\u0BC1\u0BAE\u0BCD",
    "skip": "\u0BA4\u0BB5\u0BBF\u0BB0\u0BCD",
    "dearGuest": "\u0B85\u0BA9\u0BCD\u0BAA\u0BBE\u0BB0\u0BCD\u0BA8\u0BCD\u0BA4 \u0BB5\u0BBF\u0BB0\u0BC1\u0BA8\u0BCD\u0BA4\u0BBF\u0BA9\u0BB0\u0BCD",
    "enterName": "\u0B89\u0B99\u0BCD\u0B95\u0BB3\u0BCD \u0BAA\u0BC6\u0BAF\u0BB0\u0BC8 \u0B89\u0BB3\u0BCD\u0BB3\u0BBF\u0B9F\u0BB5\u0BC1\u0BAE\u0BCD",
    "scroll": "\u0B95\u0BC0\u0BB4\u0BC7",
    "welcome": "\u0BB5\u0BB0\u0BB5\u0BC7\u0BB1\u0BCD\u0B95\u0BBF\u0BB1\u0BCB\u0BAE\u0BCD",
    "ourStory": "\u0B8E\u0B99\u0BCD\u0B95\u0BB3\u0BCD \u0B95\u0BA4\u0BC8",
    "families": "\u0B95\u0BC1\u0B9F\u0BC1\u0BAE\u0BCD\u0BAA\u0B99\u0BCD\u0B95\u0BB3\u0BCD",
    "weddingDay": "\u0BA4\u0BBF\u0BB0\u0BC1\u0BAE\u0BA3 \u0BA8\u0BBE\u0BB3\u0BCD",
    "gallery": "\u0BAA\u0B9F\u0BA4\u0BCD\u0BA4\u0BCA\u0B95\u0BC1\u0BAA\u0BCD\u0BAA\u0BC1",
    "venue": "\u0B87\u0B9F\u0BAE\u0BCD",
    "dressCode": "\u0B89\u0B9F\u0BC8 \u0BB5\u0BBF\u0BA4\u0BBF",
    "rsvp": "RSVP",
    "getDirections": "\u0BB5\u0BB4\u0BBF\u0B95\u0BBE\u0B9F\u0BCD\u0B9F\u0BBF",
    "shareLocation": "\u0BA8\u0BC7\u0BB0\u0B9F\u0BBF \u0B87\u0B9F\u0BA4\u0BCD\u0BA4\u0BC8\u0BAA\u0BCD \u0BAA\u0B95\u0BBF\u0BB0\u0BB5\u0BC1\u0BAE\u0BCD",
    "addToCalendar": "\u0BA8\u0BBE\u0B9F\u0BCD\u0B95\u0BBE\u0B9F\u0BCD\u0B9F\u0BBF\u0BAF\u0BBF\u0BB2\u0BCD \u0B9A\u0BC7\u0BB0\u0BCD",
    "googleCalendar": "Google Calendar",
    "downloadIcs": ".ics \u0BAA\u0BA4\u0BBF\u0BB5\u0BBF\u0BB1\u0B95\u0BCD\u0B95\u0BAE\u0BCD",
    "musicOn": "\u0B87\u0B9A\u0BC8 \u0B87\u0BAF\u0B95\u0BCD\u0B95\u0BAE\u0BCD",
    "musicOff": "\u0B87\u0B9A\u0BC8 \u0BA8\u0BBF\u0BB1\u0BC1\u0BA4\u0BCD\u0BA4\u0BAE\u0BCD",
    "share": "\u0BAA\u0B95\u0BBF\u0BB0\u0BCD",
    "replay": "\u0B85\u0BB4\u0BC8\u0BAA\u0BCD\u0BAA\u0BC8 \u0BAE\u0BC0\u0BA3\u0BCD\u0B9F\u0BC1\u0BAE\u0BCD \u0B95\u0BBE\u0BA3\u0BCD\u0B95",
    "thankYou": "\u0BA8\u0BA9\u0BCD\u0BB1\u0BBF",
    "nextUp": "\u0B85\u0B9F\u0BC1\u0BA4\u0BCD\u0BA4\u0BC1",
    "attending": "\u0BA8\u0BC0\u0B99\u0BCD\u0B95\u0BB3\u0BCD \u0BB5\u0BB0\u0BC1\u0BB5\u0BC0\u0BB0\u0BCD\u0B95\u0BB3\u0BBE?",
    "yes": "\u0BAE\u0B95\u0BBF\u0BB4\u0BCD\u0B9A\u0BCD\u0B9A\u0BBF\u0BAF\u0BC1\u0B9F\u0BA9\u0BCD \u0B8F\u0BB1\u0BCD\u0B95\u0BBF\u0BB1\u0BCB\u0BAE\u0BCD",
    "no": "\u0BAE\u0BA9\u0BCD\u0BA9\u0BBF\u0BAA\u0BCD\u0BAA\u0BC1\u0B9F\u0BA9\u0BCD \u0BAE\u0BB1\u0BC1\u0B95\u0BCD\u0B95\u0BBF\u0BB1\u0BCB\u0BAE\u0BCD",
    "guests": "\u0BB5\u0BBF\u0BB0\u0BC1\u0BA8\u0BCD\u0BA4\u0BBF\u0BA9\u0BB0\u0BCD \u0B8E\u0BA3\u0BCD\u0BA3\u0BBF\u0B95\u0BCD\u0B95\u0BC8",
    "meal": "\u0B89\u0BA3\u0BB5\u0BC1 \u0BB5\u0BBF\u0BB0\u0BC1\u0BAA\u0BCD\u0BAA\u0BAE\u0BCD",
    "veg": "\u0B9A\u0BC8\u0BB5\u0BAE\u0BCD",
    "nonVeg": "\u0B85\u0B9A\u0BC8\u0BB5\u0BAE\u0BCD",
    "other": "\u0BAE\u0BB1\u0BCD\u0BB1\u0BB5\u0BC8",
    "message": "\u0BA4\u0BAE\u0BCD\u0BAA\u0BA4\u0BBF\u0BAF\u0BB0\u0BC1\u0B95\u0BCD\u0B95\u0BC1 \u0B9A\u0BC6\u0BAF\u0BCD\u0BA4\u0BBF",
    "publicWish": "\u0B8E\u0BA9\u0BCD \u0BB5\u0BBE\u0BB4\u0BCD\u0BA4\u0BCD\u0BA4\u0BC8 \u0BAA\u0B95\u0BBF\u0BB0\u0BB5\u0BC1\u0BAE\u0BCD",
    "submit": "RSVP \u0B85\u0BA9\u0BC1\u0BAA\u0BCD\u0BAA\u0BC1",
    "submitting": "\u0B85\u0BA9\u0BC1\u0BAA\u0BCD\u0BAA\u0BC1\u0B95\u0BBF\u0BB1\u0BA4\u0BC1\u2026",
    "success": "\u0BA8\u0BA9\u0BCD\u0BB1\u0BBF, \u0B89\u0B99\u0BCD\u0B95\u0BB3\u0BC1\u0B9F\u0BA9\u0BCD \u0B95\u0BCA\u0BA3\u0BCD\u0B9F\u0BBE\u0B9F \u0B86\u0BB5\u0BB2\u0BBE\u0B95 \u0B89\u0BB3\u0BCD\u0BB3\u0BCB\u0BAE\u0BCD",
    "parking": "\u0BB5\u0BBE\u0BB9\u0BA9 \u0BA8\u0BBF\u0BB1\u0BC1\u0BA4\u0BCD\u0BA4\u0BAE\u0BCD",
    "hotels": "\u0BA4\u0B99\u0BCD\u0B95\u0BB2\u0BCD",
    "weddingDayBanner": "\u0B87\u0BA9\u0BCD\u0BB1\u0BC1 \u0BA4\u0BBF\u0BB0\u0BC1\u0BAE\u0BA3 \u0BA8\u0BBE\u0BB3\u0BCD \u2014 \u0BA8\u0BC7\u0BB0\u0B9F\u0BBF \u0B92\u0BB3\u0BBF\u0BAA\u0BB0\u0BAA\u0BCD\u0BAA\u0BC1",
    "wishes": "\u0BB5\u0BBE\u0BB4\u0BCD\u0BA4\u0BCD\u0BA4\u0BC1\u0B95\u0BB3\u0BCD",
}

keys = list(en.keys())
assert keys == list(si.keys()) == list(ta.keys())

def block(name: str, d: dict) -> str:
    lines = [f"const {name}: Messages = {{"]
    for k in keys:
        lines.append(f'  {k}: "{esc(d[k])}",')
    lines.append("};")
    return "\n".join(lines)

header = """export type Lang = "en" | "si" | "ta";

export const LANG_LABELS: Record<Lang, string> = {
  en: "English",
  si: "\\u0DC3\\u0DD2\\u0D82\\u0DC4\\u0DBD",
  ta: "\\u0BA4\\u0BAE\\u0BBF\\u0BB4\\u0BCD",
};

type Messages = {
""" + "\n".join(f"  {k}: string;" for k in keys) + """
};

"""

footer = """
export const dictionaries: Record<Lang, Messages> = { en, si, ta };

export type DictKey = keyof Messages;

export function t(lang: Lang, key: DictKey): string {
  return dictionaries[lang][key] ?? dictionaries.en[key];
}
"""

out = Path(__file__).resolve().parents[1] / "src" / "i18n" / "index.ts"
out.write_text(header + block("en", en) + "\n\n" + block("si", si) + "\n\n" + block("ta", ta) + "\n" + footer, encoding="utf-8")
print("wrote", out)
