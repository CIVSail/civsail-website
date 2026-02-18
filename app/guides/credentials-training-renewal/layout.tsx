import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Credentials, Training & Renewal Guide | CIVSail',
  description:
    'Step-by-step guide to maritime credentials, required training courses, and renewal timelines. MMC, STCW, TWIC, medical certificates, and more.',
  openGraph: {
    title: 'Credentials, Training & Renewal Guide | CIVSail',
    description: 'Everything you need to know about maritime credentials and training requirements.',
    url: 'https://civsail.com/guides/credentials-training-renewal',
  },
  alternates: { canonical: 'https://civsail.com/guides/credentials-training-renewal' },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
