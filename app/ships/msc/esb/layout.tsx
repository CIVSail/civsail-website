import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'ESB Expeditionary Sea Base Guide | CIVSail',
  description:
    'Complete guide to MSC ESB class expeditionary sea bases: mobile staging platforms supporting special operations and aviation. Crew, pay, and deployment info.',
  openGraph: {
    title: 'ESB Expeditionary Sea Base Guide | CIVSail',
    description: 'Everything you need to know about sailing ESB class ships at MSC.',
    url: 'https://civsail.com/ships/msc/esb',
  },
  alternates: { canonical: 'https://civsail.com/ships/msc/esb' },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
