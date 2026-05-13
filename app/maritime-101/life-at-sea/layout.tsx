import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Life at Sea — What Is It Really Like to Be a Merchant Mariner?',
  description:
    'An honest look at daily life aboard merchant ships: watch schedules (4-on/8-off, 6-on/6-off), living quarters and berthing, food quality, internet and phone access at sea, time away from family, deployment lengths, shore leave, mental health, physical fitness, and the realities of working as a merchant mariner. Written by mariners who have lived it, for people considering this career.',
  openGraph: {
    title: 'Life at Sea — What to Expect as a Merchant Mariner | CIVSail',
    description:
      'What daily life is really like aboard merchant ships — schedules, berthing, food, communication, and the realities mariners actually experience.',
    url: 'https://civsail.com/maritime-101/life-at-sea',
  },
  alternates: {
    canonical: 'https://civsail.com/maritime-101/life-at-sea',
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
