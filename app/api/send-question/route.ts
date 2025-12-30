import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: NextRequest) {
  try {
    const { question } = await request.json();

    // Validate input
    if (!question || question.trim().length === 0) {
      return NextResponse.json(
        { ok: false, code: 'MISSING_FIELD', message: 'Question is required' },
        { status: 400 }
      );
    }

    // Send email to both recipients
    const { error } = await resend.emails.send({
      from: 'CIVSail <noreply@civsail.com>', // Update with your verified domain
      to: ['markbrown@high3team.com', 'alec.schenning@civsail.com'],
      subject: 'New Retirement Question from CIVSail',
      html: `
        <h2>New Question Submitted</h2>
        <p>Someone submitted a retirement question on CIVSail:</p>
        <blockquote style="border-left: 4px solid #3db4c0; padding-left: 16px; margin: 16px 0; color: #1e3a5f;">
          ${question.replace(/\n/g, '<br>')}
        </blockquote>
        <p style="color: #666; font-size: 14px;">
          This could be a great topic for The Final Muster!
        </p>
      `,
    });

    if (error) {
      console.error('Resend error:', error);
      return NextResponse.json(
        { ok: false, code: 'EMAIL_FAILED', message: 'Failed to send email' },
        { status: 500 }
      );
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error('Send question error:', error);
    return NextResponse.json(
      { ok: false, code: 'SERVER_ERROR', message: 'Something went wrong' },
      { status: 500 }
    );
  }
}