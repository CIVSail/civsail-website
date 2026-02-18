import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Ferry & Passenger Vessel Careers | CIVSail',
  description:
    'Career guide to ferries and passenger vessels: state ferry systems, private operators, pay, home-every-night schedules, and credential requirements.',
  openGraph: {
    title: 'Ferry & Passenger Vessel Careers | CIVSail',
    description: 'Explore ferry and passenger vessel careers — schedules, pay, and how to get hired.',
    url: 'https://civsail.com/maritime-101/sectors/ferries',
  },
  alternates: { canonical: 'https://civsail.com/maritime-101/sectors/ferries' },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
