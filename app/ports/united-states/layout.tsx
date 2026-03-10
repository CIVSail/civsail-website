import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'U.S. Ports | CIVSail',
  description:
    'Port guides for the United States: Norfolk, San Diego, Charleston, Seattle, and more. Local tips, base access, maps, and info for merchant mariners.',
  openGraph: {
    title: 'U.S. Ports | CIVSail',
    description: 'Mariner port guides across the United States.',
    url: 'https://civsail.com/ports/united-states',
  },
  alternates: { canonical: 'https://civsail.com/ports/united-states' },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
