import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'MSC Policies & CMPIs — Civilian Mariner Personnel Instructions',
  description:
    'Searchable reference for MSC policies and CMPIs (Civilian Mariners Personnel Instructions). Leave policy, pay instructions, deployment guidance, overtime rules, premium pay, disciplinary procedures, and administrative references for Military Sealift Command CIVMARs. Organized and searchable so you can find the policy you need.',
  openGraph: {
    title: 'MSC Policies & CMPIs | CIVSail',
    description: 'Searchable directory of MSC CMPIs and policies — leave, pay, deployment, and administrative guidance for CIVMARs.',
    url: 'https://civsail.com/msc-hub/policies',
  },
  alternates: { canonical: 'https://civsail.com/msc-hub/policies' },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
