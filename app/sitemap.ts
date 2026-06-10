import type { MetadataRoute } from 'next';
import { getAllCities, getAllCuisines, getAllStates, getTrucksWithDetailPages } from '@/lib/data';
import { BLOG_POSTS } from '@/lib/blog-posts';

const BASE = 'https://foodtrucksnearmeusa.com';

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  const staticPages: MetadataRoute.Sitemap = [
    { url: `${BASE}/`, lastModified: now, changeFrequency: 'daily', priority: 1 },
    { url: `${BASE}/states`, lastModified: now, changeFrequency: 'weekly', priority: 0.9 },
    { url: `${BASE}/cuisines`, lastModified: now, changeFrequency: 'weekly', priority: 0.9 },
    { url: `${BASE}/search`, lastModified: now, changeFrequency: 'monthly', priority: 0.6 },
    { url: `${BASE}/list-your-truck`, lastModified: now, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${BASE}/for-trucks`, lastModified: now, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${BASE}/for-trucks/faq`, lastModified: now, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${BASE}/for-trucks/guide`, lastModified: now, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${BASE}/about`, lastModified: now, changeFrequency: 'monthly', priority: 0.4 },
    { url: `${BASE}/contact`, lastModified: now, changeFrequency: 'monthly', priority: 0.4 },
    { url: `${BASE}/blog`, lastModified: now, changeFrequency: 'weekly', priority: 0.5 },
    { url: `${BASE}/privacy`, lastModified: now, changeFrequency: 'yearly', priority: 0.3 },
    { url: `${BASE}/terms`, lastModified: now, changeFrequency: 'yearly', priority: 0.3 },
  ];

  const states: MetadataRoute.Sitemap = getAllStates().map((s) => ({
    url: `${BASE}/states/${s.slug}`,
    lastModified: now,
    changeFrequency: 'weekly',
    priority: 0.85,
  }));

  const cities: MetadataRoute.Sitemap = getAllCities().map((c) => ({
    url: `${BASE}/states/${c.stateSlug}/${c.slug}`,
    lastModified: now,
    changeFrequency: 'weekly',
    priority: 0.75,
  }));

  const cuisines: MetadataRoute.Sitemap = getAllCuisines().map((c) => ({
    url: `${BASE}/cuisines/${c.slug}`,
    lastModified: now,
    changeFrequency: 'weekly',
    priority: 0.7,
  }));

  // Truck image URLs are emitted via a separate sitemap-images.xml generated
  // at build time by scripts/build-image-sitemap.mjs. Next 14.2's
  // MetadataRoute.Sitemap silently drops the `images` field, which is fixed
  // in 14.3+ but upgrading mid-flight isn't worth the risk right now.
  const trucks: MetadataRoute.Sitemap = getTrucksWithDetailPages().map((t) => ({
    url: `${BASE}/truck/${t.slug}`,
    lastModified: now,
    changeFrequency: 'monthly',
    priority: 0.6,
  }));

  const posts: MetadataRoute.Sitemap = BLOG_POSTS.map((p) => ({
    url: `${BASE}/blog/${p.slug}`,
    lastModified: new Date(p.date),
    changeFrequency: 'monthly',
    priority: 0.7,
  }));

  return [...staticPages, ...states, ...cities, ...cuisines, ...posts, ...trucks];
}
