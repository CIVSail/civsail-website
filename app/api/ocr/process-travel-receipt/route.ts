// app/api/ocr/process-travel-receipt/route.ts
import { NextResponse } from 'next/server';
import { extractTextFromReceipt } from '@/lib/ocr/ocr-space';
import { execFile } from 'node:child_process';
import { promises as fs } from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { promisify } from 'node:util';
import {
  PDFCheckBox,
  PDFDocument,
  PDFDropdown,
  PDFOptionList,
  PDFRadioGroup,
  PDFTextField,
} from 'pdf-lib';

export const runtime = 'nodejs';

const execFileAsync = promisify(execFile);

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

async function extractTextFromRasterizedPdf(buffer: Buffer): Promise<{
  text: string;
  confidence: number;
}> {
  const tmpDir = await fs.mkdtemp(path.join(os.tmpdir(), 'civsail-ocr-'));
  const pdfPath = path.join(tmpDir, 'input.pdf');
  const outputPrefix = path.join(tmpDir, 'page');

  try {
    await fs.writeFile(pdfPath, buffer);

    await execFileAsync('pdftoppm', [
      '-png',
      '-r',
      '200',
      pdfPath,
      outputPrefix,
    ]);

    const files = (await fs.readdir(tmpDir))
      .filter((file) => file.startsWith('page-') && file.endsWith('.png'))
      .sort((a, b) => {
        const aNum = Number(a.replace(/\D/g, ''));
        const bNum = Number(b.replace(/\D/g, ''));
        return aNum - bNum;
      });

    if (files.length === 0) {
      return { text: '', confidence: 0 };
    }

    const pageTexts: string[] = [];
    const confidences: number[] = [];

    for (const file of files) {
      const pageBuffer = await fs.readFile(path.join(tmpDir, file));
      const ocrResult = await extractTextFromReceipt(pageBuffer, 'image/png');
      if (ocrResult.success && ocrResult.text.trim()) {
        pageTexts.push(ocrResult.text.trim());
        confidences.push(ocrResult.confidence);
      }
    }

    const text = pageTexts.join('\n\n').trim();
    if (!text) {
      return { text: '', confidence: 0 };
    }

    const confidence = Math.round(
      confidences.reduce((sum, value) => sum + value, 0) /
        Math.max(confidences.length, 1)
    );

    return { text, confidence };
  } finally {
    await fs.rm(tmpDir, { recursive: true, force: true });
  }
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

        const rasterResult = await extractTextFromRasterizedPdf(buffer);
        const fallbackMessage =
          'No text could be extracted from this PDF. Try a higher-resolution export.';

        results.push({
          fileName: file.name,
          success: Boolean(rasterResult.text),
          text: rasterResult.text,
          confidence: rasterResult.confidence,
          error: rasterResult.text ? undefined : fallbackMessage,
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
