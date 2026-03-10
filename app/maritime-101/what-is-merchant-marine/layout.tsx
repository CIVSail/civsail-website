import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'What Is the U.S. Merchant Marine? — Explained for Beginners',
  description:
    'What is the U.S. Merchant Marine? A clear explanation of civilian maritime careers: who merchant mariners are, what they do, the difference between the Merchant Marine and the Navy, how ships support global trade and national defense, major employers (MSC, commercial lines, tugboats, offshore), and why this career path exists. Written for prospective mariners, families, and career changers.',
  openGraph: {
    title: 'What Is the U.S. Merchant Marine? | CIVSail',
    description:
      'What the Merchant Marine is, who sails, the difference from the Navy, and why it matters to national defense and global trade.',
    url: 'https://civsail.com/maritime-101/what-is-merchant-marine',
  },
  alternates: {
    canonical: 'https://civsail.com/maritime-101/what-is-merchant-marine',
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
