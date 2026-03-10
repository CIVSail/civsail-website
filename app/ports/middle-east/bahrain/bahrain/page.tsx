import { Metadata } from 'next';
import ComingSoonPortPage from '@/components/ports/ComingSoonPortPage';

export const metadata: Metadata = {
  title: 'Bahrain Port Guide | CIVSail',
  description: 'Community-built port guide for Bahrain. Local recommendations for MSC mariners at the home of U.S. Naval Support Activity and 5th Fleet headquarters.',
  keywords: ['Bahrain', 'MSC', 'CIVMAR', '5th Fleet', 'NSA Bahrain', 'Persian Gulf'],
  openGraph: { title: 'Bahrain Port Guide | CIVSail', url: 'https://civsail.com/ports/middle-east/bahrain/bahrain' },
  alternates: { canonical: 'https://civsail.com/ports/middle-east/bahrain/bahrain' },
};

export default function BahrainPortPage() {
  return (
    <ComingSoonPortPage
      portName="Bahrain"
      country="Kingdom of Bahrain"
      countrySlug="bahrain"
      countryFlag="🇧🇭"
      region="Middle East"
      regionSlug="middle-east"
      fleet="5th Fleet HQ"
      coordinates={{ lat: 26.2285, lng: 50.5860 }}
      portType="Naval Support Activity"
      breadcrumbs={[
        { label: 'Ports', href: '/ports' },
        { label: 'Middle East', href: '/ports/middle-east' },
        { label: 'Bahrain', href: '/ports/middle-east/bahrain' },
        { label: 'Bahrain', href: '/ports/middle-east/bahrain/bahrain' },
      ]}
      relatedPorts={[
        { name: 'Dubai', href: '/ports/middle-east/uae/dubai', status: 'coming-soon' },
        { name: 'Fujairah', href: '/ports/middle-east/uae/fujairah', status: 'coming-soon' },
        { name: 'Jeddah', href: '/ports/middle-east/saudi-arabia/jeddah', status: 'coming-soon' },
      ]}
    />
  );
}
