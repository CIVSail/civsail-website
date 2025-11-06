// lib/ocr/google-vision.ts
/**
 * Google Cloud Vision API client for OCR
 * Extracts text from sea service letters (PDFs and images)
 */

import vision from '@google-cloud/vision';

export interface OCRResult {
  success: boolean;
  text: string;
  confidence: number;
  method: 'google_vision';
  error?: string;
  processedAt: string;
}

/**
 * Extract text from a document using Google Cloud Vision
 * 
 * @param fileBuffer - File as Buffer
 * @param mimeType - MIME type (application/pdf, image/jpeg, image/png)
 * @returns Extracted text with confidence score
 */
export async function extractTextFromDocument(
  fileBuffer: Buffer,
  mimeType: string
): Promise<OCRResult> {
  try {
    // Initialize Vision client with credentials from env
    const credentials = JSON.parse(
      process.env.GOOGLE_CLOUD_CREDENTIALS || '{}'
    );
    
    if (!credentials.client_email) {
      throw new Error('GOOGLE_CLOUD_CREDENTIALS not properly configured');
    }

    const client = new vision.ImageAnnotatorClient({
      credentials,
    });

    // Prepare the request
    const request = {
      image: {
        content: fileBuffer.toString('base64'),
      },
      // Use document text detection (better for PDFs)
      features: [
        {
          type: 'DOCUMENT_TEXT_DETECTION' as const,
        },
      ],
    };

    // Call Vision API
    const [result] = await client.annotateImage(request);
    
    if (result.error) {
      throw new Error(result.error.message || 'Vision API error');
    }

    // Extract full text
    const fullTextAnnotation = result.fullTextAnnotation;
    const text = fullTextAnnotation?.text || '';

    if (!text) {
      return {
        success: false,
        text: '',
        confidence: 0,
        method: 'google_vision',
        error: 'No text detected in document',
        processedAt: new Date().toISOString(),
      };
    }

    // Calculate average confidence from pages
    const pages = fullTextAnnotation?.pages || [];
    let totalConfidence = 0;
    let wordCount = 0;

    for (const page of pages) {
      for (const block of page.blocks || []) {
        for (const paragraph of block.paragraphs || []) {
          for (const word of paragraph.words || []) {
            if (word.confidence) {
              totalConfidence += word.confidence;
              wordCount++;
            }
          }
        }
      }
    }

    const avgConfidence = wordCount > 0 
      ? Math.round((totalConfidence / wordCount) * 100)
      : 85; // Default confidence if not available

    return {
      success: true,
      text: text.trim(),
      confidence: avgConfidence,
      method: 'google_vision',
      processedAt: new Date().toISOString(),
    };

  } catch (error) {
    console.error('Google Vision OCR error:', error);
    
    return {
      success: false,
      text: '',
      confidence: 0,
      method: 'google_vision',
      error: error instanceof Error ? error.message : 'Unknown OCR error',
      processedAt: new Date().toISOString(),
    };
  }
}

/**
 * Test the Google Cloud Vision connection
 * 
 * @returns true if credentials are valid
 */
export async function testConnection(): Promise<boolean> {
  try {
    const credentials = JSON.parse(
      process.env.GOOGLE_CLOUD_CREDENTIALS || '{}'
    );
    
    if (!credentials.client_email) {
      console.error('Missing GOOGLE_CLOUD_CREDENTIALS');
      return false;
    }

    const client = new vision.ImageAnnotatorClient({
      credentials,
    });

    // Try a simple API call (no actual image needed for connection test)
    // Just checks if credentials work
    await client.getProjectId();
    
    return true;
  } catch (error) {
    console.error('Google Vision connection test failed:', error);
    return false;
  }
}