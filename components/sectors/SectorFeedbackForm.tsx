'use client';

import { useState } from 'react';
import { Send, CheckCircle, AlertCircle } from 'lucide-react';

interface SectorFeedbackFormProps {
  sectorTitle: string;
}

type SubmitState = 'idle' | 'loading' | 'success' | 'error';

export function SectorFeedbackForm({ sectorTitle }: SectorFeedbackFormProps) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [state, setState] = useState<SubmitState>('idle');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) {
      setState('error');
      return;
    }

    setState('loading');
    try {
      const res = await fetch('/api/sector-feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sector: sectorTitle,
          name: name.trim() || undefined,
          email: email.trim() || undefined,
          message: message.trim(),
        }),
      });
      if (!res.ok) throw new Error('Failed to send');
      setState('success');
      setName('');
      setEmail('');
      setMessage('');
    } catch {
      setState('error');
    }
  };

  if (state === 'success') {
    return (
      <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-xl p-6 text-center">
        <CheckCircle className="h-8 w-8 text-emerald-400 mx-auto mb-3" />
        <p className="text-emerald-300 font-medium">Thanks for sharing your experience!</p>
        <p className="text-slate-400 text-sm mt-1">
          We&apos;ll review your submission and use it to build out this page.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white/[0.03] border border-white/10 rounded-xl p-6">
      <h3 className="text-lg font-semibold text-slate-100 mb-1">
        Work in this sector?
      </h3>
      <p className="text-sm text-slate-400 mb-5">
        Help us build this page. Share your experience — rotation schedules, pay,
        pros and cons, advice for newcomers. We&apos;ll use it to create an accurate guide.
      </p>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid sm:grid-cols-2 gap-4">
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Name (optional)"
            className="w-full px-4 py-2.5 rounded-lg bg-white/5 border border-white/10 text-slate-100 text-sm outline-none focus:border-blue-500/50 transition-colors placeholder:text-white/25"
          />
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email (optional, for follow-up)"
            className="w-full px-4 py-2.5 rounded-lg bg-white/5 border border-white/10 text-slate-100 text-sm outline-none focus:border-blue-500/50 transition-colors placeholder:text-white/25"
          />
        </div>

        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="What's it like working in this sector? Anything newcomers should know?"
          rows={4}
          className="w-full px-4 py-2.5 rounded-lg bg-white/5 border border-white/10 text-slate-100 text-sm outline-none focus:border-blue-500/50 transition-colors placeholder:text-white/25 resize-none"
        />

        {state === 'error' && (
          <div className="flex items-center gap-2 text-red-400 text-sm">
            <AlertCircle className="h-4 w-4" />
            Please write a message and try again.
          </div>
        )}

        <button
          type="submit"
          disabled={state === 'loading'}
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Send className="h-4 w-4" />
          {state === 'loading' ? 'Sending...' : 'Share Your Experience'}
        </button>
      </form>
    </div>
  );
}
