import { Metadata } from 'next';
import ComingSoonPortPage from '@/components/ports/ComingSoonPortPage';

export const metadata: Metadata = {
  title: 'Salalah, Oman Port Guide | CIVSail',
  description: 'Community-built port guide for Salalah, Oman. Local recommendations for MSC mariners at this strategic Arabian Sea transshipment hub.',
  keywords: ['Salalah', 'Oman', 'MSC', 'CIVMAR', '5th Fleet', 'Arabian Sea'],
  openGraph: { title: 'Salalah Port Guide | CIVSail', url: 'https://civsail.com/ports/middle-east/oman/salalah' },
  alternates: { canonical: 'https://civsail.com/ports/middle-east/oman/salalah' },
};

export default function SalalahPage() {
  return (
    <ComingSoonPortPage
      portName="Salalah"
      country="Oman"
      countrySlug="oman"
      countryFlag="🇴🇲"
      region="Middle East"
      regionSlug="middle-east"
      fleet="5th Fleet AOR"
      coordinates={{ lat: 16.9400, lng: 54.0000 }}
      portType="Transshipment Hub"
      breadcrumbs={[
        { label: 'Ports', href: '/ports' },
        { label: 'Middle East', href: '/ports/middle-east' },
        { label: 'Oman', href: '/ports/middle-east/oman' },
        { label: 'Salalah', href: '/ports/middle-east/oman/salalah' },
      ]}
      relatedPorts={[
        { name: 'Duqum', href: '/ports/middle-east/oman/duqum', status: 'coming-soon' },
        { name: 'Camp Lemonnier', href: '/ports/africa/djibouti/camp-lemonnier', status: 'coming-soon' },
        { name: 'Port Sudan', href: '/ports/africa/sudan/port-sudan', status: 'coming-soon' },
      ]}
    />
  );
}
