import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { InvitationApp } from "@/components/InvitationApp";
import { siteConfig } from "@/data/config";
import {
  getAllGuestSlugs,
  getGuest,
  getGuestBySlug,
  getGuestMetadataTitle,
  toClientGuest,
} from "@/lib/guests";

type PageProps = {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ t?: string; g?: string }>;
};

export function generateStaticParams() {
  return getAllGuestSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({ params, searchParams }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const query = await searchParams;
  const guest = getGuest({ slug, titleParam: query.t, nameParam: query.g });

  if (!getGuestBySlug(slug) && !query.g) {
    return { title: "Invitation not found" };
  }

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

  if (!getGuestBySlug(slug) && !query.g) {
    notFound();
  }

  const guest = toClientGuest(
    getGuest({ slug, titleParam: query.t, nameParam: query.g }),
  );

  return <InvitationApp guest={guest} />;
}
