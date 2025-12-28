'use client';

import Link from 'next/link';
import { useState } from 'react';

// Sample blog data - you'll replace this with your actual content
const sampleBlogs = [
  {
    id: 'shore-shock-guide',
    title:
      'Shore Shock: What Happens After You Stop Sailing and How to Prepare',
    excerpt:
      "Leaving MSC is the plan for most, but no one talks about what happens next. Here's what to expect, and how to move forward on your terms.",
    author: 'The CIVSail Team',
    authorRole: 'Maritime Veterans & Founders',
    date: '2025-07-01',
    readTime: '15 min read',
    category: 'Career Transition',
    featured: true,
    image: '/api/placeholder/800/400',
    tags: [
      'Shore Transition',
      'Career Planning',
      'Mental Health',
      'MSC',
      'Financial Planning',
    ],
  },

  {
    id: 'building-civsail',
    title: 'Why We Built CIVSail: A Letter from the Founders',
    excerpt:
      'The story behind CIVSail and our mission to support the maritime community with better tools and resources.',
    author: 'The CIVSail Team',
    authorRole: 'Founders & Maritime Veterans',
    date: '2024-01-10',
    readTime: '5 min read',
    category: 'Company News',
    featured: false,
    image: '/api/placeholder/800/400',
    tags: ['Company', 'Mission', 'Maritime Community'],
  },
  {
    id: 'maritime-mental-health',
    title: 'Mental Health at Sea: Breaking the Silence',
    excerpt:
      'Addressing the unique mental health challenges faced by mariners and the resources available for support.',
    author: 'Dr. James Rodriguez',
    authorRole: 'Maritime Psychologist',
    date: '2024-01-05',
    readTime: '12 min read',
    category: 'Wellness',
    featured: false,
    image: '/api/placeholder/800/400',
    tags: ['Mental Health', 'Wellness', 'Support'],
  },
];

const categories = [
  'All',
  'Career Transition',
  'Company News',
  'Wellness',
  'Industry Insights',
];

export default function FromTheTeamBlog() {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');

  const filteredBlogs = sampleBlogs.filter((blog) => {
    const matchesCategory =
      selectedCategory === 'All' || blog.category === selectedCategory;
    const matchesSearch =
      blog.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      blog.excerpt.toLowerCase().includes(searchTerm.toLowerCase()) ||
      blog.tags.some((tag) =>
        tag.toLowerCase().includes(searchTerm.toLowerCase())
      );
    return matchesCategory && matchesSearch;
  });

  const featuredBlog = sampleBlogs.find((blog) => blog.featured);
  const regularBlogs = filteredBlogs.filter((blog) => !blog.featured);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-purple-600/20" />

        {/* Animated background elements */}
        <div className="absolute top-20 left-10 w-20 h-20 bg-blue-400/10 rounded-full blur-xl animate-pulse" />
        <div
          className="absolute top-40 right-20 w-32 h-32 bg-purple-400/10 rounded-full blur-xl animate-pulse"
          style={{ animationDelay: '1s' }}
        />
        <div
          className="absolute bottom-20 left-1/4 w-16 h-16 bg-cyan-400/10 rounded-full blur-xl animate-pulse"
          style={{ animationDelay: '2s' }}
        />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          {/* Breadcrumb */}
          <div className="flex items-center text-white/70 text-sm mb-8">
            <Link href="/" className="hover:text-white transition-colors">
              Home
            </Link>
            <span className="mx-2">→</span>
            <Link href="/blogs" className="hover:text-white transition-colors">
              Blogs
            </Link>
            <span className="mx-2">→</span>
            <span className="text-white">From the Team</span>
          </div>

          {/* Hero Content */}
          <div className="text-center mb-16">
            <div className="inline-flex items-center bg-blue-500/20 text-blue-300 px-6 py-3 rounded-full text-sm font-medium mb-8 backdrop-blur-sm border border-blue-400/30">
              <span className="w-2 h-2 bg-blue-400 rounded-full mr-3 animate-pulse"></span>
              Direct from the CIVSail Team
            </div>

            <h1 className="text-5xl lg:text-7xl font-bold text-white mb-6 leading-tight">
              From the
              <span className="block bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
                Team
              </span>
            </h1>

            <p className="text-xl text-white/80 leading-relaxed max-w-3xl mx-auto mb-8">
              Insights, stories, and expertise from mariners who've been where
              you are. Real experiences, practical advice, and honest
              conversations about life at sea and beyond.
            </p>

            {/* Search and Filter */}
            <div className="max-w-4xl mx-auto">
              <div className="flex flex-col md:flex-row gap-4 mb-8">
                {/* Search Bar */}
                <div className="flex-1 relative">
                  <input
                    type="text"
                    placeholder="Search articles, topics, or tags..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full px-6 py-4 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all"
                  />
                  <svg
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-white/60"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                    />
                  </svg>
                </div>
              </div>

              {/* Category Filter */}
              <div className="flex flex-wrap justify-center gap-3">
                {categories.map((category) => (
                  <button
                    key={category}
                    onClick={() => setSelectedCategory(category)}
                    className={`px-6 py-3 rounded-xl font-medium transition-all duration-300 ${
                      selectedCategory === category
                        ? 'bg-blue-500 text-white shadow-lg shadow-blue-500/25'
                        : 'bg-white/10 text-white/80 hover:bg-white/20 border border-white/20'
                    }`}
                  >
                    {category}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Featured Article */}
        {featuredBlog && selectedCategory === 'All' && !searchTerm && (
          <div className="mb-20">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-white mb-4">
                Featured Article
              </h2>
              <div className="w-24 h-1 bg-gradient-to-r from-blue-400 to-cyan-400 mx-auto"></div>
            </div>

            <div className="bg-white/5 backdrop-blur-lg border border-white/20 rounded-3xl overflow-hidden group hover:bg-white/10 transition-all duration-500">
              <div className="grid lg:grid-cols-2 gap-0">
                <div className="relative overflow-hidden">
                  <div className="aspect-video bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                    <span className="text-6xl">📝</span>
                  </div>
                  <div className="absolute top-4 left-4">
                    <span className="bg-yellow-500 text-black px-3 py-1 rounded-full text-sm font-medium">
                      Featured
                    </span>
                  </div>
                </div>

                <div className="p-8 lg:p-12 flex flex-col justify-center">
                  <div className="flex items-center gap-3 mb-4">
                    <span className="bg-blue-500/20 text-blue-300 px-3 py-1 rounded-full text-sm">
                      {featuredBlog.category}
                    </span>
                    <span className="text-white/60 text-sm">
                      {featuredBlog.readTime}
                    </span>
                  </div>

                  <h3 className="text-3xl font-bold text-white mb-4 group-hover:text-blue-300 transition-colors">
                    {featuredBlog.title}
                  </h3>

                  <p className="text-white/80 leading-relaxed mb-6">
                    {featuredBlog.excerpt}
                  </p>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center mr-4">
                        <span className="text-white font-bold">
                          {featuredBlog.author
                            .split(' ')
                            .map((n) => n[0])
                            .join('')}
                        </span>
                      </div>
                      <div>
                        <div className="text-white font-medium">
                          {featuredBlog.author}
                        </div>
                        <div className="text-white/60 text-sm">
                          {featuredBlog.authorRole}
                        </div>
                      </div>
                    </div>

                    <Link
                      href={`/blogs/from-the-team/${featuredBlog.id}`}
                      className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-xl font-medium transition-all duration-300 flex items-center group/btn"
                    >
                      Read Article
                      <svg
                        className="w-4 h-4 ml-2 group-hover/btn:translate-x-1 transition-transform"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M17 8l4 4m0 0l-4 4m4-4H3"
                        />
                      </svg>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Articles Grid */}
        <div className="mb-16">
          {(selectedCategory !== 'All' || searchTerm || !featuredBlog) && (
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-white mb-4">
                {searchTerm
                  ? `Search Results for "${searchTerm}"`
                  : selectedCategory === 'All'
                  ? 'All Articles'
                  : selectedCategory}
              </h2>
              <div className="w-24 h-1 bg-gradient-to-r from-blue-400 to-cyan-400 mx-auto"></div>
            </div>
          )}

          {filteredBlogs.length === 0 ? (
            <div className="text-center py-16">
              <div className="text-6xl mb-4">🔍</div>
              <h3 className="text-2xl font-bold text-white mb-4">
                No Articles Found
              </h3>
              <p className="text-white/70">
                Try adjusting your search or filter criteria.
              </p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {regularBlogs.map((blog, index) => (
                <article
                  key={blog.id}
                  className="bg-white/5 backdrop-blur-lg border border-white/20 rounded-2xl overflow-hidden group hover:bg-white/10 transition-all duration-500 hover:-translate-y-2"
                  style={{
                    opacity: 0,
                    animation: `fadeInUp 0.6s ease-out ${
                      index * 0.1
                    }s forwards`,
                  }}
                >
                  <div className="relative">
                    <div className="aspect-video bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                      <span className="text-4xl">📖</span>
                    </div>
                    <div className="absolute top-4 left-4">
                      <span className="bg-blue-500/80 text-white px-3 py-1 rounded-full text-sm backdrop-blur-sm">
                        {blog.category}
                      </span>
                    </div>
                  </div>

                  <div className="p-6">
                    <div className="flex items-center gap-2 mb-4 text-sm text-white/60">
                      <span>{new Date(blog.date).toLocaleDateString()}</span>
                      <span>•</span>
                      <span>{blog.readTime}</span>
                    </div>

                    <h3 className="text-xl font-bold text-white mb-3 group-hover:text-blue-300 transition-colors line-clamp-2">
                      {blog.title}
                    </h3>

                    <p className="text-white/80 mb-4 line-clamp-3">
                      {blog.excerpt}
                    </p>

                    <div className="flex items-center mb-4">
                      <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center mr-3">
                        <span className="text-white text-sm font-bold">
                          {blog.author
                            .split(' ')
                            .map((n) => n[0])
                            .join('')}
                        </span>
                      </div>
                      <div>
                        <div className="text-white font-medium text-sm">
                          {blog.author}
                        </div>
                        <div className="text-white/60 text-xs">
                          {blog.authorRole}
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-2 mb-4">
                      {blog.tags.map((tag) => (
                        <span
                          key={tag}
                          className="bg-white/10 text-white/70 px-2 py-1 rounded-md text-xs"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>

                    <Link
                      href={`/blogs/from-the-team/${blog.id}`}
                      className="inline-flex items-center text-blue-400 hover:text-blue-300 font-medium transition-colors group/link"
                    >
                      Read More
                      <svg
                        className="w-4 h-4 ml-1 group-hover/link:translate-x-1 transition-transform"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M17 8l4 4m0 0l-4 4m4-4H3"
                        />
                      </svg>
                    </Link>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>

        {/* Newsletter Signup */}
        <div className="bg-gradient-to-r from-blue-600/20 to-purple-600/20 backdrop-blur-lg border border-white/20 rounded-3xl p-8 lg:p-12 text-center">
          <div className="max-w-3xl mx-auto">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-400 to-purple-500 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <span className="text-2xl">📬</span>
            </div>

            <h3 className="text-3xl font-bold text-white mb-4">
              Stay Connected with the Team
            </h3>

            <p className="text-white/80 mb-8 leading-relaxed">
              Get the latest insights, stories, and maritime industry updates
              delivered straight to your inbox. No spam, just valuable content
              from mariners who understand your journey.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-4 py-3 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
              <button className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-xl font-medium transition-all duration-300 hover:-translate-y-1">
                Subscribe
              </button>
            </div>

            <p className="text-white/60 text-sm mt-4">
              Join 2,500+ mariners already subscribed
            </p>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }

        .line-clamp-3 {
          display: -webkit-box;
          -webkit-line-clamp: 3;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
      `}</style>
    </div>
  );
}
