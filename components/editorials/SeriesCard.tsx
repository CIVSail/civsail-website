import Link from 'next/link';
import { Series } from '@/lib/editorials/series';
import { getPostsBySeries } from '@/lib/editorials/mdx';
import { Waves, Anchor, Users, ChevronRight } from 'lucide-react';

// Map icon names (from series.ts) to actual Lucide components
const ICONS: Record<string, React.ComponentType<{ className?: string }>> = {
  Waves,
  Anchor,
  Users,
};

interface SeriesCardProps {
  series: Series;
}

export function SeriesCard({ series }: SeriesCardProps) {
  // Get post count for this series
  const posts = getPostsBySeries(series.slug);
  const postCount = posts.length;

  // Get the icon component (fallback to Waves if not found)
  const IconComponent = ICONS[series.icon] || Waves;

  // Color classes based on series accent color
  // We define these explicitly so Tailwind can find them at build time
  const colorClasses: Record<string, { bg: string; text: string; border: string }> = {
    blue: {
      bg: 'bg-blue-50',
      text: 'text-blue-600',
      border: 'hover:border-blue-300',
    },
    amber: {
      bg: 'bg-amber-50',
      text: 'text-amber-600',
      border: 'hover:border-amber-300',
    },
    emerald: {
      bg: 'bg-emerald-50',
      text: 'text-emerald-600',
      border: 'hover:border-emerald-300',
    },
  };

  const colors = colorClasses[series.accentColor] || colorClasses.blue;

  return (
    <Link href={`/editorials/${series.slug}`}>
      <article
        className={`group h-full p-6 bg-white border border-slate-200 rounded-xl 
                    transition-all duration-200 hover:shadow-lg ${colors.border}`}
      >
        {/* Icon */}
        <div className={`inline-flex p-3 ${colors.bg} rounded-lg mb-4`}>
          <IconComponent className={`h-6 w-6 ${colors.text}`} />
        </div>

        {/* Title */}
        <h3 className="text-xl font-bold text-slate-900 mb-2 group-hover:text-blue-600 transition-colors">
          {series.title}
        </h3>

        {/* Byline */}
        <p className="text-sm text-slate-500 mb-3">{series.byline}</p>

        {/* Description */}
        <p className="text-slate-600 text-sm leading-relaxed mb-4">
          {series.description}
        </p>

        {/* Footer */}
        <div className="flex items-center justify-between pt-4 border-t border-slate-100">
          <span className="text-sm text-slate-500">
            {postCount} {postCount === 1 ? 'article' : 'articles'}
          </span>
          <span className="flex items-center text-sm font-medium text-blue-600 group-hover:gap-2 transition-all">
            Read series
            <ChevronRight className="h-4 w-4 opacity-0 -ml-2 group-hover:opacity-100 group-hover:ml-0 transition-all" />
          </span>
        </div>
      </article>
    </Link>
  );
}