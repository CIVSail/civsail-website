import { Resend } from 'resend';
import { NextRequest, NextResponse } from 'next/server';

const resend = new Resend(process.env.RESEND_API_KEY);

const FEEDBACK_EMAIL = 'support@civsail.com';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { sector, message, email, name } = body;

    if (!sector || !message) {
      return NextResponse.json(
        { error: 'Sector and message are required' },
        { status: 400 }
      );
    }

    const { data, error } = await resend.emails.send({
      from: 'CIVSail Sector Feedback <onboarding@resend.dev>',
      to: FEEDBACK_EMAIL,
      replyTo: email || undefined,
      subject: `Sector Feedback: ${sector}`,
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #1e40af;">New Sector Feedback</h2>
          <div style="background: #f8fafc; padding: 16px; border-radius: 8px; margin: 16px 0;">
            <p style="margin: 0 0 8px 0;"><strong>Sector:</strong> ${sector}</p>
            <p style="margin: 0 0 8px 0;"><strong>From:</strong> ${name || 'Anonymous'}</p>
            <p style="margin: 0;"><strong>Email:</strong> ${email || 'Not provided'}</p>
          </div>
          <div style="background: #fff; border: 1px solid #e2e8f0; padding: 16px; border-radius: 8px;">
            <p style="margin: 0; white-space: pre-wrap;">${message}</p>
          </div>
          <p style="color: #64748b; font-size: 12px; margin-top: 24px;">
            Sent from CIVSail Sector Feedback Form
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
    console.error('Sector feedback API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
