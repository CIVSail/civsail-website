import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Ship Class Guides — MSC & Merchant Marine Vessels',
  description:
    'Detailed guides to MSC and merchant marine ship classes: T-AKE, T-AO, T-AOE, T-AH, T-EPF, ESB, LCC, and more. Pay rates by position, crew sizes, berthing, deployment patterns, and honest crew-sourced details on what life is actually like aboard each class. Built for CIVMARs and U.S. merchant mariners.',
  openGraph: {
    title: 'Ship Class Guides — MSC & Merchant Marine Vessels | CIVSail',
    description:
      'Crew-sourced guides to MSC ship classes: pay rates, life aboard, deployment patterns, and what to expect on T-AKE, T-AO, T-AOE, and more.',
    url: 'https://civsail.com/ships',
  },
  alternates: {
    canonical: 'https://civsail.com/ships',
  },
};

export default function ShipsLayout({ children }: { children: React.ReactNode }) {
  return children;
}
