import { Metadata } from 'next';
import ComingSoonPortPage from '@/components/ports/ComingSoonPortPage';

export const metadata: Metadata = {
  title: 'Philadelphia, Pennsylvania Port Guide | CIVSail',
  description: 'Community-built port guide for Philadelphia, Pennsylvania. Local recommendations for MSC mariners at this Mid-Atlantic shipyard hub.',
  keywords: ['Philadelphia', 'Pennsylvania', 'MSC', 'CIVMAR', 'Mid-Atlantic', 'Delaware River'],
  openGraph: { title: 'Philadelphia Port Guide | CIVSail', url: 'https://civsail.com/ports/united-states/pennsylvania/philadelphia' },
  alternates: { canonical: 'https://civsail.com/ports/united-states/pennsylvania/philadelphia' },
};

export default function PhiladelphiaPage() {
  return (
    <ComingSoonPortPage
      portName="Philadelphia"
      country="Pennsylvania, USA"
      countrySlug="pennsylvania"
      countryFlag="🇺🇸"
      region="United States"
      regionSlug="united-states"
      fleet="CONUS"
      coordinates={{ lat: 39.9526, lng: -75.1652 }}
      portType="Shipyard"
      breadcrumbs={[
        { label: 'Ports', href: '/ports' },
        { label: 'United States', href: '/ports/united-states' },
        { label: 'Pennsylvania', href: '/ports/united-states/pennsylvania' },
        { label: 'Philadelphia', href: '/ports/united-states/pennsylvania/philadelphia' },
      ]}
      relatedPorts={[
        { name: 'Earle', href: '/ports/united-states/new-jersey/earle', status: 'coming-soon' },
        { name: 'Norfolk', href: '/ports/united-states/virginia/norfolk', status: 'coming-soon' },
        { name: 'Charleston', href: '/ports/united-states/south-carolina/charleston', status: 'coming-soon' },
      ]}
    />
  );
}
