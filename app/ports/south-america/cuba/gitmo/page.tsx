import { Metadata } from 'next';
import ComingSoonPortPage from '@/components/ports/ComingSoonPortPage';

export const metadata: Metadata = {
  title: 'GITMO (Guantanamo Bay), Cuba Port Guide | CIVSail',
  description: 'Community-built port guide for Naval Station Guantanamo Bay, Cuba. Local recommendations for MSC mariners at this strategic Caribbean naval installation.',
  keywords: ['GITMO', 'Guantanamo Bay', 'Cuba', 'MSC', 'CIVMAR', 'Naval Station', 'Caribbean', 'port guide'],
  openGraph: { title: 'GITMO Port Guide | CIVSail', url: 'https://civsail.com/ports/south-america/cuba/gitmo' },
  alternates: { canonical: 'https://civsail.com/ports/south-america/cuba/gitmo' },
};

export default function GitmoPage() {
  return (
    <ComingSoonPortPage
      portName="GITMO"
      country="Cuba"
      countrySlug="cuba"
      countryFlag="🇨🇺"
      region="South America / Caribbean"
      regionSlug="south-america"
      fleet="Atlantic Operations"
      coordinates={{ lat: 19.9023, lng: -75.0967 }}
      portType="Naval Station"
      breadcrumbs={[
        { label: 'Ports', href: '/ports' },
        { label: 'South America / Caribbean', href: '/ports/south-america' },
        { label: 'Cuba', href: '/ports/south-america/cuba' },
        { label: 'GITMO', href: '/ports/south-america/cuba/gitmo' },
      ]}
      relatedPorts={[
        { name: 'San Juan', href: '/ports/south-america/puerto-rico/san-juan', status: 'coming-soon' },
        { name: 'Santiago', href: '/ports/south-america/dominican-republic/santiago', status: 'coming-soon' },
        { name: 'Port-au-Prince', href: '/ports/south-america/haiti/port-au-prince', status: 'coming-soon' },
      ]}
    />
  );
}
