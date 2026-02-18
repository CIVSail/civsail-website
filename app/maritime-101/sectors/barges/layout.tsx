import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Barge & Inland Waterway Careers | CIVSail',
  description:
    'Career guide to barge and inland waterway work: rivers, the ICW, and Great Lakes. Pay, rotation, licensing, and how to break in.',
  openGraph: {
    title: 'Barge & Inland Waterway Careers | CIVSail',
    description: 'Everything you need to know about inland waterway and barge careers.',
    url: 'https://civsail.com/maritime-101/sectors/barges',
  },
  alternates: { canonical: 'https://civsail.com/maritime-101/sectors/barges' },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
