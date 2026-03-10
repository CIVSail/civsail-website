/**
 * @file PortsGlobeError.tsx
 * @description Error fallback when the globe fails to load
 *
 * Shown when WebGL isn't supported, Mapbox token is invalid,
 * or any other error occurs during globe initialization.
 */

'use client';

import { AlertTriangle, List, RefreshCcw } from 'lucide-react';

interface PortsGlobeErrorProps {
  error?: Error;
  onRetry?: () => void;
  onViewList?: () => void;
}

export default function PortsGlobeError({
  error,
  onRetry,
  onViewList,
}: PortsGlobeErrorProps) {
  // Determine error type for helpful messaging
  const isWebGLError =
    error?.message?.toLowerCase().includes('webgl') ||
    error?.message?.toLowerCase().includes('gpu');

  const isTokenError = error?.message?.toLowerCase().includes('token');

  return (
    <div className="relative w-full h-[600px] md:h-[700px] bg-slate-900 rounded-2xl overflow-hidden">
      <div className="absolute inset-0 flex items-center justify-center p-8">
        <div className="max-w-md text-center">
          {/* Error icon */}
          <div className="inline-flex items-center justify-center w-16 h-16 mb-6 rounded-full bg-red-500/10 border border-red-500/30">
            <AlertTriangle className="w-8 h-8 text-red-400" />
          </div>

          {/* Error message */}
          <h3 className="text-xl font-semibold text-white mb-3">
            {isWebGLError
              ? "Globe View Unavailable"
              : isTokenError
                ? "Map Configuration Error"
                : "Unable to Load Globe"}
          </h3>

          <p className="text-slate-400 mb-6">
            {isWebGLError ? (
              <>
                Your browser or device doesn't support WebGL, which is required
                for the 3D globe view. You can still browse all ports in list
                view.
              </>
            ) : isTokenError ? (
              <>
                There's an issue with the map configuration. Please try
                refreshing the page or contact support if the problem persists.
              </>
            ) : (
              <>
                Something went wrong loading the interactive globe. This might
                be a temporary issue.
              </>
            )}
          </p>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            {onRetry && !isWebGLError && (
              <button
                onClick={onRetry}
                className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-slate-700 hover:bg-slate-600 text-white rounded-lg font-medium transition-colors"
              >
                <RefreshCcw className="w-4 h-4" />
                Try Again
              </button>
            )}

            {onViewList && (
              <button
                onClick={onViewList}
                className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors"
              >
                <List className="w-4 h-4" />
                View Ports as List
              </button>
            )}
          </div>

          {/* Debug info (development only) */}
          {process.env.NODE_ENV === 'development' && error && (
            <details className="mt-8 text-left">
              <summary className="text-slate-500 text-sm cursor-pointer hover:text-slate-400">
                Error details (dev only)
              </summary>
              <pre className="mt-2 p-4 bg-slate-800 rounded-lg text-xs text-red-400 overflow-auto max-h-32">
                {error.message}
                {error.stack && `\n\n${error.stack}`}
              </pre>
            </details>
          )}
        </div>
      </div>

      {/* Subtle background pattern */}
      <div className="absolute inset-0 opacity-5 pointer-events-none">
        <div
          className="w-full h-full"
          style={{
            backgroundImage: `radial-gradient(circle at center, #fff 1px, transparent 1px)`,
            backgroundSize: '30px 30px',
          }}
        />
      </div>
    </div>
  );
}
