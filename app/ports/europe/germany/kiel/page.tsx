import { Metadata } from 'next';
import ComingSoonPortPage from '@/components/ports/ComingSoonPortPage';

export const metadata: Metadata = {
  title: 'Kiel, Germany Port Guide | CIVSail',
  description: 'Community-built port guide for Kiel, Germany. Local recommendations for MSC mariners visiting this historic Baltic naval port.',
  keywords: ['Kiel', 'Germany', 'MSC', 'CIVMAR', 'Baltic', 'Kiel Canal', 'NATO'],
  openGraph: { title: 'Kiel Port Guide | CIVSail', url: 'https://civsail.com/ports/europe/germany/kiel' },
  alternates: { canonical: 'https://civsail.com/ports/europe/germany/kiel' },
};

export default function KielPage() {
  return (
    <ComingSoonPortPage
      portName="Kiel"
      country="Germany"
      countrySlug="germany"
      countryFlag="🇩🇪"
      region="Europe"
      regionSlug="europe"
      fleet="6th Fleet / NATO"
      coordinates={{ lat: 54.3233, lng: 10.1228 }}
      portType="Naval Port"
      breadcrumbs={[
        { label: 'Ports', href: '/ports' },
        { label: 'Europe', href: '/ports/europe' },
        { label: 'Germany', href: '/ports/europe/germany' },
        { label: 'Kiel', href: '/ports/europe/germany/kiel' },
      ]}
      relatedPorts={[
        { name: 'Gothenburg', href: '/ports/europe/sweden/gothenburg', status: 'coming-soon' },
        { name: 'Świnoujście', href: '/ports/europe/poland/swinoujscie', status: 'coming-soon' },
        { name: 'Oslo', href: '/ports/europe/norway/oslo', status: 'coming-soon' },
      ]}
    />
  );
}
