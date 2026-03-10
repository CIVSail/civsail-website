import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'About CIVSail — Built by Mariners, for Mariners',
  description:
    'CIVSail is an independent, mariner-first platform built from lived experience aboard MSC ships. We provide pay calculators, ship class guides, interactive port maps, credential tools, and career resources for U.S. merchant mariners and CIVMARs. Neutral, transparent, and built to serve the individual mariner — not employers, unions, or agencies.',
  openGraph: {
    title: 'About CIVSail — Built by Mariners, for Mariners',
    description:
      'An independent platform helping U.S. merchant mariners navigate their careers with better tools, clearer information, and fewer dead ends.',
    url: 'https://civsail.com/about',
  },
  alternates: { canonical: 'https://civsail.com/about' },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
