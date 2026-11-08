import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas-pro';

export interface PDFExportOptions {
  elementId: string;
  fileName?: string;
  quality?: number;
}

/**
 * Generates a real, multi-page vector PDF with selectable, copyable, and searchable text,
 * preserving layout, colors, and live clickable hyperlinks (mailto, tel, web).
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

  try {
    // 1. Try vector HTML rendering with jsPDF.html for 100% selectable text & clickable links
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'pt',
      format: 'a4',
      compress: true
    });

    const a4WidthPt = 595.28;
    const a4HeightPt = 841.89;

    // Use html method with robust options
    await new Promise<void>((resolve, reject) => {
      pdf.html(element, {
        callback: (doc) => {
          // Scan for links in the original element and inject active PDF annotations if needed
          try {
            const links = element.querySelectorAll('a');
            const elemRect = element.getBoundingClientRect();
            const scaleX = a4WidthPt / elemRect.width;
            const scaleY = scaleX;

            links.forEach(a => {
              const rect = a.getBoundingClientRect();
              const href = a.getAttribute('href');
              if (href && href !== '#' && href !== '') {
                const x = (rect.left - elemRect.left) * scaleX;
                const y = (rect.top - elemRect.top) * scaleY;
                const w = rect.width * scaleX;
                const h = rect.height * scaleY;
                const pageIndex = Math.floor(y / a4HeightPt) + 1;
                const yOnPage = y % a4HeightPt;

                if (pageIndex <= doc.getNumberOfPages()) {
                  doc.setPage(pageIndex);
                  doc.link(x, yOnPage, w, h, { url: href });
                }
              }
            });
          } catch (linkErr) {
            console.warn('Notice: PDF link annotation notice:', linkErr);
          }

          deliverPdfToUser(doc, fileName);
          resolve();
        },
        x: 0,
        y: 0,
        width: a4WidthPt,
        windowWidth: 794,
        autoPaging: 'text',
        margin: [0, 0, 0, 0],
        html2canvas: {
          scale: quality,
          useCORS: true,
          logging: false,
          backgroundColor: '#ffffff'
        }
      }).catch(reject);
    });

    return true;
  } catch (htmlError) {
    console.warn('Vector html export fallback to high-fidelity canvas capture:', htmlError);
    return await fallbackCanvasPDFExport(element, fileName, quality);
  }
}

/**
 * Robust fallback capture using html2canvas-pro with multi-page handling
 */
async function fallbackCanvasPDFExport(
  element: HTMLElement,
  fileName: string,
  quality: number
): Promise<boolean> {
  const canvas = await html2canvas(element, {
    scale: quality,
    useCORS: true,
    allowTaint: false,
    logging: false,
    backgroundColor: '#ffffff',
    windowWidth: 1200
  });

  const imgData = canvas.toDataURL('image/jpeg', 0.95);
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
  const imgHeight = (canvasHeight * pageWidth) / canvasWidth;

  let heightLeft = imgHeight;
  let position = 0;

  pdf.addImage(imgData, 'JPEG', 0, position, pageWidth, imgHeight, undefined, 'FAST');
  heightLeft -= pageHeight;

  while (heightLeft > 5) {
    position = heightLeft - imgHeight;
    pdf.addPage();
    pdf.addImage(imgData, 'JPEG', 0, position, pageWidth, imgHeight, undefined, 'FAST');
    heightLeft -= pageHeight;
  }

  deliverPdfToUser(pdf, fileName);
  return true;
}

/**
 * Delivers the PDF document to the user reliably across mobile browsers,
 * desktop browsers, and sandboxed iframes.
 */
function deliverPdfToUser(pdf: jsPDF, fileName: string): void {
  try {
    pdf.save(fileName);
  } catch (err) {
    console.warn('pdf.save failed, trying blob anchor download:', err);
  }

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
    console.error('Blob download error:', blobErr);
  }
}

/**
 * Opens browser/Android native print dialog for 100% native vector PDF generation
 */
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
