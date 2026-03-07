import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import {
  searchNMCEmails,
  getEmailContent,
  markEmailAsRead,
} from '@/lib/gmail/client';
import { parseNMCEmail, detectDiscrepancies } from '@/lib/utils/nmc-parser';
import { sendNmcTimeoutNotification } from '@/lib/utils/email';

// Use service role key for cron jobs (bypasses RLS)
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// 48 hours in minutes — spec-defined user-facing timeout for NMC verification
const TIMEOUT_MINUTES = 2880;

/**
 * GET /api/cron/check-nmc-emails
 * Vercel Cron job to check Gmail for NMC responses.
 *
 * On finding a match: parses credentials, updates profile, marks email read.
 * On timeout (48h): updates status to 'timeout', sends email notification to user.
 *
 * Protected by CRON_SECRET header.
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
      console.error(
        '[NMC Cron] Error fetching pending verifications:',
        fetchError
      );
      return NextResponse.json({ error: 'Database error' }, { status: 500 });
    }

    if (!pendingVerifications || pendingVerifications.length === 0) {
      console.log('[NMC Cron] No pending verifications');
      return NextResponse.json({
        message: 'No pending verifications',
        checked: 0,
      });
    }

    console.log(
      `[NMC Cron] Found ${pendingVerifications.length} pending verifications`
    );

    // Search for unread NMC emails
    const messageIds = await searchNMCEmails();
    console.log(`[NMC Cron] Found ${messageIds.length} unread NMC emails`);

    let processedCount = 0;
    let timedOutCount = 0;

    for (const verification of pendingVerifications) {
      const ageInMinutes =
        (Date.now() - new Date(verification.requested_at).getTime()) /
        (1000 * 60);

      // ── 48-hour timeout ────────────────────────────────────────────────────
      // Email type verifications get 30 days since the email may have been
      // sent days ago before we started monitoring the inbox.
      const timeoutMinutes =
        verification.verification_type === 'email' ? 43200 : TIMEOUT_MINUTES;

      if (ageInMinutes > timeoutMinutes) {
        await supabase
          .from('nmc_verifications')
          .update({ status: 'timeout' })
          .eq('id', verification.id);

        await supabase
          .from('profiles')
          .update({ nmc_verification_status: 'timeout' })
          .eq('user_id', verification.user_id);

        // Notify user so they know to check their ref number / last name
        if (verification.verification_type !== 'email') {
          const { data: profile } = await supabase
            .from('profiles')
            .select('email, first_name')
            .eq('user_id', verification.user_id)
            .single();

          if (profile?.email) {
            await sendNmcTimeoutNotification({
              recipientName: profile.first_name || 'Mariner',
              recipientEmail: profile.email,
              refNumber: verification.ref_number,
              lastName: verification.last_name,
            });
            console.log(
              `[NMC Cron] Sent timeout notification to ${profile.email}`
            );
          }
        }

        timedOutCount++;
        continue;
      }

      // ── Checking frequency based on age ──────────────────────────────────
      // Controls how often we hit the Gmail API per verification.
      // On Vercel Pro with a 5-min cron: first 5 min = every run,
      // then backs off to avoid unnecessary API calls.
      let shouldCheck = false;

      if (ageInMinutes < 5) {
        shouldCheck = true; // Every run in first 5 minutes
      } else if (ageInMinutes < 60) {
        shouldCheck = verification.check_count % 3 === 0; // ~every 15 min
      } else if (ageInMinutes < 360) {
        shouldCheck = verification.check_count % 12 === 0; // every hour
      } else {
        shouldCheck = verification.check_count % 48 === 0; // every 4 hours
      }

      if (!shouldCheck) continue;

      // Increment check count
      await supabase
        .from('nmc_verifications')
        .update({
          check_count: verification.check_count + 1,
          last_checked_at: new Date().toISOString(),
        })
        .eq('id', verification.id);

      // Search emails for a match by reference number
      for (const messageId of messageIds) {
        const email = await getEmailContent(messageId);

        console.log(
          `[NMC Cron] Checking email for ref: ${verification.ref_number}`
        );
        console.log(
          `[NMC Cron] Email body preview: ${email.body.substring(0, 200)}`
        );

        if (!email.body.includes(`RefNum: ${verification.ref_number}`))
          continue;

        console.log(
          `[NMC Cron] Found matching email for ref ${verification.ref_number}`
        );

        try {
          const parsed = parseNMCEmail(email.body);

          const { data: profile } = await supabase
            .from('profiles')
            .select('mmc_exp, medical_exp')
            .eq('user_id', verification.user_id)
            .single();

          const discrepancy = detectDiscrepancies(
            profile?.mmc_exp || null,
            profile?.medical_exp || null,
            parsed.mmcExpiration,
            parsed.medicalExpiration
          );

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
              nmc_verified_at: new Date().toISOString(),
            })
            .eq('user_id', verification.user_id);

          // Store credentials from the parsed NMC email
          for (const cred of parsed.credentials) {
            // Skip credentials we couldn't classify — log for manual review
            if (!cred.classification) {
              console.warn(
                '[NMC Cron] Skipping unknown credential:',
                cred.rawText
              );
              continue;
            }

            await supabase.from('credentials').upsert(
              {
                user_id: verification.user_id,
                credential_type: cred.classification.type,
                endorsement_name: cred.classification.shortName,
                department: cred.classification.department,
                endorsement_system: cred.classification.system,
                raw_nmc_text: cred.rawText,
                rank: cred.classification.rank,
                qualification_level: cred.classification.level,
                verified_by_nmc: true,
                needs_review: cred.needsReview,
                source_verification_id: verification.id,
              },
              { onConflict: 'user_id,endorsement_name' }
            );
          }

          if (parsed.unknownCredentials.length > 0) {
            console.log(
              '[NMC Cron] Unknown credentials (need classification):',
              parsed.unknownCredentials
            );
            // TODO: Store in a review queue table for manual classification
          }

          await supabase
            .from('nmc_verifications')
            .update({
              status: 'completed',
              completed_at: new Date().toISOString(),
              raw_email_text: email.body,
              parsed_data: parsed,
              has_discrepancy: discrepancy.hasAnyDiscrepancy,
            })
            .eq('id', verification.id);

          await markEmailAsRead(messageId);

          processedCount++;
          console.log(
            `[NMC Cron] Processed verification for user ${verification.user_id}`
          );
        } catch (parseError) {
          console.error('[NMC Cron] Error parsing email:', parseError);
          // Don't mark as failed — might be a temporary parsing issue
        }

        break; // Found a match, move to next verification
      }
    }

    console.log(
      `[NMC Cron] Done. Processed: ${processedCount}, Timed out: ${timedOutCount}`
    );

    return NextResponse.json({
      message: 'Check completed',
      pending: pendingVerifications.length,
      processed: processedCount,
      timedOut: timedOutCount,
    });
  } catch (error) {
    console.error('[NMC Cron] Error:', error);
    return NextResponse.json(
      {
        error: 'Internal server error',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
