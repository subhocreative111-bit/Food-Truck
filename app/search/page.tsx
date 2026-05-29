import type { Metadata } from 'next';
import SearchClient from './SearchClient';
import { getAllCuisines } from '@/lib/data';

export const metadata: Metadata = {
  title: 'Search food trucks',
  description:
    'Search thousands of independent food trucks across all 50 states by name, city, state or cuisine — with ratings, opening hours and locations.',
  alternates: { canonical: '/search' },
};

export default function SearchPage() {
  return (
    <SearchClient
      allCuisines={getAllCuisines().map((c) => ({ cuisine: c.cuisine, count: c.count }))}
    />
  );
}
