'use client';

import { useState } from 'react';
import { X, Star } from 'lucide-react';

interface ReviewFormProps {
  onClose: () => void;
}

export default function ReviewForm({ onClose }: ReviewFormProps) {
  const [name, setName] = useState('');
  const [review, setReview] = useState('');
  const [rating, setRating] = useState(5);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');

    try {
      const res = await fetch('/api/submit-review', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, review, rating }),
      });

      const data = await res.json();

      if (!data.ok) {
        setError(data.message || 'Something went wrong');
        setIsSubmitting(false);
        return;
      }

      setSubmitted(true);
    } catch (err) {
      setError('Failed to submit review. Please try again.');
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="relative w-full max-w-lg rounded-2xl bg-white p-8 shadow-2xl">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 rounded-full p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-600"
        >
          <X className="h-5 w-5" />
        </button>

        {submitted ? (
          <div className="text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
              <svg
                className="h-8 w-8 text-green-500"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
            <h3 className="mb-2 text-xl font-bold text-[#1e3a5f]">
              Thank You!
            </h3>
            <p className="mb-6 text-gray-600">
              Your review has been submitted and will appear after approval.
            </p>
            <button
              onClick={onClose}
              className="rounded-full bg-[#1e3a5f] px-6 py-2 font-medium text-white hover:bg-[#2a4a73]"
            >
              Close
            </button>
          </div>
        ) : (
          <>
            <h3 className="mb-2 text-xl font-bold text-[#1e3a5f]">
              Share Your Experience
            </h3>
            <p className="mb-6 text-gray-600">
              Tell others about your experience with Mark Brown and High 3 Team.
            </p>

            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Rating
                </label>
                <div className="flex gap-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setRating(star)}
                      onMouseEnter={() => setHoveredRating(star)}
                      onMouseLeave={() => setHoveredRating(0)}
                      className="p-1"
                    >
                      <Star
                        className={`h-8 w-8 transition ${
                          star <= (hoveredRating || rating)
                            ? 'fill-yellow-400 text-yellow-400'
                            : 'fill-gray-200 text-gray-200'
                        }`}
                      />
                    </button>
                  ))}
                </div>
              </div>

              <div className="mb-4">
                <label
                  htmlFor="name"
                  className="mb-2 block text-sm font-medium text-gray-700"
                >
                  Your Name
                </label>
                <input
                  type="text"
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-[#3db4c0] focus:outline-none focus:ring-2 focus:ring-[#3db4c0]/20"
                  placeholder="John Doe"
                />
              </div>

              <div className="mb-6">
                <label
                  htmlFor="review"
                  className="mb-2 block text-sm font-medium text-gray-700"
                >
                  Your Review
                </label>
                <textarea
                  id="review"
                  value={review}
                  onChange={(e) => setReview(e.target.value)}
                  required
                  rows={4}
                  className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-[#3db4c0] focus:outline-none focus:ring-2 focus:ring-[#3db4c0]/20"
                  placeholder="Tell us about your experience..."
                />
              </div>

              {error && <p className="mb-4 text-sm text-red-500">{error}</p>}

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full rounded-full bg-[#1e3a5f] py-3 font-semibold text-white transition hover:bg-[#2a4a73] disabled:opacity-50"
              >
                {isSubmitting ? 'Submitting...' : 'Submit Review'}
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
}
