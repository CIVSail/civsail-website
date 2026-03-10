import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Maritime Pilot Careers | CIVSail',
  description:
    'Career guide to maritime piloting: harbor pilots, river pilots, and docking masters. How to become a pilot, apprenticeships, earnings potential, and lifestyle.',
  openGraph: {
    title: 'Maritime Pilot Careers | CIVSail',
    description: 'How to become a maritime pilot — apprenticeships, earnings, and the path forward.',
    url: 'https://civsail.com/maritime-101/sectors/pilots',
  },
  alternates: { canonical: 'https://civsail.com/maritime-101/sectors/pilots' },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
