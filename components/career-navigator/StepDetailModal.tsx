'use client';

import React from 'react';
import { UpgradeProgress } from '@/types/career-navigator';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { CheckCircle2, XCircle, AlertCircle } from 'lucide-react';

interface StepDetailModalProps {
  step: UpgradeProgress | null;
  open: boolean;
  onClose: () => void;
}

/**
 * Detailed modal view for a single upgrade step
 */
export function StepDetailModal({ step, open, onClose }: StepDetailModalProps) {
  if (!step) return null;

  const formatCredentialName = (cred: string) => {
    return cred.split('_').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl">
            {formatCredentialName(step.step.from)} → {formatCredentialName(step.step.to)}
          </DialogTitle>
          <DialogDescription>{step.step.cfr_section}</DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="sea_service" className="mt-4">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="sea_service">Sea Service</TabsTrigger>
            <TabsTrigger value="courses">Courses</TabsTrigger>
            <TabsTrigger value="exam">Exam</TabsTrigger>
          </TabsList>

          {/* Sea Service Tab */}
          <TabsContent value="sea_service" className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 border rounded-lg">
                <div className="text-sm text-muted-foreground">Completed</div>
                <div className="text-2xl font-bold">{step.sea_service_completed_days} days</div>
              </div>
              <div className="p-4 border rounded-lg">
                <div className="text-sm text-muted-foreground">Required</div>
                <div className="text-2xl font-bold">{step.sea_service_required_days} days</div>
              </div>
            </div>

            <div className="space-y-2">
              <h4 className="font-semibold">Requirements:</h4>
              {step.step.sea_service_paths.map((path, idx) => (
                <div key={idx} className="p-3 bg-gray-50 rounded-lg text-sm">
                  {path.description}
                </div>
              ))}
            </div>

            <div className="space-y-2">
              <h4 className="font-semibold flex items-center gap-2">
                Status Checks
              </h4>
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  {step.recency_met ? (
                    <CheckCircle2 className="h-4 w-4 text-green-500" />
                  ) : (
                    <XCircle className="h-4 w-4 text-red-500" />
                  )}
                  <span className="text-sm">Recency (90 days in past 7 years, 45 on 1600+ GRT)</span>
                </div>
                <div className="flex items-center gap-2">
                  {step.tonnage_requirement_met ? (
                    <CheckCircle2 className="h-4 w-4 text-green-500" />
                  ) : (
                    <XCircle className="h-4 w-4 text-red-500" />
                  )}
                  <span className="text-sm">Tonnage (50% on 1600+ GRT for unlimited)</span>
                </div>
              </div>
            </div>

            {step.qualifying_periods.length > 0 && (
              <div>
                <h4 className="font-semibold mb-2">Qualifying Periods ({step.qualifying_periods.length})</h4>
                <div className="space-y-2 max-h-60 overflow-y-auto">
                  {step.qualifying_periods.map((period: any, idx: number) => (
                    <div key={idx} className="p-2 border rounded text-sm">
                      <div className="font-medium">{period.vessel_name}</div>
                      <div className="text-xs text-muted-foreground">
                        {formatDate(period.sign_on_date)} - {formatDate(period.sign_off_date)} • 
                        {period.days_served} days • {period.position_held}
                        {period.grt && ` • ${period.grt} GRT`}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </TabsContent>

          {/* Courses Tab */}
          <TabsContent value="courses" className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 border rounded-lg">
                <div className="text-sm text-muted-foreground">Completed</div>
                <div className="text-2xl font-bold">{step.courses_completed}</div>
              </div>
              <div className="p-4 border rounded-lg">
                <div className="text-sm text-muted-foreground">Required</div>
                <div className="text-2xl font-bold">{step.courses_required}</div>
              </div>
            </div>

            {step.missing_courses.length > 0 && (
              <div>
                <h4 className="font-semibold mb-2 flex items-center gap-2">
                  <AlertCircle className="h-4 w-4 text-amber-500" />
                  Missing Courses
                </h4>
                <div className="space-y-2">
                  {step.missing_courses.map((course, idx) => (
                    <div key={idx} className="p-3 border rounded-lg">
                      <div className="font-medium">{course.display_name}</div>
                      <div className="text-sm text-muted-foreground mt-1">{course.description}</div>
                      <Badge variant="outline" className="mt-2">{course.category.replace('_', ' ')}</Badge>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {step.expiring_soon_courses.length > 0 && (
              <div>
                <h4 className="font-semibold mb-2 flex items-center gap-2">
                  <AlertCircle className="h-4 w-4 text-red-500" />
                  Expiring Soon
                </h4>
                <div className="space-y-2">
                  {step.expiring_soon_courses.map((cert, idx) => (
                    <div key={idx} className="p-3 border border-red-200 rounded-lg bg-red-50">
                      <div className="font-medium">{cert.course_name}</div>
                      <div className="text-sm text-red-600 mt-1">
                        Expires: {cert.expiration_date ? formatDate(cert.expiration_date) : 'N/A'}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {step.missing_courses.length === 0 && step.expiring_soon_courses.length === 0 && (
              <div className="text-center py-8 text-muted-foreground">
                <CheckCircle2 className="h-12 w-12 mx-auto text-green-500 mb-2" />
                <p>All course requirements met!</p>
              </div>
            )}
          </TabsContent>

          {/* Exam Tab */}
          <TabsContent value="exam" className="space-y-4">
            <div className={`p-4 rounded-lg border ${
              step.exam_ready ? 'bg-green-50 border-green-200' : 'bg-gray-50'
            }`}>
              <div className="flex items-center gap-2 mb-2">
                {step.exam_ready ? (
                  <CheckCircle2 className="h-5 w-5 text-green-500" />
                ) : (
                  <AlertCircle className="h-5 w-5 text-amber-500" />
                )}
                <span className="font-semibold">
                  {step.exam_ready ? 'Ready for Exam!' : 'Not Yet Ready'}
                </span>
              </div>
              <p className="text-sm">{step.exam_notes}</p>
            </div>

            <div>
              <h4 className="font-semibold mb-2">Exam Type</h4>
              <Badge variant="secondary" className="text-sm">
                {step.step.exam_requirement.exam_type.replace('_', ' ').toUpperCase()}
              </Badge>
              <p className="text-sm mt-2 text-muted-foreground">
                {step.step.exam_requirement.description}
              </p>
            </div>

            {step.step.exam_requirement.exam_modules && step.step.exam_requirement.exam_modules.length > 0 && (
              <div>
                <h4 className="font-semibold mb-2">Exam Modules</h4>
                <ul className="space-y-1">
                  {step.step.exam_requirement.exam_modules.map((module, idx) => (
                    <li key={idx} className="text-sm flex items-center gap-2">
                      <span className="h-1.5 w-1.5 rounded-full bg-blue-500" />
                      {module}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}