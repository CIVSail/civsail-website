import { Metadata } from 'next';
import ComingSoonPortPage from '@/components/ports/ComingSoonPortPage';

export const metadata: Metadata = {
  title: 'Koper, Slovenia Port Guide | CIVSail',
  description: 'Community-built port guide for Koper, Slovenia. Local recommendations for MSC mariners visiting Slovenia\'s primary port.',
  keywords: ['Koper', 'Slovenia', 'MSC', '6th Fleet', 'CIVMAR', 'Adriatic'],
  openGraph: { title: 'Koper Port Guide | CIVSail', url: 'https://civsail.com/ports/europe/slovenia/koper' },
  alternates: { canonical: 'https://civsail.com/ports/europe/slovenia/koper' },
};

export default function KoperPage() {
  return (
    <ComingSoonPortPage
      portName="Koper"
      country="Slovenia"
      countrySlug="slovenia"
      countryFlag="🇸🇮"
      region="Europe"
      regionSlug="europe"
      fleet="6th Fleet / NATO"
      coordinates={{ lat: 45.5469, lng: 13.7294 }}
      portType="Commercial Port"
      breadcrumbs={[
        { label: 'Ports', href: '/ports' },
        { label: 'Europe', href: '/ports/europe' },
        { label: 'Slovenia', href: '/ports/europe/slovenia' },
        { label: 'Koper', href: '/ports/europe/slovenia/koper' },
      ]}
      relatedPorts={[
        { name: 'Trieste', href: '/ports/europe/italy/trieste', status: 'coming-soon' },
        { name: 'Rijeka', href: '/ports/europe/croatia/rijeka', status: 'coming-soon' },
        { name: 'Split', href: '/ports/europe/croatia/split', status: 'coming-soon' },
      ]}
    />
  );
}
