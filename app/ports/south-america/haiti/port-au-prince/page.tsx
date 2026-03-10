import { Metadata } from 'next';
import ComingSoonPortPage from '@/components/ports/ComingSoonPortPage';

export const metadata: Metadata = {
  title: 'Port-au-Prince, Haiti Port Guide | CIVSail',
  description: 'Community-built port guide for Port-au-Prince, Haiti. Local recommendations for MSC mariners supporting Caribbean operations.',
  keywords: ['Port-au-Prince', 'Haiti', 'MSC', 'CIVMAR', 'Caribbean', 'Hispaniola', 'port guide'],
  openGraph: { title: 'Port-au-Prince Port Guide | CIVSail', url: 'https://civsail.com/ports/south-america/haiti/port-au-prince' },
  alternates: { canonical: 'https://civsail.com/ports/south-america/haiti/port-au-prince' },
};

export default function PortAuPrincePage() {
  return (
    <ComingSoonPortPage
      portName="Port-au-Prince"
      country="Haiti"
      countrySlug="haiti"
      countryFlag="🇭🇹"
      region="South America / Caribbean"
      regionSlug="south-america"
      fleet="Atlantic Operations"
      coordinates={{ lat: 18.5944, lng: -72.3074 }}
      portType="Commercial Port"
      breadcrumbs={[
        { label: 'Ports', href: '/ports' },
        { label: 'South America / Caribbean', href: '/ports/south-america' },
        { label: 'Haiti', href: '/ports/south-america/haiti' },
        { label: 'Port-au-Prince', href: '/ports/south-america/haiti/port-au-prince' },
      ]}
      relatedPorts={[
        { name: 'Santiago', href: '/ports/south-america/dominican-republic/santiago', status: 'coming-soon' },
        { name: 'GITMO', href: '/ports/south-america/cuba/gitmo', status: 'coming-soon' },
        { name: 'San Juan', href: '/ports/south-america/puerto-rico/san-juan', status: 'coming-soon' },
      ]}
    />
  );
}
