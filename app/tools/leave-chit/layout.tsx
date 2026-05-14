import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'MSC Leave Chit Generator — Auto-Fill CIVMAR Leave Requests',
  description:
    'Generate MSC CIVMAR leave request forms (leave chits) instantly. Auto-fill your information, calculate annual leave and sick leave balances, select dates, and download a print-ready PDF. No more handwriting leave chits — built for Military Sealift Command civilian mariners.',
  openGraph: {
    title: 'MSC Leave Chit Generator | CIVSail',
    description:
      'Auto-fill MSC leave request forms, calculate leave balances, and download print-ready PDFs. Built for CIVMARs.',
    url: 'https://civsail.com/tools/leave-chit',
  },
  alternates: { canonical: 'https://civsail.com/tools/leave-chit' },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
