import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'MSC Leave Chit Generator | CIVSail',
  description:
    'Auto-fill and generate MSC leave request forms. Calculate leave balances, pick dates, and download a ready-to-submit leave chit.',
  openGraph: {
    title: 'MSC Leave Chit Generator | CIVSail',
    description: 'Generate MSC leave chits instantly — fill in your info and download.',
    url: 'https://civsail.com/tools/leave-chit',
  },
  alternates: { canonical: 'https://civsail.com/tools/leave-chit' },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
