import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'South America & Caribbean Ports | CIVSail',
  description:
    'Port guides for South America and the Caribbean: Puerto Rico, Cuba, Colombia, Brazil, and more. Local tips, maps, and info for merchant mariners.',
  openGraph: {
    title: 'South America & Caribbean Ports | CIVSail',
    description: 'Mariner port guides for South America and the Caribbean.',
    url: 'https://civsail.com/ports/south-america',
  },
  alternates: { canonical: 'https://civsail.com/ports/south-america' },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
