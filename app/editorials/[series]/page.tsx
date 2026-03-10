import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { getSeriesBySlug, getAllSeriesParams } from '@/lib/editorials/series';
import { getPostsBySeries } from '@/lib/editorials/mdx';
import { getAuthorBySlug } from '@/lib/editorials/authors';
import { PostCard } from '@/components/editorials/PostCard';
import { AuthorBio } from '@/components/editorials/AuthorBio';
import { NewsletterSignup } from '@/components/editorials/NewsletterSignup';
import { ArrowLeft, Waves, Anchor, Users } from 'lucide-react';

// Icon mapping - matches icon names from series.ts
const ICONS: Record<string, React.ComponentType<{ className?: string }>> = {
  Waves,
  Anchor,
  Users,
};

interface PageProps {
  params: Promise<{ series: string }>;
}

// Generate static pages for each series at build time
export async function generateStaticParams() {
  return getAllSeriesParams();
}

// Dynamic metadata for SEO
export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { series: seriesSlug } = await params;
  const series = getSeriesBySlug(seriesSlug);

  if (!series) {
    return { title: 'Series Not Found | CIVSail' };
  }

  return {
    title: `${series.title} | CIVSail Editorials`,
    description: series.metaDescription,
    openGraph: {
      title: `${series.title} | CIVSail Editorials`,
      description: series.metaDescription,
      type: 'website',
    },
  };
}

export default async function SeriesPage({ params }: PageProps) {
  const { series: seriesSlug } = await params;
  const series = getSeriesBySlug(seriesSlug);

  // 404 if series doesn't exist
  if (!series) {
    notFound();
  }

  const posts = getPostsBySeries(seriesSlug);

  // Get author if this is a single-author series (like Final Muster)
  const seriesAuthor = series.bylineAuthorSlug
    ? getAuthorBySlug(series.bylineAuthorSlug)
    : null;

  const IconComponent = ICONS[series.icon] || Waves;

  // Accent color classes (explicit for Tailwind)
  const colorClasses: Record<string, { bg: string; text: string }> = {
    blue: { bg: 'bg-blue-100', text: 'text-blue-600' },
    amber: { bg: 'bg-amber-100', text: 'text-amber-600' },
    emerald: { bg: 'bg-emerald-100', text: 'text-emerald-600' },
  };

  const colors = colorClasses[series.accentColor] || colorClasses.blue;

  return (
    <main className="min-h-screen bg-white">
      {/* Back Link */}
      <div className="max-w-4xl mx-auto px-4 pt-8">
        <Link
          href="/editorials"
          className="inline-flex items-center gap-2 text-sm text-slate-600 hover:text-blue-600 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          All Editorials
        </Link>
      </div>

      {/* Series Header */}
      <header className="max-w-4xl mx-auto px-4 py-12 border-b border-slate-200">
        <div className={`inline-flex p-3 ${colors.bg} rounded-lg mb-4`}>
          <IconComponent className={`h-6 w-6 ${colors.text}`} />
        </div>

        <h1 className="text-4xl font-bold text-slate-900 mb-3">
          {series.title}
        </h1>

        <p className="text-sm text-slate-500 mb-4">{series.byline}</p>

        <p className="text-lg text-slate-600 max-w-2xl">{series.description}</p>
      </header>

      {/* Author Bio (if single author series) */}
      {seriesAuthor && (
        <section className="max-w-4xl mx-auto px-4 py-8 border-b border-slate-200">
          <AuthorBio author={seriesAuthor} variant="compact" />
        </section>
      )}

      {/* Posts Grid */}
      <section className="max-w-6xl mx-auto px-4 py-12">
        {posts.length > 0 ? (
          <>
            <p className="text-slate-600 mb-8">
              {posts.length} {posts.length === 1 ? 'article' : 'articles'} in
              this series
            </p>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {posts.map((post) => (
                <PostCard key={post.slug} post={post} showSeries={false} />
              ))}
            </div>
          </>
        ) : (
          <div className="text-center py-16">
            <p className="text-slate-500 mb-2">No articles published yet.</p>
            <p className="text-sm text-slate-400">Check back soon!</p>
          </div>
        )}
      </section>

      {/* Newsletter */}
      <section className="max-w-2xl mx-auto px-4 py-16">
        <NewsletterSignup source={`series-${seriesSlug}`} />
      </section>
    </main>
  );
}
