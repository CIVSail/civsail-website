import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Marketplace | CIVSail',
  description:
    'CIVSail is building a marketplace to connect mariners with the people building gear, tools, books, and services for the maritime community.',
  openGraph: {
    title: 'Marketplace | CIVSail',
    description:
      'Connect mariners with the people building things for mariners. Gear, tools, books, services, and more.',
    url: 'https://civsail.com/marketplace',
  },
  alternates: {
    canonical: 'https://civsail.com/marketplace',
  },
};

export default function MarketplaceLayout({ children }: { children: React.ReactNode }) {
  return children;
}
