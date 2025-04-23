export const runtime = "edge";

import { type Metadata } from "next";

import { asText } from "@prismicio/client";
import { SliceZone } from "@prismicio/react";

import { createClient } from "@/prismicio";
import { components } from "@/slices";

import { getLocales } from "@/utils/getLocales";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";

export default async function Home({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;

  const client = createClient();
  const home = await client.getByUID("page", "home", { lang });
  const locales = await getLocales(home, client);

  // <SliceZone> renders the page's slices.
  return (
    <>
      <LanguageSwitcher locales={locales} />
      <SliceZone slices={home.data.slices} components={components} />;
    </>
  );
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  const { lang } = await params;

  const client = createClient();
  const home = await client.getByUID("page", "home", { lang });

  return {
    title: asText(home.data.title),
    description: home.data.meta_description,
    openGraph: {
      title: home.data.meta_title ?? undefined,
      images: [{ url: home.data.meta_image.url ?? "" }],
    },
  };
}
