import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Cruise Ship Careers | CIVSail',
  description:
    'Career guide to working on cruise ships: deck and engine positions, pay, lifestyle, contract lengths, and how cruise lines hire.',
  openGraph: {
    title: 'Cruise Ship Careers | CIVSail',
    description: 'What it takes to work aboard cruise ships — positions, pay, and lifestyle.',
    url: 'https://civsail.com/maritime-101/sectors/cruise-ships',
  },
  alternates: { canonical: 'https://civsail.com/maritime-101/sectors/cruise-ships' },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
