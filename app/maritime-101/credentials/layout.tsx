import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Maritime Credentials & Licensing | CIVSail',
  description:
    'Understand MMC, TWIC, STCW, medical certificates, and every credential you need for a merchant marine career. Requirements, timelines, and renewal guidance.',
  openGraph: {
    title: 'Maritime Credentials & Licensing | CIVSail',
    description:
      'Everything you need to know about merchant mariner credentials, licensing, and endorsements.',
    url: 'https://civsail.com/maritime-101/credentials',
  },
  alternates: {
    canonical: 'https://civsail.com/maritime-101/credentials',
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
