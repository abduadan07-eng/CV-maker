import React, { useState, useRef, useEffect } from 'react';
import { CVData, TemplateId, CVLanguage } from '../types/cv';
import { getTemplateComponent, getTemplateMeta } from '../templates/TemplateRegistry';
import { useLanguage } from '../i18n/LanguageContext';
import { exportElementToPDF, printCv, shareCv } from '../pdf/pdfExport';
import { TemplateGalleryModal } from '../components/TemplateGalleryModal';
import {
  Download,
  Printer,
  Share2,
  Edit3,
  LayoutTemplate,
  ZoomIn,
  ZoomOut,
  Maximize2,
  Check,
  Globe,
  Sparkles
} from 'lucide-react';

interface LivePreviewProps {
  cvData: CVData;
  templateId: TemplateId;
  onSelectTemplate: (templateId: TemplateId) => void;
  onEdit: () => void;
  onUpdateCVLanguage: (cvLang: CVLanguage) => void;
  onOpenInStudio?: () => void;
}

export const LivePreview: React.FC<LivePreviewProps> = ({
  cvData,
  templateId,
  onSelectTemplate,
  onEdit,
  onUpdateCVLanguage,
  onOpenInStudio
}) => {
  const { t, language } = useLanguage();

  // Calculate the zoom that fits the 794px-wide A4 document perfectly into the screen
  const calculateAutoFitZoom = () => {
    if (typeof window === 'undefined') return 0.85;
    const margin = window.innerWidth < 640 ? 20 : 48;
    const availableWidth = window.innerWidth - margin;
    const computed = Math.min(1.0, Math.max(0.35, availableWidth / 794));
    return Number(computed.toFixed(2));
  };

  const [zoom, setZoom] = useState<number>(() => calculateAutoFitZoom());
  const [docHeight, setDocHeight] = useState<number>(1123);
  const [isGalleryOpen, setIsGalleryOpen] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const containerRef = useRef<HTMLDivElement>(null);
  const TemplateComponent = getTemplateComponent(templateId);
  const currentMeta = getTemplateMeta(templateId);

  const templateName = language === 'so' ? currentMeta.nameSo : currentMeta.nameEn;

  // Track document height dynamically so scaled container never clips the bottom
  useEffect(() => {
    if (containerRef.current) {
      const el = containerRef.current;
      const updateHeight = () => {
        if (el.scrollHeight > 0) {
          setDocHeight(Math.max(1123, el.scrollHeight));
        }
      };
      updateHeight();
      const observer = new ResizeObserver(updateHeight);
      observer.observe(el);
      return () => observer.disconnect();
    }
  }, [templateId, cvData]);

  // Handle window resizing
  useEffect(() => {
    const handleResize = () => {
      // If mobile, auto-recompute fit zoom on rotation
      if (window.innerWidth < 640) {
        setZoom(calculateAutoFitZoom());
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3500);
  };

  const handleDownloadPDF = async () => {
    setIsExporting(true);
    try {
      const sanitizedName = (cvData.personal.fullName || 'Candidate')
        .replace(/[^a-zA-Z0-9]/g, '_')
        .replace(/_+/g, '_');
      const filename = `${sanitizedName}_CV.pdf`;

      await exportElementToPDF({
        elementId: 'cv-document-container',
        fileName: filename,
        quality: 2
      });
      showToast(t('exportSuccessMsg'));
    } catch (err) {
      console.error(err);
      showToast(t('exportErrorMsg'));
    } finally {
      setIsExporting(false);
    }
  };

  const handlePrint = () => {
    printCv();
  };

  const handleShare = async () => {
    const title = `${cvData.personal.fullName || 'My'} CV`;
    const text = `Curriculum Vitae for ${cvData.personal.fullName || 'Candidate'}`;
    const shared = await shareCv(title, text);
    if (!shared) {
      showToast(t('shareNotSupported'));
    }
  };

  return (
    <div className="min-h-screen bg-slate-100/90 pb-20 flex flex-col">
      {/* Top Action Bar (Sticky, No-Print) */}
      <div className="no-print bg-white border-b border-slate-200 sticky top-16 z-20 shadow-xs">
        <div className="max-w-6xl mx-auto px-3 sm:px-4 py-2.5 flex flex-wrap items-center justify-between gap-2.5">
          {/* Left Actions: Back to Edit & Template Picker */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onEdit}
              className="inline-flex items-center gap-1.5 px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl text-xs font-semibold cursor-pointer transition-colors"
            >
              <Edit3 className="w-3.5 h-3.5 text-blue-600" />
              <span>{t('returnToEditor')}</span>
            </button>

            <button
              type="button"
              onClick={() => setIsGalleryOpen(true)}
              className="inline-flex items-center gap-1.5 px-3 py-2 bg-white border border-slate-300 hover:bg-slate-50 text-slate-800 rounded-xl text-xs font-semibold cursor-pointer transition-colors shadow-2xs"
            >
              <LayoutTemplate className="w-3.5 h-3.5 text-blue-600" />
              <span className="hidden sm:inline">{t('changeTemplateBtn')}:</span>
              <span className="font-bold text-blue-600">{templateName}</span>
            </button>

            {onOpenInStudio && (
              <button
                type="button"
                onClick={onOpenInStudio}
                className="inline-flex items-center gap-1.5 px-3 py-2 bg-indigo-50 border border-indigo-200 hover:bg-indigo-100 text-indigo-700 rounded-xl text-xs font-semibold cursor-pointer transition-colors shadow-2xs"
                title={t('designCvManually')}
              >
                <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
                <span className="hidden sm:inline">{t('openInStudio')}</span>
                <span className="sm:hidden">Studio</span>
              </button>
            )}
          </div>

          {/* Center: CV Content Language Switcher */}
          <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl text-xs border border-slate-200">
            <span className="text-[11px] font-semibold text-slate-500 pl-1.5 flex items-center gap-1">
              <Globe className="w-3 h-3" />
              CV:
            </span>
            <button
              type="button"
              onClick={() => onUpdateCVLanguage('en')}
              className={`px-2 py-1 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
                cvData.cvLanguage === 'en'
                  ? 'bg-white text-blue-600 shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              English
            </button>
            <button
              type="button"
              onClick={() => onUpdateCVLanguage('so')}
              className={`px-2 py-1 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
                cvData.cvLanguage === 'so'
                  ? 'bg-white text-blue-600 shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Af Soomaali
            </button>
          </div>

          {/* Right Actions: Zoom, Fit, Download, Print, Share */}
          <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
            {/* Zoom Controls with Center/Fit */}
            <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl">
              <button
                type="button"
                onClick={() => setZoom(Math.max(0.3, Number((zoom - 0.1).toFixed(2))))}
                title={t('zoomOut')}
                className="p-1 sm:p-1.5 text-slate-600 hover:text-slate-900 rounded-md cursor-pointer"
              >
                <ZoomOut className="w-3.5 h-3.5" />
              </button>
              <span className="text-[10px] sm:text-[11px] font-bold text-slate-700 px-1 w-10 text-center">
                {Math.round(zoom * 100)}%
              </span>
              <button
                type="button"
                onClick={() => setZoom(Math.min(1.4, Number((zoom + 0.1).toFixed(2))))}
                title={t('zoomIn')}
                className="p-1 sm:p-1.5 text-slate-600 hover:text-slate-900 rounded-md cursor-pointer"
              >
                <ZoomIn className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                onClick={() => setZoom(calculateAutoFitZoom())}
                title={t('zoomFit')}
                className="px-2 py-1 bg-white hover:bg-blue-50 text-blue-700 rounded-lg text-[10px] font-bold shadow-2xs flex items-center gap-1 cursor-pointer transition-colors"
              >
                <Maximize2 className="w-3 h-3" />
                <span>{language === 'so' ? 'Dhaxda (Fit)' : 'Fit'}</span>
              </button>
            </div>

            {/* Print / Save PDF */}
            <button
              type="button"
              onClick={handlePrint}
              className="inline-flex items-center gap-1 px-2.5 sm:px-3 py-2 bg-slate-200 hover:bg-slate-300 text-slate-800 rounded-xl text-xs font-semibold cursor-pointer transition-colors"
            >
              <Printer className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">{t('printBtn')}</span>
            </button>

            {/* Share */}
            <button
              type="button"
              onClick={handleShare}
              className="p-2 sm:px-3 sm:py-2 bg-slate-200 hover:bg-slate-300 text-slate-800 rounded-xl text-xs font-semibold cursor-pointer transition-colors"
              title={t('shareBtn')}
            >
              <Share2 className="w-3.5 h-3.5" />
              <span className="hidden sm:inline ml-1.5">{t('shareBtn')}</span>
            </button>

            {/* Download PDF Button */}
            <button
              type="button"
              disabled={isExporting}
              onClick={handleDownloadPDF}
              className="inline-flex items-center gap-1.5 px-3.5 sm:px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white rounded-xl text-xs font-semibold cursor-pointer transition-colors shadow-sm"
            >
              <Download className="w-3.5 h-3.5" />
              <span>{isExporting ? t('downloadingPdf') : t('downloadPdfBtn')}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white text-xs font-medium px-4 py-3 rounded-2xl shadow-xl flex items-center gap-2 border border-slate-700 animate-slideUp">
          <Check className="w-4 h-4 text-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* A4 Document Workspace: Symmetrically Centered without clipping */}
      <main className="w-full flex-1 px-2 sm:px-4 pt-6 pb-24 flex justify-center items-start overflow-x-auto">
        <div
          className="relative mx-auto transition-all"
          style={{
            width: `${Math.round(794 * zoom)}px`,
            minHeight: `${Math.round(docHeight * zoom)}px`,
            height: `${Math.round(docHeight * zoom)}px`
          }}
        >
          <div
            ref={containerRef}
            style={{
              width: '794px',
              minHeight: '1123px',
              transform: `scale(${zoom})`,
              transformOrigin: 'top center',
              position: 'absolute',
              top: 0,
              left: '50%',
              marginLeft: '-397px', // Exactly 794px / 2 for symmetrical horizontal center
              transition: 'transform 0.15s ease-out'
            }}
            className="shadow-2xl bg-white border border-slate-300 rounded-sm"
          >
            {/* Printable Document Container with Exact ID */}
            <div id="cv-document-container" className="bg-white text-slate-900 w-full min-h-[1123px] box-border">
              <TemplateComponent cvData={cvData} />
            </div>
          </div>
        </div>
      </main>

      {/* Template Gallery Selector Modal */}
      <TemplateGalleryModal
        isOpen={isGalleryOpen}
        onClose={() => setIsGalleryOpen(false)}
        selectedTemplateId={templateId}
        onSelectTemplate={onSelectTemplate}
      />
    </div>
  );
};
