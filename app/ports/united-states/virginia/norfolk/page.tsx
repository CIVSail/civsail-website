import { Metadata } from 'next';
import ComingSoonPortPage from '@/components/ports/ComingSoonPortPage';

export const metadata: Metadata = {
  title: 'Norfolk, Virginia Port Guide | CIVSail',
  description: 'Community-built port guide for Norfolk, Virginia. Local recommendations for MSC mariners at the world\'s largest naval station.',
  keywords: ['Norfolk', 'Virginia', 'MSC', 'CIVMAR', 'Naval Station Norfolk', 'East Coast'],
  openGraph: { title: 'Norfolk Port Guide | CIVSail', url: 'https://civsail.com/ports/united-states/virginia/norfolk' },
  alternates: { canonical: 'https://civsail.com/ports/united-states/virginia/norfolk' },
};

export default function NorfolkPage() {
  return (
    <ComingSoonPortPage
      portName="Norfolk"
      country="Virginia, USA"
      countrySlug="virginia"
      countryFlag="🇺🇸"
      region="United States"
      regionSlug="united-states"
      fleet="2nd Fleet / CONUS"
      coordinates={{ lat: 36.8508, lng: -76.2859 }}
      portType="Naval Station"
      breadcrumbs={[
        { label: 'Ports', href: '/ports' },
        { label: 'United States', href: '/ports/united-states' },
        { label: 'Virginia', href: '/ports/united-states/virginia' },
        { label: 'Norfolk', href: '/ports/united-states/virginia/norfolk' },
      ]}
      relatedPorts={[
        { name: 'Earle', href: '/ports/united-states/new-jersey/earle', status: 'coming-soon' },
        { name: 'Charleston', href: '/ports/united-states/south-carolina/charleston', status: 'coming-soon' },
        { name: 'Philadelphia', href: '/ports/united-states/pennsylvania/philadelphia', status: 'coming-soon' },
      ]}
    />
  );
}
