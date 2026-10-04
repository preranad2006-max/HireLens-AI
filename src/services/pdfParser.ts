import * as pdfjsLib from 'pdfjs-dist';

// Configure worker source
try {
  pdfjsLib.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@${pdfjsLib.version || '4.0.379'}/build/pdf.worker.min.mjs`;
} catch (e) {
  console.warn('Could not set pdf workerSrc directly:', e);
}

/**
 * Extracts plain text from an uploaded PDF File.
 */
export async function extractTextFromPDF(file: File): Promise<string> {
  try {
    const arrayBuffer = await file.arrayBuffer();
    const loadingTask = pdfjsLib.getDocument({
      data: arrayBuffer,
      useSystemFonts: true,
    });

    const pdf = await loadingTask.promise;
    const numPages = pdf.numPages;
    const textPieces: string[] = [];

    for (let pageNum = 1; pageNum <= numPages; pageNum++) {
      const page = await pdf.getPage(pageNum);
      const textContent = await page.getTextContent();
      const pageText = textContent.items
        .map((item: any) => item.str || '')
        .join(' ');
      textPieces.push(pageText);
    }

    const fullText = textPieces.join('\n\n').trim();
    if (!fullText) {
      throw new Error('PDF appears to contain no extractable text or is a scanned image.');
    }
    return fullText;
  } catch (error: any) {
    console.error('Error extracting PDF text:', error);
    throw new Error(error.message || 'Failed to extract text from PDF');
  }
}

/**
 * Helper to read plain text files (.txt, .md)
 */
export async function readTextFile(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve((reader.result as string) || '');
    reader.onerror = () => reject(new Error('Failed to read file'));
    reader.readAsText(file);
  });
}
