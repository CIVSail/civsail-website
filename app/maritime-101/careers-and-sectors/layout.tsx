import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Maritime Careers & Sectors | CIVSail',
  description:
    'Explore every sector of the maritime industry: deep sea shipping, MSC, tugboats, offshore, cruise ships, fishing, ferries, yachts, and more. Compare pay, lifestyle, and career paths.',
  openGraph: {
    title: 'Maritime Careers & Sectors | CIVSail',
    description:
      'Compare maritime career sectors side by side — pay, lifestyle, rotation, and advancement.',
    url: 'https://civsail.com/maritime-101/careers-and-sectors',
  },
  alternates: {
    canonical: 'https://civsail.com/maritime-101/careers-and-sectors',
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
