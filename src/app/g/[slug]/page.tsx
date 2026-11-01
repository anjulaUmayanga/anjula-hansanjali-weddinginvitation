import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { InvitationApp } from "@/components/InvitationApp";
import { siteConfig } from "@/data/config";
import { findGuestRecord } from "@/lib/guest-directory";
import { getGuest, getGuestMetadataTitle, resolveKnownGuest, toClientGuest } from "@/lib/guests";

type PageProps = {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ t?: string; g?: string }>;
};

export const dynamic = "force-dynamic";

export async function generateMetadata({ params, searchParams }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const query = await searchParams;
  const record = await findGuestRecord(slug);

  if (!record && !query.g) {
    return { title: "Invitation not found" };
  }

  const guest = record
    ? resolveKnownGuest(slug, record)
    : getGuest({ slug, titleParam: query.t, nameParam: query.g });
  const title = getGuestMetadataTitle(guest);

  return {
    title,
    openGraph: {
      title: `${title} — ${siteConfig.couple.displayNames}`,
      description: `${siteConfig.weddingDateLabel} · ${siteConfig.venue.name}`,
    },
  };
}

export default async function GuestInvitePage({ params, searchParams }: PageProps) {
  const { slug } = await params;
  const query = await searchParams;
  const record = await findGuestRecord(slug);

  if (!record && !query.g) {
    notFound();
  }

  const guest = toClientGuest(
    record
      ? resolveKnownGuest(slug, record)
      : getGuest({ slug, titleParam: query.t, nameParam: query.g }),
  );

  return <InvitationApp guest={guest} />;
}
