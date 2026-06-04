// lib/ocr/pdf-text.ts
/**
 * Extract embedded text from a PDF (non-OCR).
 */

type PdfTextItem = {
  str?: string;
};

function getItemText(item: unknown): string {
  if (!item || typeof item !== 'object') return '';
  const value = (item as PdfTextItem).str;
  return typeof value === 'string' ? value : '';
}

export async function extractTextFromPdf(buffer: Buffer): Promise<string> {
  const pdfjs = await import('pdfjs-dist/legacy/build/pdf.mjs');
  const isBrowser = typeof window !== 'undefined';
  if (isBrowser && !pdfjs.GlobalWorkerOptions?.workerSrc) {
    pdfjs.GlobalWorkerOptions.workerSrc = new URL(
      'pdfjs-dist/build/pdf.worker.min.mjs',
      import.meta.url
    ).toString();
  }
  const loadingTask = pdfjs.getDocument({
    data: new Uint8Array(buffer),
    disableWorker: !isBrowser,
  });
  const pdf = await loadingTask.promise;

  let combined = '';
  for (let pageNumber = 1; pageNumber <= pdf.numPages; pageNumber += 1) {
    const page = await pdf.getPage(pageNumber);
    const content = await page.getTextContent();
    const pageText = content.items
      .map((item) => getItemText(item))
      .filter(Boolean)
      .join(' ')
      .trim();

    if (pageText) {
      combined = combined ? `${combined}\n\n${pageText}` : pageText;
    }
  }

  return combined.trim();
}
