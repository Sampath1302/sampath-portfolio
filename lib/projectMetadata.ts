import type { Metadata } from "next";
import { projects } from "@/lib/content";
import { siteConfig } from "@/lib/siteConfig";

/**
 * Metadata for a project page. The pages are client components, so each project folder's
 * layout exports this. Next replaces (not merges) openGraph, so title, description and the
 * site's link-preview image (app/opengraph-image.tsx) are set here too.
 */
export function projectMetadata(slug: string): Metadata {
  const p = projects.find((x) => x.slug === slug)!;
  const title = `${p.title} | ${siteConfig.name}`;
  const path = `/projects/${slug}`;
  return {
    title,
    description: p.description,
    alternates: { canonical: path },
    openGraph: { title, description: p.description, url: path, type: "article", locale: "en_US", images: ["/opengraph-image"] },
    twitter: { card: "summary_large_image", title, description: p.description, images: ["/opengraph-image"] },
  };
}
