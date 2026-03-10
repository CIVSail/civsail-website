import { Metadata } from 'next';
import ComingSoonPortPage from '@/components/ports/ComingSoonPortPage';

export const metadata: Metadata = {
  title: 'San Juan, Puerto Rico Port Guide | CIVSail',
  description: 'Community-built port guide for San Juan, Puerto Rico. Local recommendations for MSC mariners at this strategic Caribbean hub.',
  keywords: ['San Juan', 'Puerto Rico', 'MSC', 'CIVMAR', 'Caribbean', 'port guide'],
  openGraph: { title: 'San Juan Port Guide | CIVSail', url: 'https://civsail.com/ports/south-america/puerto-rico/san-juan' },
  alternates: { canonical: 'https://civsail.com/ports/south-america/puerto-rico/san-juan' },
};

export default function SanJuanPage() {
  return (
    <ComingSoonPortPage
      portName="San Juan"
      country="Puerto Rico"
      countrySlug="puerto-rico"
      countryFlag="🇵🇷"
      region="South America & Caribbean"
      regionSlug="south-america"
      fleet="Atlantic Operations"
      coordinates={{ lat: 18.4655, lng: -66.1057 }}
      portType="Commercial Port"
      breadcrumbs={[
        { label: 'Ports', href: '/ports' },
        { label: 'South America & Caribbean', href: '/ports/south-america' },
        { label: 'Puerto Rico', href: '/ports/south-america/puerto-rico' },
        { label: 'San Juan', href: '/ports/south-america/puerto-rico/san-juan' },
      ]}
      relatedPorts={[
        { name: 'GITMO', href: '/ports/south-america/cuba/gitmo', status: 'coming-soon' },
        { name: 'Santiago', href: '/ports/south-america/dominican-republic/santiago', status: 'coming-soon' },
        { name: 'Cartagena', href: '/ports/south-america/colombia/cartagena', status: 'coming-soon' },
      ]}
    />
  );
}
