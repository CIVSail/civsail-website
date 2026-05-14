// lib/utils/email.ts
/**
 * Email utilities using Resend
 * Used for credential expiration reminders and other transactional emails
 */

import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

// =============================================
// TYPES
// =============================================

export interface ExpiringDocument {
  type: 'mmc' | 'medical' | 'passport' | 'twic' | 'license';
  name: string;
  expirationDate: string;
  daysRemaining: number;
  milestone: string;
}

export interface ReminderEmailData {
  recipientName: string;
  recipientEmails: string[];
  primaryDocuments: ExpiringDocument[]; // Documents hitting milestone TODAY
  allExpirations: ExpiringDocument[]; // All upcoming expirations for summary
}

export interface EmailResult {
  success: boolean;
  messageId?: string;
  error?: string;
}

// =============================================
// RENEWAL INFO (Placeholder - update with accurate info later)
// =============================================

const RENEWAL_INFO: Record<
  string,
  { where: string; link: string; tips: string }
> = {
  mmc: {
    where: 'National Maritime Center (NMC)',
    link: 'https://www.dco.uscg.mil/nmc/',
    tips: 'Apply online through the NMC website. Processing typically takes 4-6 weeks. Start early!',
  },
  medical: {
    where: 'Coast Guard-approved physician',
    link: '/guides/credentials-training-renewal',
    tips: 'Find a CG-approved medical examiner. Schedule your physical at least 6 months before expiration.',
  },
  passport: {
    where: 'U.S. Department of State',
    link: 'https://travel.state.gov/content/travel/en/passports.html',
    tips: 'Renew by mail if eligible, or visit a passport acceptance facility. Expedited service available.',
  },
  twic: {
    where: 'TSA Universal Enrollment',
    link: 'https://universalenroll.dhs.gov/programs/twic',
    tips: 'Schedule an appointment at an enrollment center. Renewal can be done up to 1 year before expiration.',
  },
  license: {
    where: 'National Maritime Center (NMC)',
    link: 'https://www.dco.uscg.mil/nmc/',
    tips: 'Same process as MMC renewal. Ensure all required sea service documentation is current.',
  },
};

const DOCUMENT_NAMES: Record<string, string> = {
  mmc: 'Merchant Mariner Credential (MMC)',
  medical: 'Medical Certificate',
  passport: 'Passport',
  twic: 'TWIC Card',
  license: 'License',
};

// =============================================
// EMAIL TEMPLATES
// =============================================

function generateReminderEmailHtml(data: ReminderEmailData): string {
  const { recipientName, primaryDocuments, allExpirations } = data;

  // Header section with primary expiring documents
  const primarySection = primaryDocuments
    .map((doc) => {
      const renewal = RENEWAL_INFO[doc.type];
      const urgencyColor =
        doc.daysRemaining <= 30
          ? '#dc2626'
          : doc.daysRemaining <= 90
            ? '#f59e0b'
            : '#2563eb';

      return `
        <div style="background: linear-gradient(135deg, ${urgencyColor}15, ${urgencyColor}05); border-left: 4px solid ${urgencyColor}; padding: 20px; margin-bottom: 16px; border-radius: 8px;">
          <h2 style="margin: 0 0 8px 0; color: ${urgencyColor}; font-size: 20px;">
            ${doc.name}
          </h2>
          <p style="margin: 0 0 12px 0; font-size: 16px; color: #374151;">
            ${
              doc.daysRemaining === 0
                ? '<strong>⚠️ EXPIRED TODAY</strong>'
                : doc.daysRemaining < 0
                  ? `<strong>⚠️ EXPIRED ${Math.abs(doc.daysRemaining)} days ago</strong>`
                  : `Expires in <strong>${doc.daysRemaining} days</strong> (${doc.expirationDate})`
            }
          </p>
          <div style="background: white; padding: 12px; border-radius: 6px; margin-top: 12px;">
            <p style="margin: 0 0 8px 0; font-size: 14px;"><strong>Where to renew:</strong> ${renewal.where}</p>
            <p style="margin: 0 0 8px 0; font-size: 14px;"><strong>Tips:</strong> ${renewal.tips}</p>
            <a href="${renewal.link.startsWith('http') ? renewal.link : `https://civsail.com${renewal.link}`}" 
               style="display: inline-block; margin-top: 8px; padding: 8px 16px; background: ${urgencyColor}; color: white; text-decoration: none; border-radius: 6px; font-size: 14px;">
              Start Renewal →
            </a>
          </div>
        </div>
      `;
    })
    .join('');

  // Summary table of all expirations
  const summaryRows = allExpirations
    .filter((doc) => doc.daysRemaining > 0) // Only show non-expired
    .sort((a, b) => a.daysRemaining - b.daysRemaining)
    .map((doc) => {
      const statusColor =
        doc.daysRemaining <= 30
          ? '#dc2626'
          : doc.daysRemaining <= 90
            ? '#f59e0b'
            : doc.daysRemaining <= 180
              ? '#2563eb'
              : '#059669';
      return `
        <tr>
          <td style="padding: 12px; border-bottom: 1px solid #e5e7eb;">${doc.name}</td>
          <td style="padding: 12px; border-bottom: 1px solid #e5e7eb;">${doc.expirationDate}</td>
          <td style="padding: 12px; border-bottom: 1px solid #e5e7eb;">
            <span style="color: ${statusColor}; font-weight: 600;">${doc.daysRemaining} days</span>
          </td>
        </tr>
      `;
    })
    .join('');

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
    </head>
    <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #1f2937; max-width: 600px; margin: 0 auto; padding: 20px;">
      
      <!-- Header -->
      <div style="text-align: center; margin-bottom: 32px;">
        <h1 style="color: #1e3a5f; margin: 0; font-size: 28px;">⚓ CIVSail</h1>
        <p style="color: #6b7280; margin: 8px 0 0 0;">Credential Expiration Reminder</p>
      </div>

      <!-- Greeting -->
      <p style="font-size: 16px;">Hi ${recipientName || 'Mariner'},</p>
      <p style="font-size: 16px;">This is a reminder about your upcoming credential expiration${primaryDocuments.length > 1 ? 's' : ''}:</p>

      <!-- Primary Documents (hitting milestone today) -->
      ${primarySection}

      <!-- Summary Table -->
      ${
        allExpirations.length > 0
          ? `
        <div style="margin-top: 32px;">
          <h3 style="color: #1e3a5f; margin-bottom: 16px;">📋 All Your Credentials</h3>
          <table style="width: 100%; border-collapse: collapse; background: #f9fafb; border-radius: 8px; overflow: hidden;">
            <thead>
              <tr style="background: #1e3a5f; color: white;">
                <th style="padding: 12px; text-align: left;">Document</th>
                <th style="padding: 12px; text-align: left;">Expires</th>
                <th style="padding: 12px; text-align: left;">Days Left</th>
              </tr>
            </thead>
            <tbody>
              ${summaryRows}
            </tbody>
          </table>
        </div>
      `
          : ''
      }

      <!-- CTA -->
      <div style="text-align: center; margin: 32px 0;">
        <a href="https://civsail.com/dashboard" 
           style="display: inline-block; padding: 14px 28px; background: #1e3a5f; color: white; text-decoration: none; border-radius: 8px; font-size: 16px; font-weight: 600;">
          View Dashboard
        </a>
      </div>

      <!-- Footer -->
      <div style="margin-top: 40px; padding-top: 20px; border-top: 1px solid #e5e7eb; color: #6b7280; font-size: 14px;">
        <p>Need help with renewals? Check out our <a href="https://civsail.com/guides/credentials-training-renewal" style="color: #3db4c0;">credential renewal guide</a>.</p>
        <p style="margin-top: 16px;">
          You're receiving this because you have credential reminders enabled in your CIVSail account.
          <br>
          <a href="https://civsail.com/dashboard/settings" style="color: #6b7280;">Manage notification preferences</a>
        </p>
        <p style="margin-top: 16px; color: #9ca3af;">
          © ${new Date().getFullYear()} CIVSail • Built for Mariners
        </p>
      </div>

    </body>
    </html>
  `;
}

function generateReminderEmailText(data: ReminderEmailData): string {
  const { recipientName, primaryDocuments, allExpirations } = data;

  let text = `CIVSail - Credential Expiration Reminder\n\n`;
  text += `Hi ${recipientName || 'Mariner'},\n\n`;
  text += `This is a reminder about your upcoming credential expiration${primaryDocuments.length > 1 ? 's' : ''}:\n\n`;

  for (const doc of primaryDocuments) {
    const renewal = RENEWAL_INFO[doc.type];
    text += `━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n`;
    text += `${doc.name}\n`;
    text +=
      doc.daysRemaining === 0
        ? `⚠️ EXPIRED TODAY\n`
        : doc.daysRemaining < 0
          ? `⚠️ EXPIRED ${Math.abs(doc.daysRemaining)} days ago\n`
          : `Expires in ${doc.daysRemaining} days (${doc.expirationDate})\n`;
    text += `\nWhere to renew: ${renewal.where}\n`;
    text += `Tips: ${renewal.tips}\n`;
    text += `More info: ${renewal.link.startsWith('http') ? renewal.link : `https://civsail.com${renewal.link}`}\n\n`;
  }

  if (allExpirations.length > 0) {
    text += `\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n`;
    text += `ALL YOUR CREDENTIALS:\n\n`;
    for (const doc of allExpirations
      .filter((d) => d.daysRemaining > 0)
      .sort((a, b) => a.daysRemaining - b.daysRemaining)) {
      text += `• ${doc.name}: ${doc.expirationDate} (${doc.daysRemaining} days)\n`;
    }
  }

  text += `\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n`;
  text += `View your dashboard: https://civsail.com/dashboard\n`;
  text += `Renewal guide: https://civsail.com/guides/credentials-training-renewal\n`;
  text += `Manage notifications: https://civsail.com/dashboard/settings\n`;

  return text;
}

// =============================================
// SEND FUNCTIONS
// =============================================

/**
 * Send a credential expiration reminder email
 */
export async function sendCredentialReminder(
  data: ReminderEmailData
): Promise<EmailResult> {
  try {
    const { data: result, error } = await resend.emails.send({
      from: 'CIVSail Reminders <reminders@civsail.com>',
      to: data.recipientEmails,
      subject: generateSubject(data.primaryDocuments),
      html: generateReminderEmailHtml(data),
      text: generateReminderEmailText(data),
    });

    if (error) {
      console.error('[Email] Resend error:', error);
      return { success: false, error: error.message };
    }

    return { success: true, messageId: result?.id };
  } catch (err) {
    console.error('[Email] Send error:', err);
    return {
      success: false,
      error: err instanceof Error ? err.message : 'Unknown error',
    };
  }
}

/**
 * Generate email subject based on urgency
 */
function generateSubject(documents: ExpiringDocument[]): string {
  const mostUrgent = documents.reduce(
    (min, doc) => (doc.daysRemaining < min.daysRemaining ? doc : min),
    documents[0]
  );

  if (mostUrgent.daysRemaining <= 0) {
    return `⚠️ EXPIRED: Your ${mostUrgent.name} has expired`;
  } else if (mostUrgent.daysRemaining <= 7) {
    return `🚨 URGENT: ${mostUrgent.name} expires in ${mostUrgent.daysRemaining} days`;
  } else if (mostUrgent.daysRemaining <= 30) {
    return `⚠️ Action needed: ${mostUrgent.name} expires in ${mostUrgent.daysRemaining} days`;
  } else if (mostUrgent.daysRemaining <= 90) {
    return `📋 Reminder: ${mostUrgent.name} expires in ${mostUrgent.daysRemaining} days`;
  } else {
    return `📅 Upcoming: ${mostUrgent.name} expires in ${Math.round(mostUrgent.daysRemaining / 30)} months`;
  }
}

/**
 * Get the human-readable name for a document type
 */
export function getDocumentName(type: string): string {
  return DOCUMENT_NAMES[type] || type;
}

// =============================================
// NMC TIMEOUT NOTIFICATION
// =============================================

export interface NmcTimeoutData {
  recipientName: string;
  recipientEmail: string;
  refNumber: string;
  lastName: string;
}

/**
 * Send an NMC verification timeout notification.
 * Fired when a pending nmc_verifications row hits the 48-hour timeout threshold.
 *
 * Tone: helpful, not alarmist. The most common cause is a ref number or last name mismatch.
 */
export async function sendNmcTimeoutNotification(
  data: NmcTimeoutData
): Promise<EmailResult> {
  const { recipientName, recipientEmail, refNumber, lastName } = data;

  const html = `
    <!DOCTYPE html>
    <html>
    <head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"></head>
    <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #1f2937; max-width: 600px; margin: 0 auto; padding: 20px;">
      <div style="text-align: center; margin-bottom: 32px;">
        <h1 style="color: #1e3a5f; margin: 0; font-size: 28px;">⚓ CIVSail</h1>
        <p style="color: #6b7280; margin: 8px 0 0 0;">Credential Verification Update</p>
      </div>

      <p style="font-size: 16px;">Hi ${recipientName || 'Mariner'},</p>

      <p style="font-size: 16px;">
        We weren't able to find credentials matching reference number
        <strong style="font-family: monospace;">${refNumber}</strong>
        and last name <strong>${lastName}</strong> in the NMC system.
      </p>

      <div style="background: #fef3c7; border-left: 4px solid #f59e0b; padding: 16px; border-radius: 6px; margin: 20px 0;">
        <p style="margin: 0; font-size: 15px;">
          <strong>The most common cause is a name mismatch.</strong>
          Make sure your last name is entered exactly as it appears on your MMC —
          not a nickname or shortened version.
        </p>
      </div>

      <p style="font-size: 15px;">From your dashboard you can:</p>
      <ul style="font-size: 15px;">
        <li>Edit your reference number and retry</li>
        <li>Update your last name to match your MMC exactly</li>
        <li>Enter your credentials manually in the meantime</li>
      </ul>

      <div style="text-align: center; margin: 32px 0;">
        <a href="https://civsail.com/dashboard"
           style="display: inline-block; padding: 14px 28px; background: #1e3a5f; color: white; text-decoration: none; border-radius: 8px; font-size: 16px; font-weight: 600;">
          Go to Dashboard
        </a>
      </div>

      <div style="margin-top: 40px; padding-top: 20px; border-top: 1px solid #e5e7eb; color: #6b7280; font-size: 14px;">
        <p>Questions? Reply to this email or visit your dashboard.</p>
        <p style="margin-top: 16px; color: #9ca3af;">
          © ${new Date().getFullYear()} CIVSail • Built for Mariners
        </p>
      </div>
    </body>
    </html>
  `;

  const text = `CIVSail — Credential Verification Update\n\nHi ${recipientName || 'Mariner'},\n\nWe weren't able to find credentials matching reference number ${refNumber} and last name ${lastName}.\n\nThe most common cause is a name mismatch. Make sure your last name is entered exactly as it appears on your MMC.\n\nFrom your dashboard you can:\n- Edit your reference number and retry\n- Update your last name\n- Enter credentials manually\n\nhttps://civsail.com/dashboard\n\n© ${new Date().getFullYear()} CIVSail`;

  try {
    const { data: result, error } = await resend.emails.send({
      from: 'CIVSail <notifications@civsail.com>',
      to: [recipientEmail],
      subject: "Action needed: We couldn't verify your credentials",
      html,
      text,
    });

    if (error) {
      return { success: false, error: error.message };
    }

    return { success: true, messageId: result?.id };
  } catch (err) {
    return {
      success: false,
      error: err instanceof Error ? err.message : 'Unknown error',
    };
  }
}
