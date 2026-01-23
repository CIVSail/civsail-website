import { Metadata } from 'next';
import ComingSoonPortPage from '@/components/ports/ComingSoonPortPage';

export const metadata: Metadata = {
  title: 'Genoa, Italy Port Guide | CIVSail',
  description: 'Community-built port guide for Genoa, Italy. Local recommendations for MSC mariners visiting this major Mediterranean port.',
  keywords: ['Genoa', 'Genova', 'Italy', 'MSC', '6th Fleet', 'CIVMAR', 'Mediterranean'],
  openGraph: { title: 'Genoa Port Guide | CIVSail', url: 'https://civsail.com/ports/europe/italy/genoa' },
  alternates: { canonical: 'https://civsail.com/ports/europe/italy/genoa' },
};

export default function GenoaPage() {
  return (
    <ComingSoonPortPage
      portName="Genoa"
      country="Italy"
      countrySlug="italy"
      countryFlag="🇮🇹"
      region="Europe"
      regionSlug="europe"
      fleet="6th Fleet / NATO"
      coordinates={{ lat: 44.4056, lng: 8.9463 }}
      portType="Commercial Port"
      breadcrumbs={[
        { label: 'Ports', href: '/ports' },
        { label: 'Europe', href: '/ports/europe' },
        { label: 'Italy', href: '/ports/europe/italy' },
        { label: 'Genoa', href: '/ports/europe/italy/genoa' },
      ]}
      relatedPorts={[
        { name: 'Civitavecchia', href: '/ports/europe/italy/civitavecchia', status: 'coming-soon' },
        { name: 'Barcelona', href: '/ports/europe/spain/barcelona', status: 'coming-soon' },
        { name: 'Naples', href: '/ports/europe/italy/naples', status: 'coming-soon' },
      ]}
    />
  );
}
