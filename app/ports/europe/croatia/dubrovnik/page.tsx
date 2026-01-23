import { Metadata } from 'next';
import ComingSoonPortPage from '@/components/ports/ComingSoonPortPage';

export const metadata: Metadata = {
  title: 'Dubrovnik, Croatia Port Guide | CIVSail',
  description: 'Community-built port guide for Dubrovnik, Croatia. Local recommendations for MSC mariners visiting this historic Adriatic city.',
  keywords: ['Dubrovnik', 'Croatia', 'MSC', '6th Fleet', 'CIVMAR', 'Adriatic'],
  openGraph: { title: 'Dubrovnik Port Guide | CIVSail', url: 'https://civsail.com/ports/europe/croatia/dubrovnik' },
  alternates: { canonical: 'https://civsail.com/ports/europe/croatia/dubrovnik' },
};

export default function DubrovnikPage() {
  return (
    <ComingSoonPortPage
      portName="Dubrovnik"
      country="Croatia"
      countrySlug="croatia"
      countryFlag="🇭🇷"
      region="Europe"
      regionSlug="europe"
      fleet="6th Fleet / NATO"
      coordinates={{ lat: 42.6507, lng: 18.0944 }}
      portType="Commercial Port"
      breadcrumbs={[
        { label: 'Ports', href: '/ports' },
        { label: 'Europe', href: '/ports/europe' },
        { label: 'Croatia', href: '/ports/europe/croatia' },
        { label: 'Dubrovnik', href: '/ports/europe/croatia/dubrovnik' },
      ]}
      relatedPorts={[
        { name: 'Split', href: '/ports/europe/croatia/split', status: 'coming-soon' },
        { name: 'Zadar', href: '/ports/europe/croatia/zadar', status: 'coming-soon' },
        { name: 'Souda Bay', href: '/ports/europe/greece/souda-bay', status: 'coming-soon' },
      ]}
    />
  );
}
