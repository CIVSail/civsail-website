import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Credentials, Training & Renewal — Step-by-Step Guide for Mariners',
  description:
    'Step-by-step guide to maritime credentials, required training courses, and renewal timelines for U.S. merchant mariners. How to get and renew your MMC, STCW, TWIC, medical certificate, and endorsements. NMC processing times, approved training schools, sea service documentation, and what to do when credentials are expiring.',
  openGraph: {
    title: 'Credentials, Training & Renewal Guide | CIVSail',
    description: 'How to get and renew MMC, STCW, TWIC, and medical certificates. NMC timelines, training schools, and sea service requirements.',
    url: 'https://civsail.com/guides/credentials-training-renewal',
  },
  alternates: { canonical: 'https://civsail.com/guides/credentials-training-renewal' },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
