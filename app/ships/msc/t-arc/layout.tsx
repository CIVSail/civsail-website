import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'T-ARC Cable Repair Ship Guide | CIVSail',
  description:
    'Complete guide to MSC T-ARC class cable repair ships: specialized vessels maintaining undersea communication cables. Crew, pay, and deployment patterns.',
  openGraph: {
    title: 'T-ARC Cable Repair Ship Guide | CIVSail',
    description: 'Everything you need to know about sailing T-ARC cable ships at MSC.',
    url: 'https://civsail.com/ships/msc/t-arc',
  },
  alternates: { canonical: 'https://civsail.com/ships/msc/t-arc' },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
