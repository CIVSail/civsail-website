import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Common Needs & Requests | CIVSail',
  description:
    'Quick access to frequently needed resources for MSC mariners: placement contacts, employment verification, drug testing letters, and important links.',
  openGraph: {
    title: 'Common Needs & Requests | CIVSail',
    description:
      'Quick access to frequently needed resources for MSC mariners.',
    type: 'website',
    url: 'https://civsail.com/common-requests',
  },
  alternates: {
    canonical: 'https://civsail.com/common-requests',
  },
};

export default function CommonRequestsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
