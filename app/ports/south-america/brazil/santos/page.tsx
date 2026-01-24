import { Metadata } from 'next';
import ComingSoonPortPage from '@/components/ports/ComingSoonPortPage';

export const metadata: Metadata = {
  title: 'Santos, Brazil Port Guide | CIVSail',
  description: 'Community-built port guide for Santos, Brazil. Local recommendations for MSC mariners at Latin America\'s largest commercial port.',
  keywords: ['Santos', 'Brazil', 'MSC', 'CIVMAR', 'South America', 'port guide'],
  openGraph: { title: 'Santos Port Guide | CIVSail', url: 'https://civsail.com/ports/south-america/brazil/santos' },
  alternates: { canonical: 'https://civsail.com/ports/south-america/brazil/santos' },
};

export default function SantosPage() {
  return (
    <ComingSoonPortPage
      portName="Santos"
      country="Brazil"
      countrySlug="brazil"
      countryFlag="🇧🇷"
      region="South America & Caribbean"
      regionSlug="south-america"
      fleet="Atlantic Operations"
      coordinates={{ lat: -23.9608, lng: -46.3336 }}
      portType="Commercial Port"
      breadcrumbs={[
        { label: 'Ports', href: '/ports' },
        { label: 'South America & Caribbean', href: '/ports/south-america' },
        { label: 'Brazil', href: '/ports/south-america/brazil' },
        { label: 'Santos', href: '/ports/south-america/brazil/santos' },
      ]}
      relatedPorts={[
        { name: 'Cartagena', href: '/ports/south-america/colombia/cartagena', status: 'coming-soon' },
        { name: 'San Juan', href: '/ports/south-america/puerto-rico/san-juan', status: 'coming-soon' },
        { name: 'Puerto Cortez', href: '/ports/south-america/honduras/puerto-cortez', status: 'coming-soon' },
      ]}
    />
  );
}
