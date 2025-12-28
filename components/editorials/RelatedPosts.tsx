import { Post, getPostsBySeries } from '@/lib/editorials/mdx';
import { PostCard } from './PostCard';

interface RelatedPostsProps {
  currentPost: Post;
  limit?: number;
}

export function RelatedPosts({ currentPost, limit = 3 }: RelatedPostsProps) {
  // Get other posts from the same series, excluding current post
  const relatedPosts = getPostsBySeries(currentPost.series)
    .filter((post) => post.slug !== currentPost.slug)
    .slice(0, limit);

  // Don't render anything if no related posts
  if (relatedPosts.length === 0) {
    return null;
  }

  return (
    <section className="max-w-6xl mx-auto px-4 py-12 border-t border-slate-200">
      <h2 className="text-2xl font-bold text-slate-900 mb-8">
        More from this series
      </h2>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {relatedPosts.map((post) => (
          <PostCard key={post.slug} post={post} showSeries={false} />
        ))}
      </div>
    </section>
  );
}