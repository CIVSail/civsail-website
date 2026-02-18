import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Government Vessel Careers — NOAA, USACE, MSC | CIVSail',
  description:
    'Career guide to government maritime jobs: NOAA Corps, Army Corps of Engineers, MSC, and other federal fleets. Federal benefits, job security, and how to apply.',
  openGraph: {
    title: 'Government Vessel Careers | CIVSail',
    description: 'Explore federal maritime careers — NOAA, USACE, MSC, and more.',
    url: 'https://civsail.com/maritime-101/sectors/government',
  },
  alternates: { canonical: 'https://civsail.com/maritime-101/sectors/government' },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
