import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Superyacht & Private Vessel Careers | CIVSail',
  description:
    'Career guide to superyachts and private vessels: crew positions, STCW requirements, tip culture, lifestyle, and how to land your first yacht job.',
  openGraph: {
    title: 'Superyacht & Private Vessel Careers | CIVSail',
    description: 'What superyacht careers look like — positions, pay, tips, and how to get hired.',
    url: 'https://civsail.com/maritime-101/sectors/yachts',
  },
  alternates: { canonical: 'https://civsail.com/maritime-101/sectors/yachts' },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
