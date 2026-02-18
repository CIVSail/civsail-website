import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/dashboard', '/onboarding', '/career-path', '/api/'],
      },
    ],
    sitemap: 'https://civsail.com/sitemap.xml',
  };
}
