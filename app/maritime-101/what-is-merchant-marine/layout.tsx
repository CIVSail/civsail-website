import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'What Is the Merchant Marine? | CIVSail',
  description:
    'An introduction to the U.S. Merchant Marine: what it is, who sails, what the work looks like, and why it matters to national defense and global trade.',
  openGraph: {
    title: 'What Is the Merchant Marine? | CIVSail',
    description:
      'Learn what the U.S. Merchant Marine is, who sails, and why it matters.',
    url: 'https://civsail.com/maritime-101/what-is-merchant-marine',
  },
  alternates: {
    canonical: 'https://civsail.com/maritime-101/what-is-merchant-marine',
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
