import { Metadata } from 'next';
import ComingSoonPortPage from '@/components/ports/ComingSoonPortPage';

export const metadata: Metadata = {
  title: 'Zadar, Croatia Port Guide | CIVSail',
  description: 'Community-built port guide for Zadar, Croatia. Local recommendations for MSC mariners.',
  keywords: ['Zadar', 'Croatia', 'MSC', '6th Fleet', 'CIVMAR', 'Adriatic'],
  openGraph: { title: 'Zadar Port Guide | CIVSail', url: 'https://civsail.com/ports/europe/croatia/zadar' },
  alternates: { canonical: 'https://civsail.com/ports/europe/croatia/zadar' },
};

export default function ZadarPage() {
  return (
    <ComingSoonPortPage
      portName="Zadar"
      country="Croatia"
      countrySlug="croatia"
      countryFlag="🇭🇷"
      region="Europe"
      regionSlug="europe"
      fleet="6th Fleet / NATO"
      coordinates={{ lat: 44.1194, lng: 15.2314 }}
      portType="Commercial Port"
      breadcrumbs={[
        { label: 'Ports', href: '/ports' },
        { label: 'Europe', href: '/ports/europe' },
        { label: 'Croatia', href: '/ports/europe/croatia' },
        { label: 'Zadar', href: '/ports/europe/croatia/zadar' },
      ]}
      relatedPorts={[
        { name: 'Split', href: '/ports/europe/croatia/split', status: 'coming-soon' },
        { name: 'Dubrovnik', href: '/ports/europe/croatia/dubrovnik', status: 'coming-soon' },
        { name: 'Rijeka', href: '/ports/europe/croatia/rijeka', status: 'coming-soon' },
      ]}
    />
  );
}
