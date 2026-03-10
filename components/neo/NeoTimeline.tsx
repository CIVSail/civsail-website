/**
 * @file NeoTimeline.tsx
 * @description The complete vertical timeline for the NEO journey
 *
 * @purpose Display all timeline sections in order, showing the full journey
 *          from getting a NEO date to arriving at the first ship
 */

import { TimelineSection } from './TimelineSection';
import { timelineSections } from '@/lib/neo/articles';

export function NeoTimeline() {
  return (
    <div className="relative">
      {/* Journey header with mini visual */}
      <div className="mb-8 text-center">
        <h2 className="text-2xl font-bold text-white mb-4">Your Journey</h2>
        <div className="flex items-center justify-center gap-2">
          {timelineSections.map((section, index) => (
            <div key={section.id} className="flex items-center">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-600/80 text-xs font-bold text-white">
                {section.id}
              </div>
              {index < timelineSections.length - 1 && (
                <div className="h-0.5 w-4 md:w-6 bg-blue-500/40" />
              )}
            </div>
          ))}
        </div>
        <p className="mt-4 text-sm text-slate-400">
          Click on any section to learn more about that stage
        </p>
      </div>

      {/* Vertical timeline */}
      <div className="relative">
        {timelineSections.map((section, index) => (
          <TimelineSection
            key={section.id}
            section={section}
            isLast={index === timelineSections.length - 1}
          />
        ))}
      </div>
    </div>
  );
}
