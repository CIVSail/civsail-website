import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Australia & Oceania Ports | CIVSail',
  description:
    'Port guides for Australia and Oceania: Sydney, Port Townsend, and more. Local tips, maps, and what to expect ashore for merchant mariners.',
  openGraph: {
    title: 'Australia & Oceania Ports | CIVSail',
    description: 'Mariner port guides for Australia and the Pacific islands.',
    url: 'https://civsail.com/ports/australia',
  },
  alternates: { canonical: 'https://civsail.com/ports/australia' },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
