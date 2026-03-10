'use client';

import { useState } from 'react';
import { Send } from 'lucide-react';

export default function QuestionForm() {
  const [question, setQuestion] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');

    try {
      const res = await fetch('/api/send-question', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question }),
      });

      const data = await res.json();

      if (!data.ok) {
        setError(data.message || 'Something went wrong');
        setIsSubmitting(false);
        return;
      }

      setSubmitted(true);
      setQuestion('');
    } catch (err) {
      setError('Failed to send question. Please try again.');
      setIsSubmitting(false);
    }
  };

  return (
    <section id="ask-question" className="bg-gradient-to-br from-[#1e3a5f] to-[#2a4a73] py-16 md:py-24">
      <div className="mx-auto max-w-3xl px-4 text-center">
        <h2 className="mb-2 text-sm font-semibold uppercase tracking-wider text-[#3db4c0]">
          Have a Question?
        </h2>
        <h3 className="mb-4 text-3xl font-bold text-white md:text-4xl">
          What Should Mark Cover Next?
        </h3>
        <p className="mb-8 text-white/80">
          Submit your retirement questions and they may be answered in a future 
          Final Muster article.
        </p>

        {submitted ? (
          <div className="rounded-2xl bg-white/10 p-8">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-[#3db4c0]">
              <svg
                className="h-8 w-8 text-white"
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
            <h4 className="mb-2 text-xl font-bold text-white">Question Sent!</h4>
            <p className="mb-6 text-white/80">
              Thanks for your question. Mark will review it for a future article.
            </p>
            <button
              onClick={() => setSubmitted(false)}
              className="rounded-full bg-white px-6 py-2 font-medium text-[#1e3a5f] hover:bg-gray-100"
            >
              Ask Another Question
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="mx-auto max-w-xl">
            <textarea
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              required
              rows={4}
              className="mb-4 w-full rounded-xl border-0 px-4 py-3 text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#3db4c0]"
              placeholder="What retirement topic would you like Mark to cover? What questions do you have about FERS, TSP, military buybacks, or your LES?"
            />

            {error && (
              <p className="mb-4 text-sm text-red-300">{error}</p>
            )}

            <button
              type="submit"
              disabled={isSubmitting}
              className="inline-flex items-center gap-2 rounded-full bg-[#3db4c0] px-8 py-3 font-semibold text-white transition hover:bg-[#35a0ab] disabled:opacity-50"
            >
              {isSubmitting ? (
                'Sending...'
              ) : (
                <>
                  <Send className="h-4 w-4" />
                  Send Question
                </>
              )}
            </button>
          </form>
        )}
      </div>
    </section>
  );
}