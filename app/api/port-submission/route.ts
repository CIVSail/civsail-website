/**
 * @file /app/api/port-submission/route.ts
 * @description Receives port community submissions and emails them via Resend
 *
 * Validates form data with Zod, builds a structured HTML email, and sends
 * to support@civsail.com for review. Includes honeypot spam prevention.
 */

import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';
import { z } from 'zod';

const resend = new Resend(process.env.RESEND_API_KEY);

// --- Zod Schemas ---

const PlaceEntrySchema = z.object({
  name: z.string().max(200).optional(),
  type: z.string().max(200).optional(),
  priceRange: z.string().max(50).optional(),
  tips: z.string().max(2000).optional(),
});

const PortSubmissionSchema = z.object({
  // Section 1: Port Identification
  portName: z.string().min(2, 'Port name is required').max(200),

  // Section 2: Main Content
  mainContent: z.string().min(10, 'Please share at least a short tip or note').max(5000),

  // Section 3: Port Suggestion
  suggestedPort: z.string().max(200).optional(),

  // Section 4: Optional Detail Sections
  places: z.array(PlaceEntrySchema).max(20).optional(),
  gettingAround: z.string().max(2000).optional(),
  operationsBaseInfo: z.string().max(2000).optional(),
  safetyTips: z.string().max(2000).optional(),
  regionalTravel: z.string().max(2000).optional(),

  // Section 5: About You
  submitterName: z.string().max(200).optional(),
  submitterEmail: z.string().email('Invalid email').max(200).optional().or(z.literal('')),
  shipName: z.string().max(200).optional(),
  recency: z.string().max(200).optional(),

  // Context
  portRegion: z.string().max(200).optional(),

  // Honeypot
  website: z.string().optional(),
});

// --- Helpers ---

const recencyLabels: Record<string, string> = {
  'current': 'Currently there',
  'last-6-months': 'Within 6 months',
  '1-2-years': '1–2 years ago',
  '3-plus-years': '3+ years ago',
  'heard': "Haven't been (sharing what I've heard)",
};

const SECTION_NAMES = [
  'Places & Venues',
  'Getting Around',
  'Operations & Base Info',
  'Safety & Practical Tips',
  'Regional Travel',
] as const;

function deriveCategory(data: z.infer<typeof PortSubmissionSchema>): string {
  const filled: string[] = [];
  if (data.places?.some(p => p.name || p.tips)) filled.push('Places & Venues');
  if (data.gettingAround) filled.push('Getting Around');
  if (data.operationsBaseInfo) filled.push('Operations & Base Info');
  if (data.safetyTips) filled.push('Safety & Practical Tips');
  if (data.regionalTravel) filled.push('Regional Travel');

  if (filled.length === 0) return 'General';
  if (filled.length <= 2) return filled.join(' & ');
  return `${filled.length} sections`;
}

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/\n/g, '<br>');
}

function buildEmailHtml(data: z.infer<typeof PortSubmissionSchema>, timestamp: string): string {
  const { portName, mainContent, suggestedPort, places, gettingAround, operationsBaseInfo, safetyTips, regionalTravel, submitterName, submitterEmail, shipName, recency, portRegion } = data;

  // Build detail sections HTML
  let detailSectionsHtml = '';

  // Places & Venues
  const filledPlaces = places?.filter(p => p.name || p.tips) || [];
  if (filledPlaces.length > 0) {
    let placesHtml = '';
    for (const place of filledPlaces) {
      const tags: string[] = [];
      if (place.type) tags.push(place.type);
      if (place.priceRange) tags.push(place.priceRange);

      placesHtml += `
        <div style="background: white; padding: 12px; border-radius: 8px; border: 1px solid #e2e8f0; margin-bottom: 8px;">
          ${place.name ? `<strong style="color: #1f2937;">${escapeHtml(place.name)}</strong>` : ''}
          ${tags.length > 0 ? `<span style="color: #6b7280; font-size: 13px;"> — ${tags.join(' · ')}</span>` : ''}
          ${place.tips ? `<p style="margin: 8px 0 0; color: #374151; font-size: 14px;">${escapeHtml(place.tips)}</p>` : ''}
        </div>
      `;
    }
    detailSectionsHtml += buildSection('Places & Venues', placesHtml);
  }

  // Text-based detail sections
  const textSections: [string, string | undefined][] = [
    ['Getting Around', gettingAround],
    ['Operations & Base Info', operationsBaseInfo],
    ['Safety & Practical Tips', safetyTips],
    ['Regional Travel', regionalTravel],
  ];

  for (const [title, content] of textSections) {
    if (content) {
      detailSectionsHtml += buildSection(title, `
        <div style="background: white; padding: 12px; border-radius: 8px; border: 1px solid #e2e8f0;">
          ${escapeHtml(content)}
        </div>
      `);
    }
  }

  // Submitter info
  const submitterParts: string[] = [];
  if (submitterName) submitterParts.push(`<strong>Name:</strong> ${escapeHtml(submitterName)}`);
  if (submitterEmail) submitterParts.push(`<strong>Email:</strong> <a href="mailto:${escapeHtml(submitterEmail)}" style="color: #2563eb;">${escapeHtml(submitterEmail)}</a>`);
  if (shipName) submitterParts.push(`<strong>Ship:</strong> ${escapeHtml(shipName)}`);
  if (recency) submitterParts.push(`<strong>Last visit:</strong> ${recencyLabels[recency] || recency}`);

  return `
    <div style="font-family: system-ui, -apple-system, sans-serif; max-width: 600px; margin: 0 auto;">
      <div style="background: linear-gradient(135deg, #1e3a5f 0%, #1e40af 100%); padding: 24px; border-radius: 12px 12px 0 0;">
        <h1 style="color: white; margin: 0; font-size: 22px;">Port Submission: ${escapeHtml(portName)}</h1>
        ${portRegion ? `<p style="color: rgba(255,255,255,0.7); margin: 4px 0 0; font-size: 14px;">${escapeHtml(portRegion)}</p>` : ''}
      </div>

      <div style="background: #f8fafc; padding: 24px; border: 1px solid #e2e8f0; border-top: none;">
        <h2 style="color: #1f2937; font-size: 16px; margin: 0 0 12px;">Main Content</h2>
        <div style="background: white; padding: 16px; border-radius: 8px; border: 1px solid #e2e8f0; margin-bottom: 24px;">
          <p style="margin: 0; color: #1f2937; line-height: 1.6;">${escapeHtml(mainContent)}</p>
        </div>

        ${detailSectionsHtml}

        ${suggestedPort ? `
          <div style="margin-top: 24px; padding: 12px; background: #fef3c7; border-radius: 8px; border: 1px solid #fde68a;">
            <strong style="color: #92400e; font-size: 14px;">Port page request:</strong>
            <span style="color: #78350f;"> ${escapeHtml(suggestedPort)}</span>
          </div>
        ` : ''}
      </div>

      <div style="background: #f1f5f9; padding: 16px 24px; border-radius: 0 0 12px 12px; border: 1px solid #e2e8f0; border-top: none;">
        ${submitterParts.length > 0 ? `
          <p style="margin: 0 0 8px; color: #475569; font-size: 13px;">
            ${submitterParts.join(' &nbsp;·&nbsp; ')}
          </p>
        ` : ''}
        <p style="margin: 0; color: #94a3b8; font-size: 12px;">
          Submitted on ${timestamp} via CIVSail Port Submission Form
        </p>
      </div>
    </div>
  `;
}

function buildSection(title: string, content: string): string {
  return `
    <div style="margin-bottom: 20px;">
      <h3 style="color: #374151; font-size: 15px; margin: 0 0 8px; padding-bottom: 4px; border-bottom: 1px solid #e2e8f0;">${title}</h3>
      ${content}
    </div>
  `;
}

// --- Route Handler ---

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate input
    const parsed = PortSubmissionSchema.safeParse(body);
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

    // Honeypot check — silently accept if bot filled the hidden field
    if (parsed.data.website) {
      return NextResponse.json({ ok: true });
    }

    const category = deriveCategory(parsed.data);

    const timestamp = new Date().toLocaleString('en-US', {
      timeZone: 'America/New_York',
      dateStyle: 'full',
      timeStyle: 'short',
    });

    const emailHtml = buildEmailHtml(parsed.data, timestamp);

    const { error } = await resend.emails.send({
      from: 'CIVSail <noreply@civsail.com>',
      to: ['support@civsail.com'],
      subject: `Port Submission: ${parsed.data.portName} — ${category}`,
      html: emailHtml,
      replyTo: parsed.data.submitterEmail || undefined,
    });

    if (error) {
      console.error('Resend error:', error);
      return NextResponse.json(
        {
          ok: false,
          code: 'EMAIL_FAILED',
          message: 'Something went wrong sending your submission. Please try again, or email us directly at support@civsail.com',
        },
        { status: 500 }
      );
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error('Port submission error:', error);
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
