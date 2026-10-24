import "server-only";

const BREVO_BASE = "https://api.brevo.com/v3";
const TIMEOUT_MS = 12_000;

export class BrevoError extends Error {
  status: number;
  constructor(message: string, status = 500) {
    super(message);
    this.name = "BrevoError";
    this.status = status;
  }
}

type BrevoFetchOptions = {
  method?: "GET" | "POST" | "PUT";
  body?: unknown;
};

async function brevoFetch<T>(path: string, options: BrevoFetchOptions = {}): Promise<T> {
  const apiKey = process.env.BREVO_API_KEY;
  if (!apiKey) {
    throw new BrevoError("Brevo is not configured", 503);
  }

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);

  try {
    const res = await fetch(`${BREVO_BASE}${path}`, {
      method: options.method ?? "GET",
      headers: {
        "api-key": apiKey,
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: options.body !== undefined ? JSON.stringify(options.body) : undefined,
      signal: controller.signal,
      cache: "no-store",
    });

    if (!res.ok) {
      const text = await res.text().catch(() => "");
      console.error("[brevo]", path, res.status, text.slice(0, 200));
      throw new BrevoError("Email service unavailable", res.status >= 500 ? 502 : 400);
    }

    if (res.status === 204) return undefined as T;
    const text = await res.text();
    if (!text) return undefined as T;
    return JSON.parse(text) as T;
  } catch (err) {
    if (err instanceof BrevoError) throw err;
    if (err instanceof Error && err.name === "AbortError") {
      throw new BrevoError("Email service timed out", 504);
    }
    console.error("[brevo] unexpected", err);
    throw new BrevoError("Email service unavailable", 502);
  } finally {
    clearTimeout(timer);
  }
}

export type BrevoContactAttributes = {
  FIRSTNAME?: string;
  SLUG?: string;
  RSVP_STATUS?: string;
  GUESTS?: number;
  MEAL?: string;
  MESSAGE?: string;
  PUBLIC_WISH?: string;
  PHONE?: string;
};

export async function upsertContact(input: {
  email: string;
  attributes: BrevoContactAttributes;
  listId: number;
}) {
  return brevoFetch("/contacts", {
    method: "POST",
    body: {
      email: input.email,
      attributes: input.attributes,
      listIds: [input.listId],
      updateEnabled: true,
    },
  });
}

export async function sendTransactionalEmail(input: {
  toEmail: string;
  toName?: string;
  subject: string;
  html: string;
}) {
  const senderEmail = process.env.BREVO_SENDER_EMAIL;
  const senderName = process.env.BREVO_SENDER_NAME ?? "Wedding Invitation";
  if (!senderEmail) throw new BrevoError("Sender email not configured", 503);

  return brevoFetch("/smtp/email", {
    method: "POST",
    body: {
      sender: { email: senderEmail, name: senderName },
      to: [{ email: input.toEmail, name: input.toName }],
      subject: input.subject,
      htmlContent: input.html,
    },
  });
}

export type BrevoContact = {
  email?: string;
  attributes?: Record<string, string | number | boolean | null>;
};

export async function getAllContacts(listId: number): Promise<BrevoContact[]> {
  const contacts: BrevoContact[] = [];
  let offset = 0;
  const limit = 50;

  for (;;) {
    const data = await brevoFetch<{ contacts?: BrevoContact[]; count?: number }>(
      `/contacts?listIds=${listId}&limit=${limit}&offset=${offset}&sort=desc`,
    );
    const batch = data.contacts ?? [];
    contacts.push(...batch);
    if (batch.length < limit) break;
    offset += limit;
    if (offset > 2000) break;
  }

  return contacts;
}
