import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';
import { z } from 'zod';

const resend = new Resend(process.env.RESEND_API_KEY);

// Validation schema
const FormDataSchema = z.object({
  name: z.string().min(1, 'Name is required').max(200),
  email: z.string().email('Invalid email address'),
  phone: z.string().max(50).optional(),
  currentlySailing: z.string().min(1, 'Current sailing status is required'),
  helpWith: z.array(z.string()).min(1, 'Please select at least one area'),
  additionalInfo: z.string().max(5000).optional(),
});

// Map values to readable labels
const sailingStatusLabels: Record<string, string> = {
  'at-sea': 'Currently at sea',
  'ashore': 'On rotation ashore',
  'between': 'Between assignments',
  'new': 'New to the industry',
};

const helpWithLabels: Record<string, string> = {
  retirement: 'Retirement planning',
  investing: 'Investing',
  benefits: 'Benefits selection',
  budgeting: 'Budgeting',
  debt: 'Debt management',
  home: 'Saving for a home',
  insurance: 'Insurance',
  general: 'General financial planning',
  unsure: 'Not sure — need guidance',
};

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate input
    const parsed = FormDataSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        {
          ok: false,
          code: 'VALIDATION_ERROR',
          message: parsed.error.issues[0]?.message || 'Invalid input',
        },
        { status: 400 }
      );
    }

    const { name, email, phone, currentlySailing, helpWith, additionalInfo } = parsed.data;

    // Format the help with areas
    const helpWithFormatted = helpWith
      .map((h) => helpWithLabels[h] || h)
      .join(', ');

    // Format sailing status
    const sailingStatus = sailingStatusLabels[currentlySailing] || currentlySailing;

    // Get current timestamp
    const timestamp = new Date().toLocaleString('en-US', {
      timeZone: 'America/New_York',
      dateStyle: 'full',
      timeStyle: 'short',
    });

    // Build email HTML
    const emailHtml = `
      <div style="font-family: system-ui, -apple-system, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: linear-gradient(135deg, #064e3b 0%, #065f46 100%); padding: 24px; border-radius: 12px 12px 0 0;">
          <h1 style="color: white; margin: 0; font-size: 24px;">New Financial Consultation Request</h1>
        </div>

        <div style="background: #f8fafc; padding: 24px; border: 1px solid #e2e8f0; border-top: none;">
          <table style="width: 100%; border-collapse: collapse;">
            <tr>
              <td style="padding: 12px 0; border-bottom: 1px solid #e2e8f0; font-weight: 600; color: #374151; width: 40%;">Name</td>
              <td style="padding: 12px 0; border-bottom: 1px solid #e2e8f0; color: #1f2937;">${name}</td>
            </tr>
            <tr>
              <td style="padding: 12px 0; border-bottom: 1px solid #e2e8f0; font-weight: 600; color: #374151;">Email</td>
              <td style="padding: 12px 0; border-bottom: 1px solid #e2e8f0; color: #1f2937;">
                <a href="mailto:${email}" style="color: #059669;">${email}</a>
              </td>
            </tr>
            ${
              phone
                ? `
            <tr>
              <td style="padding: 12px 0; border-bottom: 1px solid #e2e8f0; font-weight: 600; color: #374151;">Phone</td>
              <td style="padding: 12px 0; border-bottom: 1px solid #e2e8f0; color: #1f2937;">
                <a href="tel:${phone}" style="color: #059669;">${phone}</a>
              </td>
            </tr>
            `
                : ''
            }
            <tr>
              <td style="padding: 12px 0; border-bottom: 1px solid #e2e8f0; font-weight: 600; color: #374151;">Current Status</td>
              <td style="padding: 12px 0; border-bottom: 1px solid #e2e8f0; color: #1f2937;">${sailingStatus}</td>
            </tr>
            <tr>
              <td style="padding: 12px 0; border-bottom: 1px solid #e2e8f0; font-weight: 600; color: #374151;">Needs Help With</td>
              <td style="padding: 12px 0; border-bottom: 1px solid #e2e8f0; color: #1f2937;">${helpWithFormatted}</td>
            </tr>
            ${
              additionalInfo
                ? `
            <tr>
              <td style="padding: 12px 0; font-weight: 600; color: #374151; vertical-align: top;">Additional Info</td>
              <td style="padding: 12px 0; color: #1f2937;">
                <div style="background: white; padding: 12px; border-radius: 8px; border: 1px solid #e2e8f0;">
                  ${additionalInfo.replace(/\n/g, '<br>')}
                </div>
              </td>
            </tr>
            `
                : ''
            }
          </table>
        </div>

        <div style="background: #f1f5f9; padding: 16px 24px; border-radius: 0 0 12px 12px; border: 1px solid #e2e8f0; border-top: none;">
          <p style="margin: 0; color: #64748b; font-size: 14px;">
            Submitted on ${timestamp} via CIVSail Financial Consultation page
          </p>
        </div>
      </div>
    `;

    // Send email
    const { error } = await resend.emails.send({
      from: 'CIVSail <noreply@civsail.com>',
      to: ['support@civsail.com'],
      subject: `New Financial Consultation Request — ${name}`,
      html: emailHtml,
      replyTo: email,
    });

    if (error) {
      console.error('Resend error:', error);
      return NextResponse.json(
        {
          ok: false,
          code: 'EMAIL_FAILED',
          message: 'Failed to send request. Please try again.',
        },
        { status: 500 }
      );
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error('Financial consultation error:', error);
    return NextResponse.json(
      {
        ok: false,
        code: 'SERVER_ERROR',
        message: 'Something went wrong. Please try again.',
      },
      { status: 500 }
    );
  }
}
