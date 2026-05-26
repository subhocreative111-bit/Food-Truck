import type { Metadata } from 'next';
import OwnerDashboard from './OwnerDashboard';

export const metadata: Metadata = {
  title: 'Owner dashboard',
  description: 'Manage your food truck listings.',
};

export default function OwnerHome() {
  return <OwnerDashboard />;
}
