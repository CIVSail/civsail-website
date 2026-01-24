import { Metadata } from 'next';
import ComingSoonPortPage from '@/components/ports/ComingSoonPortPage';

export const metadata: Metadata = {
  title: 'Naval Weapons Station Earle, New Jersey Port Guide | CIVSail',
  description: 'Community-built port guide for NWS Earle, New Jersey. Local recommendations for MSC mariners.',
  keywords: ['Earle', 'New Jersey', 'MSC', 'CIVMAR', 'Naval Weapons Station', 'Atlantic'],
  openGraph: { title: 'Earle Port Guide | CIVSail', url: 'https://civsail.com/ports/united-states/new-jersey/earle' },
  alternates: { canonical: 'https://civsail.com/ports/united-states/new-jersey/earle' },
};

export default function EarlePage() {
  return (
    <ComingSoonPortPage
      portName="Naval Weapons Station Earle"
      country="New Jersey, USA"
      countrySlug="new-jersey"
      countryFlag="🇺🇸"
      region="United States"
      regionSlug="united-states"
      fleet="2nd Fleet / CONUS"
      coordinates={{ lat: 40.2668, lng: -74.0396 }}
      portType="Naval Weapons Station"
      breadcrumbs={[
        { label: 'Ports', href: '/ports' },
        { label: 'United States', href: '/ports/united-states' },
        { label: 'New Jersey', href: '/ports/united-states/new-jersey' },
        { label: 'Earle', href: '/ports/united-states/new-jersey/earle' },
      ]}
      relatedPorts={[
        { name: 'Norfolk', href: '/ports/united-states/virginia/norfolk', status: 'coming-soon' },
        { name: 'Philadelphia', href: '/ports/united-states/pennsylvania/philadelphia', status: 'coming-soon' },
        { name: 'Charleston', href: '/ports/united-states/south-carolina/charleston', status: 'coming-soon' },
      ]}
    />
  );
}
