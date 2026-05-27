import type { Metadata } from 'next';
import OwnerDashboard from './OwnerDashboard';

export const metadata: Metadata = {
  title: 'Owner dashboard',
  description: 'Manage your food truck listings.',
  alternates: { canonical: '/owner' },
  // Owner dashboard is auth-gated — don't index in search engines
  robots: { index: false, follow: false },
};

export default function OwnerHome() {
  return <OwnerDashboard />;
}
