import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'T-AOE Fast Combat Support Ship Guide | CIVSail',
  description:
    'Complete guide to MSC T-AOE class fast combat support ships: multi-product replenishment for carrier strike groups. Crew, pay, and deployment info.',
  openGraph: {
    title: 'T-AOE Fast Combat Support Ship Guide | CIVSail',
    description: 'Everything you need to know about sailing T-AOE class ships at MSC.',
    url: 'https://civsail.com/ships/msc/t-aoe',
  },
  alternates: { canonical: 'https://civsail.com/ships/msc/t-aoe' },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
