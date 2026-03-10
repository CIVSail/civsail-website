import { Metadata } from 'next';
import ComingSoonPortPage from '@/components/ports/ComingSoonPortPage';

export const metadata: Metadata = {
  title: 'Southampton, UK Port Guide | CIVSail',
  description: 'Community-built port guide for Southampton, United Kingdom. Local recommendations for MSC mariners.',
  keywords: ['Southampton', 'UK', 'United Kingdom', 'England', 'MSC', 'CIVMAR'],
  openGraph: { title: 'Southampton Port Guide | CIVSail', url: 'https://civsail.com/ports/europe/uk/southampton' },
  alternates: { canonical: 'https://civsail.com/ports/europe/uk/southampton' },
};

export default function SouthamptonPage() {
  return (
    <ComingSoonPortPage
      portName="Southampton"
      country="United Kingdom"
      countrySlug="uk"
      countryFlag="🇬🇧"
      region="Europe"
      regionSlug="europe"
      fleet="6th Fleet / NATO"
      coordinates={{ lat: 50.8998, lng: -1.4044 }}
      portType="Commercial Port"
      breadcrumbs={[
        { label: 'Ports', href: '/ports' },
        { label: 'Europe', href: '/ports/europe' },
        { label: 'United Kingdom', href: '/ports/europe/uk' },
        { label: 'Southampton', href: '/ports/europe/uk/southampton' },
      ]}
      relatedPorts={[
        { name: 'Portsmouth', href: '/ports/europe/uk/portsmouth', status: 'coming-soon' },
        { name: 'Faslane', href: '/ports/europe/scotland/faslane', status: 'coming-soon' },
        { name: 'Rota', href: '/ports/europe/spain/rota', status: 'coming-soon' },
      ]}
    />
  );
}
