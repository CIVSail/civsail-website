import { createClient } from '@/lib/supabase/server';
import { NextRequest, NextResponse } from 'next/server';

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
    
    if (!refNumber || !lastName) {
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
        ref_number: refNumber,
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
        ref_number: refNumber 
      })
      .eq('user_id', user.id);
    
    // TODO: Submit to NMC form (implement later - for now just monitor email)
    // For MVP, user will manually submit the NMC form
    
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