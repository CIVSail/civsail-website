import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'DD 1351-2 Travel Claim Generator | CIVSail',
  description:
    'Generate DD 1351-2 travel voucher claims for MSC mariners. Fill in trip details and download a ready-to-submit travel reimbursement form.',
  openGraph: {
    title: 'DD 1351-2 Travel Claim Generator | CIVSail',
    description: 'Generate travel voucher claims instantly for MSC travel reimbursement.',
    url: 'https://civsail.com/tools/travel-claim',
  },
  alternates: { canonical: 'https://civsail.com/tools/travel-claim' },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
