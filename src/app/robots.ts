import type { MetadataRoute } from 'next';

const SITE_URL = process.env.PUBLIC_APP_URL || 'https://lessora.ajgenabio.me';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
    },
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
