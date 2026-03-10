import { Metadata } from 'next';
import ComingSoonPortPage from '@/components/ports/ComingSoonPortPage';

export const metadata: Metadata = {
  title: 'Gothenburg, Sweden Port Guide | CIVSail',
  description: 'Community-built port guide for Gothenburg, Sweden. Local recommendations for MSC mariners visiting Scandinavia\'s largest port.',
  keywords: ['Gothenburg', 'Göteborg', 'Sweden', 'MSC', 'CIVMAR', 'Baltic', 'Scandinavia'],
  openGraph: { title: 'Gothenburg Port Guide | CIVSail', url: 'https://civsail.com/ports/europe/sweden/gothenburg' },
  alternates: { canonical: 'https://civsail.com/ports/europe/sweden/gothenburg' },
};

export default function GothenburgPage() {
  return (
    <ComingSoonPortPage
      portName="Gothenburg"
      country="Sweden"
      countrySlug="sweden"
      countryFlag="🇸🇪"
      region="Europe"
      regionSlug="europe"
      fleet="6th Fleet / NATO"
      coordinates={{ lat: 57.7089, lng: 11.9746 }}
      portType="Commercial Port"
      breadcrumbs={[
        { label: 'Ports', href: '/ports' },
        { label: 'Europe', href: '/ports/europe' },
        { label: 'Sweden', href: '/ports/europe/sweden' },
        { label: 'Gothenburg', href: '/ports/europe/sweden/gothenburg' },
      ]}
      relatedPorts={[
        { name: 'Oslo', href: '/ports/europe/norway/oslo', status: 'coming-soon' },
        { name: 'Kiel', href: '/ports/europe/germany/kiel', status: 'coming-soon' },
        { name: 'Świnoujście', href: '/ports/europe/poland/swinoujscie', status: 'coming-soon' },
      ]}
    />
  );
}
