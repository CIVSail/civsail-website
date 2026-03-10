import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Maritime 101 — Your Guide to the Merchant Marine | CIVSail',
  description:
    'Everything you need to know about becoming a merchant mariner: career sectors, credentials, training paths, life at sea, and how to get started.',
  openGraph: {
    title: 'Maritime 101 — Your Guide to the Merchant Marine | CIVSail',
    description:
      'The complete beginner-to-advanced guide to U.S. merchant marine careers, credentials, and life at sea.',
    url: 'https://civsail.com/maritime-101',
  },
  alternates: { canonical: 'https://civsail.com/maritime-101' },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
