import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'European Ports | CIVSail',
  description:
    'Port guides for Europe: Italy, Spain, Croatia, Germany, UK, and more. Local tips, maps, and what to expect ashore for merchant mariners.',
  openGraph: {
    title: 'European Ports | CIVSail',
    description: 'Mariner port guides across Europe — Mediterranean, North Sea, and Baltic.',
    url: 'https://civsail.com/ports/europe',
  },
  alternates: { canonical: 'https://civsail.com/ports/europe' },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
