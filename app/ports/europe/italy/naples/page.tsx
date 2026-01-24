import { Metadata } from 'next';
import ComingSoonPortPage from '@/components/ports/ComingSoonPortPage';

export const metadata: Metadata = {
  title: 'Naples, Italy Port Guide | CIVSail',
  description: 'Community-built port guide for Naples, Italy. Local recommendations for MSC mariners visiting this major 6th Fleet hub.',
  keywords: ['Naples', 'Napoli', 'Italy', 'MSC', '6th Fleet', 'CIVMAR', 'Mediterranean'],
  openGraph: { title: 'Naples Port Guide | CIVSail', url: 'https://civsail.com/ports/europe/italy/naples' },
  alternates: { canonical: 'https://civsail.com/ports/europe/italy/naples' },
};

export default function NaplesPage() {
  return (
    <ComingSoonPortPage
      portName="Naples"
      country="Italy"
      countrySlug="italy"
      countryFlag="🇮🇹"
      region="Europe"
      regionSlug="europe"
      fleet="6th Fleet / NATO"
      coordinates={{ lat: 40.8359, lng: 14.2488 }}
      portType="Naval Support Activity"
      breadcrumbs={[
        { label: 'Ports', href: '/ports' },
        { label: 'Europe', href: '/ports/europe' },
        { label: 'Italy', href: '/ports/europe/italy' },
        { label: 'Naples', href: '/ports/europe/italy/naples' },
      ]}
      relatedPorts={[
        { name: 'Rota', href: '/ports/europe/spain/rota', status: 'coming-soon' },
        { name: 'Souda Bay', href: '/ports/europe/greece/souda-bay', status: 'coming-soon' },
        { name: 'Civitavecchia', href: '/ports/europe/italy/civitavecchia', status: 'coming-soon' },
      ]}
    />
  );
}
