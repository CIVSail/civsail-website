// lib/ocr/pdf-converter.ts
/// <reference types="node" />
import { convert } from 'pdf-img-convert';

/**
 * Convert PDF to PNG images
 * Uses pdf-img-convert which works reliably on Vercel
 * 
 * @param pdfBuffer - PDF file as Buffer
 * @param options - Conversion options
 * @returns Array of PNG buffers (one per page)
 */
export async function convertPdfToImages(
  pdfBuffer: Buffer,
  options: {
    scale?: number; // DPI scaling (default 2.0 = 200 DPI for good quality)
    page?: number; // Specific page to convert (1-indexed), or undefined for all pages
  } = {}
): Promise<Buffer[]> {
  const { scale = 2.0, page } = options;

  try {
    console.log(`[PDF Converter] Converting PDF (${pdfBuffer.length} bytes) at ${scale}x scale`);

    // Convert PDF to images
    // The library returns Uint8Array[], we convert to Buffer[]
    const outputImages = await convert(pdfBuffer, {
      width: Math.floor(2550 * scale), // ~8.5" at 300 DPI base
      height: Math.floor(3300 * scale), // ~11" at 300 DPI base
      page_numbers: page ? [page] : undefined, // Specific page or all
      base64: false, // Return as Buffer
    });

    // Convert Uint8Array to Buffer
    // Fix: Explicitly type as Uint8Array and use Array methods
    const imageBuffers = (outputImages as Uint8Array[]).map((uint8Array) => 
      Buffer.from(uint8Array)
    );

    console.log(`[PDF Converter] Successfully converted ${imageBuffers.length} page(s)`);
    
    return imageBuffers;
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    console.error('[PDF Converter] Error:', errorMessage);
    throw new Error(`Failed to convert PDF: ${errorMessage}`);
  }
}

/**
 * Convert just the first page of a PDF to PNG
 * Most Sea Service Letters are single-page, so this is the common case
 * 
 * @param pdfBuffer - PDF file as Buffer
 * @param scale - DPI scaling (default 2.0)
 * @returns PNG buffer of first page
 */
export async function convertPdfFirstPage(
  pdfBuffer: Buffer,
  scale: number = 2.0
): Promise<Buffer> {
  const images = await convertPdfToImages(pdfBuffer, { scale, page: 1 });
  
  if (images.length === 0) {
    throw new Error('PDF conversion produced no images');
  }
  
  return images[0];
}

/**
 * Convert all pages of a PDF to PNGs
 * For multi-page documents
 * 
 * @param pdfBuffer - PDF file as Buffer
 * @param scale - DPI scaling (default 2.0)
 * @returns Array of PNG buffers
 */
export async function convertPdfAllPages(
  pdfBuffer: Buffer,
  scale: number = 2.0
): Promise<Buffer[]> {
  return convertPdfToImages(pdfBuffer, { scale });
}