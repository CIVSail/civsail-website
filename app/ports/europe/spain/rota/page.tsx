import { Metadata } from 'next';
import ComingSoonPortPage from '@/components/ports/ComingSoonPortPage';

export const metadata: Metadata = {
  title: 'Rota, Spain Port Guide | CIVSail',
  description: 'Community-built port guide for Naval Station Rota, Spain. Local recommendations and insider knowledge for MSC mariners.',
  keywords: ['Rota', 'Spain', 'MSC', '6th Fleet', 'CIVMAR', 'Naval Station Rota', 'NATO'],
  openGraph: {
    title: 'Rota Port Guide | CIVSail',
    url: 'https://civsail.com/ports/europe/spain/rota',
  },
  alternates: { canonical: 'https://civsail.com/ports/europe/spain/rota' },
};

export default function RotaPage() {
  return (
    <ComingSoonPortPage
      portName="Rota"
      country="Spain"
      countrySlug="spain"
      countryFlag="🇪🇸"
      region="Europe"
      regionSlug="europe"
      fleet="6th Fleet / NATO"
      coordinates={{ lat: 36.6231, lng: -6.3499 }}
      portType="Naval Station"
      breadcrumbs={[
        { label: 'Ports', href: '/ports' },
        { label: 'Europe', href: '/ports/europe' },
        { label: 'Spain', href: '/ports/europe/spain' },
        { label: 'Rota', href: '/ports/europe/spain/rota' },
      ]}
      relatedPorts={[
        { name: 'Cadiz', href: '/ports/europe/spain/cadiz', status: 'coming-soon' },
        { name: 'Barcelona', href: '/ports/europe/spain/barcelona', status: 'coming-soon' },
        { name: 'Naples', href: '/ports/europe/italy/naples', status: 'coming-soon' },
      ]}
    />
  );
}
