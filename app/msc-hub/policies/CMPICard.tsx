'use client';

/**
 * CMPICard Component
 * 
 * Displays a single CMPI policy as a clickable tile with:
 * - Large CMPI number badge
 * - Title and description
 * - Category badge
 * - Opens PDF in new tab when clicked
 */

import { ExternalLink, FileText } from 'lucide-react';
import { CMPIItem, CMPI_CATEGORY_CONFIG } from './cmpiData';

interface CMPICardProps {
  cmpi: CMPIItem;
}

export default function CMPICard({ cmpi }: CMPICardProps) {
  const categoryConfig = CMPI_CATEGORY_CONFIG[cmpi.category];
  
  // Build the PDF URL - files go in /public/policies/
  const pdfUrl = `/policies/${cmpi.filename}`;

  return (
    <a
      href={pdfUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="group block"
      aria-label={`Open CMPI ${cmpi.number} - ${cmpi.title} (PDF opens in new tab)`}
    >
      {/* Card Container */}
      <div className="
        relative h-full
        bg-white/5 backdrop-blur-lg 
        border border-white/20 
        rounded-2xl p-6
        transition-all duration-300 ease-out
        hover:bg-white/10 
        hover:border-white/30
        hover:scale-[1.02]
        hover:shadow-xl hover:shadow-blue-500/10
        cursor-pointer
      ">
        {/* Top Row: CMPI Number + Category Badge */}
        <div className="flex items-start justify-between mb-4">
          {/* CMPI Number Badge */}
          <div className="
            px-3 py-2
            bg-blue-500/20 
            rounded-xl 
            flex items-center gap-2
            transition-colors duration-300
            group-hover:bg-blue-500/30
          ">
            <FileText className="w-4 h-4 text-blue-400" />
            <span className="text-blue-300 font-bold text-sm">
              CMPI {cmpi.number}
            </span>
          </div>

          {/* Category Badge */}
          <span className={`
            text-xs font-medium px-2.5 py-1 
            rounded-full border
            ${categoryConfig.color}
          `}>
            {categoryConfig.label}
          </span>
        </div>

        {/* CMPI Title */}
        <h3 className="
          text-lg font-semibold text-white mb-2
          transition-colors duration-300
          group-hover:text-blue-300
        ">
          {cmpi.title}
        </h3>

        {/* CMPI Description */}
        <p className="
          text-white/60 text-sm leading-relaxed
          line-clamp-3
        ">
          {cmpi.description}
        </p>

        {/* "View Policy" indicator - appears on hover */}
        <div className="
          mt-4 pt-4 border-t border-white/10
          flex items-center justify-between
          opacity-0 translate-y-1
          transition-all duration-300
          group-hover:opacity-100 group-hover:translate-y-0
        ">
          <span className="text-sm text-blue-400 font-medium">
            View Policy
          </span>
          <ExternalLink className="w-4 h-4 text-blue-400" />
        </div>

        {/* Subtle glow effect on hover */}
        <div className="
          absolute inset-0 rounded-2xl
          bg-gradient-to-br from-blue-500/0 to-purple-500/0
          transition-all duration-300
          group-hover:from-blue-500/5 group-hover:to-purple-500/5
          pointer-events-none
        " />
      </div>
    </a>
  );
}