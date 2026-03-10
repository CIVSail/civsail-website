import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Middle East Ports | CIVSail',
  description:
    'Port guides for the Middle East: Bahrain, UAE, Oman, Saudi Arabia, and more. Local tips, maps, and what to expect ashore for merchant mariners.',
  openGraph: {
    title: 'Middle East Ports | CIVSail',
    description: 'Mariner port guides for the Middle East and Arabian Gulf.',
    url: 'https://civsail.com/ports/middle-east',
  },
  alternates: { canonical: 'https://civsail.com/ports/middle-east' },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
