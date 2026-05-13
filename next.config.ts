import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  async redirects() {
    return [
      // Old /pages/ URLs from previous site structure
      {
        source: '/pages/about',
        destination: '/about',
        permanent: true,
      },
      {
        source: '/pages/ship-pay-calculator',
        destination: '/tools/ship-pay-calculator',
        permanent: true,
      },

      // Old /blogs/ URLs → /editorials/
      {
        source: '/blogs/from-the-team/weve-rebranded-and-yes-theres-a-story',
        destination: '/editorials/soundings/weve-rebranded',
        permanent: true,
      },
      {
        source: '/blogs/from-the-team/the-vision-behind-civmar-com',
        destination: '/editorials/soundings/the-vision-behind-civsail',
        permanent: true,
      },
      {
        source: '/blogs/from-the-team',
        destination: '/editorials/soundings',
        permanent: true,
      },
      {
        source: '/blogs/:series/:slug*',
        destination: '/editorials/:series/:slug*',
        permanent: true,
      },
      {
        source: '/blogs/:slug*',
        destination: '/editorials/:slug*',
        permanent: true,
      },

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
