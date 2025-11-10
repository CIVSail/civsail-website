// app/api/ocr/process-sea-service/route.ts
import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { extractTextFromDocument } from '@/lib/ocr/google-vision';
import { parseSeaServiceLetter } from '@/lib/utils/sea-service-parser';

// server-side supabase client
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// helper: Date | null -> 'YYYY-MM-DD' | null
function toPgDate(d: Date | null): string | null {
  if (!d || !(d instanceof Date) || isNaN(d.getTime())) return null;
  return d.toISOString().slice(0, 10);
}

export async function POST(req: Request) {
  try {
    const formData = await req.formData();

    const file = formData.get('file') as File | null;
    const storagePath = formData.get('storagePath') as string | null;

    if (!file) {
      return NextResponse.json(
        {
          success: false,
          error: 'No file uploaded',
          servicePeriods: { extracted: 0, inserted: 0, duplicates: 0 },
          periods: [],
          needsReview: false,
        },
        { status: 400 }
      );
    }

    if (!storagePath) {
      return NextResponse.json(
        {
          success: false,
          error: 'storagePath is required',
          servicePeriods: { extracted: 0, inserted: 0, duplicates: 0 },
          periods: [],
          needsReview: false,
        },
        { status: 400 }
      );
    }

    // storagePath: sea_service/<user_id>/<filename>
    const parts = storagePath.split('/');
    const userId = parts.length >= 2 ? parts[1] : null;

    if (!userId) {
      return NextResponse.json(
        {
          success: false,
          error: 'Could not determine user from storagePath',
          servicePeriods: { extracted: 0, inserted: 0, duplicates: 0 },
          periods: [],
          needsReview: false,
        },
        { status: 400 }
      );
    }

    const mimeType = file.type;

    // 🚫 temporary PDF guard so we stop 500-ing
    if (mimeType === 'application/pdf') {
      return NextResponse.json(
        {
          success: false,
          error:
            'PDF OCR is not available on this server right now. Please save/export the sea service letter as an image (PNG/JPG) and upload again.',
          servicePeriods: { extracted: 0, inserted: 0, duplicates: 0 },
          periods: [],
          needsReview: false,
        },
        { status: 400 }
      );
    }

    // ---------- IMAGE PATH (works) ----------
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    console.log('[OCR] Processing sea service upload...');
    console.log(
      `[OCR] File: ${file.name} (${mimeType}) for user ${userId} from ${storagePath}`
    );

    console.log('[OCR] Image detected, using Google Vision...');
    const visionResult = await extractTextFromDocument(buffer, mimeType);
    const extractedText = visionResult.text;

    if (!extractedText || extractedText.trim().length === 0) {
      return NextResponse.json(
        {
          success: false,
          error: 'No text could be extracted from the document',
          servicePeriods: { extracted: 0, inserted: 0, duplicates: 0 },
          periods: [],
          needsReview: false,
        },
        { status: 400 }
      );
    }

    console.log('[OCR] Parsing extracted text...');
    const parsed = parseSeaServiceLetter(extractedText);
    const extractedCount = parsed.servicePeriods.length;

    const rowsToInsert: any[] = [];
    let insertedCount = 0;
    let duplicateCount = 0;
    let anyNeedsReview = parsed.needsManualReview ?? false;
    const now = new Date().toISOString();

    for (const period of parsed.servicePeriods) {
      const vesselName = period.vesselName ?? null;
      const signOn = toPgDate(period.signOnDate);
      const signOff = toPgDate(period.signOffDate);
      const daysServed =
        typeof period.daysServed === 'number' ? period.daysServed : null;
      const positionHeld = period.position ?? null;
      const propulsionType = period.propulsionType ?? null;
      const department = period.department ?? null;
      const grossTonnage =
        typeof period.grossTonnage === 'number'
          ? period.grossTonnage
          : null;
      const horsepower =
        typeof period.horsepower === 'number' ? period.horsepower : null;
      const route = period.route ?? null;

      // duplicate check
      let isDuplicate = false;
      if (vesselName && signOn && signOff) {
        const { data: existing } = await supabase
          .from('sea_service')
          .select('id')
          .eq('user_id', userId)
          .eq('vessel_name', vesselName)
          .eq('sign_on_date', signOn)
          .eq('sign_off_date', signOff)
          .maybeSingle();

        if (existing) {
          duplicateCount++;
          isDuplicate = true;
        }
      }

      if (isDuplicate) continue;

      const rowNeedsReview =
        !vesselName ||
        !signOn ||
        !signOff ||
        !positionHeld ||
        (period.validationFlags ?? []).some((f) => f.type === 'error');

      if (rowNeedsReview) {
        anyNeedsReview = true;
      }

      const row = {
        user_id: userId,
        document_id: null,
        vessel_name: vesselName,
        official_number: null,
        gross_tonnage: grossTonnage,
        horsepower: horsepower,
        propulsion_type: propulsionType,
        route: route,
        sign_on_date: signOn,
        sign_off_date: signOff,
        days_served: daysServed,
        position_held: positionHeld,
        department: department,
        is_creditable: true,
        creditable_for_routes: null,
        creditable_toward: null,
        tonnage_category: null,
        counts_toward_unlimited: true,
        raw_ocr_text: extractedText,
        ocr_confidence: null,
        ocr_method: 'google-vision',
        ocr_processed_at: now,
        needs_manual_review: rowNeedsReview,
        validation_flags: period.validationFlags ?? [],
        verified: false,
        verified_at: null,
        verified_by: null,
        notes: null,
        created_at: now,
        updated_at: now,
      };

      rowsToInsert.push(row);
    }

    if (rowsToInsert.length > 0) {
      const { error: insertErr } = await supabase
        .from('sea_service')
        .insert(rowsToInsert);
      if (insertErr) {
        console.error('[OCR] Supabase insert error:', insertErr);
      } else {
        insertedCount = rowsToInsert.length;
      }
    }

    return NextResponse.json(
      {
        success: true,
        servicePeriods: {
          extracted: extractedCount,
          inserted: insertedCount,
          duplicates: duplicateCount,
        },
        periods: parsed.servicePeriods,
        needsReview: anyNeedsReview,
      },
      { status: 200 }
    );
  } catch (err) {
    console.error('[OCR] Text extraction failed:', err);
    return NextResponse.json(
      {
        success: false,
        error:
          err instanceof Error ? err.message : 'Unknown OCR processing error',
        servicePeriods: { extracted: 0, inserted: 0, duplicates: 0 },
        periods: [],
        needsReview: false,
      },
      { status: 500 }
    );
  }
}
