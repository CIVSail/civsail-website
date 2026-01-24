import { Metadata } from 'next';
import ComingSoonPortPage from '@/components/ports/ComingSoonPortPage';

export const metadata: Metadata = {
  title: 'Jeddah, Saudi Arabia Port Guide | CIVSail',
  description: 'Community-built port guide for Jeddah, Saudi Arabia. Local recommendations for MSC mariners at this major Red Sea commercial port.',
  keywords: ['Jeddah', 'Saudi Arabia', 'MSC', 'CIVMAR', '5th Fleet', 'Red Sea'],
  openGraph: { title: 'Jeddah Port Guide | CIVSail', url: 'https://civsail.com/ports/middle-east/saudi-arabia/jeddah' },
  alternates: { canonical: 'https://civsail.com/ports/middle-east/saudi-arabia/jeddah' },
};

export default function JeddahPage() {
  return (
    <ComingSoonPortPage
      portName="Jeddah"
      country="Saudi Arabia"
      countrySlug="saudi-arabia"
      countryFlag="🇸🇦"
      region="Middle East"
      regionSlug="middle-east"
      fleet="5th Fleet AOR"
      coordinates={{ lat: 21.4858, lng: 39.1925 }}
      portType="Commercial Port"
      breadcrumbs={[
        { label: 'Ports', href: '/ports' },
        { label: 'Middle East', href: '/ports/middle-east' },
        { label: 'Saudi Arabia', href: '/ports/middle-east/saudi-arabia' },
        { label: 'Jeddah', href: '/ports/middle-east/saudi-arabia/jeddah' },
      ]}
      relatedPorts={[
        { name: 'Dubai', href: '/ports/middle-east/uae/dubai', status: 'coming-soon' },
        { name: 'Port Sudan', href: '/ports/africa/sudan/port-sudan', status: 'coming-soon' },
        { name: 'Camp Lemonnier', href: '/ports/africa/djibouti/camp-lemonnier', status: 'coming-soon' },
      ]}
    />
  );
}
