import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'MSC Forms & Documents — CIVMAR Leave, Travel & Evaluation Forms',
  description:
    'Find and access common MSC CIVMAR forms: SF-1150 leave requests, travel authorization, DD 1351-2 travel vouchers, allotment changes, evaluation forms, and other Military Sealift Command documents. Searchable and organized so you can find what you need without digging through NAVO or MSC portals.',
  openGraph: {
    title: 'MSC Forms & Documents | CIVSail',
    description: 'Searchable directory of MSC CIVMAR forms — leave requests, travel claims, evaluations, and more.',
    url: 'https://civsail.com/msc-hub/forms',
  },
  alternates: { canonical: 'https://civsail.com/msc-hub/forms' },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
