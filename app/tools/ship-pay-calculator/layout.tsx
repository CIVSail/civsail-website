import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'MSC CIVMAR Pay Calculator — Estimate Your Earnings by Ship Class',
  description:
    'Calculate your estimated Military Sealift Command (MSC) CIVMAR earnings by ship class and position. Covers base wage, overtime, premium pay, penalty pay, night differential, Sunday premium, and deployment bonuses for all MSC ship classes including T-AKE, T-AO, T-AOE, and more. How much do MSC CIVMARs make? Find out here.',
  openGraph: {
    title: 'MSC CIVMAR Pay Calculator | CIVSail',
    description:
      'How much do MSC CIVMARs make? Calculate earnings by ship class and position — base, OT, premium, penalty, and deployment bonuses.',
    url: 'https://civsail.com/tools/ship-pay-calculator',
  },
  alternates: { canonical: 'https://civsail.com/tools/ship-pay-calculator' },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
