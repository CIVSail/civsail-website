import { Metadata } from 'next';
import ComingSoonPortPage from '@/components/ports/ComingSoonPortPage';

export const metadata: Metadata = {
  title: 'Świnoujście, Poland Port Guide | CIVSail',
  description: 'Community-built port guide for Świnoujście, Poland. Local recommendations for MSC mariners visiting this Baltic gateway.',
  keywords: ['Świnoujście', 'Swinoujscie', 'Poland', 'MSC', 'CIVMAR', 'Baltic', 'NATO'],
  openGraph: { title: 'Świnoujście Port Guide | CIVSail', url: 'https://civsail.com/ports/europe/poland/swinoujscie' },
  alternates: { canonical: 'https://civsail.com/ports/europe/poland/swinoujscie' },
};

export default function SwinoujsciePage() {
  return (
    <ComingSoonPortPage
      portName="Świnoujście"
      country="Poland"
      countrySlug="poland"
      countryFlag="🇵🇱"
      region="Europe"
      regionSlug="europe"
      fleet="6th Fleet / NATO"
      coordinates={{ lat: 53.9106, lng: 14.2472 }}
      portType="Commercial Port"
      breadcrumbs={[
        { label: 'Ports', href: '/ports' },
        { label: 'Europe', href: '/ports/europe' },
        { label: 'Poland', href: '/ports/europe/poland' },
        { label: 'Świnoujście', href: '/ports/europe/poland/swinoujscie' },
      ]}
      relatedPorts={[
        { name: 'Kiel', href: '/ports/europe/germany/kiel', status: 'coming-soon' },
        { name: 'Gothenburg', href: '/ports/europe/sweden/gothenburg', status: 'coming-soon' },
        { name: 'Oslo', href: '/ports/europe/norway/oslo', status: 'coming-soon' },
      ]}
    />
  );
}
