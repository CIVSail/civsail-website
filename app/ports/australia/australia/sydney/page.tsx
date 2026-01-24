import { Metadata } from 'next';
import ComingSoonPortPage from '@/components/ports/ComingSoonPortPage';

export const metadata: Metadata = {
  title: 'Sydney, Australia Port Guide | CIVSail',
  description: 'Community-built port guide for Sydney, Australia. Local recommendations for MSC mariners visiting this major Pacific port city.',
  keywords: ['Sydney', 'Australia', 'MSC', 'CIVMAR', 'Pacific', 'port guide'],
  openGraph: { title: 'Sydney Port Guide | CIVSail', url: 'https://civsail.com/ports/australia/australia/sydney' },
  alternates: { canonical: 'https://civsail.com/ports/australia/australia/sydney' },
};

export default function SydneyPage() {
  return (
    <ComingSoonPortPage
      portName="Sydney"
      country="Australia"
      countrySlug="australia"
      countryFlag="🇦🇺"
      region="Australia"
      regionSlug="australia"
      fleet="Pacific Operations"
      coordinates={{ lat: -33.8688, lng: 151.2093 }}
      portType="Major Commercial Port"
      breadcrumbs={[
        { label: 'Ports', href: '/ports' },
        { label: 'Australia', href: '/ports/australia' },
        { label: 'Australia', href: '/ports/australia/australia' },
        { label: 'Sydney', href: '/ports/australia/australia/sydney' },
      ]}
      relatedPorts={[
        { name: 'Port Townsend', href: '/ports/australia/australia/port-townsend', status: 'coming-soon' },
        { name: 'Guam', href: '/ports/far-east/guam/apra-harbor', status: 'complete' },
        { name: 'Singapore', href: '/ports/far-east/singapore/changi', status: 'coming-soon' },
      ]}
    />
  );
}
