import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'T-AKE Dry Cargo Ship Guide | CIVSail',
  description:
    'Complete guide to MSC T-AKE class dry cargo/ammunition ships: 14 vessels, crew life, pay rates, deployment patterns, and career advice for mariners.',
  openGraph: {
    title: 'T-AKE Dry Cargo Ship Guide | CIVSail',
    description: 'Everything you need to know about sailing T-AKE class ships at MSC.',
    url: 'https://civsail.com/ships/msc/t-ake',
  },
  alternates: { canonical: 'https://civsail.com/ships/msc/t-ake' },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
