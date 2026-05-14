import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Training & Entry — How to Become a Merchant Mariner | CIVSail',
  description:
    'How to start a career in the U.S. Merchant Marine: maritime academy programs, hawsepipe entry paths, military-to-mariner transitions, sea service requirements, USCG licensing exams, and step-by-step career progression from entry-level to senior officer.',
  openGraph: {
    title: 'Training & Entry — How to Become a Merchant Mariner | CIVSail',
    description:
      'Academy, hawsepipe, and military entry paths into the merchant marine. Sea service requirements, licensing exams, and career progression.',
    url: 'https://civsail.com/maritime-101/training-and-entry',
  },
  alternates: { canonical: 'https://civsail.com/maritime-101/training-and-entry' },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
