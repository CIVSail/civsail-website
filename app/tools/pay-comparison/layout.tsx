import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'MSC Pay Comparison — Compare CIVMAR Earnings Across Ship Classes',
  description:
    'Compare Military Sealift Command (MSC) CIVMAR pay across ship classes and positions side by side. See how T-AKE vs T-AO vs T-AOE earnings differ for AB, OS, QMED, 3rd Mate, Chief Engineer, and other positions. Includes base wage, overtime, premium pay, penalty pay, and deployment bonuses.',
  openGraph: {
    title: 'MSC Pay Comparison — Compare CIVMAR Earnings | CIVSail',
    description:
      'Compare CIVMAR pay across MSC ship classes side by side. T-AKE vs T-AO vs T-AOE earnings by position.',
    url: 'https://civsail.com/tools/pay-comparison',
  },
  alternates: { canonical: 'https://civsail.com/tools/pay-comparison' },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
