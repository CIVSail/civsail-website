import { createClient } from '@/lib/supabase/server';
import { NextRequest, NextResponse } from 'next/server';
import { submitNMCForm } from '@/lib/utils/nmc-form';

/**
 * POST /api/nmc-lookup
 * Trigger NMC verification for a user
 * 
 * Body: {
 *   refNumber: string,
 *   lastName: string,
 *   verificationType: 'onboarding' | 're-verification' | 'upgrade'
 * }
 */

// Use default resend receiving address bc it cost money to add the subdomain to resend
const SEND_TO_EMAIL = 'credentials@uuseluagra.resend.app'; 

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    
    // Get authenticated user
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json(
        { ok: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }
    
    // Parse request body
    const { refNumber, lastName, verificationType = 'onboarding' } = await request.json();

    const normalizedRefNumber = String(refNumber || '')
      .replace(/\D/g, '')
      .trim();
    
    if (!normalizedRefNumber || !lastName) {
      return NextResponse.json(
        { ok: false, error: 'Missing refNumber or lastName' },
        { status: 400 }
      );
    }
    
    // Check if there's already a pending verification
    const { data: existingVerification } = await supabase
      .from('nmc_verifications')
      .select('id, status')
      .eq('user_id', user.id)
      .eq('status', 'pending')
      .single();
    
    if (existingVerification) {
      return NextResponse.json({
        ok: true,
        message: 'Verification already in progress',
        verificationId: existingVerification.id
      });
    }
    
    // Create new verification request
    const { data: verification, error: insertError } = await supabase
      .from('nmc_verifications')
      .insert({
        user_id: user.id,
        ref_number: normalizedRefNumber,
        last_name: lastName,
        verification_type: verificationType,
        status: 'pending',
        requested_at: new Date().toISOString(),
        check_count: 0
      })
      .select()
      .single();
    
    if (insertError) {
      console.error('Error creating verification:', insertError);
      return NextResponse.json(
        { ok: false, error: 'Failed to create verification request' },
        { status: 500 }
      );
    }
    
    // Update profile verification status
    await supabase
      .from('profiles')
      .update({ 
        nmc_verification_status: 'pending',
        ref_number: normalizedRefNumber 
      })
      .eq('user_id', user.id);
    
    // Submit the NMC credential verification form automatically.
    // Non-fatal: the pending record is already in the DB, so the cron job
    // will still pick up the email whenever the submission eventually succeeds.
    const formResult = await submitNMCForm(lastName, refNumber, SEND_TO_EMAIL);
    if (!formResult.ok) {
      console.error('[nmc-lookup] NMC form submission failed:', formResult.error);
    }

    return NextResponse.json({
      ok: true,
      message: 'Verification requested. We\'ll check for your credentials in the next few minutes.',
      verificationId: verification.id
    });
    
  } catch (error) {
    console.error('Error in nmc-lookup:', error);
    return NextResponse.json(
      { ok: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}
