import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Financial Planning for Merchant Mariners — Retirement, TSP & Investing',
  description:
    'Financial planning resources for U.S. merchant mariners and CIVMARs: FERS retirement, TSP allocation strategies, budgeting for rotation schedules, investing on mariner income, tax considerations for sea-based work, and connections to financial professionals who understand the unique challenges of maritime careers.',
  openGraph: {
    title: 'Financial Planning for Merchant Mariners | CIVSail',
    description:
      'FERS retirement, TSP strategies, budgeting, and investing resources built for the unique financial needs of merchant mariners.',
    type: 'website',
    url: 'https://civsail.com/financial',
  },
  alternates: {
    canonical: 'https://civsail.com/financial',
  },
};

export default function FinancialLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
