// lib/ocr/ocr-space.ts
/**
 * OCR.Space API client for receipt OCR
 * Extracts text from travel receipt images
 */

import { ocrSpace, type OcrSpaceResponse } from 'ocr-space-api-wrapper';

export interface OCRSpaceResult {
  success: boolean;
  text: string;
  confidence: number;
  method: 'ocr_space';
  error?: string;
  processedAt: string;
  rawResponse?: OcrSpaceResponse;
}

/**
 * Extract text from a receipt image using OCR.Space
 *
 * @param fileBuffer - File as Buffer
 * @param mimeType - MIME type (image/jpeg, image/png, image/webp, application/pdf)
 * @returns Extracted text with confidence score
 */
export async function extractTextFromReceipt(
  fileBuffer: Buffer,
  mimeType: string
): Promise<OCRSpaceResult> {
  try {
    const apiKey = process.env.OCR_SPACE_KEY;
    if (!apiKey) {
      throw new Error('OCR_SPACE_KEY not configured');
    }

    const isImage = mimeType.startsWith('image/');
    const isPdf = mimeType === 'application/pdf';
    if (!isImage && !isPdf) {
      throw new Error('OCR.Space only supports image or PDF uploads');
    }

    const dataUrl = toDataUrl(fileBuffer, mimeType);
    const filetype = toOcrSpaceFileType(mimeType);

    const response = await ocrSpace(dataUrl, {
      apiKey,
      language: 'eng',
      isOverlayRequired: true,
      OCREngine: '2',
      filetype,
    });

    const isError =
      response.IsErroredOnProcessing ||
      (typeof response.OCRExitCode === 'number' && response.OCRExitCode >= 3);

    if (isError) {
      const errorMessage =
        response.ErrorMessage || response.ErrorDetails || 'OCR.Space error';
      return {
        success: false,
        text: '',
        confidence: 0,
        method: 'ocr_space',
        error: errorMessage,
        processedAt: new Date().toISOString(),
        rawResponse: response,
      };
    }

    const parsedResults = response.ParsedResults || [];
    const text = parsedResults
      .map((result) => (result?.ParsedText || '').trim())
      .filter(Boolean)
      .join('\n\n');

    if (!text) {
      return {
        success: false,
        text: '',
        confidence: 0,
        method: 'ocr_space',
        error: 'No text detected in receipt image',
        processedAt: new Date().toISOString(),
        rawResponse: response,
      };
    }

    const confidence = calculateAverageConfidence(response);

    return {
      success: true,
      text,
      confidence,
      method: 'ocr_space',
      processedAt: new Date().toISOString(),
    };
  } catch (error) {
    console.error('OCR.Space OCR error:', error);

    return {
      success: false,
      text: '',
      confidence: 0,
      method: 'ocr_space',
      error: error instanceof Error ? error.message : 'Unknown OCR error',
      processedAt: new Date().toISOString(),
    };
  }
}

/**
 * Calculate average confidence from OCR.Space word-level confidence values.
 * Returns a 0-100 score; defaults to 85 if not available.
 */
function calculateAverageConfidence(response: OcrSpaceResponse): number {
  let total = 0;
  let count = 0;

  const results = response.ParsedResults || [];
  for (const result of results) {
    const lines = result.TextOverlay?.Lines || [];
    for (const line of lines) {
      const words = Array.isArray(line?.Words) ? line.Words : [];
      for (const word of words) {
        const value = Number(word?.WordConfidence);
        if (!Number.isNaN(value)) {
          total += value;
          count += 1;
        }
      }
    }
  }

  if (count === 0) {
    return 85;
  }

  return Math.round(total / count);
}

function toDataUrl(fileBuffer: Buffer, mimeType: string): string {
  const base64 = fileBuffer.toString('base64');
  return `data:${mimeType};base64,${base64}`;
}

function toOcrSpaceFileType(mimeType: string): string | undefined {
  switch (mimeType) {
    case 'application/pdf':
      return 'PDF';
    case 'image/png':
      return 'PNG';
    case 'image/jpeg':
    case 'image/jpg':
      return 'JPG';
    case 'image/gif':
      return 'GIF';
    case 'image/bmp':
      return 'BMP';
    case 'image/tiff':
    case 'image/tif':
      return 'TIF';
    default:
      return undefined;
  }
}

/**
 * Test the OCR.Space connection with a minimal request
 *
 * @returns true if the API key is valid
 */
export async function testConnection(): Promise<boolean> {
  try {
    const apiKey = process.env.OCR_SPACE_KEY;
    if (!apiKey) {
      console.error('Missing OCR_SPACE_KEY');
      return false;
    }

    const tinyPngDataUrl =
      'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR4nGNgYAAAAAMAASsJTYQAAAAASUVORK5CYII=';

    const response = await ocrSpace(tinyPngDataUrl, {
      apiKey,
      language: 'eng',
      isOverlayRequired: false,
      OCREngine: '2',
      filetype: 'PNG',
    });

    return !response.IsErroredOnProcessing;
  } catch (error) {
    console.error('OCR.Space connection test failed:', error);
    return false;
  }
}
