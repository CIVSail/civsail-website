'use client';

import React from 'react';
import { CareerPathEvaluation, UpgradeProgress } from '@/types/career-navigator';
import { CheckCircle2, Circle, Clock, BookOpen, Ship } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';

interface CareerPathLadderProps {
  evaluation: CareerPathEvaluation;
  onStepClick: (step: UpgradeProgress) => void;
}

/**
 * Visual ladder showing progression from current to target credential
 */
export function CareerPathLadder({ evaluation, onStepClick }: CareerPathLadderProps) {
  const formatCredentialName = (cred: string) => {
    return cred
      .split('_')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  const getStepStatus = (step: UpgradeProgress): 'complete' | 'in_progress' | 'not_started' => {
    if (step.sea_service_percentage >= 100 && step.courses_percentage >= 100) {
      return 'complete';
    }
    if (step.sea_service_percentage > 0 || step.courses_percentage > 0) {
      return 'in_progress';
    }
    return 'not_started';
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Your Career Path</h2>
          <p className="text-muted-foreground mt-1">
            {formatCredentialName(evaluation.current_credential)} → {formatCredentialName(evaluation.target_credential)}
          </p>
        </div>
        <div className="text-right">
          <div className="text-sm text-muted-foreground">Estimated Time</div>
          <div className="text-2xl font-bold">
            {evaluation.total_estimated_years.toFixed(1)} years
          </div>
          <div className="text-xs text-muted-foreground">
            (~{evaluation.total_estimated_days} sea days)
          </div>
        </div>
      </div>

      {/* Upgrade Steps */}
      <div className="space-y-4">
        {evaluation.upgrade_steps.map((step, index) => {
          const status = getStepStatus(step);
          const isComplete = status === 'complete';
          const isInProgress = status === 'in_progress';

          return (
            <Card 
              key={index}
              className={`cursor-pointer transition-all hover:shadow-md ${
                isComplete ? 'border-green-500 bg-green-50' : 
                isInProgress ? 'border-blue-500' : ''
              }`}
              onClick={() => onStepClick(step)}
            >
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    {isComplete ? (
                      <CheckCircle2 className="h-6 w-6 text-green-500" />
                    ) : (
                      <Circle className={`h-6 w-6 ${isInProgress ? 'text-blue-500' : 'text-gray-300'}`} />
                    )}
                    <div>
                      <CardTitle className="text-lg">
                        {formatCredentialName(step.step.from)} → {formatCredentialName(step.step.to)}
                      </CardTitle>
                      <CardDescription className="text-xs mt-1">
                        {step.step.cfr_section}
                      </CardDescription>
                    </div>
                  </div>
                  
                  {!isComplete && (
                    <Badge variant={isInProgress ? 'default' : 'secondary'}>
                      {isInProgress ? 'In Progress' : 'Not Started'}
                    </Badge>
                  )}
                </div>
              </CardHeader>

              <CardContent className="space-y-4">
                {/* Sea Service Progress */}
                <div>
                  <div className="flex items-center justify-between text-sm mb-2">
                    <div className="flex items-center gap-2">
                      <Ship className="h-4 w-4" />
                      <span className="font-medium">Sea Service</span>
                    </div>
                    <span className="text-muted-foreground">
                      {step.sea_service_completed_days} / {step.sea_service_required_days} days
                    </span>
                  </div>
                  <Progress value={Math.min(100, step.sea_service_percentage)} className="h-2" />
                  
                  {!step.recency_met && (
                    <p className="text-xs text-amber-600 mt-1">⚠️ Recency requirement not met</p>
                  )}
                  {!step.tonnage_requirement_met && (
                    <p className="text-xs text-amber-600 mt-1">⚠️ Need more time on 1600+ GRT vessels</p>
                  )}
                </div>

                {/* Course Progress */}
                <div>
                  <div className="flex items-center justify-between text-sm mb-2">
                    <div className="flex items-center gap-2">
                      <BookOpen className="h-4 w-4" />
                      <span className="font-medium">Required Courses</span>
                    </div>
                    <span className="text-muted-foreground">
                      {step.courses_completed} / {step.courses_required} completed
                    </span>
                  </div>
                  <Progress value={Math.min(100, step.courses_percentage)} className="h-2" />
                  
                  {step.missing_courses.length > 0 && (
                    <p className="text-xs text-amber-600 mt-1">
                      Missing: {step.missing_courses.slice(0, 2).map(c => c.display_name).join(', ')}
                      {step.missing_courses.length > 2 && ` +${step.missing_courses.length - 2} more`}
                    </p>
                  )}
                </div>

                {/* Time Estimate */}
                {!isComplete && (
                  <div className="flex items-center gap-2 text-sm text-muted-foreground pt-2 border-t">
                    <Clock className="h-4 w-4" />
                    <span>
                      ~{step.estimated_days_remaining} days remaining 
                      ({(step.estimated_days_remaining / 200).toFixed(1)} years at 200 days/year)
                    </span>
                  </div>
                )}

                {/* Exam Status */}
                <div className="text-sm">
                  <span className="font-medium">Exam: </span>
                  <span className={step.exam_ready ? 'text-green-600' : 'text-muted-foreground'}>
                    {step.exam_notes}
                  </span>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Next Actions */}
      {evaluation.next_action_items.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Next Steps</CardTitle>
            <CardDescription>Priority actions to move forward</CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {evaluation.next_action_items.map((action, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <span className="text-blue-500 font-bold">{idx + 1}.</span>
                  <span className="text-sm">{action}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}
    </div>
  );
}