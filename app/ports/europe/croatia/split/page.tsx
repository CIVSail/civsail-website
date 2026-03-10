import { Metadata } from 'next';
import ComingSoonPortPage from '@/components/ports/ComingSoonPortPage';

export const metadata: Metadata = {
  title: 'Split, Croatia Port Guide | CIVSail',
  description: 'Community-built port guide for Split, Croatia. Local recommendations for MSC mariners visiting this Adriatic hub.',
  keywords: ['Split', 'Croatia', 'MSC', '6th Fleet', 'CIVMAR', 'Adriatic'],
  openGraph: { title: 'Split Port Guide | CIVSail', url: 'https://civsail.com/ports/europe/croatia/split' },
  alternates: { canonical: 'https://civsail.com/ports/europe/croatia/split' },
};

export default function SplitPage() {
  return (
    <ComingSoonPortPage
      portName="Split"
      country="Croatia"
      countrySlug="croatia"
      countryFlag="🇭🇷"
      region="Europe"
      regionSlug="europe"
      fleet="6th Fleet / NATO"
      coordinates={{ lat: 43.5081, lng: 16.4402 }}
      portType="Commercial Port"
      breadcrumbs={[
        { label: 'Ports', href: '/ports' },
        { label: 'Europe', href: '/ports/europe' },
        { label: 'Croatia', href: '/ports/europe/croatia' },
        { label: 'Split', href: '/ports/europe/croatia/split' },
      ]}
      relatedPorts={[
        { name: 'Dubrovnik', href: '/ports/europe/croatia/dubrovnik', status: 'coming-soon' },
        { name: 'Zadar', href: '/ports/europe/croatia/zadar', status: 'coming-soon' },
        { name: 'Rijeka', href: '/ports/europe/croatia/rijeka', status: 'coming-soon' },
      ]}
    />
  );
}
