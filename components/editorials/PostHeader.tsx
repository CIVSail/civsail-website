import Image from 'next/image';
import { Post } from '@/lib/editorials/mdx';
import { Series } from '@/lib/editorials/series';
import { Author } from '@/lib/editorials/authors';
import { User } from 'lucide-react';

interface PostHeaderProps {
  post: Post;
  series: Series;
  author?: Author | null;
}

export function PostHeader({ post, series, author }: PostHeaderProps) {
  const { frontmatter, readingTime } = post;

  // Format date as "May 17, 2025"
  const formattedDate = new Date(frontmatter.date).toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });

  return (
    <header className="mb-12">
      {/* Series Label */}
      <div className="mb-6">
        <span className="text-sm font-medium text-blue-600 uppercase tracking-widest">
          {series.title}
        </span>
      </div>

      {/* Title */}
      <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-bold text-slate-900 mb-6 leading-[1.1] tracking-tight">
        {frontmatter.title}
      </h1>

      {/* Description / Deck */}
      <p className="text-xl sm:text-2xl text-slate-600 mb-8 leading-relaxed font-light">
        {frontmatter.description}
      </p>

      {/* Byline */}
      <div className="flex items-center gap-4 pb-8 border-b border-slate-200">
        {/* Author Avatar */}
        {author?.avatar ? (
          <Image
            src={author.avatar}
            alt={author.name}
            width={48}
            height={48}
            className="rounded-full"
          />
        ) : (
          <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center">
            <User className="h-6 w-6 text-slate-400" />
          </div>
        )}

        <div>
          <p className="font-medium text-slate-900">
            {author?.name || 'CIVSail'}
          </p>
          <p className="text-sm text-slate-500">
            {formattedDate} · {readingTime}
          </p>
        </div>
      </div>

      {/* Cover Image */}
      {frontmatter.coverImage && (
        <figure className="mt-10 -mx-4 sm:mx-0">
          <Image
            src={frontmatter.coverImage}
            alt={frontmatter.title}
            width={1200}
            height={630}
            className="w-full h-auto sm:rounded-lg"
            priority
          />
        </figure>
      )}
    </header>
  );
}