import { Metadata } from 'next';
import ComingSoonPortPage from '@/components/ports/ComingSoonPortPage';

export const metadata: Metadata = {
  title: 'Souda Bay, Greece Port Guide | CIVSail',
  description: 'Community-built port guide for Souda Bay NATO facility, Crete, Greece. Local recommendations for MSC mariners.',
  keywords: ['Souda Bay', 'Greece', 'Crete', 'MSC', '6th Fleet', 'NATO', 'CIVMAR'],
  openGraph: { title: 'Souda Bay Port Guide | CIVSail', url: 'https://civsail.com/ports/europe/greece/souda-bay' },
  alternates: { canonical: 'https://civsail.com/ports/europe/greece/souda-bay' },
};

export default function SoudaBayPage() {
  return (
    <ComingSoonPortPage
      portName="Souda Bay"
      country="Greece"
      countrySlug="greece"
      countryFlag="🇬🇷"
      region="Europe"
      regionSlug="europe"
      fleet="6th Fleet / NATO"
      coordinates={{ lat: 35.4875, lng: 24.1419 }}
      portType="NATO Naval Facility"
      breadcrumbs={[
        { label: 'Ports', href: '/ports' },
        { label: 'Europe', href: '/ports/europe' },
        { label: 'Greece', href: '/ports/europe/greece' },
        { label: 'Souda Bay', href: '/ports/europe/greece/souda-bay' },
      ]}
      relatedPorts={[
        { name: 'Naples', href: '/ports/europe/italy/naples', status: 'coming-soon' },
        { name: 'Augusta Bay', href: '/ports/europe/italy/augusta-bay', status: 'coming-soon' },
        { name: 'Split', href: '/ports/europe/croatia/split', status: 'coming-soon' },
      ]}
    />
  );
}
