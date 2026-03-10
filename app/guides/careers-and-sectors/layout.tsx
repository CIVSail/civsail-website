import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Careers & Sectors Guide | CIVSail',
  description:
    'Comprehensive guide to maritime career sectors: compare pay, lifestyle, rotation, advancement, and entry requirements across the entire industry.',
  openGraph: {
    title: 'Careers & Sectors Guide | CIVSail',
    description: 'Compare maritime career sectors — pay, rotation, and how to get started.',
    url: 'https://civsail.com/guides/careers-and-sectors',
  },
  alternates: { canonical: 'https://civsail.com/guides/careers-and-sectors' },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
