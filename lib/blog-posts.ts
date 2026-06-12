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
import { halalCartsNyc } from './blog/halal-carts-nyc';
import { houstonFoodTruckGuide } from './blog/houston-food-truck-guide';
import { portlandFoodPods } from './blog/portland-food-pods';
import { laFoodTruckOrigins } from './blog/la-food-truck-origins';
import { birriaTacoTrail } from './blog/birria-taco-trail';
import { howToStartAFoodTruck } from './blog/how-to-start-a-food-truck';
import { koreanFoodTrucksAmerica } from './blog/korean-food-trucks-america';
import { newEnglandLobsterTrucks } from './blog/new-england-lobster-trucks';
// June 8 — capturing legacy URLs Google already indexed (GSC export 8 Jun 2026)
import { foodTruckMenuIdeas } from './blog/food-truck-menu-ideas';
import { bestFoodTruckFestivals } from './blog/best-food-truck-festivals';
import { foodTruckIndustryTrends } from './blog/food-truck-industry-trends';
// June 11-12 sprint — city guides
import { austinFoodTruckGuide } from './blog/austin-food-truck-guide';
import { chicagoFoodTruckGuide } from './blog/chicago-food-truck-guide';
import { nashvilleFoodTruckGuide } from './blog/nashville-food-truck-guide';
import { miamiFoodTruckGuide } from './blog/miami-food-truck-guide';
import { atlantaFoodTruckGuide } from './blog/atlanta-food-truck-guide';
import { orlandoFoodTruckGuide } from './blog/orlando-food-truck-guide';

export const BLOG_POSTS: BlogPost[] = [
  // Original 5
  nycFoodTrucks,
  howToFindFoodTrucks,
  texasBbqGuide,
  cuisineGuide,
  whyFoodTrucksMatter,
  // June 4 sprint — 8 new posts
  halalCartsNyc,
  houstonFoodTruckGuide,
  portlandFoodPods,
  laFoodTruckOrigins,
  birriaTacoTrail,
  howToStartAFoodTruck,
  koreanFoodTrucksAmerica,
  newEnglandLobsterTrucks,
  // June 8 — slugs match legacy URLs Google already has indexed
  foodTruckMenuIdeas,
  bestFoodTruckFestivals,
  foodTruckIndustryTrends,
  // June 11-12 — city guides
  austinFoodTruckGuide,
  chicagoFoodTruckGuide,
  nashvilleFoodTruckGuide,
  miamiFoodTruckGuide,
  atlantaFoodTruckGuide,
  orlandoFoodTruckGuide,
];

export function getPostBySlug(slug: string): BlogPost | undefined {
  return BLOG_POSTS.find((p) => p.slug === slug);
}

export function getAllPostsSorted(): BlogPost[] {
  return [...BLOG_POSTS].sort((a, b) => (a.date < b.date ? 1 : -1));
}
