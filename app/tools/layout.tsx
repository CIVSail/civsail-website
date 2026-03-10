// app/tools/layout.tsx
'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Calculator,
  GitCompare,
  FileText,
  ClipboardList,
  ChevronLeft,
  ChevronRight,
  Menu,
  X,
  Wrench,
} from 'lucide-react';

// Tool navigation items
const tools = [
  {
    id: 'ship-pay-calculator',
    name: 'Ship Pay Calculator',
    description: 'Estimate your earnings',
    href: '/tools/ship-pay-calculator',
    icon: Calculator,
  },
  {
    id: 'pay-comparison',
    name: 'Pay Comparison',
    description: 'Compare ships & positions',
    href: '/tools/pay-comparison',
    icon: GitCompare,
  },
  {
    id: 'leave-chit',
    name: 'Leave Chit Generator',
    description: 'Generate leave requests',
    href: '/tools/leave-chit',
    icon: ClipboardList,
  },
  {
    id: 'travel-claim',
    name: 'Travel Claim Generator',
    description: 'Create DD1351-2 forms',
    href: '/tools/travel-claim',
    icon: FileText,
  },
];

export default function ToolsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Check if we're on the main tools page
  const isToolsHome = pathname === '/tools';

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile Header */}
      <div className="lg:hidden bg-white border-b border-gray-200 sticky top-0 z-40">
        <div className="flex items-center justify-between px-4 py-3">
          <div className="flex items-center gap-3">
            <Wrench className="w-5 h-5 text-blue-600" />
            <span className="font-semibold text-gray-900">CIVMAR Tools</span>
          </div>
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
          >
            {mobileMenuOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </button>
        </div>

        {/* Mobile Navigation Dropdown */}
        {mobileMenuOpen && (
          <div className="border-t border-gray-100 bg-white px-4 py-3 space-y-1">
            {tools.map((tool) => {
              const isActive = pathname === tool.href;
              const Icon = tool.icon;
              return (
                <Link
                  key={tool.id}
                  href={tool.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center gap-3 px-3 py-3 rounded-lg transition-all ${
                    isActive
                      ? 'bg-blue-50 text-blue-700 border border-blue-200'
                      : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <Icon className={`w-5 h-5 ${isActive ? 'text-blue-600' : 'text-gray-400'}`} />
                  <div>
                    <div className="font-medium">{tool.name}</div>
                    <div className="text-xs text-gray-500">{tool.description}</div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>

      <div className="flex">
        {/* Desktop Sidebar */}
        <aside
          className={`hidden lg:flex flex-col bg-white border-r border-gray-200 sticky top-0 h-screen transition-all duration-300 ${
            sidebarCollapsed ? 'w-20' : 'w-72'
          }`}
        >
          {/* Sidebar Header */}
          <div className="flex items-center justify-between p-4 border-b border-gray-100">
            {!sidebarCollapsed && (
              <div className="flex items-center gap-3">
                <div className="bg-gradient-to-br from-blue-600 to-blue-700 p-2 rounded-xl">
                  <Wrench className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h2 className="font-bold text-gray-900">CIVMAR Tools</h2>
                  <p className="text-xs text-gray-500">Calculators & Generators</p>
                </div>
              </div>
            )}
            {sidebarCollapsed && (
              <div className="mx-auto bg-gradient-to-br from-blue-600 to-blue-700 p-2 rounded-xl">
                <Wrench className="w-5 h-5 text-white" />
              </div>
            )}
          </div>

          {/* Collapse Toggle */}
          <button
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
            className="absolute -right-3 top-20 bg-white border border-gray-200 rounded-full p-1.5 shadow-sm hover:shadow-md transition-shadow"
          >
            {sidebarCollapsed ? (
              <ChevronRight className="w-4 h-4 text-gray-600" />
            ) : (
              <ChevronLeft className="w-4 h-4 text-gray-600" />
            )}
          </button>

          {/* Navigation */}
          <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
            {tools.map((tool) => {
              const isActive = pathname === tool.href;
              const Icon = tool.icon;

              return (
                <Link
                  key={tool.id}
                  href={tool.href}
                  className={`group flex items-center gap-3 px-3 py-3 rounded-xl transition-all duration-200 ${
                    isActive
                      ? 'bg-gradient-to-r from-blue-50 to-blue-100/50 text-blue-700 shadow-sm border border-blue-200/50'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                  }`}
                  title={sidebarCollapsed ? tool.name : undefined}
                >
                  <div
                    className={`flex-shrink-0 p-2 rounded-lg transition-colors ${
                      isActive
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-100 text-gray-500 group-hover:bg-gray-200 group-hover:text-gray-700'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                  </div>
                  {!sidebarCollapsed && (
                    <div className="min-w-0 flex-1">
                      <div className="font-medium truncate">{tool.name}</div>
                      <div className="text-xs text-gray-500 truncate">
                        {tool.description}
                      </div>
                    </div>
                  )}
                  {!sidebarCollapsed && isActive && (
                    <div className="w-1.5 h-8 bg-blue-600 rounded-full" />
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Sidebar Footer */}
          {!sidebarCollapsed && (
            <div className="p-4 border-t border-gray-100">
              <Link
                href="/msc-hub"
                className="flex items-center justify-center gap-2 text-sm text-gray-500 hover:text-blue-600 transition-colors"
              >
                <ChevronLeft className="w-4 h-4" />
                Back to MSC Hub
              </Link>
            </div>
          )}
        </aside>

        {/* Main Content */}
        <main className="flex-1 min-h-screen">
          {children}
        </main>
      </div>
    </div>
  );
}