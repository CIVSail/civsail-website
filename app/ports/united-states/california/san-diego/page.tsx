import { Metadata } from 'next';
import ComingSoonPortPage from '@/components/ports/ComingSoonPortPage';

export const metadata: Metadata = {
  title: 'San Diego, California Port Guide | CIVSail',
  description: 'Community-built port guide for San Diego, California. Local recommendations for MSC mariners at the largest naval fleet homeport.',
  keywords: ['San Diego', 'California', 'MSC', 'CIVMAR', 'Pacific Fleet', 'West Coast'],
  openGraph: { title: 'San Diego Port Guide | CIVSail', url: 'https://civsail.com/ports/united-states/california/san-diego' },
  alternates: { canonical: 'https://civsail.com/ports/united-states/california/san-diego' },
};

export default function SanDiegoPage() {
  return (
    <ComingSoonPortPage
      portName="San Diego"
      country="California, USA"
      countrySlug="california"
      countryFlag="🇺🇸"
      region="United States"
      regionSlug="united-states"
      fleet="3rd Fleet / CONUS"
      coordinates={{ lat: 32.7157, lng: -117.1611 }}
      portType="Naval Base"
      breadcrumbs={[
        { label: 'Ports', href: '/ports' },
        { label: 'United States', href: '/ports/united-states' },
        { label: 'California', href: '/ports/united-states/california' },
        { label: 'San Diego', href: '/ports/united-states/california/san-diego' },
      ]}
      relatedPorts={[
        { name: 'Seattle', href: '/ports/united-states/washington/seattle', status: 'coming-soon' },
        { name: 'Mobile', href: '/ports/united-states/alabama/mobile', status: 'coming-soon' },
        { name: 'Norfolk', href: '/ports/united-states/virginia/norfolk', status: 'coming-soon' },
      ]}
    />
  );
}
