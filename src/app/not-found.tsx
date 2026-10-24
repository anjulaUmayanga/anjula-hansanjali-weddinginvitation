import Link from "next/link";

export default function NotFound() {
  return (
    <main className="flex min-h-dvh flex-col items-center justify-center px-6 text-center">
      <p className="font-script text-4xl text-ink">Invitation not found</p>
      <p className="mt-3 max-w-sm font-serif text-ink/70">
        This guest link may be incorrect. Please ask the couple for your personal invitation.
      </p>
      <Link
        href="/"
        className="gold-border mt-8 rounded-sm px-6 py-2 font-serif text-sm tracking-wide text-ink transition hover:bg-champagne/50"
      >
        Open general invitation
      </Link>
    </main>
  );
}
