/**
 * @file TimelineNode.tsx
 * @description Timeline node/circle component for the vertical timeline
 *
 * @purpose Display numbered nodes on the timeline with visual connection line
 */

interface TimelineNodeProps {
  number: number;
  isLast?: boolean;
}

export function TimelineNode({ number, isLast = false }: TimelineNodeProps) {
  return (
    <div className="relative flex flex-col items-center">
      {/* The node circle */}
      <div className="z-10 flex h-12 w-12 items-center justify-center rounded-full border-2 border-blue-400 bg-blue-600 font-bold text-white shadow-lg shadow-blue-500/30">
        {number}
      </div>

      {/* Connecting line to next node */}
      {!isLast && (
        <div className="absolute top-12 h-full w-0.5 bg-gradient-to-b from-blue-500/50 to-blue-500/20" />
      )}
    </div>
  );
}
