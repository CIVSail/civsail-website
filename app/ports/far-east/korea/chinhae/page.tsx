import { Metadata } from 'next';
import ComingSoonPortPage from '@/components/ports/ComingSoonPortPage';

export const metadata: Metadata = {
  title: 'Chinhae, South Korea Port Guide | CIVSail',
  description: 'Community-built port guide for Chinhae Naval Base, South Korea. Local recommendations and tips for MSC mariners.',
  keywords: ['Chinhae', 'South Korea', 'MSC', 'CIVMAR', 'naval base', 'Far East'],
  openGraph: { title: 'Chinhae Port Guide | CIVSail', url: 'https://civsail.com/ports/far-east/korea/chinhae' },
  alternates: { canonical: 'https://civsail.com/ports/far-east/korea/chinhae' },
};

export default function ChinhaePage() {
  return (
    <ComingSoonPortPage
      portName="Chinhae"
      country="South Korea"
      countrySlug="south-korea"
      countryFlag="🇰🇷"
      region="Far East"
      regionSlug="far-east"
      fleet="7th Fleet AOR"
      coordinates={{ lat: 35.1467, lng: 128.6536 }}
      portType="Naval Base"
      breadcrumbs={[
        { label: 'Ports', href: '/ports' },
        { label: 'Far East', href: '/ports/far-east' },
        { label: 'South Korea', href: '/ports/far-east/korea' },
        { label: 'Chinhae', href: '/ports/far-east/korea/chinhae' },
      ]}
      relatedPorts={[
        { name: 'Busan', href: '/ports/far-east/korea/busan', status: 'coming-soon' },
        { name: 'Sasebo', href: '/ports/far-east/japan/sasebo', status: 'complete' },
        { name: 'Guam', href: '/ports/far-east/guam', status: 'complete' },
      ]}
    />
  );
}
