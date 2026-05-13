import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Maritime 101 — Complete Guide to the U.S. Merchant Marine',
  description:
    'Everything you need to know about the U.S. Merchant Marine: what it is, how to become a merchant mariner, career sectors (MSC, commercial shipping, tugboats, offshore, cruise, NOAA), credentials (MMC, STCW, TWIC), training paths (maritime academy vs hawsepipe vs military), life at sea, pay expectations, and how to get started. A free, comprehensive guide from CIVSail.',
  openGraph: {
    title: 'Maritime 101 — Complete Guide to the U.S. Merchant Marine | CIVSail',
    description:
      'How to become a merchant mariner: careers, credentials, training, life at sea, and getting started in the U.S. Merchant Marine.',
    url: 'https://civsail.com/maritime-101',
  },
  alternates: { canonical: 'https://civsail.com/maritime-101' },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
