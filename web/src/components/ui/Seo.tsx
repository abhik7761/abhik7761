import { Helmet } from 'react-helmet-async';
import { brand } from '@/config/brand';

export function Seo({
  title,
  description,
  jsonLd,
  noindex,
}: {
  title: string;
  description?: string;
  jsonLd?: object;
  noindex?: boolean;
}) {
  const t = title ? `${title} | ${brand.name}` : brand.name;
  return (
    <Helmet>
      <title>{t}</title>
      {description && <meta name="description" content={description} />}
      <meta property="og:title" content={t} />
      {description && <meta property="og:description" content={description} />}
      {noindex && <meta name="robots" content="noindex" />}
      {jsonLd && <script type="application/ld+json">{JSON.stringify(jsonLd)}</script>}
    </Helmet>
  );
}
