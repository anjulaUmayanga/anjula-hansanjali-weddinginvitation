"use client";

import { useCallback, useEffect, useMemo, useState } from "react";

type Reply = {
  email: string;
  name: string;
  slug: string;
  status: string;
  guests: number;
  message: string;
  phone: string;
  publicWish: boolean;
};

type InviteGuest = {
  slug: string;
  type: "one" | "two" | "family" | string;
  name: string;
  maxGuests: number;
  source?: "admin" | "file";
};

type AdminData = {
  counts: {
    attending: number;
    declined: number;
    totalGuests: number;
    pending: number;
    replies: number;
  };
  replies: Reply[];
  pending: InviteGuest[];
  guests?: InviteGuest[];
};

export function AdminDashboard() {
  const [authed, setAuthed] = useState<boolean | null>(null);
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState("");
  const [data, setData] = useState<AdminData | null>(null);
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | "attending" | "declined">("all");
  const [loading, setLoading] = useState(false);
  const [guestName, setGuestName] = useState("");
  const [guestType, setGuestType] = useState<"one" | "two" | "family">("one");
  const [guestSlug, setGuestSlug] = useState("");
  const [guestError, setGuestError] = useState("");
  const [savingGuest, setSavingGuest] = useState(false);
  const [copiedSlug, setCopiedSlug] = useState("");

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/data");
      if (res.status === 401) {
        setAuthed(false);
        setData(null);
        return;
      }
      const json = (await res.json()) as AdminData & { ok: boolean };
      if (json.ok) {
        setAuthed(true);
        setData(json);
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  const login = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError("");
    const res = await fetch("/api/admin/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password }),
    });
    if (!res.ok) {
      setLoginError("Invalid password.");
      return;
    }
    setPassword("");
    await load();
  };

  const addGuest = async (e: React.FormEvent) => {
    e.preventDefault();
    setGuestError("");
    setSavingGuest(true);
    try {
      const res = await fetch("/api/admin/guests", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: guestName,
          type: guestType,
          slug: guestSlug.trim() || undefined,
        }),
      });
      const json = (await res.json().catch(() => ({}))) as { error?: string };
      if (!res.ok) {
        setGuestError(json.error || "Could not add this guest.");
        return;
      }
      setGuestName("");
      setGuestSlug("");
      await load();
    } finally {
      setSavingGuest(false);
    }
  };

  const removeGuest = async (slug: string) => {
    const res = await fetch(`/api/admin/guests?slug=${encodeURIComponent(slug)}`, {
      method: "DELETE",
    });
    if (res.ok) await load();
  };

  const copyLink = async (slug: string) => {
    const url = `${window.location.origin}/g/${slug}`;
    try {
      await navigator.clipboard.writeText(url);
      setCopiedSlug(slug);
      window.setTimeout(() => setCopiedSlug(""), 1600);
    } catch {
      window.prompt("Copy this invite link", url);
    }
  };

  const logout = async () => {
    await fetch("/api/admin/logout", { method: "POST" });
    setAuthed(false);
    setData(null);
  };

  const filtered = useMemo(() => {
    if (!data) return [];
    return data.replies.filter((r) => {
      if (statusFilter !== "all" && r.status !== statusFilter) return false;
      if (!query.trim()) return true;
      const q = query.toLowerCase();
      return (
        r.name.toLowerCase().includes(q) ||
        r.email.toLowerCase().includes(q) ||
        r.slug.toLowerCase().includes(q) ||
        r.message.toLowerCase().includes(q)
      );
    });
  }, [data, query, statusFilter]);

  const exportCsv = () => {
    if (!data) return;
    const header = ["name", "email", "slug", "status", "guests", "phone", "message", "publicWish"];
    const rows = data.replies.map((r) =>
      [r.name, r.email, r.slug, r.status, r.guests, r.phone, r.message, r.publicWish]
        .map((v) => `"${String(v).replace(/"/g, '""')}"`)
        .join(","),
    );
    const blob = new Blob([[header.join(","), ...rows].join("\n")], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "rsvp-export.csv";
    a.click();
    URL.revokeObjectURL(url);
  };

  if (authed === null) {
    return <main className="p-8 font-serif text-ink">Loading…</main>;
  }

  if (!authed) {
    return (
      <main className="mx-auto flex min-h-dvh max-w-sm flex-col justify-center px-6">
        <h1 className="font-script text-4xl text-ink">Admin</h1>
        <p className="mt-2 text-sm text-ink/60">RSVP dashboard for Anjula & Hansanjali</p>
        <form onSubmit={login} className="glass-card gold-border mt-8 space-y-4 rounded-sm p-6">
          <label className="label-caps text-gold-dark" htmlFor="admin-pass">
            Password
          </label>
          <input
            id="admin-pass"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full rounded-sm border border-champagne bg-white/80 px-3 py-2.5 font-serif"
            autoComplete="current-password"
            required
          />
          {loginError && <p className="text-sm text-wax">{loginError}</p>}
          <button
            type="submit"
            className="w-full rounded-sm bg-gradient-to-r from-gold-light via-gold to-gold-dark py-2.5 text-ivory"
          >
            Sign in
          </button>
        </form>
      </main>
    );
  }

  return (
    <main className="mx-auto min-h-dvh max-w-5xl px-4 py-8 font-serif text-ink sm:px-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-script text-4xl">RSVP Dashboard</h1>
          <p className="text-sm text-ink/60">Anjula & Hansanjali</p>
        </div>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={exportCsv}
            className="gold-border rounded-sm px-3 py-2 text-sm"
          >
            Export CSV
          </button>
          <button type="button" onClick={() => void load()} className="gold-border rounded-sm px-3 py-2 text-sm">
            {loading ? "Refreshing…" : "Refresh"}
          </button>
          <button type="button" onClick={() => void logout()} className="rounded-sm bg-ink/10 px-3 py-2 text-sm">
            Log out
          </button>
        </div>
      </div>

      {data && (
        <>
          <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-4">
            {[
              ["Attending", data.counts.attending],
              ["Declined", data.counts.declined],
              ["Total guests", data.counts.totalGuests],
              ["Pending", data.counts.pending],
            ].map(([label, value]) => (
              <div key={label as string} className="glass-card gold-border rounded-sm p-4">
                <p className="label-caps text-gold-dark">{label}</p>
                <p className="mt-2 text-3xl">{value}</p>
              </div>
            ))}
          </div>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search name, email, slug…"
              className="flex-1 rounded-sm border border-champagne bg-white/80 px-3 py-2"
            />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as typeof statusFilter)}
              className="rounded-sm border border-champagne bg-white/80 px-3 py-2"
            >
              <option value="all">All statuses</option>
              <option value="attending">Attending</option>
              <option value="declined">Declined</option>
            </select>
          </div>

          <div className="mt-4 overflow-x-auto rounded-sm border border-champagne bg-white/70">
            <table className="min-w-full text-left text-sm">
              <thead className="bg-champagne/40 text-xs uppercase tracking-wider text-ink/70">
                <tr>
                  <th className="px-3 py-2">Name</th>
                  <th className="px-3 py-2">Status</th>
                  <th className="px-3 py-2">Guests</th>
                  <th className="px-3 py-2">Contact</th>
                  <th className="px-3 py-2">Message</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((r, i) => (
                  <tr key={`${r.email}-${r.slug}-${i}`} className="border-t border-champagne/60">
                    <td className="px-3 py-2">
                      <div>{r.name || "—"}</div>
                      <div className="text-xs text-ink/50">{r.slug}</div>
                    </td>
                    <td className="px-3 py-2 capitalize">{r.status}</td>
                    <td className="px-3 py-2">{r.guests}</td>
                    <td className="px-3 py-2">
                      <div>{r.email || "—"}</div>
                      <div className="text-xs text-ink/50">{r.phone}</div>
                    </td>
                    <td className="max-w-[220px] truncate px-3 py-2">{r.message}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <section className="mt-10">
            <h2 className="font-serif text-xl">Invite links</h2>
            <p className="mt-1 text-sm text-ink/60">
              Add a guest here, then copy their link. Individual, couple, and family links all open the invitation.
            </p>
            <form onSubmit={addGuest} className="mt-4 grid gap-3 sm:grid-cols-[1fr_160px_1fr_auto]">
              <input
                value={guestName}
                onChange={(e) => setGuestName(e.target.value)}
                placeholder="Name, e.g. Hirusha or Anjula & Hansa"
                className="rounded-sm border border-champagne bg-white/80 px-3 py-2"
                required
              />
              <select
                value={guestType}
                onChange={(e) => setGuestType(e.target.value as "one" | "two" | "family")}
                className="rounded-sm border border-champagne bg-white/80 px-3 py-2"
              >
                <option value="one">Individual</option>
                <option value="two">Couple</option>
                <option value="family">Family</option>
              </select>
              <input
                value={guestSlug}
                onChange={(e) => setGuestSlug(e.target.value)}
                placeholder="Link name, optional (hirusha)"
                className="rounded-sm border border-champagne bg-white/80 px-3 py-2"
              />
              <button
                type="submit"
                disabled={savingGuest}
                className="rounded-sm bg-gradient-to-r from-gold-light via-gold to-gold-dark px-4 py-2 text-ivory disabled:opacity-60"
              >
                {savingGuest ? "Saving…" : "Add guest"}
              </button>
            </form>
            {guestError && <p className="mt-2 text-sm text-wax">{guestError}</p>}

            <ul className="mt-4 space-y-2">
              {(data.guests ?? []).map((guest) => (
                <li
                  key={guest.slug}
                  className="flex flex-col gap-2 rounded-sm border border-champagne bg-white/70 px-3 py-3 sm:flex-row sm:items-center sm:justify-between"
                >
                  <div>
                    <p className="font-medium">
                      {guest.type === "family"
                        ? `Family of ${guest.name}`
                        : guest.type === "two"
                          ? `Mr. & Mrs. ${guest.name}`
                          : `Mr. ${guest.name}`}
                    </p>
                    <p className="text-xs text-ink/50">/g/{guest.slug}</p>
                  </div>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => void copyLink(guest.slug)}
                      className="gold-border rounded-sm px-3 py-1.5 text-sm"
                    >
                      {copiedSlug === guest.slug ? "Copied" : "Copy URL"}
                    </button>
                    {guest.source === "admin" && (
                      <button
                        type="button"
                        onClick={() => void removeGuest(guest.slug)}
                        className="rounded-sm bg-ink/10 px-3 py-1.5 text-sm"
                      >
                        Remove
                      </button>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          </section>

          {data.pending.length > 0 && (
            <div className="mt-10">
              <h2 className="font-serif text-xl">Pending guests</h2>
              <ul className="mt-3 space-y-1 text-sm text-ink/75">
                {data.pending.map((p) => (
                  <li key={p.slug}>
                    <span className="font-medium">
                      {p.type === "family"
                        ? `Family of ${p.name}`
                        : p.type === "two"
                          ? `Mr. & Mrs. ${p.name}`
                          : `Mr. ${p.name}`}
                    </span>{" "}
                    <span className="text-ink/45">/g/{p.slug}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </>
      )}
    </main>
  );
}
