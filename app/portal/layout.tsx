import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'CIVSail Portal — Credential Tracking & Career Management for Mariners',
  description:
    'CIVSail is building a career management portal for U.S. merchant mariners and CIVMARs. Track MMC, STCW, TWIC, and medical certificate expirations with automated reminders. Log sea service by vessel and employer. Store documents securely. Track progress toward your next license upgrade. One dashboard for the administrative side of your maritime career.',
  openGraph: {
    title: 'CIVSail Portal — Career Management for Mariners',
    description:
      'Track credentials, log sea service, store documents, and manage your maritime career in one place. Built for merchant mariners and CIVMARs.',
    url: 'https://civsail.com/portal',
  },
  alternates: {
    canonical: 'https://civsail.com/portal',
  },
};

export default function PortalLayout({ children }: { children: React.ReactNode }) {
  return children;
}
