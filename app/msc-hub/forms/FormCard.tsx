'use client';

/**
 * FormCard Component
 * 
 * Displays a single form as a clickable tile with:
 * - Icon (based on form type)
 * - Title and description
 * - Category badge
 * - Hover effects with smooth transitions
 * - Opens PDF in new tab when clicked
 */

import { 
  Calendar, 
  Heart, 
  GraduationCap, 
  FileText, 
  Anchor, 
  DollarSign,
  Users,
  Clipboard,
  Home,
  Shield,
  ExternalLink,
  type LucideIcon 
} from 'lucide-react';
import { FormItem, CATEGORY_CONFIG } from './formsData';

interface FormCardProps {
  form: FormItem;
}

// Map icon names to actual Lucide components
const ICON_MAP: Record<FormItem['icon'], LucideIcon> = {
  'calendar': Calendar,
  'heart': Heart,
  'graduation-cap': GraduationCap,
  'file-text': FileText,
  'anchor': Anchor,
  'dollar-sign': DollarSign,
  'users': Users,
  'clipboard': Clipboard,
  'home': Home,
  'shield': Shield,
};

export default function FormCard({ form }: FormCardProps) {
  const IconComponent = ICON_MAP[form.icon];
  const categoryConfig = CATEGORY_CONFIG[form.category];
  
  // Build the PDF URL - files go in /public/forms/
  const pdfUrl = `/forms/${form.filename}`;

  return (
    <a
      href={pdfUrl}
      target="_blank"           // Opens in new tab
      rel="noopener noreferrer" // Security best practice for target="_blank"
      className="group block"
      aria-label={`Open ${form.title} form (PDF opens in new tab)`}
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
        {/* Top Row: Icon + Category Badge */}
        <div className="flex items-start justify-between mb-4">
          {/* Form Icon */}
          <div className="
            w-12 h-12 
            bg-blue-500/20 
            rounded-xl 
            flex items-center justify-center
            transition-colors duration-300
            group-hover:bg-blue-500/30
          ">
            <IconComponent className="w-6 h-6 text-blue-400" />
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

        {/* Form Title */}
        <h3 className="
          text-lg font-semibold text-white mb-2
          transition-colors duration-300
          group-hover:text-blue-300
        ">
          {form.title}
        </h3>

        {/* Form Description */}
        <p className="
          text-white/60 text-sm leading-relaxed
          line-clamp-3
        ">
          {form.description}
        </p>

        {/* "Open Form" indicator - appears on hover */}
        <div className="
          mt-4 pt-4 border-t border-white/10
          flex items-center justify-between
          opacity-0 translate-y-1
          transition-all duration-300
          group-hover:opacity-100 group-hover:translate-y-0
        ">
          <span className="text-sm text-blue-400 font-medium">
            Open Form
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