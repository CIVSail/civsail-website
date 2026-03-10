import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'MSC Ship Classes | Military Sealift Command Fleet | CIVSail',
  description:
    'Explore every MSC ship class: T-AKE, T-AO, T-AOE, T-AH, T-EPF, ESB, LCC, and more. Crew sizes, deployment patterns, pay, and life aboard each class.',
  openGraph: {
    title: 'MSC Ship Classes | CIVSail',
    description:
      'Complete guide to Military Sealift Command ship classes — specs, crew, pay, and life aboard.',
    url: 'https://civsail.com/ships/msc',
  },
  alternates: { canonical: 'https://civsail.com/ships/msc' },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
