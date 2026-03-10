import { Metadata } from 'next';
import ComingSoonPortPage from '@/components/ports/ComingSoonPortPage';

export const metadata: Metadata = {
  title: 'Puerto Barrios, Guatemala Port Guide | CIVSail',
  description: 'Community-built port guide for Puerto Barrios, Guatemala. Local recommendations for MSC mariners at this Central American Caribbean port.',
  keywords: ['Puerto Barrios', 'Guatemala', 'MSC', 'CIVMAR', 'Central America', 'Caribbean', 'port guide'],
  openGraph: { title: 'Puerto Barrios Port Guide | CIVSail', url: 'https://civsail.com/ports/south-america/guatemala/puerto-barrios' },
  alternates: { canonical: 'https://civsail.com/ports/south-america/guatemala/puerto-barrios' },
};

export default function PuertoBarriosPage() {
  return (
    <ComingSoonPortPage
      portName="Puerto Barrios"
      country="Guatemala"
      countrySlug="guatemala"
      countryFlag="🇬🇹"
      region="South America / Caribbean"
      regionSlug="south-america"
      fleet="Atlantic Operations"
      coordinates={{ lat: 15.7333, lng: -88.5833 }}
      portType="Commercial Port"
      breadcrumbs={[
        { label: 'Ports', href: '/ports' },
        { label: 'South America / Caribbean', href: '/ports/south-america' },
        { label: 'Guatemala', href: '/ports/south-america/guatemala' },
        { label: 'Puerto Barrios', href: '/ports/south-america/guatemala/puerto-barrios' },
      ]}
      relatedPorts={[
        { name: 'Puerto Cortez', href: '/ports/south-america/honduras/puerto-cortez', status: 'coming-soon' },
        { name: 'Cartagena', href: '/ports/south-america/colombia/cartagena', status: 'coming-soon' },
        { name: 'San Juan', href: '/ports/south-america/puerto-rico/san-juan', status: 'coming-soon' },
      ]}
    />
  );
}
