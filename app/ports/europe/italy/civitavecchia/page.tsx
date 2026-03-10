import { Metadata } from 'next';
import ComingSoonPortPage from '@/components/ports/ComingSoonPortPage';

export const metadata: Metadata = {
  title: 'Civitavecchia, Italy Port Guide | CIVSail',
  description: 'Community-built port guide for Civitavecchia, Italy. Local recommendations for MSC mariners visiting Rome\'s primary port.',
  keywords: ['Civitavecchia', 'Rome', 'Italy', 'MSC', '6th Fleet', 'CIVMAR'],
  openGraph: { title: 'Civitavecchia Port Guide | CIVSail', url: 'https://civsail.com/ports/europe/italy/civitavecchia' },
  alternates: { canonical: 'https://civsail.com/ports/europe/italy/civitavecchia' },
};

export default function CivitavecchiaPage() {
  return (
    <ComingSoonPortPage
      portName="Civitavecchia"
      country="Italy"
      countrySlug="italy"
      countryFlag="🇮🇹"
      region="Europe"
      regionSlug="europe"
      fleet="6th Fleet / NATO"
      coordinates={{ lat: 42.0930, lng: 11.7968 }}
      portType="Commercial Port"
      breadcrumbs={[
        { label: 'Ports', href: '/ports' },
        { label: 'Europe', href: '/ports/europe' },
        { label: 'Italy', href: '/ports/europe/italy' },
        { label: 'Civitavecchia', href: '/ports/europe/italy/civitavecchia' },
      ]}
      relatedPorts={[
        { name: 'Naples', href: '/ports/europe/italy/naples', status: 'coming-soon' },
        { name: 'Genoa', href: '/ports/europe/italy/genoa', status: 'coming-soon' },
        { name: 'Mallorca', href: '/ports/europe/spain/mallorca', status: 'coming-soon' },
      ]}
    />
  );
}
