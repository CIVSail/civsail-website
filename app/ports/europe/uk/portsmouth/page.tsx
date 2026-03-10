import { Metadata } from 'next';
import ComingSoonPortPage from '@/components/ports/ComingSoonPortPage';

export const metadata: Metadata = {
  title: 'Portsmouth, UK Port Guide | CIVSail',
  description: 'Community-built port guide for Portsmouth, United Kingdom. Local recommendations for MSC mariners visiting this historic naval port.',
  keywords: ['Portsmouth', 'UK', 'United Kingdom', 'England', 'MSC', 'CIVMAR', 'Royal Navy'],
  openGraph: { title: 'Portsmouth Port Guide | CIVSail', url: 'https://civsail.com/ports/europe/uk/portsmouth' },
  alternates: { canonical: 'https://civsail.com/ports/europe/uk/portsmouth' },
};

export default function PortsmouthPage() {
  return (
    <ComingSoonPortPage
      portName="Portsmouth"
      country="United Kingdom"
      countrySlug="uk"
      countryFlag="🇬🇧"
      region="Europe"
      regionSlug="europe"
      fleet="6th Fleet / NATO"
      coordinates={{ lat: 50.8198, lng: -1.0880 }}
      portType="Naval Base"
      breadcrumbs={[
        { label: 'Ports', href: '/ports' },
        { label: 'Europe', href: '/ports/europe' },
        { label: 'United Kingdom', href: '/ports/europe/uk' },
        { label: 'Portsmouth', href: '/ports/europe/uk/portsmouth' },
      ]}
      relatedPorts={[
        { name: 'Southampton', href: '/ports/europe/uk/southampton', status: 'coming-soon' },
        { name: 'Faslane', href: '/ports/europe/scotland/faslane', status: 'coming-soon' },
        { name: 'Kiel', href: '/ports/europe/germany/kiel', status: 'coming-soon' },
      ]}
    />
  );
}
