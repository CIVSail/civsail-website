import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Offshore Rig & Platform Careers | CIVSail',
  description:
    'Career guide to offshore rigs and platforms: drilling rigs, production platforms, FPSOs. Rotation schedules, pay, certifications, and how to get hired.',
  openGraph: {
    title: 'Offshore Rig & Platform Careers | CIVSail',
    description: 'What offshore rig and platform careers look like — pay, rotation, and entry paths.',
    url: 'https://civsail.com/maritime-101/sectors/offshore-rigs',
  },
  alternates: { canonical: 'https://civsail.com/maritime-101/sectors/offshore-rigs' },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
