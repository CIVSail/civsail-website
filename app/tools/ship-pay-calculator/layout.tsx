import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'MSC Ship Pay Calculator | CIVSail',
  description:
    'Calculate your estimated MSC earnings by ship class and position. Includes base wage, overtime, premium pay, and deployment bonuses.',
  openGraph: {
    title: 'MSC Ship Pay Calculator | CIVSail',
    description: 'Estimate your MSC earnings by ship class, position, and deployment days.',
    url: 'https://civsail.com/tools/ship-pay-calculator',
  },
  alternates: { canonical: 'https://civsail.com/tools/ship-pay-calculator' },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
