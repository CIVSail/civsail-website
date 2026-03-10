// app/tools/page.tsx
import Link from 'next/link';
import {
  Calculator,
  GitCompare,
  FileText,
  ClipboardList,
  ArrowRight,
  Sparkles,
} from 'lucide-react';
import ToolDisclaimer from '@/components/tools/ToolDisclaimer';

export const metadata = {
  title: 'Tools | CIVSail',
  description: 'Interactive tools for CIVMARs - calculators, generators, and more.',
};

const tools = [
  {
    id: 'ship-pay-calculator',
    name: 'Ship Pay Calculator',
    description: 'Estimate your total earnings based on position, ship type, overtime, and deductions. See your projected gross and net pay.',
    href: '/tools/ship-pay-calculator',
    icon: Calculator,
    color: 'blue',
  },
  {
    id: 'pay-comparison',
    name: 'Pay Comparison',
    description: 'Compare compensation between different ships and positions side-by-side. Find the best opportunity for your career.',
    href: '/tools/pay-comparison',
    icon: GitCompare,
    color: 'emerald',
  },
  {
    id: 'leave-chit',
    name: 'Leave Chit Generator',
    description: 'Generate properly formatted leave request forms. Fill in your details and download a ready-to-submit chit.',
    href: '/tools/leave-chit',
    icon: ClipboardList,
    color: 'amber',
  },
  {
    id: 'travel-claim',
    name: 'Travel Claim Generator',
    description: 'Create DD1351-2 travel voucher forms automatically. Input your travel details and generate a completed PDF.',
    href: '/tools/travel-claim',
    icon: FileText,
    color: 'purple',
  },
];

const colorClasses = {
  blue: {
    bg: 'bg-blue-50',
    border: 'border-blue-200',
    icon: 'bg-blue-600',
    text: 'text-blue-600',
    hover: 'hover:border-blue-300 hover:shadow-blue-100',
  },
  emerald: {
    bg: 'bg-emerald-50',
    border: 'border-emerald-200',
    icon: 'bg-emerald-600',
    text: 'text-emerald-600',
    hover: 'hover:border-emerald-300 hover:shadow-emerald-100',
  },
  amber: {
    bg: 'bg-amber-50',
    border: 'border-amber-200',
    icon: 'bg-amber-600',
    text: 'text-amber-600',
    hover: 'hover:border-amber-300 hover:shadow-amber-100',
  },
  purple: {
    bg: 'bg-purple-50',
    border: 'border-purple-200',
    icon: 'bg-purple-600',
    text: 'text-purple-600',
    hover: 'hover:border-purple-300 hover:shadow-purple-100',
  },
};

export default function ToolsPage() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 text-white">
        <div className="max-w-5xl mx-auto px-6 py-16 lg:py-20">
          <div className="flex items-center gap-2 text-blue-300 text-sm font-medium mb-4">
            <Sparkles className="w-4 h-4" />
            <span>Interactive Tools for CIVMARs</span>
          </div>
          
          <h1 className="text-4xl lg:text-5xl font-bold mb-4">
            CIVMAR Tools
          </h1>
          
          <p className="text-xl text-blue-100/80 max-w-2xl">
            Powerful calculators and generators to help you navigate MSC pay, 
            travel claims, leave requests, and more. Select a tool below to get started.
          </p>
        </div>
      </div>

      {/* Tools Grid */}
      <div className="max-w-5xl mx-auto px-6 py-12">
        <h2 className="text-lg font-semibold text-gray-900 mb-6">
          Available Tools
        </h2>
        
        <div className="grid md:grid-cols-2 gap-6">
          {tools.map((tool) => {
            const Icon = tool.icon;
            const colors = colorClasses[tool.color as keyof typeof colorClasses];
            
            return (
              <Link
                key={tool.id}
                href={tool.href}
                className={`group relative bg-white rounded-2xl border-2 ${colors.border} p-6 transition-all duration-300 hover:shadow-lg ${colors.hover}`}
              >
                {/* Icon */}
                <div className={`inline-flex p-3 rounded-xl ${colors.icon} text-white mb-4`}>
                  <Icon className="w-6 h-6" />
                </div>
                
                {/* Content */}
                <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
                  {tool.name}
                </h3>
                
                <p className="text-gray-600 mb-4 line-clamp-2">
                  {tool.description}
                </p>
                
                {/* CTA */}
                <div className={`inline-flex items-center gap-2 font-medium ${colors.text}`}>
                  <span>Open Tool</span>
                  <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                </div>
              </Link>
            );
          })}
        </div>

        {/* Disclaimer and Feedback */}
        <ToolDisclaimer />
      </div>
    </div>
  );
}