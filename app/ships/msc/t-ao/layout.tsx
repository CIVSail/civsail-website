import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'T-AO Fleet Replenishment Oiler Guide | CIVSail',
  description:
    'Complete guide to MSC T-AO class fleet oilers: 15 vessels providing underway fuel replenishment. Crew life, pay, deployment patterns, and career tips.',
  openGraph: {
    title: 'T-AO Fleet Oiler Guide | CIVSail',
    description: 'Everything you need to know about sailing T-AO class oilers at MSC.',
    url: 'https://civsail.com/ships/msc/t-ao',
  },
  alternates: { canonical: 'https://civsail.com/ships/msc/t-ao' },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
