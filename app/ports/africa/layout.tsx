import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'African Ports | CIVSail',
  description:
    'Port guides for Africa: Djibouti, South Africa, Nigeria, Ghana, and more. Local tips, maps, and what to expect ashore for merchant mariners.',
  openGraph: {
    title: 'African Ports | CIVSail',
    description: 'Mariner port guides across Africa — East, West, and Southern coasts.',
    url: 'https://civsail.com/ports/africa',
  },
  alternates: { canonical: 'https://civsail.com/ports/africa' },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
