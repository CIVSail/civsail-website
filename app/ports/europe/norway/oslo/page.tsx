import { Metadata } from 'next';
import ComingSoonPortPage from '@/components/ports/ComingSoonPortPage';

export const metadata: Metadata = {
  title: 'Oslo, Norway Port Guide | CIVSail',
  description: 'Community-built port guide for Oslo, Norway. Local recommendations for MSC mariners visiting Norway\'s capital.',
  keywords: ['Oslo', 'Norway', 'MSC', 'CIVMAR', 'North Sea', 'Scandinavia', 'NATO'],
  openGraph: { title: 'Oslo Port Guide | CIVSail', url: 'https://civsail.com/ports/europe/norway/oslo' },
  alternates: { canonical: 'https://civsail.com/ports/europe/norway/oslo' },
};

export default function OsloPage() {
  return (
    <ComingSoonPortPage
      portName="Oslo"
      country="Norway"
      countrySlug="norway"
      countryFlag="🇳🇴"
      region="Europe"
      regionSlug="europe"
      fleet="6th Fleet / NATO"
      coordinates={{ lat: 59.9139, lng: 10.7522 }}
      portType="Commercial Port"
      breadcrumbs={[
        { label: 'Ports', href: '/ports' },
        { label: 'Europe', href: '/ports/europe' },
        { label: 'Norway', href: '/ports/europe/norway' },
        { label: 'Oslo', href: '/ports/europe/norway/oslo' },
      ]}
      relatedPorts={[
        { name: 'Gothenburg', href: '/ports/europe/sweden/gothenburg', status: 'coming-soon' },
        { name: 'Kiel', href: '/ports/europe/germany/kiel', status: 'coming-soon' },
        { name: 'Faslane', href: '/ports/europe/scotland/faslane', status: 'coming-soon' },
      ]}
    />
  );
}
