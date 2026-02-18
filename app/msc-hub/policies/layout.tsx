import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'MSC Policies & References | CIVSail',
  description:
    'Key MSC policies and reference materials for CIVMARs: leave policy, pay instructions, deployment guidance, and administrative references.',
  openGraph: {
    title: 'MSC Policies & References | CIVSail',
    description: 'MSC policy references and administrative guidance for CIVMARs.',
    url: 'https://civsail.com/msc-hub/policies',
  },
  alternates: { canonical: 'https://civsail.com/msc-hub/policies' },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
