/**
 * Blog post registry. Each post is a React node — that way we can use links,
 * structured layout, and any component we need without bringing in MDX. The
 * blog index and the [slug] route pull from this single source of truth.
 */
import type { ReactNode } from 'react';

export interface BlogPost {
  slug: string;
  title: string;
  /** One-line summary used on the blog index and as the meta description. */
  excerpt: string;
  /** ISO date, e.g. "2026-05-31". */
  date: string;
  /** ~140-char meta description (defaults to excerpt if omitted). */
  metaDescription?: string;
  /** Reading time, eg. "8 min read". */
  readingTime: string;
  /** Optional cover hint — used as og:image when present. */
  coverEmoji?: string;
  /** Renders the article body. */
  render: () => ReactNode;
}

// Individual post bodies live in lib/blog/*.tsx — keep this file lean
import { nycFoodTrucks } from './blog/nyc-food-trucks';
import { howToFindFoodTrucks } from './blog/how-to-find-food-trucks';
import { texasBbqGuide } from './blog/texas-bbq-guide';
import { cuisineGuide } from './blog/cuisine-guide';
import { whyFoodTrucksMatter } from './blog/why-food-trucks-matter';

export const BLOG_POSTS: BlogPost[] = [
  nycFoodTrucks,
  howToFindFoodTrucks,
  texasBbqGuide,
  cuisineGuide,
  whyFoodTrucksMatter,
];

export function getPostBySlug(slug: string): BlogPost | undefined {
  return BLOG_POSTS.find((p) => p.slug === slug);
}

export function getAllPostsSorted(): BlogPost[] {
  return [...BLOG_POSTS].sort((a, b) => (a.date < b.date ? 1 : -1));
}
