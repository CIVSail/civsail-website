import { Metadata } from 'next';
import { SERIES_LIST } from '@/lib/editorials/series';
import { getRecentPosts } from '@/lib/editorials/mdx';
import { SeriesCard } from '@/components/editorials/SeriesCard';
import { PostCard } from '@/components/editorials/PostCard';
import { NewsletterSignup } from '@/components/editorials/NewsletterSignup';
import { Newspaper } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Editorials | CIVSail',
  description:
    'Essays, analysis, and career stories for civilian mariners. Explore retirement guides, mariner profiles, and maritime policy reporting.',
  openGraph: {
    title: 'Editorials | CIVSail',
    description: 'Essays, analysis, and career stories for civilian mariners.',
    type: 'website',
  },
};

export default function EditorialsPage() {
  const recentPosts = getRecentPosts(6);

  return (
    <main className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="bg-gradient-to-b from-slate-50 to-white border-b border-slate-200">
        <div className="max-w-4xl mx-auto px-4 py-16 sm:py-20">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Newspaper className="h-6 w-6 text-blue-600" />
            </div>
            <span className="text-sm font-medium text-blue-600 uppercase tracking-wide">
              CIVSail Editorials
            </span>
          </div>

          <h1 className="text-4xl sm:text-5xl font-bold text-slate-900 mb-4">
            Stories & Insights for Mariners
          </h1>

          <p className="text-xl text-slate-600 max-w-2xl">
            Career guidance, retirement planning, and the stories that shape life at sea.
            Written by mariners, for mariners.
          </p>
        </div>
      </section>

      {/* Series Grid */}
      <section className="max-w-6xl mx-auto px-4 py-12">
        <h2 className="text-2xl font-bold text-slate-900 mb-8">Editorial Series</h2>

        <div className="grid md:grid-cols-3 gap-6">
          {SERIES_LIST.map((series) => (
            <SeriesCard key={series.slug} series={series} />
          ))}
        </div>
      </section>

      {/* Recent Posts */}
      {recentPosts.length > 0 && (
        <section className="max-w-6xl mx-auto px-4 py-12 border-t border-slate-200">
          <h2 className="text-2xl font-bold text-slate-900 mb-8">Recent Posts</h2>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {recentPosts.map((post) => (
              <PostCard key={`${post.series}-${post.slug}`} post={post} />
            ))}
          </div>
        </section>
      )}

      {/* Newsletter CTA */}
      <section className="max-w-2xl mx-auto px-4 py-16">
        <NewsletterSignup source="editorials-landing" />
      </section>
    </main>
  );
}