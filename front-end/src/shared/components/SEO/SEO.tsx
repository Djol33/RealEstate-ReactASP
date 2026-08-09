import { Helmet } from 'react-helmet-async';

export interface SEOProps {
  title: string;
  description?: string;
  image?: string;
  noIndex?: boolean;
}

const SITE_NAME = 'Nekretnine';

export function SEO({ title, description, image, noIndex }: SEOProps) {
  const fullTitle = `${title} | ${SITE_NAME}`;

  return (
    <Helmet>
      <title>{fullTitle}</title>
      {description && <meta name="description" content={description} />}
      {noIndex && <meta name="robots" content="noindex, nofollow" />}
      <meta property="og:title" content={fullTitle} />
      {description && <meta property="og:description" content={description} />}
      {image && <meta property="og:image" content={image} />}
    </Helmet>
  );
}
