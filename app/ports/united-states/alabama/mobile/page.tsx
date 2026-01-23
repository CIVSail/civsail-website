import { Metadata } from 'next';
import ComingSoonPortPage from '@/components/ports/ComingSoonPortPage';

export const metadata: Metadata = {
  title: 'Mobile, Alabama Port Guide | CIVSail',
  description: 'Community-built port guide for Mobile, Alabama. Local recommendations for MSC mariners at this Gulf Coast gateway.',
  keywords: ['Mobile', 'Alabama', 'MSC', 'CIVMAR', 'Gulf Coast', 'Gulf of Mexico'],
  openGraph: { title: 'Mobile Port Guide | CIVSail', url: 'https://civsail.com/ports/united-states/alabama/mobile' },
  alternates: { canonical: 'https://civsail.com/ports/united-states/alabama/mobile' },
};

export default function MobilePage() {
  return (
    <ComingSoonPortPage
      portName="Mobile"
      country="Alabama, USA"
      countrySlug="alabama"
      countryFlag="🇺🇸"
      region="United States"
      regionSlug="united-states"
      fleet="CONUS"
      coordinates={{ lat: 30.6954, lng: -88.0399 }}
      portType="Commercial Port"
      breadcrumbs={[
        { label: 'Ports', href: '/ports' },
        { label: 'United States', href: '/ports/united-states' },
        { label: 'Alabama', href: '/ports/united-states/alabama' },
        { label: 'Mobile', href: '/ports/united-states/alabama/mobile' },
      ]}
      relatedPorts={[
        { name: 'Charleston', href: '/ports/united-states/south-carolina/charleston', status: 'coming-soon' },
        { name: 'Norfolk', href: '/ports/united-states/virginia/norfolk', status: 'coming-soon' },
        { name: 'San Diego', href: '/ports/united-states/california/san-diego', status: 'coming-soon' },
      ]}
    />
  );
}
