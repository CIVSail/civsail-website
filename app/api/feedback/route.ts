import { Resend } from 'resend';
import { NextRequest, NextResponse } from 'next/server';

const resend = new Resend(process.env.RESEND_API_KEY);

const FEEDBACK_EMAIL = 'support@civsail.com';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { type, message, email } = body;

    if (!type || !message) {
      return NextResponse.json(
        { error: 'Type and message are required' },
        { status: 400 }
      );
    }

    const typeLabels: Record<string, string> = {
      bug: 'Bug Report',
      feature: 'Feature Request',
      data: 'Data Issue',
      other: 'Other',
    };

    const { data, error } = await resend.emails.send({
      from: 'CIVSail Feedback <onboarding@resend.dev>',
      to: FEEDBACK_EMAIL,
      replyTo: email || undefined,
      subject: `${typeLabels[type] || 'Feedback'} - CIVSail Tools`,
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #1e40af;">New Feedback Received</h2>
          <div style="background: #f8fafc; padding: 16px; border-radius: 8px; margin: 16px 0;">
            <p style="margin: 0 0 8px 0;"><strong>Type:</strong> ${typeLabels[type] || type}</p>
            <p style="margin: 0;"><strong>From:</strong> ${email || 'Anonymous'}</p>
          </div>
          <div style="background: #fff; border: 1px solid #e2e8f0; padding: 16px; border-radius: 8px;">
            <p style="margin: 0; white-space: pre-wrap;">${message}</p>
          </div>
          <p style="color: #64748b; font-size: 12px; margin-top: 24px;">
            Sent from CIVSail Tools Feedback Form
          </p>
        </div>
      `,
    });

    if (error) {
      console.error('Resend error:', error);
      return NextResponse.json(
        { error: 'Failed to send email' },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true, id: data?.id });
  } catch (error) {
    console.error('Feedback API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}