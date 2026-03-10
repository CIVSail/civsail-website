import { Metadata } from 'next';
import ComingSoonPortPage from '@/components/ports/ComingSoonPortPage';

export const metadata: Metadata = {
  title: 'Dubai, UAE Port Guide | CIVSail',
  description: 'Community-built port guide for Dubai, United Arab Emirates. Local recommendations for MSC mariners at this premier Gulf logistics hub.',
  keywords: ['Dubai', 'UAE', 'United Arab Emirates', 'MSC', 'CIVMAR', '5th Fleet', 'Persian Gulf'],
  openGraph: { title: 'Dubai Port Guide | CIVSail', url: 'https://civsail.com/ports/middle-east/uae/dubai' },
  alternates: { canonical: 'https://civsail.com/ports/middle-east/uae/dubai' },
};

export default function DubaiPage() {
  return (
    <ComingSoonPortPage
      portName="Dubai"
      country="United Arab Emirates"
      countrySlug="uae"
      countryFlag="🇦🇪"
      region="Middle East"
      regionSlug="middle-east"
      fleet="5th Fleet AOR"
      coordinates={{ lat: 25.2048, lng: 55.2708 }}
      portType="Commercial Hub"
      breadcrumbs={[
        { label: 'Ports', href: '/ports' },
        { label: 'Middle East', href: '/ports/middle-east' },
        { label: 'UAE', href: '/ports/middle-east/uae' },
        { label: 'Dubai', href: '/ports/middle-east/uae/dubai' },
      ]}
      relatedPorts={[
        { name: 'Fujairah', href: '/ports/middle-east/uae/fujairah', status: 'coming-soon' },
        { name: 'Bahrain', href: '/ports/middle-east/bahrain/bahrain', status: 'coming-soon' },
        { name: 'Jeddah', href: '/ports/middle-east/saudi-arabia/jeddah', status: 'coming-soon' },
      ]}
    />
  );
}
