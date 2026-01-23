import { Metadata } from 'next';
import ComingSoonPortPage from '@/components/ports/ComingSoonPortPage';

export const metadata: Metadata = {
  title: 'Faslane (Lockstriven), Scotland Port Guide | CIVSail',
  description: 'Community-built port guide for HMNB Clyde/Faslane, Scotland. Local recommendations for MSC mariners.',
  keywords: ['Faslane', 'Lockstriven', 'Scotland', 'UK', 'MSC', 'CIVMAR', 'NATO', 'HMNB Clyde'],
  openGraph: { title: 'Faslane Port Guide | CIVSail', url: 'https://civsail.com/ports/europe/scotland/faslane' },
  alternates: { canonical: 'https://civsail.com/ports/europe/scotland/faslane' },
};

export default function FaslanePage() {
  return (
    <ComingSoonPortPage
      portName="Faslane (Lockstriven)"
      country="Scotland"
      countrySlug="scotland"
      countryFlag="🏴󠁧󠁢󠁳󠁣󠁴󠁿"
      region="Europe"
      regionSlug="europe"
      fleet="6th Fleet / NATO"
      coordinates={{ lat: 56.0614, lng: -4.8194 }}
      portType="Naval Base"
      breadcrumbs={[
        { label: 'Ports', href: '/ports' },
        { label: 'Europe', href: '/ports/europe' },
        { label: 'Scotland', href: '/ports/europe/scotland' },
        { label: 'Faslane', href: '/ports/europe/scotland/faslane' },
      ]}
      relatedPorts={[
        { name: 'Portsmouth', href: '/ports/europe/uk/portsmouth', status: 'coming-soon' },
        { name: 'Southampton', href: '/ports/europe/uk/southampton', status: 'coming-soon' },
        { name: 'Oslo', href: '/ports/europe/norway/oslo', status: 'coming-soon' },
      ]}
    />
  );
}
