import { Metadata } from 'next';
import ComingSoonPortPage from '@/components/ports/ComingSoonPortPage';

export const metadata: Metadata = {
  title: 'Cartagena, Colombia Port Guide | CIVSail',
  description: 'Community-built port guide for Cartagena, Colombia. Local recommendations for MSC mariners at this historic Caribbean port city.',
  keywords: ['Cartagena', 'Colombia', 'MSC', 'CIVMAR', 'Caribbean', 'port guide'],
  openGraph: { title: 'Cartagena Port Guide | CIVSail', url: 'https://civsail.com/ports/south-america/colombia/cartagena' },
  alternates: { canonical: 'https://civsail.com/ports/south-america/colombia/cartagena' },
};

export default function CartagenaPage() {
  return (
    <ComingSoonPortPage
      portName="Cartagena"
      country="Colombia"
      countrySlug="colombia"
      countryFlag="🇨🇴"
      region="South America / Caribbean"
      regionSlug="south-america"
      fleet="Atlantic Operations"
      coordinates={{ lat: 10.3910, lng: -75.4794 }}
      portType="Commercial Port"
      breadcrumbs={[
        { label: 'Ports', href: '/ports' },
        { label: 'South America / Caribbean', href: '/ports/south-america' },
        { label: 'Colombia', href: '/ports/south-america/colombia' },
        { label: 'Cartagena', href: '/ports/south-america/colombia/cartagena' },
      ]}
      relatedPorts={[
        { name: 'San Juan', href: '/ports/south-america/puerto-rico/san-juan', status: 'coming-soon' },
        { name: 'GITMO', href: '/ports/south-america/cuba/gitmo', status: 'coming-soon' },
        { name: 'Puerto Barrios', href: '/ports/south-america/guatemala/puerto-barrios', status: 'coming-soon' },
      ]}
    />
  );
}
