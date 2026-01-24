import { Metadata } from 'next';
import ComingSoonPortPage from '@/components/ports/ComingSoonPortPage';

export const metadata: Metadata = {
  title: 'Fujairah, UAE Port Guide | CIVSail',
  description: 'Community-built port guide for Fujairah, United Arab Emirates. Local recommendations for MSC mariners at this strategic Gulf of Oman bunkering port.',
  keywords: ['Fujairah', 'UAE', 'United Arab Emirates', 'MSC', 'CIVMAR', '5th Fleet', 'Gulf of Oman'],
  openGraph: { title: 'Fujairah Port Guide | CIVSail', url: 'https://civsail.com/ports/middle-east/uae/fujairah' },
  alternates: { canonical: 'https://civsail.com/ports/middle-east/uae/fujairah' },
};

export default function FujairahPage() {
  return (
    <ComingSoonPortPage
      portName="Fujairah"
      country="United Arab Emirates"
      countrySlug="uae"
      countryFlag="🇦🇪"
      region="Middle East"
      regionSlug="middle-east"
      fleet="5th Fleet AOR"
      coordinates={{ lat: 25.1288, lng: 56.3264 }}
      portType="Bunkering Hub"
      breadcrumbs={[
        { label: 'Ports', href: '/ports' },
        { label: 'Middle East', href: '/ports/middle-east' },
        { label: 'UAE', href: '/ports/middle-east/uae' },
        { label: 'Fujairah', href: '/ports/middle-east/uae/fujairah' },
      ]}
      relatedPorts={[
        { name: 'Dubai', href: '/ports/middle-east/uae/dubai', status: 'coming-soon' },
        { name: 'Duqum', href: '/ports/middle-east/oman/duqum', status: 'coming-soon' },
        { name: 'Salalah', href: '/ports/middle-east/oman/salalah', status: 'coming-soon' },
      ]}
    />
  );
}
