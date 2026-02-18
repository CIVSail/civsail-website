import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'MSC Forms & Documents | CIVSail',
  description:
    'Quick access to MSC forms: leave chits, travel claims, evaluation forms, and other commonly needed documents for CIVMARs.',
  openGraph: {
    title: 'MSC Forms & Documents | CIVSail',
    description: 'Find and download MSC forms and documents in one place.',
    url: 'https://civsail.com/msc-hub/forms',
  },
  alternates: { canonical: 'https://civsail.com/msc-hub/forms' },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
