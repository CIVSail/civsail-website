import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Financial Planning for Mariners | CIVSail',
  description:
    'Connect with financial professionals who understand mariner life. Free consultation for retirement planning, investing, budgeting, and more.',
  openGraph: {
    title: 'Financial Planning for Mariners | CIVSail',
    description:
      'Making money at sea? Make sure you keep it. Get your free financial consultation.',
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
