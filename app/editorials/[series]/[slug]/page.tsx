import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { getPostBySlug, getAllPostParams } from '@/lib/editorials/mdx';
import { getSeriesBySlug } from '@/lib/editorials/series';
import { getAuthorBySlug } from '@/lib/editorials/authors';
import { PostHeader } from '@/components/editorials/PostHeader';
import { PostBody } from '@/components/editorials/PostBody';
import { AuthorBio } from '@/components/editorials/AuthorBio';
import { NewsletterSignup } from '@/components/editorials/NewsletterSignup';
import { RelatedPosts } from '@/components/editorials/RelatedPosts';
import { ArrowLeft } from 'lucide-react';

interface PageProps {
  params: Promise<{ series: string; slug: string }>;
}

// Generate static pages for all posts at build time
export async function generateStaticParams() {
  return getAllPostParams();
}

// Dynamic metadata for SEO
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { series: seriesSlug, slug } = await params;
  const post = getPostBySlug(seriesSlug, slug);
  const series = getSeriesBySlug(seriesSlug);

  if (!post || !series) {
    return { title: 'Post Not Found | CIVSail' };
  }

  const { frontmatter } = post;
  const author = getAuthorBySlug(frontmatter.author);

  return {
    title: `${frontmatter.title} | ${series.title} | CIVSail`,
    description: frontmatter.description,
    authors: [{ name: author?.name || 'CIVSail' }],
    openGraph: {
      title: frontmatter.title,
      description: frontmatter.description,
      type: 'article',
      publishedTime: frontmatter.date,
      authors: [author?.name || 'CIVSail'],
      images: frontmatter.coverImage ? [frontmatter.coverImage] : [],
    },
    twitter: {
      card: 'summary_large_image',
      title: frontmatter.title,
      description: frontmatter.description,
    },
  };
}

export default async function PostPage({ params }: PageProps) {
  const { series: seriesSlug, slug } = await params;
  const post = getPostBySlug(seriesSlug, slug);
  const series = getSeriesBySlug(seriesSlug);

  // 404 if post or series doesn't exist
  if (!post || !series) {
    notFound();
  }

  const author = getAuthorBySlug(post.frontmatter.author);

  // JSON-LD structured data for SEO
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: post.frontmatter.title,
    description: post.frontmatter.description,
    datePublished: post.frontmatter.date,
    author: {
      '@type': 'Person',
      name: author?.name || 'CIVSail',
    },
    publisher: {
      '@type': 'Organization',
      name: 'CIVSail',
      logo: {
        '@type': 'ImageObject',
        url: 'https://civsail.com/logo.png', // TODO: Update with actual logo URL
      },
    },
    image: post.frontmatter.coverImage,
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `https://civsail.com/editorials/${seriesSlug}/${slug}`,
    },
  };

  return (
    <>
      {/* Structured Data for SEO */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <main className="min-h-screen bg-white">
        {/* Navigation */}
        <div className="max-w-3xl mx-auto px-4 pt-8">
          <Link
            href={`/editorials/${seriesSlug}`}
            className="inline-flex items-center gap-2 text-sm text-slate-600 hover:text-blue-600 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            {series.title}
          </Link>
        </div>

        {/* Article */}
        <article className="max-w-2xl mx-auto px-4 py-12 sm:py-16">
          {/* Header: Title, date, author, reading time */}
          <PostHeader post={post} series={series} author={author} />

          {/* Content */}
          <PostBody content={post.content} />

          {/* Author Bio */}
          {author && (
            <div className="mt-12 pt-8 border-t border-slate-200">
              <AuthorBio author={author} />
            </div>
          )}

          {/* Newsletter CTA */}
          <div className="mt-12">
            <NewsletterSignup source={`post-${seriesSlug}-${slug}`} />
          </div>
        </article>

        {/* Related Posts */}
        <RelatedPosts currentPost={post} />
      </main>
    </>
  );
}
