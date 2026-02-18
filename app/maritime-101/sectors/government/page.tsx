'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { Shield, ArrowLeft, ArrowRight, Clock, DollarSign, Award } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { SectorFeedbackForm } from '@/components/sectors/SectorFeedbackForm';

export default function GovernmentSectorPage() {
  const sector = {
    title: 'Government',
    subtitle: 'MSC, NOAA & Federal Maritime',
    icon: Shield,
    color: 'emerald',
    description: 'Federal maritime service supporting military operations (MSC), scientific research (NOAA), and other government missions. Exceptional benefits, job security, and mission-driven work.',
    stats: { rotation: '4-6 months', pay: 'Federal GS/WG scale', benefits: 'FERS, TSP, Health' },
    content: [
      'Military Sealift Command (MSC) career pathways',
      'CIVMAR positions: what they are and how to apply',
      'MSC vessel types: T-AKE, T-AO, T-AH, and more',
      'Federal benefits: FERS retirement, health insurance, TSP',
      'NOAA Corps opportunities and research vessels',
      'Army Corps of Engineers maritime positions',
      'Security clearance requirements and process',
      'Advancement from entry-level to senior positions',
    ],
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      {/* Breadcrumbs */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        <nav className="flex items-center text-sm text-slate-400">
          <Link href="/" className="hover:text-white transition-colors">Home</Link>
          <span className="mx-2">/</span>
          <Link href="/maritime-101" className="hover:text-white transition-colors">Maritime 101</Link>
          <span className="mx-2">/</span>
          <Link href="/maritime-101/careers-and-sectors" className="hover:text-white transition-colors">Careers & Sectors</Link>
          <span className="mx-2">/</span>
          <span className="text-white">{sector.title}</span>
        </nav>
      </div>

      {/* Hero */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-28">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center max-w-3xl mx-auto"
        >
          <div className={`inline-flex p-4 rounded-2xl bg-${sector.color}-500/20 border border-${sector.color}-500/30 mb-8`}>
            <sector.icon className={`w-12 h-12 text-${sector.color}-400`} />
          </div>
          
          <Badge className="mb-6 bg-amber-500/20 text-amber-400 border-amber-500/50">
            Coming Soon
          </Badge>
          
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-4">
            {sector.title}
          </h1>
          <p className={`text-xl text-${sector.color}-400 mb-6`}>{sector.subtitle}</p>
          
          <p className="text-lg text-slate-300 mb-8 leading-relaxed">
            {sector.description}
          </p>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-4 max-w-md mx-auto mb-12">
            <div className="text-center p-4 bg-slate-900 rounded-lg border border-slate-800">
              <Clock className="w-5 h-5 text-slate-500 mx-auto mb-2" />
              <div className="text-xs text-slate-500 mb-1">Rotation</div>
              <div className="text-sm text-white font-medium">{sector.stats.rotation}</div>
            </div>
            <div className="text-center p-4 bg-slate-900 rounded-lg border border-slate-800">
              <DollarSign className="w-5 h-5 text-slate-500 mx-auto mb-2" />
              <div className="text-xs text-slate-500 mb-1">Pay</div>
              <div className="text-sm text-white font-medium">{sector.stats.pay}</div>
            </div>
            <div className="text-center p-4 bg-slate-900 rounded-lg border border-slate-800">
              <Award className="w-5 h-5 text-slate-500 mx-auto mb-2" />
              <div className="text-xs text-slate-500 mb-1">Benefits</div>
              <div className="text-sm text-white font-medium">{sector.stats.benefits}</div>
            </div>
          </div>

          {/* What to expect */}
          <Card className="p-8 bg-slate-900 border-slate-800 text-left mb-12">
            <h2 className="text-xl font-bold text-white mb-6">What You Will Find Here</h2>
            <div className="grid md:grid-cols-2 gap-4">
              {sector.content.map((item, idx) => (
                <div key={idx} className="flex items-start gap-3">
                  <div className={`w-1.5 h-1.5 rounded-full bg-${sector.color}-400 mt-2 flex-shrink-0`} />
                  <span className="text-slate-300 text-sm">{item}</span>
                </div>
              ))}
            </div>
          </Card>

          <SectorFeedbackForm sectorTitle="Government" />

          {/* CTA */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/maritime-101/careers-and-sectors">
              <Button size="lg" className="bg-slate-800/50 text-slate-300 border border-slate-700 hover:bg-slate-700">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Careers & Sectors
              </Button>
            </Link>
          </div>
        </motion.div>
      </section>
    </div>
  );
}