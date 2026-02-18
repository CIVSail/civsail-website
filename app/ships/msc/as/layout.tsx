import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'AS Submarine Tender Guide | CIVSail',
  description:
    'Complete guide to MSC AS class submarine tenders: support vessels providing maintenance and supplies to submarine crews. Crew life, pay, and deployment info.',
  openGraph: {
    title: 'AS Submarine Tender Guide | CIVSail',
    description: 'Everything you need to know about sailing AS submarine tenders at MSC.',
    url: 'https://civsail.com/ships/msc/as',
  },
  alternates: { canonical: 'https://civsail.com/ships/msc/as' },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
