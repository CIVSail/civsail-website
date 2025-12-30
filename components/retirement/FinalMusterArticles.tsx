import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight } from 'lucide-react';
import { getPostsBySeries } from '@/src/lib/editorials/mdx';

export default function FinalMusterArticles() {
  // Fetch all Final Muster articles
  const posts = getPostsBySeries('final-muster');

  return (
    <section id="articles" className="bg-[#f8fafb] py-16 md:py-24">
      <div className="mx-auto max-w-6xl px-4">
        {/* Header */}
        <div className="mb-12 text-center">
          <h2 className="mb-2 text-sm font-semibold uppercase tracking-wider text-[#3db4c0]">
            The Final Muster
          </h2>
          <h3 className="mb-4 text-3xl font-bold text-[#1e3a5f] md:text-4xl">
            Retirement Articles for CIVMARs
          </h3>
          <p className="mx-auto max-w-2xl text-gray-600">
            Breaking down LES line items, benefits, and retirement decisions in plain language.
          </p>
        </div>

        {/* Articles Grid */}
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {posts.map((post) => (
            <Link
              key={post.slug}
              href={`/editorials/final-muster/${post.slug}`}
              className="group overflow-hidden rounded-2xl bg-white shadow-md transition hover:shadow-xl"
            >
              {/* Cover Image */}
              <div className="relative aspect-[16/9] overflow-hidden bg-gradient-to-br from-[#1e3a5f] to-[#3db4c0]">
                {post.frontmatter.coverImage ? (
                  <Image
                    src={post.frontmatter.coverImage}
                    alt={post.frontmatter.title}
                    fill
                    className="object-cover transition group-hover:scale-105"
                  />
                ) : (
                  <div className="flex h-full items-center justify-center">
                    <span className="text-4xl font-bold text-white/20">FM</span>
                  </div>
                )}
              </div>

              {/* Content */}
              <div className="p-6">
                <p className="mb-2 text-sm text-gray-500">
                  {new Date(post.frontmatter.date).toLocaleDateString('en-US', {
                    month: 'long',
                    day: 'numeric',
                    year: 'numeric',
                  })}
                </p>
                <h4 className="mb-2 text-xl font-semibold text-[#1e3a5f] group-hover:text-[#3db4c0]">
                  {post.frontmatter.title}
                </h4>
                <p className="mb-4 line-clamp-2 text-gray-600">
                  {post.frontmatter.description}
                </p>
                <span className="inline-flex items-center gap-1 text-sm font-medium text-[#3db4c0]">
                  Read article
                  <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
                </span>
              </div>
            </Link>
          ))}
        </div>

        {/* View All Link */}
        <div className="mt-12 text-center">
          <Link
            href="/editorials/final-muster"
            className="inline-flex items-center gap-2 rounded-full border-2 border-[#1e3a5f] px-8 py-3 font-semibold text-[#1e3a5f] transition hover:bg-[#1e3a5f] hover:text-white"
          >
            View All Articles
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}