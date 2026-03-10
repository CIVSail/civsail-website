import { Metadata } from 'next';
import ComingSoonPortPage from '@/components/ports/ComingSoonPortPage';

export const metadata: Metadata = {
  title: 'Cadiz, Spain Port Guide | CIVSail',
  description: 'Community-built port guide for Cadiz, Spain. Local recommendations and insider knowledge for MSC mariners.',
  keywords: ['Cadiz', 'Spain', 'MSC', '6th Fleet', 'CIVMAR'],
  openGraph: { title: 'Cadiz Port Guide | CIVSail', url: 'https://civsail.com/ports/europe/spain/cadiz' },
  alternates: { canonical: 'https://civsail.com/ports/europe/spain/cadiz' },
};

export default function CadizPage() {
  return (
    <ComingSoonPortPage
      portName="Cadiz"
      country="Spain"
      countrySlug="spain"
      countryFlag="🇪🇸"
      region="Europe"
      regionSlug="europe"
      fleet="6th Fleet / NATO"
      coordinates={{ lat: 36.5271, lng: -6.2886 }}
      portType="Commercial Port"
      breadcrumbs={[
        { label: 'Ports', href: '/ports' },
        { label: 'Europe', href: '/ports/europe' },
        { label: 'Spain', href: '/ports/europe/spain' },
        { label: 'Cadiz', href: '/ports/europe/spain/cadiz' },
      ]}
      relatedPorts={[
        { name: 'Rota', href: '/ports/europe/spain/rota', status: 'coming-soon' },
        { name: 'Barcelona', href: '/ports/europe/spain/barcelona', status: 'coming-soon' },
        { name: 'Mallorca', href: '/ports/europe/spain/mallorca', status: 'coming-soon' },
      ]}
    />
  );
}
