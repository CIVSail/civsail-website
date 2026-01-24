import { Metadata } from 'next';
import ComingSoonPortPage from '@/components/ports/ComingSoonPortPage';

export const metadata: Metadata = {
  title: 'Mallorca, Spain Port Guide | CIVSail',
  description: 'Community-built port guide for Mallorca (Palma), Spain. Local recommendations and insider knowledge for MSC mariners.',
  keywords: ['Mallorca', 'Palma', 'Spain', 'MSC', '6th Fleet', 'CIVMAR', 'Balearic Islands'],
  openGraph: { title: 'Mallorca Port Guide | CIVSail', url: 'https://civsail.com/ports/europe/spain/mallorca' },
  alternates: { canonical: 'https://civsail.com/ports/europe/spain/mallorca' },
};

export default function MallorcaPage() {
  return (
    <ComingSoonPortPage
      portName="Mallorca"
      country="Spain"
      countrySlug="spain"
      countryFlag="🇪🇸"
      region="Europe"
      regionSlug="europe"
      fleet="6th Fleet / NATO"
      coordinates={{ lat: 39.5596, lng: 2.6336 }}
      portType="Commercial Port"
      breadcrumbs={[
        { label: 'Ports', href: '/ports' },
        { label: 'Europe', href: '/ports/europe' },
        { label: 'Spain', href: '/ports/europe/spain' },
        { label: 'Mallorca', href: '/ports/europe/spain/mallorca' },
      ]}
      relatedPorts={[
        { name: 'Barcelona', href: '/ports/europe/spain/barcelona', status: 'coming-soon' },
        { name: 'Rota', href: '/ports/europe/spain/rota', status: 'coming-soon' },
        { name: 'Civitavecchia', href: '/ports/europe/italy/civitavecchia', status: 'coming-soon' },
      ]}
    />
  );
}
