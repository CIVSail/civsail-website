import { Metadata } from 'next';
import ComingSoonPortPage from '@/components/ports/ComingSoonPortPage';

export const metadata: Metadata = {
  title: 'Port Townsend, Australia Port Guide | CIVSail',
  description: 'Community-built port guide for Port Townsend, Australia. Local recommendations for MSC mariners visiting this Australian port.',
  keywords: ['Port Townsend', 'Australia', 'MSC', 'CIVMAR', 'Pacific', 'port guide'],
  openGraph: { title: 'Port Townsend Port Guide | CIVSail', url: 'https://civsail.com/ports/australia/australia/port-townsend' },
  alternates: { canonical: 'https://civsail.com/ports/australia/australia/port-townsend' },
};

export default function PortTownsendPage() {
  return (
    <ComingSoonPortPage
      portName="Port Townsend"
      country="Australia"
      countrySlug="australia"
      countryFlag="🇦🇺"
      region="Australia"
      regionSlug="australia"
      fleet="Pacific Operations"
      coordinates={{ lat: -34.4818, lng: 150.9022 }}
      portType="Commercial Port"
      breadcrumbs={[
        { label: 'Ports', href: '/ports' },
        { label: 'Australia', href: '/ports/australia' },
        { label: 'Australia', href: '/ports/australia/australia' },
        { label: 'Port Townsend', href: '/ports/australia/australia/port-townsend' },
      ]}
      relatedPorts={[
        { name: 'Sydney', href: '/ports/australia/australia/sydney', status: 'coming-soon' },
        { name: 'Guam', href: '/ports/far-east/guam/apra-harbor', status: 'complete' },
        { name: 'Singapore', href: '/ports/far-east/singapore/changi', status: 'coming-soon' },
      ]}
    />
  );
}
