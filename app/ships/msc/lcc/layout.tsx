import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'LCC Command Ship Guide | CIVSail',
  description:
    'Complete guide to MSC LCC class command ships: fleet headquarters vessels with large Navy detachments. Crew life, forward-deployed operations, and pay info.',
  openGraph: {
    title: 'LCC Command Ship Guide | CIVSail',
    description: 'Everything you need to know about sailing LCC command ships at MSC.',
    url: 'https://civsail.com/ships/msc/lcc',
  },
  alternates: { canonical: 'https://civsail.com/ships/msc/lcc' },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
