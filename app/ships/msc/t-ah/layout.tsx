import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'T-AH Hospital Ship Guide | CIVSail',
  description:
    'Complete guide to MSC T-AH class hospital ships (USNS Mercy & Comfort): humanitarian missions, crew life, deployment patterns, and mariner career info.',
  openGraph: {
    title: 'T-AH Hospital Ship Guide | CIVSail',
    description: 'Everything you need to know about sailing T-AH hospital ships at MSC.',
    url: 'https://civsail.com/ships/msc/t-ah',
  },
  alternates: { canonical: 'https://civsail.com/ships/msc/t-ah' },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
