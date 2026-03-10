import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Offshore Supply Vessel (OSV) Careers | CIVSail',
  description:
    'Career guide to offshore supply vessels: PSVs, AHTS, and crew boats. Gulf of Mexico operations, even-time rotation, pay, and how to break in.',
  openGraph: {
    title: 'Offshore Supply Vessel Careers | CIVSail',
    description: 'Explore OSV careers — supply boats, crew boats, and Gulf of Mexico operations.',
    url: 'https://civsail.com/maritime-101/sectors/offshore-supply',
  },
  alternates: { canonical: 'https://civsail.com/maritime-101/sectors/offshore-supply' },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
