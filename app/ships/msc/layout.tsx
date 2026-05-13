import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'MSC Ship Classes — Military Sealift Command Fleet Guide',
  description:
    'Complete guide to every Military Sealift Command (MSC) ship class. Compare T-AKE dry cargo ships, T-AO fleet oilers, T-AOE fast combat support ships, T-AH hospital ships, T-EPF expeditionary fast transports, ESB expeditionary sea bases, LCC command ships, and more. CIVMAR pay rates, crew sizes, berthing, deployment schedules, homeports, and real crew experiences.',
  openGraph: {
    title: 'MSC Ship Classes — Military Sealift Command Fleet Guide | CIVSail',
    description:
      'Every MSC ship class compared: T-AKE, T-AO, T-AOE, T-AH, T-EPF, ESB, LCC. Pay rates, crew sizes, deployment patterns, and life aboard.',
    url: 'https://civsail.com/ships/msc',
  },
  alternates: { canonical: 'https://civsail.com/ships/msc' },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
