/**
 * @file NeoDisclaimer.tsx
 * @description Disclaimer box for NEO help page
 *
 * @purpose Display important disclaimer that CIVSail is not officially affiliated
 *          with MSC and users should defer to official communications.
 */

import { AlertTriangle } from 'lucide-react';

export function NeoDisclaimer() {
  return (
    <div className="rounded-xl border border-yellow-500/30 bg-yellow-500/10 p-6">
      <div className="flex gap-4">
        <div className="flex-shrink-0">
          <AlertTriangle className="h-6 w-6 text-yellow-400" />
        </div>
        <div className="space-y-2">
          <h3 className="font-semibold text-yellow-300">Disclaimer</h3>
          <p className="text-sm leading-relaxed text-yellow-200/80">
            We are not officially affiliated with MSC. This site is run by former
            CIVMARs, with input from current CIVMARs, to share best practices and
            lessons learned. Please defer to all official communications from MSC
            for authoritative information.
          </p>
        </div>
      </div>
    </div>
  );
}
