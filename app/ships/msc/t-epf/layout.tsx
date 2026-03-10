import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'T-EPF Expeditionary Fast Transport Guide | CIVSail',
  description:
    'Complete guide to MSC T-EPF class high-speed transports: 12 vessels, small crew operations, shallow-draft missions, pay, and career advice.',
  openGraph: {
    title: 'T-EPF Expeditionary Fast Transport Guide | CIVSail',
    description: 'Everything you need to know about sailing T-EPF class ships at MSC.',
    url: 'https://civsail.com/ships/msc/t-epf',
  },
  alternates: { canonical: 'https://civsail.com/ships/msc/t-epf' },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
