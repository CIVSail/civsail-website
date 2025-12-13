'use client';

import React, { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import { User } from '@supabase/supabase-js';
import { CareerPathLadder } from '@/components/career-navigator/CareerPathLadder';
import { StepDetailModal } from '@/components/career-navigator/StepDetailModal';
import { QualifyingShipsSection } from '@/components/career-navigator/QualifyingShipsSection';
import { evaluateCareerPath } from '@/lib/career-navigator/career-path-evaluator';
import { findQualifyingShips } from '@/lib/career-navigator/ship-matcher';
import { CareerPathEvaluation, UpgradeProgress, CredentialLevel, Ship } from '@/types/career-navigator';
import { SeaServicePeriod } from '@/types/sea-service';
import { Loader2 } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

export default function CareerPathPage() {
  const supabase = createClient();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [evaluation, setEvaluation] = useState<CareerPathEvaluation | null>(null);
  const [qualifyingShips, setQualifyingShips] = useState<Ship[]>([]);
  const [selectedStep, setSelectedStep] = useState<UpgradeProgress | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Get current user
  useEffect(() => {
    async function getUser() {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
      if (!user) {
        setLoading(false);
      }
    }
    getUser();
  }, []);

  // Load career path when user is available
  useEffect(() => {
    if (user) {
      loadCareerPath();
    }
  }, [user]);

  async function loadCareerPath() {
    if (!user) return;

    try {
      setLoading(true);
      setError(null);

      // Load user's career goal (or default to 3/M → Master)
      const { data: goalData } = await supabase
        .from('career_goals')
        .select('*')
        .eq('user_id', user.id)
        .single();

      const currentCredential: CredentialLevel = goalData?.current_credential || 'third_mate';
      const targetCredential: CredentialLevel = goalData?.target_credential || 'master';

      // Load sea service
      const { data: seaServiceData } = await supabase
        .from('sea_service')
        .select('*')
        .eq('user_id', user.id)
        .order('sign_on_date', { ascending: false });

      // Load training certificates
      const { data: certificatesData } = await supabase
        .from('training_certificates')
        .select('*')
        .eq('user_id', user.id);

      // Load user profile for sea_days_per_year
      const { data: profileData } = await supabase
        .from('profiles')
        .select('sea_days_per_year')
        .eq('user_id', user.id)
        .single();

      const seaDaysPerYear = profileData?.sea_days_per_year || 200;

      // Evaluate career path
      const pathEvaluation = evaluateCareerPath(
        user.id,
        currentCredential,
        targetCredential,
        seaServiceData as SeaServicePeriod[] || [],
        certificatesData || [],
        seaDaysPerYear
      );

      setEvaluation(pathEvaluation);

      // Load qualifying ships
      const { data: shipsData } = await supabase
        .from('ships')
        .select('*');

      if (shipsData) {
        const matched = findQualifyingShips(shipsData as Ship[], targetCredential, 12);
        setQualifyingShips(matched);
      }

    } catch (err) {
      console.error('Error loading career path:', err);
      setError('Failed to load career path. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="container mx-auto py-8">
        <Alert>
          <AlertDescription>Please sign in to view your career path.</AlertDescription>
        </Alert>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto py-8">
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      </div>
    );
  }

  if (!evaluation) {
    return (
      <div className="container mx-auto py-8">
        <Alert>
          <AlertDescription>
            No career path configured. Please set up your career goals in settings.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 space-y-8">
      <CareerPathLadder 
        evaluation={evaluation} 
        onStepClick={setSelectedStep}
      />

      <QualifyingShipsSection ships={qualifyingShips} />

      <StepDetailModal
        step={selectedStep}
        open={!!selectedStep}
        onClose={() => setSelectedStep(null)}
      />
    </div>
  );
}