import { Metadata } from 'next';
import ComingSoonPortPage from '@/components/ports/ComingSoonPortPage';

export const metadata: Metadata = {
  title: 'Trieste, Italy Port Guide | CIVSail',
  description: 'Community-built port guide for Trieste, Italy. Local recommendations for MSC mariners visiting this Adriatic port.',
  keywords: ['Trieste', 'Italy', 'MSC', '6th Fleet', 'CIVMAR', 'Adriatic'],
  openGraph: { title: 'Trieste Port Guide | CIVSail', url: 'https://civsail.com/ports/europe/italy/trieste' },
  alternates: { canonical: 'https://civsail.com/ports/europe/italy/trieste' },
};

export default function TriestePage() {
  return (
    <ComingSoonPortPage
      portName="Trieste"
      country="Italy"
      countrySlug="italy"
      countryFlag="🇮🇹"
      region="Europe"
      regionSlug="europe"
      fleet="6th Fleet / NATO"
      coordinates={{ lat: 45.6495, lng: 13.7768 }}
      portType="Commercial Port"
      breadcrumbs={[
        { label: 'Ports', href: '/ports' },
        { label: 'Europe', href: '/ports/europe' },
        { label: 'Italy', href: '/ports/europe/italy' },
        { label: 'Trieste', href: '/ports/europe/italy/trieste' },
      ]}
      relatedPorts={[
        { name: 'Koper', href: '/ports/europe/slovenia/koper', status: 'coming-soon' },
        { name: 'Rijeka', href: '/ports/europe/croatia/rijeka', status: 'coming-soon' },
        { name: 'Venice', href: '/ports/europe/italy/genoa', status: 'coming-soon' },
      ]}
    />
  );
}
