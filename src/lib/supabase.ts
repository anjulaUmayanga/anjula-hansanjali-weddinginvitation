import "server-only";

import { createClient, type SupabaseClient } from "@supabase/supabase-js";

export type RsvpRow = {
  id: string;
  slug: string | null;
  name: string;
  email: string | null;
  phone: string | null;
  attending: boolean;
  guest_count: number;
  message: string | null;
  public_wish: boolean;
  created_at: string;
  updated_at: string;
};

let client: SupabaseClient | null = null;

/** Server-only client. Uses the service role key so the browser never sees it. */
export function getSupabaseAdmin(): SupabaseClient | null {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) return null;
  if (!client) {
    client = createClient(url, key, {
      auth: { persistSession: false, autoRefreshToken: false },
    });
  }
  return client;
}
