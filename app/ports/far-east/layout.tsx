import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Far East & Pacific Ports | CIVSail',
  description:
    'Port guides for the Far East and Pacific: Guam, Japan, and more. Local tips, maps, base info, and what to expect ashore for merchant mariners.',
  openGraph: {
    title: 'Far East & Pacific Ports | CIVSail',
    description: 'Mariner port guides for the Far East and Pacific region.',
    url: 'https://civsail.com/ports/far-east',
  },
  alternates: { canonical: 'https://civsail.com/ports/far-east' },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
