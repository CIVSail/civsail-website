// app/api/ocr/process-sea-service/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { extractTextFromDocument } from '@/lib/ocr/google-vision';
import { convertPdfFirstPage } from '@/lib/ocr/pdf-converter';
import { parseSeaServiceLetter } from '@/lib/utils/sea-service-parser'; // ✅ FIXED: Correct function name

/**
 * GET /api/ocr/process-sea-service
 * Health check endpoint
 */
export async function GET() {
  return new Response('✅ connected');
}

/**
 * POST /api/ocr/process-sea-service
 * Process uploaded sea service file with OCR
 * Handles both PDFs (converts to image first) and images directly
 */
export async function POST(request: NextRequest) {
  console.log('[OCR] Processing sea service upload...');

  try {
    // Get authenticated user
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json(
        { success: false, error: 'Not authenticated' },
        { status: 401 }
      );
    }

    // Parse form data
    const formData = await request.formData();
    const file = formData.get('file') as File;
    const storagePath = formData.get('storagePath') as string | null;

    if (!file) {
      return NextResponse.json(
        { success: false, error: 'No file provided' },
        { status: 400 }
      );
    }

    console.log(
      `[OCR] Processing file: ${file.name} (${file.type}, ${file.size} bytes)`
    );

    // Convert file to buffer
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // STEP 1: Convert PDF to image if needed
    let imageBuffer: Buffer;

    if (file.type === 'application/pdf') {
      console.log('[OCR] PDF detected, converting to image first...');

      try {
        imageBuffer = await convertPdfFirstPage(buffer);
        console.log(
          `[OCR] PDF converted to image (${imageBuffer.length} bytes)`
        );
      } catch (conversionError: any) {
        console.error('[OCR] PDF conversion failed:', conversionError.message);
        return NextResponse.json(
          {
            success: false,
            error:
              'This PDF could not be processed. Please try converting it to an image (PNG/JPG) first.',
            servicePeriods: { extracted: 0, inserted: 0, duplicates: 0 },
            periods: [],
            needsReview: false,
          },
          { status: 400 }
        );
      }
    } else if (file.type.startsWith('image/')) {
      // Already an image, use as-is
      imageBuffer = buffer;
      console.log('[OCR] Image file, processing directly');
    } else {
      return NextResponse.json(
        {
          success: false,
          error: `Unsupported file type: ${file.type}. Please upload a PDF or image file.`,
          servicePeriods: { extracted: 0, inserted: 0, duplicates: 0 },
          periods: [],
          needsReview: false,
        },
        { status: 400 }
      );
    }

    // STEP 2: Extract text using OCR
    console.log('[OCR] Extracting text with Google Vision API...');
    let extractedText: string;

    try {
      const ocrResult = await extractTextFromDocument(imageBuffer);
      extractedText = ocrResult.text ?? '';

      if (!extractedText || extractedText.trim().length === 0) {
        throw new Error('No text found in document');
      }

      console.log(`[OCR] Extracted ${extractedText.length} characters`);
    } catch (ocrError: any) {
      console.error('[OCR] Text extraction failed:', ocrError.message);
      return NextResponse.json(
        {
          success: false,
          error:
            'Failed to extract text from document. Please ensure the image is clear and readable.',
          servicePeriods: { extracted: 0, inserted: 0, duplicates: 0 },
          periods: [],
          needsReview: false,
        },
        { status: 500 }
      );
    }

    // STEP 3: Parse sea service periods from text
    console.log('[OCR] Parsing sea service periods...');
    const parseResult = parseSeaServiceLetter(extractedText); // ✅ FIXED: Correct function name

    // ✅ FIXED: Access servicePeriods (not "periods")
    if (parseResult.servicePeriods.length === 0) {
      console.warn('[OCR] No service periods found in document');
      return NextResponse.json({
        success: true,
        servicePeriods: { extracted: 0, inserted: 0, duplicates: 0 },
        periods: [],
        needsReview: true,
        error:
          'No service periods found. Please check if this is a valid Sea Service Letter.',
      });
    }

    console.log(
      `[OCR] Found ${parseResult.servicePeriods.length} service period(s)`
    );

    // STEP 4: Insert periods into database (skip duplicates)
    let insertedCount = 0;
    let duplicateCount = 0;
    const periodsWithStatus: any[] = [];

    // ✅ FIXED: Loop over servicePeriods (not "periods")
    for (const period of parseResult.servicePeriods) {
      // Map parser output (camelCase) to database schema (snake_case)
      const vesselName = period.vesselName;
      const signOnDate = period.signOnDate?.toISOString().split('T')[0] || null;
      const signOffDate =
        period.signOffDate?.toISOString().split('T')[0] || null;
      const positionHeld = period.position;
      const daysServed = period.daysServed;
      const tonnage = period.grossTonnage;

      // Calculate tonnage category
      let tonnageCategory: 'under_200' | '200_to_1600' | 'over_1600' | null =
        null;
      if (tonnage) {
        if (tonnage < 200) tonnageCategory = 'under_200';
        else if (tonnage <= 1600) tonnageCategory = '200_to_1600';
        else tonnageCategory = 'over_1600';
      }

      // Calculate creditable routes based on actual route
      const creditableForRoutes: string[] = [];
      if (period.route === 'oceans') {
        creditableForRoutes.push(
          'oceans',
          'near_coastal',
          'great_lakes',
          'inland'
        );
      } else if (period.route === 'near_coastal') {
        creditableForRoutes.push('near_coastal', 'great_lakes', 'inland');
      } else if (period.route === 'great_lakes') {
        creditableForRoutes.push('great_lakes', 'inland');
      } else if (period.route === 'inland') {
        creditableForRoutes.push('inland');
      }

      // Determine if needs manual review
      const needsManualReview =
        period.confidence === 'low' ||
        period.validationFlags.some((f) => f.type === 'error');

      // Check for duplicates
      const { data: existing, error: checkError } = await supabase
        .from('sea_service')
        .select('id')
        .eq('user_id', user.id)
        .eq('vessel_name', vesselName)
        .eq('sign_on_date', signOnDate)
        .eq('sign_off_date', signOffDate)
        .eq('position_held', positionHeld)
        .maybeSingle();

      if (checkError) {
        console.error('[OCR] Duplicate check failed:', checkError);
      }

      if (existing) {
        // Duplicate found
        duplicateCount++;
        periodsWithStatus.push({
          vessel_name: vesselName,
          sign_on_date: signOnDate,
          sign_off_date: signOffDate,
          position_held: positionHeld,
          days_served: daysServed,
          tonnage,
          tonnage_category: tonnageCategory,
          propulsion: period.propulsionType,
          department: period.department,
          route: period.route,
          creditable_for_routes: creditableForRoutes,
          needs_manual_review: needsManualReview,
          verified: false,
          isDuplicate: true,
          id: existing.id,
        });
        console.log(`[OCR] Duplicate: ${vesselName} ${signOnDate}`);
      } else {
        // New period - insert it
        const { data: inserted, error: insertError } = await supabase
          .from('sea_service')
          .insert({
            user_id: user.id,
            vessel_name: vesselName,
            sign_on_date: signOnDate,
            sign_off_date: signOffDate,
            position_held: positionHeld,
            tonnage,
            tonnage_category: tonnageCategory,
            propulsion: period.propulsionType,
            department: period.department,
            route: period.route,
            creditable_for_routes: creditableForRoutes,
            needs_manual_review: needsManualReview,
            verified: false,
          })
          .select()
          .single();

        if (insertError) {
          console.error('[OCR] Insert failed:', insertError);
          periodsWithStatus.push({
            vessel_name: vesselName,
            sign_on_date: signOnDate,
            sign_off_date: signOffDate,
            position_held: positionHeld,
            days_served: daysServed,
            tonnage,
            isDuplicate: false,
            error: 'Failed to save to database',
          });
        } else {
          insertedCount++;
          console.log(`[OCR] Inserted: ${vesselName} ${signOnDate}`);
          periodsWithStatus.push({
            ...inserted,
            isDuplicate: false,
          });
        }
      }
    }

    // STEP 5: Return results
    console.log(
      `[OCR] Complete: ${insertedCount} inserted, ${duplicateCount} duplicates`
    );

    return NextResponse.json({
      success: true,
      servicePeriods: {
        extracted: parseResult.servicePeriods.length,
        inserted: insertedCount,
        duplicates: duplicateCount,
      },
      periods: periodsWithStatus,
      needsReview: parseResult.needsManualReview,
    });
  } catch (error: any) {
    console.error('[OCR] Failed:', error.message);
    return NextResponse.json(
      {
        success: false,
        error: error.message || 'OCR processing failed',
        servicePeriods: { extracted: 0, inserted: 0, duplicates: 0 },
        periods: [],
        needsReview: false,
      },
      { status: 500 }
    );
  }
}
