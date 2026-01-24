/**
 * @file PortsGlobeLoading.tsx
 * @description Loading skeleton for the ports globe
 *
 * Shown while Mapbox initializes and port data loads.
 * Matches the dark theme of the globe page.
 */

export default function PortsGlobeLoading() {
  return (
    <div className="relative w-full h-[600px] md:h-[700px] bg-slate-900 rounded-2xl overflow-hidden">
      {/* Pulsing globe outline */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="relative">
          {/* Outer glow ring */}
          <div className="absolute inset-0 rounded-full bg-blue-500/20 blur-xl animate-pulse" />

          {/* Globe circle */}
          <div className="w-64 h-64 md:w-80 md:h-80 rounded-full border-2 border-slate-700 bg-slate-800/50 animate-pulse">
            {/* Grid lines to suggest a globe */}
            <svg
              className="w-full h-full text-slate-700"
              viewBox="0 0 100 100"
              fill="none"
              stroke="currentColor"
              strokeWidth="0.5"
            >
              {/* Horizontal lines */}
              <ellipse cx="50" cy="25" rx="45" ry="8" />
              <ellipse cx="50" cy="50" rx="48" ry="15" />
              <ellipse cx="50" cy="75" rx="45" ry="8" />

              {/* Vertical lines */}
              <ellipse cx="50" cy="50" rx="8" ry="48" />
              <ellipse cx="50" cy="50" rx="25" ry="48" />
              <ellipse cx="50" cy="50" rx="40" ry="48" />
            </svg>
          </div>
        </div>
      </div>

      {/* Loading text */}
      <div className="absolute bottom-8 left-0 right-0 text-center">
        <div className="inline-flex items-center gap-3 px-6 py-3 bg-slate-800/80 backdrop-blur-sm rounded-full border border-slate-700">
          {/* Spinning dots */}
          <div className="flex gap-1">
            <span className="w-2 h-2 bg-blue-500 rounded-full animate-bounce [animation-delay:-0.3s]" />
            <span className="w-2 h-2 bg-blue-500 rounded-full animate-bounce [animation-delay:-0.15s]" />
            <span className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" />
          </div>
          <span className="text-slate-300 font-medium">Loading ports...</span>
        </div>
      </div>

      {/* Subtle star background */}
      <div className="absolute inset-0 pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-white/30 rounded-full animate-pulse"
            style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 2}s`,
            }}
          />
        ))}
      </div>
    </div>
  );
}
