import { Metadata } from 'next';
import ComingSoonPortPage from '@/components/ports/ComingSoonPortPage';

export const metadata: Metadata = {
  title: 'Barcelona, Spain Port Guide | CIVSail',
  description: 'Community-built port guide for Barcelona, Spain. Local recommendations and insider knowledge for MSC mariners.',
  keywords: ['Barcelona', 'Spain', 'MSC', '6th Fleet', 'CIVMAR', 'Mediterranean'],
  openGraph: { title: 'Barcelona Port Guide | CIVSail', url: 'https://civsail.com/ports/europe/spain/barcelona' },
  alternates: { canonical: 'https://civsail.com/ports/europe/spain/barcelona' },
};

export default function BarcelonaPage() {
  return (
    <ComingSoonPortPage
      portName="Barcelona"
      country="Spain"
      countrySlug="spain"
      countryFlag="🇪🇸"
      region="Europe"
      regionSlug="europe"
      fleet="6th Fleet / NATO"
      coordinates={{ lat: 41.3545, lng: 2.1685 }}
      portType="Commercial Port"
      breadcrumbs={[
        { label: 'Ports', href: '/ports' },
        { label: 'Europe', href: '/ports/europe' },
        { label: 'Spain', href: '/ports/europe/spain' },
        { label: 'Barcelona', href: '/ports/europe/spain/barcelona' },
      ]}
      relatedPorts={[
        { name: 'Rota', href: '/ports/europe/spain/rota', status: 'coming-soon' },
        { name: 'Mallorca', href: '/ports/europe/spain/mallorca', status: 'coming-soon' },
        { name: 'Genoa', href: '/ports/europe/italy/genoa', status: 'coming-soon' },
      ]}
    />
  );
}
