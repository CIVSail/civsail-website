/**
 * @file ArticleGrid.tsx
 * @description Grid of all NEO articles at the bottom of the page
 *
 * @purpose Display all available articles in a browsable grid format
 */

import Link from 'next/link';
import { ArrowRight, BookOpen, Clock } from 'lucide-react';
import { getAllArticles, type NeoArticle } from '@/lib/neo/articles';

export function ArticleGrid() {
  const articles = getAllArticles();
  const publishedCount = articles.filter((a) => a.status === 'published').length;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="rounded-lg bg-blue-500/20 p-2">
            <BookOpen className="h-5 w-5 text-blue-400" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white">All Articles</h2>
            <p className="text-sm text-slate-400">
              {publishedCount} published, {articles.length - publishedCount} coming soon
            </p>
          </div>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {articles.map((article) => (
          <ArticleGridCard key={article.slug} article={article} />
        ))}
      </div>
    </div>
  );
}

function ArticleGridCard({ article }: { article: NeoArticle }) {
  const isComingSoon = article.status === 'coming-soon';

  const CardContent = (
    <div className="flex h-full flex-col">
      <div className="flex items-start justify-between gap-2 mb-2">
        <h3 className="font-medium text-white group-hover:text-blue-300 transition-colors line-clamp-2">
          {article.title}
        </h3>
        {isComingSoon && (
          <span className="flex-shrink-0 inline-flex items-center gap-1 rounded-full bg-slate-600/50 px-2 py-0.5 text-xs font-medium text-slate-300">
            <Clock className="h-3 w-3" />
            Soon
          </span>
        )}
      </div>
      <p className="flex-1 text-sm text-slate-400 line-clamp-2 mb-3">
        {article.description}
      </p>
      {!isComingSoon && (
        <div className="flex items-center gap-1 text-sm text-blue-400 group-hover:text-blue-300">
          Read article
          <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
        </div>
      )}
    </div>
  );

  if (isComingSoon) {
    return (
      <div className="rounded-xl border border-white/5 bg-white/5 p-4 opacity-60 cursor-not-allowed">
        {CardContent}
      </div>
    );
  }

  return (
    <Link
      href={`/msc-hub/neo-help/${article.slug}`}
      className="group rounded-xl border border-white/10 bg-white/5 p-4 transition-all hover:bg-white/10 hover:border-blue-500/30 hover:-translate-y-1"
    >
      {CardContent}
    </Link>
  );
}
