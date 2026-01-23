import { Metadata } from 'next';
import ComingSoonPortPage from '@/components/ports/ComingSoonPortPage';

export const metadata: Metadata = {
  title: 'Puerto Cortez, Honduras Port Guide | CIVSail',
  description: 'Community-built port guide for Puerto Cortez, Honduras. Local recommendations for MSC mariners at Central America\'s largest port.',
  keywords: ['Puerto Cortez', 'Honduras', 'MSC', 'CIVMAR', 'Central America', 'Caribbean', 'port guide'],
  openGraph: { title: 'Puerto Cortez Port Guide | CIVSail', url: 'https://civsail.com/ports/south-america/honduras/puerto-cortez' },
  alternates: { canonical: 'https://civsail.com/ports/south-america/honduras/puerto-cortez' },
};

export default function PuertoCortezPage() {
  return (
    <ComingSoonPortPage
      portName="Puerto Cortez"
      country="Honduras"
      countrySlug="honduras"
      countryFlag="🇭🇳"
      region="South America / Caribbean"
      regionSlug="south-america"
      fleet="Atlantic Operations"
      coordinates={{ lat: 15.8333, lng: -87.9500 }}
      portType="Commercial Port"
      breadcrumbs={[
        { label: 'Ports', href: '/ports' },
        { label: 'South America / Caribbean', href: '/ports/south-america' },
        { label: 'Honduras', href: '/ports/south-america/honduras' },
        { label: 'Puerto Cortez', href: '/ports/south-america/honduras/puerto-cortez' },
      ]}
      relatedPorts={[
        { name: 'Puerto Barrios', href: '/ports/south-america/guatemala/puerto-barrios', status: 'coming-soon' },
        { name: 'Cartagena', href: '/ports/south-america/colombia/cartagena', status: 'coming-soon' },
        { name: 'GITMO', href: '/ports/south-america/cuba/gitmo', status: 'coming-soon' },
      ]}
    />
  );
}
