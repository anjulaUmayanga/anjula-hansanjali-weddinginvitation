import type { Metadata } from "next";

import { InvitationApp } from "@/components/InvitationApp";
import { siteConfig } from "@/data/config";
import { getGuest, getGuestMetadataTitle, toClientGuest } from "@/lib/guests";

type PageProps = {
  searchParams: Promise<{ t?: string; g?: string }>;
};

export async function generateMetadata({ searchParams }: PageProps): Promise<Metadata> {
  const params = await searchParams;
  const guest = getGuest({ titleParam: params.t, nameParam: params.g });
  const title = getGuestMetadataTitle(guest);

  return {
    title,
    openGraph: {
      title: `${title} — ${siteConfig.couple.displayNames}`,
      description: `${siteConfig.weddingDateLabel} · ${siteConfig.venue.name}`,
    },
  };
}

export default async function HomePage({ searchParams }: PageProps) {
  const params = await searchParams;
  const guest = toClientGuest(getGuest({ titleParam: params.t, nameParam: params.g }));
  return <InvitationApp guest={guest} />;
}
