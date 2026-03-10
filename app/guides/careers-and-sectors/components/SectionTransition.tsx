/**
 * SectionTransition - Visual divider between major page sections
 * 
 * Creates a smooth gradient fade to signal conceptual shifts
 * (e.g., from Careers to Sectors)
 */

export function SectionTransition() {
  return (
    <div className="h-24 md:h-32 bg-gradient-to-b from-white via-slate-50 to-slate-100" />
  );
}