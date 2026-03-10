'use client';

import { useState } from 'react';
import { Star } from 'lucide-react';
import ReviewForm from './ReviewForm';

interface Review {
  id: string;
  name: string;
  review: string;
  rating: number;
  created_at: string;
}

interface ReviewsSectionProps {
  reviews: Review[];
}

export default function ReviewsSection({ reviews }: ReviewsSectionProps) {
  const [showForm, setShowForm] = useState(false);

  return (
    <section className="bg-white py-16 md:py-24">
      <div className="mx-auto max-w-6xl px-4">
        <div className="mb-12 text-center">
          <h2 className="mb-2 text-sm font-semibold uppercase tracking-wider text-[#3db4c0]">
            Testimonials
          </h2>
          <h3 className="mb-4 text-3xl font-bold text-[#1e3a5f] md:text-4xl">
            What Mariners Are Saying
          </h3>
        </div>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {reviews.map((review) => (
            <div
              key={review.id}
              className="rounded-2xl border border-gray-100 bg-white p-6 shadow-md"
            >
              <div className="mb-4 flex gap-1">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`h-5 w-5 ${
                      i < review.rating
                        ? 'fill-yellow-400 text-yellow-400'
                        : 'fill-gray-200 text-gray-200'
                    }`}
                  />
                ))}
              </div>

              <p className="mb-4 line-clamp-6 text-gray-600">
                &quot;{review.review}&quot;
              </p>

              <div className="flex items-center gap-3">
                <div className="flex size-10 items-center justify-center rounded-full bg-linear-to-br from-h3t-navy to-h3t-teal">
                  <span className="text-sm font-semibold text-white">
                    {review.name.charAt(0).toUpperCase()}
                  </span>
                </div>
                <div>
                  <p className="font-semibold text-[#1e3a5f]">{review.name}</p>
                  <p className="text-sm text-gray-500">
                    {new Date(review.created_at).toLocaleDateString('en-US', {
                      month: 'short',
                      year: 'numeric',
                    })}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-12 text-center">
          <button
            onClick={() => setShowForm(true)}
            className="rounded-full bg-[#1e3a5f] px-8 py-3 font-semibold text-white transition hover:bg-[#2a4a73]"
          >
            Share Your Experience
          </button>
        </div>

        {showForm && <ReviewForm onClose={() => setShowForm(false)} />}
      </div>
    </section>
  );
}
