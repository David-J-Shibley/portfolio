import { Helmet } from "react-helmet-async";

const rawOrigin = import.meta.env.VITE_SITE_ORIGIN as string | undefined;
const siteOrigin = rawOrigin?.replace(/\/$/, "") ?? "";

/** Fallback when VITE_SITE_ORIGIN is unset — Open Graph prefers absolute URLs. */
const DEFAULT_SHARE_IMAGE =
  "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?auto=format&fit=crop&w=1200&q=80";

type PageMetaProps = {
  title: string;
  description?: string;
  /** Path only, e.g. /projects */
  path?: string;
  image?: string;
};

export function PageMeta({
  title,
  description = "Full stack developer portfolio — projects, games, case studies, and contact.",
  path = "",
  image,
}: PageMetaProps) {
  const fullTitle = title.includes("David Shibley")
    ? title
    : `${title} · David Shibley`;
  const canonical =
    siteOrigin && path !== undefined ? `${siteOrigin}${path || "/"}` : undefined;
  const ogImage =
    image ||
    (siteOrigin ? `${siteOrigin}/og-image.png` : DEFAULT_SHARE_IMAGE);

  return (
    <Helmet prioritizeSeoTags>
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      {canonical && <link rel="canonical" href={canonical} />}
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:type" content="website" />
      {canonical && <meta property="og:url" content={canonical} />}
      <meta property="og:image" content={ogImage} />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={ogImage} />
    </Helmet>
  );
}
