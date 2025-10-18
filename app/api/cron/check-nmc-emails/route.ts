import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { searchNMCEmails, getEmailContent, markEmailAsRead } from '@/lib/gmail/client';
import { parseNMCEmail, detectDiscrepancies } from '@/lib/utils/nmc-parser';

// Use service role key for cron jobs
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

/**
 * GET /api/cron/check-nmc-emails
 * Vercel Cron job to check Gmail for NMC responses
 * Runs every 1 minute
 * 
 * Protected by CRON_SECRET header
 */
export async function GET(request: NextRequest) {
  // Verify cron secret
  const authHeader = request.headers.get('authorization');
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  
  try {
    console.log('[NMC Cron] Starting email check...');
    
    // Get all pending verifications
    const { data: pendingVerifications, error: fetchError } = await supabase
      .from('nmc_verifications')
      .select('*')
      .eq('status', 'pending')
      .order('requested_at', { ascending: true });
    
    if (fetchError) {
      console.error('[NMC Cron] Error fetching pending verifications:', fetchError);
      return NextResponse.json({ error: 'Database error' }, { status: 500 });
    }
    
    if (!pendingVerifications || pendingVerifications.length === 0) {
      console.log('[NMC Cron] No pending verifications');
      return NextResponse.json({ message: 'No pending verifications', checked: 0 });
    }
    
    console.log(`[NMC Cron] Found ${pendingVerifications.length} pending verifications`);
    
    // Search for unread NMC emails
    const messageIds = await searchNMCEmails();
    console.log(`[NMC Cron] Found ${messageIds.length} unread NMC emails`);
    
    let processedCount = 0;
    let timedOutCount = 0;
    
    // Process each pending verification
    for (const verification of pendingVerifications) {
      const ageInMinutes = (Date.now() - new Date(verification.requested_at).getTime()) / (1000 * 60);
      
      // Determine if we should check this verification (based on age)
      let shouldCheck = false;
      
      if (verification.verification_type === 'onboarding') {
        // Aggressive checking for onboarding
        if (ageInMinutes < 5) shouldCheck = true; // Every 30 sec (cron runs every minute)
        else if (ageInMinutes < 15) shouldCheck = verification.check_count % 1 === 0; // Every 1 min
        else if (ageInMinutes < 30) shouldCheck = verification.check_count % 2 === 0; // Every 2 min
        else if (ageInMinutes < 60) shouldCheck = verification.check_count % 5 === 0; // Every 5 min
        else {
          // Timeout after 60 minutes
          await supabase
            .from('nmc_verifications')
            .update({ status: 'timeout' })
            .eq('id', verification.id);
          
          await supabase
            .from('profiles')
            .update({ nmc_verification_status: 'timeout' })
            .eq('user_id', verification.user_id);
          
          timedOutCount++;
          continue;
        }
      } else {
        // Relaxed checking for re-verification
        if (ageInMinutes < 120) shouldCheck = verification.check_count % 15 === 0; // Every 15 min
        else {
          // Timeout after 2 hours
          await supabase
            .from('nmc_verifications')
            .update({ status: 'timeout' })
            .eq('id', verification.id);
          
          timedOutCount++;
          continue;
        }
      }
      
      if (!shouldCheck) {
        continue; // Skip this check interval
      }
      
      // Increment check count
      await supabase
        .from('nmc_verifications')
        .update({ 
          check_count: verification.check_count + 1,
          last_checked_at: new Date().toISOString()
        })
        .eq('id', verification.id);
      
      // Look for matching email
      for (const messageId of messageIds) {
        const email = await getEmailContent(messageId);
        
        // Check if email matches this verification (by ref number)
        if (email.body.includes(`RefNum: ${verification.ref_number}`)) {
          console.log(`[NMC Cron] Found matching email for ref ${verification.ref_number}`);
          
          try {
            // Parse email
            const parsed = parseNMCEmail(email.body);
            
            // Get user's current profile
            const { data: profile } = await supabase
              .from('profiles')
              .select('mmc_exp, medical_exp')
              .eq('user_id', verification.user_id)
              .single();
            
            // Detect discrepancies
            const discrepancy = detectDiscrepancies(
              profile?.mmc_exp || null,
              profile?.medical_exp || null,
              parsed.mmcExpiration,
              parsed.medicalExpiration
            );
            
            // Update profile with NMC data
            await supabase
              .from('profiles')
              .update({
                mmc_exp: parsed.mmcExpiration,
                mmc_exp_nmc_verified: parsed.mmcExpiration,
                mmc_exp_user_entered: profile?.mmc_exp || null,
                medical_exp: parsed.medicalExpiration,
                medical_exp_nmc_verified: parsed.medicalExpiration,
                medical_exp_user_entered: profile?.medical_exp || null,
                nmc_verification_status: discrepancy.hasAnyDiscrepancy 
                  ? 'verified_needs_review' 
                  : 'verified',
                nmc_verified_at: new Date().toISOString()
              })
              .eq('user_id', verification.user_id);
            
            // Store credentials
            for (const cred of parsed.credentials) {
              await supabase
                .from('credentials')
                .upsert({
                  user_id: verification.user_id,
                  credential_type: cred.type,
                  endorsement_name: cred.name,
                  department: cred.department,
                  verified_by_nmc: true,
                  verified_at: new Date().toISOString()
                }, {
                  onConflict: 'user_id,endorsement_name'
                });
            }
            
            // Mark verification as completed
            await supabase
              .from('nmc_verifications')
              .update({
                status: 'completed',
                completed_at: new Date().toISOString(),
                raw_email_text: email.body,
                parsed_data: parsed,
                has_discrepancy: discrepancy.hasAnyDiscrepancy
              })
              .eq('id', verification.id);
            
            // Mark email as read
            await markEmailAsRead(messageId);
            
            processedCount++;
            
            // TODO: Send notification to user (implement later)
            console.log(`[NMC Cron] Processed verification for user ${verification.user_id}`);
            
          } catch (parseError) {
            console.error('[NMC Cron] Error parsing email:', parseError);
            // Don't mark as failed - might be temporary parsing issue
          }
          
          break; // Found matching email, move to next verification
        }
      }
    }
    
    console.log(`[NMC Cron] Completed. Processed: ${processedCount}, Timed out: ${timedOutCount}`);
    
    return NextResponse.json({
      message: 'Check completed',
      pending: pendingVerifications.length,
      processed: processedCount,
      timedOut: timedOutCount
    });
    
  } catch (error) {
    console.error('[NMC Cron] Error:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}