// app/api/ocr/process-travel-receipt/route.ts
import { NextResponse } from 'next/server';
import { extractTextFromReceipt } from '@/lib/ocr/ocr-space';
import {
  PDFCheckBox,
  PDFDocument,
  PDFDropdown,
  PDFOptionList,
  PDFRadioGroup,
  PDFTextField,
} from 'pdf-lib';

export const runtime = 'nodejs';

function getPdfFormFieldValue(field: unknown): string {
  if (field instanceof PDFTextField) {
    return field.getText() ?? '';
  }

  if (field instanceof PDFDropdown || field instanceof PDFOptionList) {
    return field.getSelected().join(', ');
  }

  if (field instanceof PDFCheckBox) {
    return field.isChecked() ? 'Yes' : '';
  }

  if (field instanceof PDFRadioGroup) {
    return field.getSelected() ?? '';
  }

  return '';
}

async function extractTextFromPdfForm(buffer: Buffer): Promise<string> {
  const pdfDoc = await PDFDocument.load(buffer, { ignoreEncryption: true });
  const form = pdfDoc.getForm();
  const fields = form.getFields();

  const lines: string[] = [];
  for (const field of fields) {
    const name = field.getName();
    const value = getPdfFormFieldValue(field).trim();
    if (!value) continue;
    lines.push(`${name}: ${value}`);
  }

  return lines.join('\n').trim();
}

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
        const formText = await extractTextFromPdfForm(buffer);
        if (formText) {
          results.push({
            fileName: file.name,
            success: true,
            text: formText,
            confidence: 100,
          });
          continue;
        }

        const pdfResult = await extractTextFromReceipt(buffer, 'application/pdf');
        const fallbackMessage =
          'No embedded text found in this PDF. If it is a scanned image, export a higher-resolution version or upload a clear image instead.';

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
