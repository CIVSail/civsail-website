/**
 * @file ArticleCard.tsx
 * @description Card component for linking to individual NEO articles
 *
 * @purpose Display article preview with title, description, and status
 */

import Link from 'next/link';
import { ArrowRight, FileText } from 'lucide-react';
import { ComingSoonBadge } from './ComingSoonBadge';
import type { NeoArticle } from '@/lib/neo/articles';

interface ArticleCardProps {
  article: NeoArticle;
}

export function ArticleCard({ article }: ArticleCardProps) {
  const isComingSoon = article.status === 'coming-soon';

  const CardContent = (
    <>
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-3">
          <div className="flex-shrink-0 rounded-lg bg-blue-500/20 p-2">
            <FileText className="h-4 w-4 text-blue-400" />
          </div>
          <div className="space-y-1">
            <h4 className="font-medium text-white group-hover:text-blue-300 transition-colors">
              {article.title}
            </h4>
            <p className="text-sm text-slate-400 line-clamp-2">
              {article.description}
            </p>
          </div>
        </div>
        {isComingSoon ? (
          <ComingSoonBadge />
        ) : (
          <ArrowRight className="h-5 w-5 flex-shrink-0 text-slate-500 group-hover:text-blue-400 group-hover:translate-x-1 transition-all" />
        )}
      </div>
    </>
  );

  if (isComingSoon) {
    return (
      <div className="group rounded-lg border border-white/5 bg-white/5 p-4 opacity-60 cursor-not-allowed">
        {CardContent}
      </div>
    );
  }

  return (
    <Link
      href={`/msc-hub/neo-help/${article.slug}`}
      className="group block rounded-lg border border-white/10 bg-white/5 p-4 transition-all hover:bg-white/10 hover:border-blue-500/30 hover:-translate-y-0.5"
    >
      {CardContent}
    </Link>
  );
}
