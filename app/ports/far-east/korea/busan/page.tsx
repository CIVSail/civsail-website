import { Metadata } from 'next';
import ComingSoonPortPage from '@/components/ports/ComingSoonPortPage';

export const metadata: Metadata = {
  title: 'Busan, South Korea Port Guide | CIVSail',
  description: 'Community-built port guide for Busan, South Korea. Local recommendations, restaurants, nightlife, and tips for MSC mariners.',
  keywords: ['Busan', 'South Korea', 'MSC', 'CIVMAR', 'port guide', 'Far East'],
  openGraph: { title: 'Busan Port Guide | CIVSail', url: 'https://civsail.com/ports/far-east/korea/busan' },
  alternates: { canonical: 'https://civsail.com/ports/far-east/korea/busan' },
};

export default function BusanPage() {
  return (
    <ComingSoonPortPage
      portName="Busan"
      country="South Korea"
      countrySlug="south-korea"
      countryFlag="🇰🇷"
      region="Far East"
      regionSlug="far-east"
      fleet="7th Fleet AOR"
      coordinates={{ lat: 35.1796, lng: 129.0756 }}
      portType="Commercial Port"
      breadcrumbs={[
        { label: 'Ports', href: '/ports' },
        { label: 'Far East', href: '/ports/far-east' },
        { label: 'South Korea', href: '/ports/far-east/korea' },
        { label: 'Busan', href: '/ports/far-east/korea/busan' },
      ]}
      relatedPorts={[
        { name: 'Chinhae', href: '/ports/far-east/korea/chinhae', status: 'coming-soon' },
        { name: 'Sasebo', href: '/ports/far-east/japan/sasebo', status: 'complete' },
        { name: 'Guam', href: '/ports/far-east/guam', status: 'complete' },
      ]}
    />
  );
}
