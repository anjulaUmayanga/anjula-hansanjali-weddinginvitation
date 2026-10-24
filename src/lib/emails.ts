import { siteConfig } from "@/data/config";

function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

const baseStyles = `
  body { margin:0; padding:0; background:#FBF7F0; color:#3B2F2F; font-family: Georgia, 'Times New Roman', serif; }
  .wrap { max-width:560px; margin:0 auto; padding:32px 24px; }
  .card { background:#fff; border:1px solid #E6C987; border-radius:4px; padding:28px 24px; }
  h1 { font-family: Georgia, serif; font-weight:500; font-size:26px; margin:0 0 8px; color:#3B2F2F; }
  .script { font-family: Georgia, serif; font-style:italic; font-size:22px; color:#B8923F; }
  p { line-height:1.6; font-size:16px; margin:12px 0; }
  .label { font-size:12px; letter-spacing:0.2em; text-transform:uppercase; color:#8C6A25; }
  .btn { display:inline-block; margin-top:16px; padding:12px 20px; background:linear-gradient(135deg,#E6C987,#B8923F,#8C6A25); color:#fff !important; text-decoration:none; border-radius:2px; font-size:14px; letter-spacing:0.08em; }
  .muted { color:#6b5a5a; font-size:14px; }
`;

export function coupleNotifyEmailHtml(summary: {
  name: string;
  attending: string;
  guestCount: number;
  meal: string;
  email?: string;
  phone?: string;
  message?: string;
  publicWish: boolean;
  slug?: string | null;
}) {
  return `<!doctype html><html><head><meta charset="utf-8"/><style>${baseStyles}</style></head>
  <body><div class="wrap"><div class="card">
    <p class="label">RSVP received</p>
    <h1>${escapeHtml(summary.name)} is ${escapeHtml(summary.attending)}</h1>
    <p><strong>Guests:</strong> ${summary.guestCount}</p>
    <p><strong>Meal:</strong> ${escapeHtml(summary.meal)}</p>
    ${summary.email ? `<p><strong>Email:</strong> ${escapeHtml(summary.email)}</p>` : ""}
    ${summary.phone ? `<p><strong>Phone:</strong> ${escapeHtml(summary.phone)}</p>` : ""}
    ${summary.slug ? `<p><strong>Slug:</strong> ${escapeHtml(summary.slug)}</p>` : ""}
    ${summary.message ? `<p><strong>Message:</strong> ${escapeHtml(summary.message)}</p>` : ""}
    <p><strong>Public wish:</strong> ${summary.publicWish ? "Yes" : "No"}</p>
  </div></div></body></html>`;
}

export function guestConfirmationEmailHtml(input: { name: string }) {
  const maps = siteConfig.venue.mapsShareUrl;
  return `<!doctype html><html><head><meta charset="utf-8"/><style>${baseStyles}</style></head>
  <body><div class="wrap"><div class="card">
    <p class="script">You are invited</p>
    <h1>${escapeHtml(siteConfig.couple.displayNames)}</h1>
    <p>Dear ${escapeHtml(input.name)},</p>
    <p>Thank you for your RSVP. We can't wait to celebrate with you.</p>
    <p class="label">When</p>
    <p>${escapeHtml(siteConfig.weddingDateLabel)}</p>
    <p class="label">Where</p>
    <p>${escapeHtml(siteConfig.venue.name)}<br/><span class="muted">${escapeHtml(siteConfig.venue.address)}</span></p>
    <a class="btn" href="${maps}">View map</a>
    <p class="muted" style="margin-top:24px">With love,<br/>${escapeHtml(siteConfig.couple.displayNames)}</p>
  </div></div></body></html>`;
}
