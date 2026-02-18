import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Tugboat & Towing Careers | CIVSail',
  description:
    'Career guide to tugboats and towing: harbor tugs, ocean towing, and ship assist. Even-time rotation, pay, credentials, and how to get started.',
  openGraph: {
    title: 'Tugboat & Towing Careers | CIVSail',
    description: 'Explore tugboat careers — harbor work, ocean towing, pay, and entry paths.',
    url: 'https://civsail.com/maritime-101/sectors/tugboats',
  },
  alternates: { canonical: 'https://civsail.com/maritime-101/sectors/tugboats' },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
