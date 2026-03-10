import Link from 'next/link';
import Image from 'next/image';
import { Post } from '@/lib/editorials/mdx';
import { getSeriesBySlug } from '@/lib/editorials/series';
import { getAuthorBySlug } from '@/lib/editorials/authors';
import { Calendar, Clock } from 'lucide-react';

interface PostCardProps {
  post: Post;
  showSeries?: boolean; // Show series badge (useful on main listing)
}

export function PostCard({ post, showSeries = true }: PostCardProps) {
  const series = getSeriesBySlug(post.series);
  const author = getAuthorBySlug(post.frontmatter.author);

  // Format date as "Jan 15, 2024"
  const formattedDate = new Date(post.frontmatter.date).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });

  // Series badge color classes (explicit for Tailwind)
  const badgeColors: Record<string, string> = {
    blue: 'bg-blue-100 text-blue-700',
    amber: 'bg-amber-100 text-amber-700',
    emerald: 'bg-emerald-100 text-emerald-700',
  };

  const badgeClass = series 
    ? badgeColors[series.accentColor] || badgeColors.blue 
    : badgeColors.blue;

  return (
    <Link href={`/editorials/${post.series}/${post.slug}`}>
      <article className="group h-full flex flex-col bg-white border border-slate-200 rounded-xl overflow-hidden hover:shadow-lg hover:border-slate-300 transition-all duration-200">
        {/* Cover Image (optional) */}
        {post.frontmatter.coverImage && (
          <div className="relative h-48 bg-slate-100 overflow-hidden">
            <Image
              src={post.frontmatter.coverImage}
              alt={post.frontmatter.title}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-300"
            />
          </div>
        )}

        <div className="flex-1 p-5">
          {/* Series Badge */}
          {showSeries && series && (
            <span
              className={`inline-block text-xs font-medium px-2.5 py-1 rounded-full mb-3 ${badgeClass}`}
            >
              {series.title}
            </span>
          )}

          {/* Title */}
          <h3 className="text-lg font-semibold text-slate-900 mb-2 group-hover:text-blue-600 transition-colors line-clamp-2">
            {post.frontmatter.title}
          </h3>

          {/* Description */}
          <p className="text-slate-600 text-sm leading-relaxed mb-4 line-clamp-2">
            {post.frontmatter.description}
          </p>

          {/* Meta: Date and Reading Time */}
          <div className="flex items-center gap-4 text-sm text-slate-500 mt-auto">
            <span className="flex items-center gap-1.5">
              <Calendar className="h-4 w-4" />
              {formattedDate}
            </span>
            <span className="flex items-center gap-1.5">
              <Clock className="h-4 w-4" />
              {post.readingTime}
            </span>
          </div>
        </div>
      </article>
    </Link>
  );
}