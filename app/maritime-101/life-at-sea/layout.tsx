import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Life at Sea — What to Expect | CIVSail',
  description:
    'What daily life is really like aboard merchant vessels: watch schedules, living conditions, communication, food, time off, and the realities of working at sea.',
  openGraph: {
    title: 'Life at Sea — What to Expect | CIVSail',
    description:
      'An honest look at daily life aboard merchant ships — schedules, conditions, and what mariners actually experience.',
    url: 'https://civsail.com/maritime-101/life-at-sea',
  },
  alternates: {
    canonical: 'https://civsail.com/maritime-101/life-at-sea',
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
