import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Maritime Credentials & Licensing — MMC, STCW, TWIC Guide',
  description:
    'Complete guide to U.S. merchant mariner credentials and licensing: Merchant Mariner Credential (MMC), STCW certification, TWIC card, medical certificates, endorsements, sea service requirements, NMC application process, renewal timelines, and how to advance from entry-level to unlimited tonnage licenses. Covers exam track, approved courses, and what the Coast Guard requires at each level.',
  openGraph: {
    title: 'Maritime Credentials & Licensing — MMC, STCW, TWIC | CIVSail',
    description:
      'MMC, STCW, TWIC, medical certs, endorsements, sea service requirements, and renewal timelines for merchant mariners.',
    url: 'https://civsail.com/maritime-101/credentials',
  },
  alternates: {
    canonical: 'https://civsail.com/maritime-101/credentials',
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
