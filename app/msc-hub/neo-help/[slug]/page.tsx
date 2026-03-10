/**
 * @file page.tsx
 * @description Dynamic article page for NEO help articles
 *
 * @purpose Display individual article content with navigation and related articles
 */

import { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { MDXRemote } from 'next-mdx-remote/rsc';
import remarkGfm from 'remark-gfm';
import {
  ChevronRight,
  ArrowLeft,
  Clock,
  BookOpen,
  ArrowRight,
} from 'lucide-react';
import {
  getArticleBySlug,
  getFullArticleBySlug,
  getAllArticles,
  timelineSections,
  type NeoArticle,
} from '@/lib/neo/articles';
import { getAllNeoArticleSlugs } from '@/lib/neo/mdx';

interface PageProps {
  params: Promise<{ slug: string }>;
}

// Generate static paths for all articles
export async function generateStaticParams() {
  const slugs = getAllNeoArticleSlugs();
  return slugs.map((slug) => ({ slug }));
}

// Generate metadata for each article
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const article = getArticleBySlug(slug);

  if (!article) {
    return {
      title: 'Article Not Found | CIVSail',
    };
  }

  return {
    title: `${article.title} | NEO Help | CIVSail`,
    description: article.description,
    openGraph: {
      title: `${article.title} | CIVSail`,
      description: article.description,
      url: `https://civsail.com/msc-hub/neo-help/${article.slug}`,
    },
    alternates: {
      canonical: `https://civsail.com/msc-hub/neo-help/${article.slug}`,
    },
  };
}

export default async function ArticlePage({ params }: PageProps) {
  const { slug } = await params;
  const article = getArticleBySlug(slug);
  const fullArticle = getFullArticleBySlug(slug);

  if (!article || !fullArticle) {
    notFound();
  }

  // Get related articles (from same timeline sections)
  const relatedArticles = getRelatedArticles(article);

  // Get timeline section info
  const section = timelineSections.find((s) =>
    article.timelineSections.includes(s.id)
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900">
      {/* Hero / Header */}
      <div className="border-b border-white/10 bg-black/20">
        <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
          {/* Breadcrumb */}
          <nav className="mb-6 flex items-center gap-2 text-sm text-slate-400">
            <Link href="/" className="hover:text-white transition-colors">
              Home
            </Link>
            <ChevronRight className="h-4 w-4" />
            <Link href="/msc-hub" className="hover:text-white transition-colors">
              MSC Hub
            </Link>
            <ChevronRight className="h-4 w-4" />
            <Link
              href="/msc-hub/neo-help"
              className="hover:text-white transition-colors"
            >
              NEO Help
            </Link>
            <ChevronRight className="h-4 w-4" />
            <span className="text-white truncate max-w-[200px]">
              {article.title}
            </span>
          </nav>

          {/* Back link */}
          <Link
            href="/msc-hub/neo-help"
            className="inline-flex items-center gap-2 text-sm text-blue-400 hover:text-blue-300 transition-colors mb-6"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to NEO Guide
          </Link>

          {/* Timeline section badge */}
          {section && (
            <div className="mb-4">
              <span className="inline-flex items-center gap-2 rounded-full bg-blue-500/20 px-3 py-1 text-sm text-blue-300">
                <span>{section.icon}</span>
                <span>Stage {section.id}: {section.title}</span>
              </span>
            </div>
          )}

          {/* Title */}
          <h1 className="text-3xl font-bold text-white md:text-4xl">
            {article.title}
          </h1>

          {/* Description and reading time */}
          <p className="mt-4 text-lg text-slate-300">{article.description}</p>

          {article.readingTime && article.status === 'published' && (
            <p className="mt-2 text-sm text-slate-400">{article.readingTime}</p>
          )}

          {/* Coming soon indicator */}
          {article.status === 'coming-soon' && (
            <div className="mt-6 inline-flex items-center gap-2 rounded-full bg-slate-600/50 px-4 py-2 text-slate-300">
              <Clock className="h-4 w-4" />
              <span>This article is coming soon</span>
            </div>
          )}
        </div>
      </div>

      {/* Main Content */}
      <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
        {article.status === 'coming-soon' ? (
          <ComingSoonContent article={article} />
        ) : (
          <ArticleContent content={fullArticle.content} />
        )}

        {/* Related Articles */}
        {relatedArticles.length > 0 && (
          <div className="mt-12 pt-8 border-t border-white/10">
            <div className="flex items-center gap-3 mb-6">
              <div className="rounded-lg bg-blue-500/20 p-2">
                <BookOpen className="h-5 w-5 text-blue-400" />
              </div>
              <h2 className="text-xl font-bold text-white">Related Articles</h2>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              {relatedArticles.map((related) => (
                <RelatedArticleCard key={related.slug} article={related} />
              ))}
            </div>
          </div>
        )}

        {/* Back to guide */}
        <div className="mt-12 text-center">
          <Link
            href="/msc-hub/neo-help"
            className="inline-flex items-center gap-2 rounded-lg border border-white/20 bg-white/5 px-6 py-3 font-medium text-white transition-colors hover:bg-white/10"
          >
            <ArrowLeft className="h-5 w-5" />
            Back to NEO Guide
          </Link>
        </div>
      </div>
    </div>
  );
}

// Article content rendered from MDX
function ArticleContent({ content }: { content: string }) {
  return (
    <div className="neo-prose prose prose-invert prose-lg max-w-none prose-headings:text-white prose-p:text-slate-300 prose-a:text-blue-400 prose-strong:text-white prose-li:text-slate-300">
      <MDXRemote
        source={content}
        options={{
          mdxOptions: {
            remarkPlugins: [remarkGfm],
          },
        }}
      />
    </div>
  );
}

// Coming soon content
function ComingSoonContent({ article }: { article: NeoArticle }) {
  return (
    <div className="rounded-xl border border-white/10 bg-white/5 p-12 text-center">
      <div className="inline-flex items-center justify-center rounded-full bg-slate-600/30 p-4 mb-4">
        <Clock className="h-8 w-8 text-slate-400" />
      </div>
      <h2 className="text-2xl font-bold text-white mb-2">Coming Soon</h2>
      <p className="text-slate-400 max-w-md mx-auto">
        We&apos;re still working on &quot;{article.title}&quot;. Check back later
        for the full guide.
      </p>
    </div>
  );
}

// Related article card
function RelatedArticleCard({ article }: { article: NeoArticle }) {
  const isComingSoon = article.status === 'coming-soon';

  if (isComingSoon) {
    return (
      <div className="rounded-lg border border-white/5 bg-white/5 p-4 opacity-60 cursor-not-allowed">
        <h3 className="font-medium text-white mb-1">{article.title}</h3>
        <p className="text-sm text-slate-400 line-clamp-2">
          {article.description}
        </p>
        <div className="mt-2 inline-flex items-center gap-1 text-xs text-slate-500">
          <Clock className="h-3 w-3" />
          Coming Soon
        </div>
      </div>
    );
  }

  return (
    <Link
      href={`/msc-hub/neo-help/${article.slug}`}
      className="group rounded-lg border border-white/10 bg-white/5 p-4 transition-all hover:bg-white/10 hover:border-blue-500/30"
    >
      <h3 className="font-medium text-white group-hover:text-blue-300 transition-colors mb-1">
        {article.title}
      </h3>
      <p className="text-sm text-slate-400 line-clamp-2">{article.description}</p>
      <div className="mt-2 flex items-center gap-1 text-sm text-blue-400 group-hover:text-blue-300">
        Read article
        <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
      </div>
    </Link>
  );
}

// Helper to get related articles
function getRelatedArticles(currentArticle: NeoArticle): NeoArticle[] {
  const allArticles = getAllArticles();

  // Find articles in the same timeline sections, excluding current
  return allArticles
    .filter(
      (article) =>
        article.slug !== currentArticle.slug &&
        article.timelineSections.some((sectionId) =>
          currentArticle.timelineSections.includes(sectionId)
        )
    )
    .slice(0, 4); // Limit to 4 related articles
}
