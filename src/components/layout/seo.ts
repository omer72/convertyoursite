import type { Metadata } from "next";

interface SeoProps {
  title: string;
  description: string;
  path?: string;
  ogImage?: string;
}

const SITE_NAME = "convertYourSite";
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://convertyoursite.com";
const DEFAULT_OG_IMAGE = `${SITE_URL}/og-image.png`;

export function buildMetadata({
  title,
  description,
  path = "",
  ogImage,
}: SeoProps): Metadata {
  const url = `${SITE_URL}${path}`;
  const image = ogImage || DEFAULT_OG_IMAGE;

  return {
    title: `${title} | ${SITE_NAME}`,
    description,
    metadataBase: new URL(SITE_URL),
    alternates: {
      canonical: url,
    },
    openGraph: {
      title: `${title} | ${SITE_NAME}`,
      description,
      url,
      siteName: SITE_NAME,
      images: [
        {
          url: image,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: `${title} | ${SITE_NAME}`,
      description,
      images: [image],
    },
  };
}
