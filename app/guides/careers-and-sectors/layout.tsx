import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Maritime Careers & Sectors Guide — Compare Every Path',
  description:
    'Interactive guide to maritime career sectors: compare pay, lifestyle, time at home, rotation schedules, advancement speed, and entry requirements across MSC, commercial deep sea, tugboats, offshore, cruise, ferries, barges, yachts, pilots, and more. Find the right sector for your priorities and credentials.',
  openGraph: {
    title: 'Maritime Careers & Sectors Guide | CIVSail',
    description: 'Compare every maritime career sector — pay, rotation, lifestyle, and how to get started.',
    url: 'https://civsail.com/guides/careers-and-sectors',
  },
  alternates: { canonical: 'https://civsail.com/guides/careers-and-sectors' },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
