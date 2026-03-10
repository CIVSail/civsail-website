import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'DD 1351-2 Travel Voucher Generator — MSC Travel Claims & Comp Time',
  description:
    'Generate DD 1351-2 travel voucher claims and calculate comp time for MSC CIVMAR travel. Fill in trip details, per diem rates, mileage, and expenses, then download a ready-to-submit travel reimbursement form. Includes comp time calculator for travel outside duty hours. Built for Military Sealift Command civilian mariners.',
  openGraph: {
    title: 'DD 1351-2 Travel Voucher Generator | CIVSail',
    description:
      'Generate MSC travel voucher claims and calculate comp time. Fill in details and download ready-to-submit DD 1351-2 forms.',
    url: 'https://civsail.com/tools/travel-claim',
  },
  alternates: { canonical: 'https://civsail.com/tools/travel-claim' },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
