import { Metadata } from 'next';
import ComingSoonPortPage from '@/components/ports/ComingSoonPortPage';

export const metadata: Metadata = {
  title: 'Augusta Bay, Italy Port Guide | CIVSail',
  description: 'Community-built port guide for Augusta Bay, Sicily, Italy. Local recommendations for MSC mariners.',
  keywords: ['Augusta Bay', 'Sicily', 'Italy', 'MSC', '6th Fleet', 'NATO', 'CIVMAR'],
  openGraph: { title: 'Augusta Bay Port Guide | CIVSail', url: 'https://civsail.com/ports/europe/italy/augusta-bay' },
  alternates: { canonical: 'https://civsail.com/ports/europe/italy/augusta-bay' },
};

export default function AugustaBayPage() {
  return (
    <ComingSoonPortPage
      portName="Augusta Bay"
      country="Italy"
      countrySlug="italy"
      countryFlag="🇮🇹"
      region="Europe"
      regionSlug="europe"
      fleet="6th Fleet / NATO"
      coordinates={{ lat: 37.2268, lng: 15.2267 }}
      portType="Naval Facility"
      breadcrumbs={[
        { label: 'Ports', href: '/ports' },
        { label: 'Europe', href: '/ports/europe' },
        { label: 'Italy', href: '/ports/europe/italy' },
        { label: 'Augusta Bay', href: '/ports/europe/italy/augusta-bay' },
      ]}
      relatedPorts={[
        { name: 'Naples', href: '/ports/europe/italy/naples', status: 'coming-soon' },
        { name: 'Souda Bay', href: '/ports/europe/greece/souda-bay', status: 'coming-soon' },
        { name: 'Civitavecchia', href: '/ports/europe/italy/civitavecchia', status: 'coming-soon' },
      ]}
    />
  );
}
