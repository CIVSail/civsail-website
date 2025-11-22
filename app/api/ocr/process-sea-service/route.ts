// app/api/ocr/process-sea-service/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { extractTextFromDocument } from '@/lib/ocr/google-vision';
import { parseSeaServiceLetter } from '@/lib/utils/sea-service-parser';

/**
 * POST /api/ocr/process-sea-service
 * Process uploaded sea service letters with OCR
 * 
 * Handles:
 * - Image files (.png, .jpeg, .jpg) → OCR + parse + save
 * - PDF files → Accept but flag for manual entry
 */
export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    
    // Get authenticated user
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Parse form data
    const formData = await request.formData();
    const file = formData.get('file') as File;
    const storagePath = formData.get('storagePath') as string;

    if (!file) {
      return NextResponse.json(
        { success: false, error: 'No file provided' },
        { status: 400 }
      );
    }

    // Check file type
    const fileType = file.type;
    const fileName = file.name.toLowerCase();
    const isPDF = fileType === 'application/pdf' || fileName.endsWith('.pdf');

    // If PDF, return special response indicating manual entry needed
    if (isPDF) {
      return NextResponse.json({
        success: false,
        isPDF: true,
        fileName: file.name,
        message: 'PDF files cannot be processed automatically. Please enter data manually or re-upload as an image.',
        error: 'PDF_NOT_SUPPORTED',
      });
    }

    // Verify it's an image
    if (!fileType.startsWith('image/')) {
      return NextResponse.json(
        { success: false, error: 'Only image files (.png, .jpeg, .jpg) are supported for OCR' },
        { status: 400 }
      );
    }

    // Convert file to buffer for OCR
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Step 1: OCR extraction
    console.log('[OCR] Processing image:', file.name);
    const ocrResult = await extractTextFromDocument(buffer, fileType);

    if (!ocrResult.success || !ocrResult.text) {
      return NextResponse.json({
        success: false,
        error: ocrResult.error || 'Failed to extract text from image',
        ocrConfidence: ocrResult.confidence,
      });
    }

    console.log('[OCR] Extracted text length:', ocrResult.text.length);
    console.log('[OCR] Confidence:', ocrResult.confidence);

    // Step 2: Parse sea service data
    const parseResult = parseSeaServiceLetter(ocrResult.text);
    
    console.log('[Parser] Found', parseResult.servicePeriods.length, 'service periods');
    console.log('[Parser] Overall confidence:', parseResult.overallConfidence);
    console.log('[Parser] Needs review:', parseResult.needsManualReview);

    if (parseResult.servicePeriods.length === 0) {
      return NextResponse.json({
        success: false,
        error: 'No service periods found in document. Please try manual entry.',
        rawText: parseResult.rawText,
        needsReview: true,
      });
    }

    // Step 3: Check for duplicates and save to database
    const insertedPeriods = [];
    const duplicates = [];

    for (const period of parseResult.servicePeriods) {
      // Skip if missing critical data
      if (!period.vesselName || !period.signOnDate || !period.signOffDate) {
        console.log('[Parser] Skipping incomplete period:', period);
        continue;
      }

      // Check for existing period (duplicate detection)
      const { data: existing, error: checkError } = await supabase
        .from('sea_service')
        .select('id')
        .eq('user_id', user.id)
        .eq('vessel_name', period.vesselName)
        .eq('sign_on_date', period.signOnDate.toISOString().split('T')[0])
        .eq('sign_off_date', period.signOffDate.toISOString().split('T')[0])
        .maybeSingle();

      if (existing) {
        console.log('[DB] Duplicate found, skipping:', period.vesselName);
        duplicates.push(period);
        continue;
      }

      // Prepare database record
      const dbRecord = {
        user_id: user.id,
        vessel_name: period.vesselName,
        sign_on_date: period.signOnDate.toISOString().split('T')[0],
        sign_off_date: period.signOffDate.toISOString().split('T')[0],
        days_served: period.daysServed || 0,
        position_held: period.position || 'Unknown',
        department: period.department || 'Other',
        grt: period.grossTonnage,
        route: period.route || 'Oceans',
        propulsion: period.propulsionType,
        watchkeeping_days: 0, // User can edit this
        supervised: false,
        source_doc_path: storagePath,
        ocr_confidence: period.confidence === 'high' ? 0.9 : period.confidence === 'medium' ? 0.7 : 0.5,
        needs_manual_review: period.confidence === 'low' || period.validationFlags.some(f => f.type === 'error'),
        verified: false, // OCR results need verification
      };

      // Insert into database
      const { data: inserted, error: insertError } = await supabase
        .from('sea_service')
        .insert([dbRecord])
        .select()
        .single();

      if (insertError) {
        console.error('[DB] Insert error:', insertError);
        continue;
      }

      console.log('[DB] Inserted period:', inserted.id);
      insertedPeriods.push(inserted);
    }

    // Return results
    return NextResponse.json({
      success: true,
      servicePeriods: {
        extracted: parseResult.servicePeriods.length,
        inserted: insertedPeriods.length,
        duplicates: duplicates.length,
      },
      periods: insertedPeriods,
      needsReview: parseResult.needsManualReview,
      ocrConfidence: ocrResult.confidence,
      message: insertedPeriods.length > 0
        ? `Successfully processed ${insertedPeriods.length} service period(s)`
        : duplicates.length > 0
        ? 'All periods were duplicates (already in your ledger)'
        : 'No valid periods could be extracted',
    });

  } catch (error) {
    console.error('[OCR API] Error:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : 'Internal server error' 
      },
      { status: 500 }
    );
  }
}