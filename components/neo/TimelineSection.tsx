/**
 * @file TimelineSection.tsx
 * @description Individual timeline section card with content and articles
 *
 * @purpose Display a single stage in the NEO journey with its associated articles
 */

import { TimelineNode } from './TimelineNode';
import { ArticleCard } from './ArticleCard';
import { getArticlesForSection } from '@/lib/neo/articles';
import type { TimelineSectionData } from '@/lib/neo/articles';

interface TimelineSectionProps {
  section: TimelineSectionData;
  isLast?: boolean;
}

export function TimelineSection({ section, isLast = false }: TimelineSectionProps) {
  const articles = getArticlesForSection(section.id);

  return (
    <div className="relative flex gap-6 md:gap-8">
      {/* Timeline node and line - positioned on the left */}
      <div className="flex-shrink-0">
        <TimelineNode number={section.id} isLast={isLast} />
      </div>

      {/* Content card */}
      <div className="flex-1 pb-12">
        <div className="rounded-xl border border-white/10 bg-white/5 backdrop-blur-sm p-6 transition-all hover:bg-white/[0.07]">
          {/* Header with icon, title, and duration badge */}
          <div className="flex flex-wrap items-start gap-3 mb-4">
            <span className="text-3xl">{section.icon}</span>
            <div className="flex-1">
              <h3 className="text-xl font-semibold text-white">
                {section.title}
              </h3>
              <span className="inline-block mt-2 rounded-full bg-blue-500/20 px-3 py-1 text-xs font-medium text-blue-300">
                {section.durationBadge}
              </span>
            </div>
          </div>

          {/* Section description */}
          <div className="text-slate-300 leading-relaxed whitespace-pre-line">
            {section.content}
          </div>

          {/* Related articles */}
          {articles.length > 0 && (
            <div className="mt-6 space-y-3">
              <h4 className="text-sm font-medium uppercase tracking-wide text-slate-400">
                Related Articles
              </h4>
              <div className="space-y-2">
                {articles.map((article) => (
                  <ArticleCard key={article.slug} article={article} />
                ))}
              </div>
            </div>
          )}

          {/* Empty state for sections with no articles */}
          {articles.length === 0 && (
            <div className="mt-6 rounded-lg border border-dashed border-white/10 bg-white/[0.02] p-4 text-center">
              <p className="text-sm text-slate-500">
                No articles for this section yet. Check back soon!
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
