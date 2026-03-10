import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'MSC Pay Comparison Tool | CIVSail',
  description:
    'Compare earnings across MSC ship classes and positions side by side. See how deployment patterns, overtime, and premium pay affect total compensation.',
  openGraph: {
    title: 'MSC Pay Comparison Tool | CIVSail',
    description: 'Compare MSC pay across ship classes and positions side by side.',
    url: 'https://civsail.com/tools/pay-comparison',
  },
  alternates: { canonical: 'https://civsail.com/tools/pay-comparison' },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
