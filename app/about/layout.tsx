import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'About CIVSail | Built from Lived Experience',
  description:
    'CIVSail is an independent, mariner-first platform providing tools, port guides, ship intelligence, and career resources for U.S. merchant mariners.',
  openGraph: {
    title: 'About CIVSail | Built from Lived Experience',
    description:
      'An independent platform helping mariners navigate their careers with better tools, clearer information, and fewer dead ends.',
    url: 'https://civsail.com/about',
  },
  alternates: { canonical: 'https://civsail.com/about' },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
