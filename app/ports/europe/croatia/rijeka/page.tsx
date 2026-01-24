import { Metadata } from 'next';
import ComingSoonPortPage from '@/components/ports/ComingSoonPortPage';

export const metadata: Metadata = {
  title: 'Rijeka, Croatia Port Guide | CIVSail',
  description: 'Community-built port guide for Rijeka, Croatia. Local recommendations for MSC mariners visiting this Adriatic port.',
  keywords: ['Rijeka', 'Croatia', 'MSC', '6th Fleet', 'CIVMAR', 'Adriatic'],
  openGraph: { title: 'Rijeka Port Guide | CIVSail', url: 'https://civsail.com/ports/europe/croatia/rijeka' },
  alternates: { canonical: 'https://civsail.com/ports/europe/croatia/rijeka' },
};

export default function RijekaPage() {
  return (
    <ComingSoonPortPage
      portName="Rijeka"
      country="Croatia"
      countrySlug="croatia"
      countryFlag="🇭🇷"
      region="Europe"
      regionSlug="europe"
      fleet="6th Fleet / NATO"
      coordinates={{ lat: 45.3271, lng: 14.4422 }}
      portType="Commercial Port"
      breadcrumbs={[
        { label: 'Ports', href: '/ports' },
        { label: 'Europe', href: '/ports/europe' },
        { label: 'Croatia', href: '/ports/europe/croatia' },
        { label: 'Rijeka', href: '/ports/europe/croatia/rijeka' },
      ]}
      relatedPorts={[
        { name: 'Split', href: '/ports/europe/croatia/split', status: 'coming-soon' },
        { name: 'Trieste', href: '/ports/europe/italy/trieste', status: 'coming-soon' },
        { name: 'Koper', href: '/ports/europe/slovenia/koper', status: 'coming-soon' },
      ]}
    />
  );
}
