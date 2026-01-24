import { Metadata } from 'next';
import ComingSoonPortPage from '@/components/ports/ComingSoonPortPage';

export const metadata: Metadata = {
  title: 'Charleston, South Carolina Port Guide | CIVSail',
  description: 'Community-built port guide for Charleston, South Carolina. Local recommendations for MSC mariners at this historic Southeast port.',
  keywords: ['Charleston', 'South Carolina', 'MSC', 'CIVMAR', 'Southeast', 'Historic Port'],
  openGraph: { title: 'Charleston Port Guide | CIVSail', url: 'https://civsail.com/ports/united-states/south-carolina/charleston' },
  alternates: { canonical: 'https://civsail.com/ports/united-states/south-carolina/charleston' },
};

export default function CharlestonPage() {
  return (
    <ComingSoonPortPage
      portName="Charleston"
      country="South Carolina, USA"
      countrySlug="south-carolina"
      countryFlag="🇺🇸"
      region="United States"
      regionSlug="united-states"
      fleet="CONUS"
      coordinates={{ lat: 32.7765, lng: -79.9311 }}
      portType="Commercial Port"
      breadcrumbs={[
        { label: 'Ports', href: '/ports' },
        { label: 'United States', href: '/ports/united-states' },
        { label: 'South Carolina', href: '/ports/united-states/south-carolina' },
        { label: 'Charleston', href: '/ports/united-states/south-carolina/charleston' },
      ]}
      relatedPorts={[
        { name: 'Norfolk', href: '/ports/united-states/virginia/norfolk', status: 'coming-soon' },
        { name: 'Mobile', href: '/ports/united-states/alabama/mobile', status: 'coming-soon' },
        { name: 'Philadelphia', href: '/ports/united-states/pennsylvania/philadelphia', status: 'coming-soon' },
      ]}
    />
  );
}
