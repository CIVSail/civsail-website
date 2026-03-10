import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Commercial Fishing Careers | CIVSail',
  description:
    'Career guide to commercial fishing: Alaska, Gulf, and Atlantic fisheries. Share-based pay, seasonal patterns, physical demands, and path to vessel ownership.',
  openGraph: {
    title: 'Commercial Fishing Careers | CIVSail',
    description: 'What commercial fishing careers look like — pay, seasons, and how to get started.',
    url: 'https://civsail.com/maritime-101/sectors/fishing',
  },
  alternates: { canonical: 'https://civsail.com/maritime-101/sectors/fishing' },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
