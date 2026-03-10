import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Maritime Careers & Sectors — Every Path in the Merchant Marine',
  description:
    'Explore every career sector in the U.S. maritime industry: Military Sealift Command (MSC), commercial deep sea shipping, tugboats, offshore oil and wind, cruise ships, ferries, barges, yachts, fishing, harbor pilots, NOAA, and shore-side careers. Compare pay, time at home, rotation schedules, credential requirements, and lifestyle across departments (deck, engine, steward) and positions from OS/Wiper to Captain/Chief Engineer.',
  openGraph: {
    title: 'Maritime Careers & Sectors | CIVSail',
    description:
      'Every sector of the maritime industry compared: MSC, commercial, tugboats, offshore, cruise, and more. Pay, lifestyle, and how to get started.',
    url: 'https://civsail.com/maritime-101/careers-and-sectors',
  },
  alternates: {
    canonical: 'https://civsail.com/maritime-101/careers-and-sectors',
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
