// app/api/cron/check-expirations/route.ts
/**
 * Daily cron job to check credential expirations and send reminders
 * Runs once per day via Vercel Cron
 * 
 * Reminder milestones:
 * - 2 years (730 days)
 * - 1 year (365 days)
 * - 10 months (304 days)
 * - 8 months (243 days)
 * - 6 months (182 days)
 * - 4 months (121 days)
 * - 3 months (91 days)
 * - 2 months (60 days)
 * - 1 month (30 days)
 * - 2 weeks (14 days)
 * - 1 week (7 days)
 * - 3 days (3 days)
 * - Expired (0 days) - final notice
 */

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { differenceInDays, parseISO, format } from 'date-fns';
import {
  sendCredentialReminder,
  getDocumentName,
  type ExpiringDocument,
  type ReminderEmailData,
} from '@/lib/utils/email';

// Use service role key for cron jobs (bypasses RLS)
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// Milestone configuration: [days before expiration, milestone name]
const MILESTONES: [number, string][] = [
  [730, '2_years'],
  [365, '1_year'],
  [304, '10_months'],
  [243, '8_months'],
  [182, '6_months'],
  [121, '4_months'],
  [91, '3_months'],
  [60, '2_months'],
  [30, '1_month'],
  [14, '2_weeks'],
  [7, '1_week'],
  [3, '3_days'],
  [0, 'expired'],
];

// Document types to check in profiles table
const DOCUMENT_FIELDS: { field: string; type: string; name: string }[] = [
  { field: 'mmc_exp', type: 'mmc', name: 'Merchant Mariner Credential (MMC)' },
  { field: 'medical_exp', type: 'medical', name: 'Medical Certificate' },
  { field: 'passport_exp', type: 'passport', name: 'Passport' },
  { field: 'twic_exp', type: 'twic', name: 'TWIC Card' },
  { field: 'license_exp', type: 'license', name: 'License' },
];

interface UserProfile {
  user_id: string;
  first_name: string | null;
  last_name: string | null;
  email: string | null;
  ship_email: string | null;
  alert_email: boolean;
  mmc_exp: string | null;
  medical_exp: string | null;
  passport_exp: string | null;
  twic_exp: string | null;
  license_exp: string | null;
}

/**
 * GET /api/cron/check-expirations
 * Protected by CRON_SECRET header
 */
export async function GET(request: NextRequest) {
  // Verify cron secret (Vercel sends this automatically)
  const authHeader = request.headers.get('authorization');
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    console.error('[Expiration Cron] Unauthorized request');
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const startTime = Date.now();
  console.log('[Expiration Cron] Starting daily expiration check...');

  try {
    // Get all users with email alerts enabled
    const { data: users, error: fetchError } = await supabase
      .from('profiles')
      .select('user_id, first_name, last_name, email, ship_email, alert_email, mmc_exp, medical_exp, passport_exp, twic_exp, license_exp')
      .eq('alert_email', true);

    if (fetchError) {
      console.error('[Expiration Cron] Error fetching users:', fetchError);
      return NextResponse.json({ error: 'Database error' }, { status: 500 });
    }

    if (!users || users.length === 0) {
      console.log('[Expiration Cron] No users with alerts enabled');
      return NextResponse.json({ message: 'No users to check', checked: 0 });
    }

    console.log(`[Expiration Cron] Checking ${users.length} users...`);

    const today = new Date();
    let emailsSent = 0;
    let usersProcessed = 0;
    let errors: string[] = [];

    // Process each user
    for (const user of users as UserProfile[]) {
      try {
        // Skip if no email addresses
        const emails = [user.email, user.ship_email].filter(Boolean) as string[];
        if (emails.length === 0) {
          continue;
        }

        // Find documents hitting a milestone today
        const primaryDocuments: ExpiringDocument[] = [];
        const allExpirations: ExpiringDocument[] = [];

        for (const doc of DOCUMENT_FIELDS) {
          const expDateStr = user[doc.field as keyof UserProfile] as string | null;
          if (!expDateStr) continue;

          const expDate = parseISO(expDateStr);
          const daysRemaining = differenceInDays(expDate, today);

          // Add to all expirations list (for summary)
          const expiringDoc: ExpiringDocument = {
            type: doc.type as ExpiringDocument['type'],
            name: doc.name,
            expirationDate: format(expDate, 'MMM d, yyyy'),
            daysRemaining,
            milestone: getMilestoneForDays(daysRemaining),
          };

          // Only include non-expired in summary, or just expired
          if (daysRemaining >= 0) {
            allExpirations.push(expiringDoc);
          }

          // Check if hitting a milestone today
          const milestone = findExactMilestone(daysRemaining);
          if (milestone) {
            // Check if we already sent this reminder
            const alreadySent = await checkReminderSent(
              user.user_id,
              doc.type,
              milestone,
              expDateStr
            );

            if (!alreadySent) {
              expiringDoc.milestone = milestone;
              primaryDocuments.push(expiringDoc);
            }
          }
        }

        // If we have documents hitting milestones, send email
        if (primaryDocuments.length > 0) {
          const emailData: ReminderEmailData = {
            recipientName: user.first_name || user.last_name || 'Mariner',
            recipientEmails: emails,
            primaryDocuments,
            allExpirations,
          };

          const result = await sendCredentialReminder(emailData);

          if (result.success) {
            // Log each reminder sent
            for (const doc of primaryDocuments) {
              await logReminderSent(
                user.user_id,
                doc.type,
                doc.name,
                doc.milestone,
                doc.daysRemaining,
                user[`${doc.type}_exp` as keyof UserProfile] as string,
                emails,
                result.messageId
              );
            }
            emailsSent++;
            console.log(`[Expiration Cron] Sent reminder to ${user.email} for ${primaryDocuments.length} document(s)`);
          } else {
            errors.push(`Failed to send to ${user.email}: ${result.error}`);
          }
        }

        usersProcessed++;
      } catch (userError) {
        console.error(`[Expiration Cron] Error processing user ${user.user_id}:`, userError);
        errors.push(`User ${user.user_id}: ${userError instanceof Error ? userError.message : 'Unknown error'}`);
      }
    }

    const duration = Date.now() - startTime;
    console.log(`[Expiration Cron] Completed in ${duration}ms. Processed: ${usersProcessed}, Emails sent: ${emailsSent}`);

    return NextResponse.json({
      message: 'Expiration check completed',
      usersChecked: users.length,
      usersProcessed,
      emailsSent,
      errors: errors.length > 0 ? errors : undefined,
      durationMs: duration,
    });
  } catch (error) {
    console.error('[Expiration Cron] Fatal error:', error);
    return NextResponse.json(
      {
        error: 'Internal server error',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}

/**
 * Find if days remaining matches an exact milestone
 * Returns the milestone name if it matches, null otherwise
 */
function findExactMilestone(daysRemaining: number): string | null {
  for (const [days, milestone] of MILESTONES) {
    if (daysRemaining === days) {
      return milestone;
    }
  }
  return null;
}

/**
 * Get the current milestone category for display purposes
 */
function getMilestoneForDays(daysRemaining: number): string {
  for (const [days, milestone] of MILESTONES) {
    if (daysRemaining >= days) {
      return milestone;
    }
  }
  return 'expired';
}

/**
 * Check if a reminder was already sent for this user/document/milestone
 */
async function checkReminderSent(
  userId: string,
  documentType: string,
  milestone: string,
  expirationDate: string
): Promise<boolean> {
  const { data, error } = await supabase
    .from('credential_reminders')
    .select('id')
    .eq('user_id', userId)
    .eq('document_type', documentType)
    .eq('milestone', milestone)
    .eq('expiration_date', expirationDate)
    .single();

  if (error && error.code !== 'PGRST116') {
    // PGRST116 = no rows returned (which is fine)
    console.error('[Expiration Cron] Error checking reminder:', error);
  }

  return !!data;
}

/**
 * Log that a reminder was sent
 */
async function logReminderSent(
  userId: string,
  documentType: string,
  documentName: string,
  milestone: string,
  daysBeforeExpiration: number,
  expirationDate: string,
  emailsSentTo: string[],
  messageId?: string
): Promise<void> {
  const { error } = await supabase.from('credential_reminders').insert({
    user_id: userId,
    document_type: documentType,
    document_name: documentName,
    milestone,
    days_before_expiration: daysBeforeExpiration,
    expiration_date: expirationDate,
    emails_sent_to: emailsSentTo,
    resend_message_id: messageId,
    delivery_status: 'sent',
  });

  if (error) {
    console.error('[Expiration Cron] Error logging reminder:', error);
  }
}