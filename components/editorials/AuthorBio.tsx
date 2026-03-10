import Image from 'next/image';
import { Author } from '@/lib/editorials/authors';
import { User } from 'lucide-react';

interface AuthorBioProps {
  author: Author;
  variant?: 'full' | 'compact';
}

export function AuthorBio({ author, variant = 'full' }: AuthorBioProps) {
  // Compact variant - small, inline (for series pages)
  if (variant === 'compact') {
    return (
      <div className="flex items-center gap-4">
        {/* Avatar or fallback icon */}
        {author.avatar ? (
          <Image
            src={author.avatar}
            alt={author.name}
            width={48}
            height={48}
            className="rounded-full"
          />
        ) : (
          // TODO: Add author photos to /public/authors/ and update authors.ts
          <div className="w-12 h-12 bg-slate-200 rounded-full flex items-center justify-center">
            <User className="h-6 w-6 text-slate-500" />
          </div>
        )}
        <div>
          <p className="font-semibold text-slate-900">{author.name}</p>
          <p className="text-sm text-slate-500">{author.role}</p>
        </div>
      </div>
    );
  }

  // Full variant - larger card (for end of posts)
  return (
    <div className="flex flex-col sm:flex-row gap-4 p-6 bg-slate-50 rounded-xl">
      {/* Avatar or fallback icon */}
      {author.avatar ? (
        <Image
          src={author.avatar}
          alt={author.name}
          width={80}
          height={80}
          className="rounded-full flex-shrink-0"
        />
      ) : (
        // TODO: Add author photos to /public/authors/ and update authors.ts
        <div className="w-20 h-20 bg-slate-200 rounded-full flex items-center justify-center flex-shrink-0">
          <User className="h-10 w-10 text-slate-500" />
        </div>
      )}

      {/* Author info */}
      <div>
        <p className="text-sm text-slate-500 mb-1">Written by</p>
        <p className="text-lg font-semibold text-slate-900">{author.name}</p>
        <p className="text-sm text-slate-600 mb-2">{author.role}</p>
        <p className="text-slate-600 text-sm leading-relaxed">{author.bio}</p>
      </div>
    </div>
  );
}