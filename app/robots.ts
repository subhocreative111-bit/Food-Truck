import type { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [{ userAgent: '*', allow: '/' }],
    sitemap: [
      'https://foodtrucksnearmeusa.com/sitemap.xml',
      'https://foodtrucksnearmeusa.com/sitemap-images.xml',
    ],
  };
}
