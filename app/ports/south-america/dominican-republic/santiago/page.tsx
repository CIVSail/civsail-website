import { Metadata } from 'next';
import ComingSoonPortPage from '@/components/ports/ComingSoonPortPage';

export const metadata: Metadata = {
  title: 'Santiago, Dominican Republic Port Guide | CIVSail',
  description: 'Community-built port guide for Santiago, Dominican Republic. Local recommendations for MSC mariners visiting this Caribbean island nation.',
  keywords: ['Santiago', 'Dominican Republic', 'MSC', 'CIVMAR', 'Caribbean', 'Hispaniola', 'port guide'],
  openGraph: { title: 'Santiago Port Guide | CIVSail', url: 'https://civsail.com/ports/south-america/dominican-republic/santiago' },
  alternates: { canonical: 'https://civsail.com/ports/south-america/dominican-republic/santiago' },
};

export default function SantiagoPage() {
  return (
    <ComingSoonPortPage
      portName="Santiago"
      country="Dominican Republic"
      countrySlug="dominican-republic"
      countryFlag="🇩🇴"
      region="South America / Caribbean"
      regionSlug="south-america"
      fleet="Atlantic Operations"
      coordinates={{ lat: 19.4500, lng: -70.7000 }}
      portType="Commercial Port"
      breadcrumbs={[
        { label: 'Ports', href: '/ports' },
        { label: 'South America / Caribbean', href: '/ports/south-america' },
        { label: 'Dominican Republic', href: '/ports/south-america/dominican-republic' },
        { label: 'Santiago', href: '/ports/south-america/dominican-republic/santiago' },
      ]}
      relatedPorts={[
        { name: 'Port-au-Prince', href: '/ports/south-america/haiti/port-au-prince', status: 'coming-soon' },
        { name: 'San Juan', href: '/ports/south-america/puerto-rico/san-juan', status: 'coming-soon' },
        { name: 'GITMO', href: '/ports/south-america/cuba/gitmo', status: 'coming-soon' },
      ]}
    />
  );
}
