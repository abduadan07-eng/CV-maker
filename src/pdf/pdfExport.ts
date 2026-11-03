import html2canvas from 'html2canvas-pro';
import { jsPDF } from 'jspdf';

export interface PDFExportOptions {
  elementId: string;
  fileName?: string;
  quality?: number;
}

/**
 * Downloads a captured DOM element as an A4 PDF.
 * Uses html2canvas-pro for full native support of modern CSS (oklch, oklab, display-p3)
 * and resets zoom/transforms on cloned elements for crisp, unclipped capture.
 */
export async function exportElementToPDF({
  elementId,
  fileName = 'CV_Document.pdf',
  quality = 2
}: PDFExportOptions): Promise<boolean> {
  const element = document.getElementById(elementId);
  if (!element) {
    throw new Error(`Element with id "${elementId}" not found`);
  }

  // Preserve original inline styling
  const originalWidth = element.style.width;
  const originalMaxWidth = element.style.maxWidth;

  try {
    // Render using html2canvas-pro with robust settings
    const canvas = await html2canvas(element, {
      scale: quality,
      useCORS: true,
      allowTaint: false,
      logging: false,
      backgroundColor: '#ffffff',
      windowWidth: 1200,
      onclone: (clonedDoc, clonedElement) => {
        // Reset any zoom scaling, margins, or relative positioning on ancestors
        let current: HTMLElement | null = clonedElement;
        while (current && current !== clonedDoc.body) {
          current.style.transform = 'none';
          current.style.transition = 'none';
          current = current.parentElement;
        }

        clonedElement.style.transform = 'none';
        clonedElement.style.position = 'static';
        clonedElement.style.margin = '0 auto';
        clonedElement.style.left = 'auto';
        clonedElement.style.top = 'auto';
        clonedElement.style.width = '794px';

        // Ensure all images in clone request anonymous CORS
        const images = clonedElement.querySelectorAll('img');
        images.forEach((img) => {
          img.crossOrigin = 'anonymous';
        });
      }
    });

    // Safely generate base64 image data
    let imgData: string;
    try {
      imgData = canvas.toDataURL('image/jpeg', 0.95);
    } catch {
      imgData = canvas.toDataURL('image/png');
    }

    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4',
      compress: true
    });

    const pageWidth = 210;
    const pageHeight = 297;
    const canvasWidth = canvas.width;
    const canvasHeight = canvas.height;

    // Calculate height of the image scaled to fit A4 width (210mm)
    const imgHeight = (canvasHeight * pageWidth) / canvasWidth;

    let heightLeft = imgHeight;
    let position = 0;

    // First page
    pdf.addImage(imgData, 'JPEG', 0, position, pageWidth, imgHeight, undefined, 'FAST');
    heightLeft -= pageHeight;

    // Additional pages if content overflows A4 height
    while (heightLeft > 5) { // 5mm threshold to prevent empty trailing page
      position = heightLeft - imgHeight;
      pdf.addPage();
      pdf.addImage(imgData, 'JPEG', 0, position, pageWidth, imgHeight, undefined, 'FAST');
      heightLeft -= pageHeight;
    }

    // Trigger download with multi-browser delivery
    deliverPdfToUser(pdf, fileName);

    return true;
  } catch (error) {
    console.error('Error generating PDF:', error);
    throw error;
  } finally {
    element.style.width = originalWidth;
    element.style.maxWidth = originalMaxWidth;
  }
}

/**
 * Delivers the PDF document to the user reliably across mobile browsers,
 * desktop browsers, and sandboxed iframes.
 */
function deliverPdfToUser(pdf: jsPDF, fileName: string): void {
  // 1. Primary jsPDF download mechanism
  try {
    pdf.save(fileName);
  } catch (err) {
    console.warn('pdf.save failed, trying blob anchor download:', err);
  }

  // 2. Direct Blob anchor download to ensure reliability in iframes and mobile
  try {
    const blob = pdf.output('blob');
    const blobUrl = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = blobUrl;
    link.download = fileName;
    link.rel = 'noopener';
    link.style.display = 'none';
    document.body.appendChild(link);
    link.click();

    setTimeout(() => {
      if (document.body.contains(link)) {
        document.body.removeChild(link);
      }
      URL.revokeObjectURL(blobUrl);
    }, 4000);
  } catch (blobErr) {
    console.error('Fallback Blob download error:', blobErr);
  }
}

export function printCv(): void {
  window.print();
}

export async function shareCv(title: string, text: string): Promise<boolean> {
  if (navigator.share) {
    try {
      await navigator.share({
        title,
        text,
        url: window.location.href
      });
      return true;
    } catch (err: any) {
      if (err.name !== 'AbortError') {
        console.error('Error sharing:', err);
      }
      return false;
    }
  }
  return false;
}
