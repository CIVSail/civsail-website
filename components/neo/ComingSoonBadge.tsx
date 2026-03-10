/**
 * @file ComingSoonBadge.tsx
 * @description Badge component for articles that are not yet published
 */

import { Clock } from 'lucide-react';

export function ComingSoonBadge() {
  return (
    <span className="inline-flex items-center gap-1 rounded-full bg-slate-600/50 px-2 py-0.5 text-xs font-medium text-slate-300">
      <Clock className="h-3 w-3" />
      Coming Soon
    </span>
  );
}
