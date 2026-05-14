import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { Webhook } from 'svix';
import { Resend } from 'resend';
import { parseNMCEmail, detectDiscrepancies } from '@/lib/utils/nmc-parser';

const resend = new Resend(process.env.RESEND_API_KEY!);

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

const NMC_SENDER = 'smb-nationalmariticenter-donotreply@uscg.mil';

/**
 * POST /api/mail
 *
 * Resend inbound webhook — fires when an email arrives at credentials@civsail.com.
 * Finds the matching pending verification, parses credentials, and updates Supabase.
 */
export async function POST(request: NextRequest) {
  // ── Verify webhook signature ───────────────────────────────────────────────
  const rawBody = await request.text();
  const svixId = request.headers.get('svix-id');
  const svixTimestamp = request.headers.get('svix-timestamp');
  const svixSignature = request.headers.get('svix-signature');

  if (!svixId || !svixTimestamp || !svixSignature) {
    return new NextResponse('Missing svix headers', { status: 400 });
  }

  let event: {
    type: string;
    data: { email_id: string; from: string; to: string[]; subject: string };
  };

  try {
    const wh = new Webhook(process.env.RESEND_WEBHOOK_SECRET!);
    event = wh.verify(rawBody, {
      'svix-id': svixId,
      'svix-timestamp': svixTimestamp,
      'svix-signature': svixSignature,
    }) as typeof event;
  } catch (err) {
    console.error('[NMC Mail] Invalid webhook signature:', err);
    return new NextResponse('Invalid signature', { status: 401 });
  }

  if (event.type !== 'email.received') {
    return NextResponse.json({ received: true, skipped: true });
  }

  const { email_id, from, subject } = event.data;

  // ── Confirm sender is NMC ──────────────────────────────────────────────────
  if (!from.toLowerCase().includes(NMC_SENDER)) {
    console.log(`[NMC Mail] Ignored non-NMC sender: ${from}`);
    return NextResponse.json({ received: true, skipped: true });
  }

  console.log(`[NMC Mail] Received NMC email ${email_id} — "${subject}"`);

  // ── Fetch full email body ──────────────────────────────────────────────────
  // Resend webhooks only carry metadata; body requires a separate API call.
  let emailBody = '';
  try {
    const emailData = await resend.emails.get(email_id);
    if (emailData.data?.text) {
      emailBody = emailData.data.text;
    } else if (emailData.data?.html) {
      emailBody = emailData.data.html.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
    }
  } catch (err) {
    console.error('[NMC Mail] Failed to fetch email body:', err);
    return new NextResponse('Failed to fetch email content', { status: 500 });
  }

  if (!emailBody) {
    console.warn(`[NMC Mail] Empty body for email ${email_id}`);
    return NextResponse.json({ received: true, parsed: false, reason: 'empty body' });
  }

  // ── Match to a pending verification by ref number ─────────────────────────
  const { data: pendingVerifications, error: fetchError } = await supabase
    .from('nmc_verifications')
    .select('*')
    .eq('status', 'pending');

  if (fetchError) {
    console.error('[NMC Mail] Error fetching pending verifications:', fetchError);
    return NextResponse.json({ error: 'Database error' }, { status: 500 });
  }

  const verification = pendingVerifications?.find((v) =>
    emailBody.includes(`RefNum: ${v.ref_number}`)
  );

  if (!verification) {
    console.log('[NMC Mail] No pending verification matched the ref number in this email');
    return NextResponse.json({ received: true, skipped: true, reason: 'no matching ref' });
  }

  console.log(`[NMC Mail] Matched ref ${verification.ref_number} → user ${verification.user_id}`);

  // ── Parse, detect discrepancies, write to Supabase ────────────────────────
  try {
    const parsed = parseNMCEmail(emailBody);

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

    for (const cred of parsed.credentials) {
      if (!cred.classification) {
        console.warn('[NMC Mail] Skipping unclassified credential:', cred.rawText);
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
      console.log('[NMC Mail] Unknown credentials (need classification):', parsed.unknownCredentials);
      // TODO: Store in a review queue table for manual classification
    }

    await supabase
      .from('nmc_verifications')
      .update({
        status: 'completed',
        completed_at: new Date().toISOString(),
        raw_email_text: emailBody,
        parsed_data: parsed,
        has_discrepancy: discrepancy.hasAnyDiscrepancy,
      })
      .eq('id', verification.id);

    console.log(`[NMC Mail] Done — user ${verification.user_id}`);
    return NextResponse.json({ received: true, parsed: true });
  } catch (parseError) {
    console.error('[NMC Mail] Parse error:', parseError);
    // Return 200 so Resend doesn't retry — this is a parsing issue, not transport
    return NextResponse.json({ received: true, parsed: false, reason: 'parse error' });
  }
}