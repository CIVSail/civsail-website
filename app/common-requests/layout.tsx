import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Common Requests for MSC CIVMARs — Contacts, Forms & Resources',
  description:
    'Quick access to frequently needed MSC CIVMAR resources: placement office contacts and phone numbers, employment verification requests, drug testing letter requests, pay and finance links, benefits information, job announcements, regulations, and government portals. Everything CIVMARs keep asking for, in one place.',
  openGraph: {
    title: 'Common Requests for MSC CIVMARs | CIVSail',
    description:
      'Placement contacts, employment verification, drug test letters, and essential links for MSC CIVMARs.',
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
