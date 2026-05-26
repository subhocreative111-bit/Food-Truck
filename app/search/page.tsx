import type { Metadata } from 'next';
import SearchClient from './SearchClient';
import { getAllCuisines } from '@/lib/data';

export const metadata: Metadata = {
  title: 'Search food trucks',
  description: 'Search by truck name, city, state or cuisine.',
};

export default function SearchPage() {
  return (
    <SearchClient
      allCuisines={getAllCuisines().map((c) => ({ cuisine: c.cuisine, count: c.count }))}
    />
  );
}
