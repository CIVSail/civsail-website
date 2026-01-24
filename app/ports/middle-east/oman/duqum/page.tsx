import { Metadata } from 'next';
import ComingSoonPortPage from '@/components/ports/ComingSoonPortPage';

export const metadata: Metadata = {
  title: 'Duqum, Oman Port Guide | CIVSail',
  description: 'Community-built port guide for Duqum, Oman. Local recommendations for MSC mariners at this developing deepwater port on the Arabian Sea.',
  keywords: ['Duqum', 'Oman', 'MSC', 'CIVMAR', '5th Fleet', 'Arabian Sea'],
  openGraph: { title: 'Duqum Port Guide | CIVSail', url: 'https://civsail.com/ports/middle-east/oman/duqum' },
  alternates: { canonical: 'https://civsail.com/ports/middle-east/oman/duqum' },
};

export default function DuqumPage() {
  return (
    <ComingSoonPortPage
      portName="Duqum"
      country="Oman"
      countrySlug="oman"
      countryFlag="🇴🇲"
      region="Middle East"
      regionSlug="middle-east"
      fleet="5th Fleet AOR"
      coordinates={{ lat: 19.6714, lng: 57.7035 }}
      portType="Deepwater Port"
      breadcrumbs={[
        { label: 'Ports', href: '/ports' },
        { label: 'Middle East', href: '/ports/middle-east' },
        { label: 'Oman', href: '/ports/middle-east/oman' },
        { label: 'Duqum', href: '/ports/middle-east/oman/duqum' },
      ]}
      relatedPorts={[
        { name: 'Salalah', href: '/ports/middle-east/oman/salalah', status: 'coming-soon' },
        { name: 'Fujairah', href: '/ports/middle-east/uae/fujairah', status: 'coming-soon' },
        { name: 'Bahrain', href: '/ports/middle-east/bahrain/bahrain', status: 'coming-soon' },
      ]}
    />
  );
}
