import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'CIVSail Portal | Career Management for Mariners',
  description:
    'CIVSail is building a career management portal for U.S. merchant mariners. Track credentials, log sea service, store documents, and manage the administrative side of your career in one place.',
  openGraph: {
    title: 'CIVSail Portal | Career Management for Mariners',
    description:
      'A platform for managing life at sea. Track credentials, log sea service, and manage your career documents in one place.',
    url: 'https://civsail.com/portal',
  },
  alternates: {
    canonical: 'https://civsail.com/portal',
  },
};

export default function PortalLayout({ children }: { children: React.ReactNode }) {
  return children;
}
