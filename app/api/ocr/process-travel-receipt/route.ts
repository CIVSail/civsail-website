// app/api/ocr/process-travel-receipt/route.ts
import { NextResponse } from 'next/server';
import { extractTextFromReceipt } from '@/lib/ocr/ocr-space';

export const runtime = 'nodejs';


/**
 * POST /api/ocr/process-travel-receipt
 * Process uploaded receipt images with OCR.Space
 */
export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const files = formData.getAll('files') as File[];

    if (!files || files.length === 0) {
      return NextResponse.json(
        { success: false, error: 'No files provided' },
        { status: 400 }
      );
    }

    const results = [] as {
      fileName: string;
      success: boolean;
      text: string;
      confidence: number;
      error?: string;
    }[];

    for (const file of files) {
      const mimeType = file.type;
      const isImage = mimeType.startsWith('image/');
      const isPdf = mimeType === 'application/pdf';
      if (!isImage && !isPdf) {
        results.push({
          fileName: file.name,
          success: false,
          text: '',
          confidence: 0,
          error: 'Only image files or PDFs are supported',
        });
        continue;
      }

      const arrayBuffer = await file.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);

      if (isPdf) {
        const pdfResult = await extractTextFromReceipt(buffer, 'application/pdf');
        const fallbackMessage =
          'Please upload a clearer image or a higher-quality scan.';

        results.push({
          fileName: file.name,
          success: pdfResult.success,
          text: pdfResult.text,
          confidence: pdfResult.confidence,
          error: pdfResult.success ? undefined : fallbackMessage,
        });
        continue;
      }

      const ocrResult = await extractTextFromReceipt(buffer, mimeType);

      results.push({
        fileName: file.name,
        success: ocrResult.success,
        text: ocrResult.text,
        confidence: ocrResult.confidence,
        error: ocrResult.success
          ? undefined
          : 'Please upload a clearer image or a higher-quality scan.',
      });
    }

    return NextResponse.json({ success: true, results });
  } catch (error) {
    console.error('[OCR API] Travel receipt error:', error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Internal server error',
      },
      { status: 500 }
    );
  }
}
