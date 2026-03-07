import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Ships | CIVSail',
  description:
    'Explore ship class guides with pay rates, life aboard, deployment patterns, and crew-sourced details across MSC, commercial, and government fleets.',
  openGraph: {
    title: 'Ships | CIVSail',
    description:
      'Ship class guides with pay, life aboard, and crew-sourced details for U.S. merchant mariners.',
    url: 'https://civsail.com/ships',
  },
  alternates: {
    canonical: 'https://civsail.com/ships',
  },
};

export default function ShipsLayout({ children }: { children: React.ReactNode }) {
  return children;
}
