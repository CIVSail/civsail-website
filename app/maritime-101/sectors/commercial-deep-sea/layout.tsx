import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Commercial Deep Sea Shipping Careers | CIVSail',
  description:
    'Career guide to commercial deep sea shipping: container ships, tankers, and bulk carriers. Union contracts, pay, rotation schedules, and how to get started.',
  openGraph: {
    title: 'Commercial Deep Sea Shipping Careers | CIVSail',
    description: 'Explore careers in commercial deep sea shipping — tankers, container ships, and bulk carriers.',
    url: 'https://civsail.com/maritime-101/sectors/commercial-deep-sea',
  },
  alternates: { canonical: 'https://civsail.com/maritime-101/sectors/commercial-deep-sea' },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
