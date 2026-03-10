import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  async redirects() {
    return [
      // Old tool URLs that Google has indexed
      {
        source: '/tools/pay-calculator',
        destination: '/tools/ship-pay-calculator',
        permanent: true,
      },
      {
        source: '/tools/travel-voucher',
        destination: '/tools/travel-claim',
        permanent: true,
      },
      {
        source: '/tools/pay-comparison-calculator',
        destination: '/tools/pay-comparison',
        permanent: true,
      },
      // Old ship URL pattern (t-as vs as)
      {
        source: '/ships/msc/t-as',
        destination: '/ships/msc/as',
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
