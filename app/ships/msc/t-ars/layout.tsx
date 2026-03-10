import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'T-ARS Rescue & Salvage Ship Guide | CIVSail',
  description:
    'Complete guide to MSC T-ARS class rescue and salvage ships: towing, diving, and salvage operations. Crew life, pay, and deployment info.',
  openGraph: {
    title: 'T-ARS Rescue & Salvage Ship Guide | CIVSail',
    description: 'Everything you need to know about sailing T-ARS class ships at MSC.',
    url: 'https://civsail.com/ships/msc/t-ars',
  },
  alternates: { canonical: 'https://civsail.com/ships/msc/t-ars' },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
