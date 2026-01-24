import { Metadata } from 'next';
import ComingSoonPortPage from '@/components/ports/ComingSoonPortPage';

export const metadata: Metadata = {
  title: 'Seattle, Washington Port Guide | CIVSail',
  description: 'Community-built port guide for Seattle, Washington. Local recommendations for MSC mariners at this Pacific Northwest maritime hub.',
  keywords: ['Seattle', 'Washington', 'MSC', 'CIVMAR', 'Pacific Northwest', 'Puget Sound'],
  openGraph: { title: 'Seattle Port Guide | CIVSail', url: 'https://civsail.com/ports/united-states/washington/seattle' },
  alternates: { canonical: 'https://civsail.com/ports/united-states/washington/seattle' },
};

export default function SeattlePage() {
  return (
    <ComingSoonPortPage
      portName="Seattle"
      country="Washington, USA"
      countrySlug="washington"
      countryFlag="🇺🇸"
      region="United States"
      regionSlug="united-states"
      fleet="3rd Fleet / CONUS"
      coordinates={{ lat: 47.6062, lng: -122.3321 }}
      portType="Commercial Port"
      breadcrumbs={[
        { label: 'Ports', href: '/ports' },
        { label: 'United States', href: '/ports/united-states' },
        { label: 'Washington', href: '/ports/united-states/washington' },
        { label: 'Seattle', href: '/ports/united-states/washington/seattle' },
      ]}
      relatedPorts={[
        { name: 'San Diego', href: '/ports/united-states/california/san-diego', status: 'coming-soon' },
        { name: 'Norfolk', href: '/ports/united-states/virginia/norfolk', status: 'coming-soon' },
        { name: 'Mobile', href: '/ports/united-states/alabama/mobile', status: 'coming-soon' },
      ]}
    />
  );
}
