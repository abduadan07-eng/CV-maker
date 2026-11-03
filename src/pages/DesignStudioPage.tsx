import React, { useState, useEffect, useCallback, useRef } from 'react';
import { StudioDocument, StudioElement, StudioPage, StudioToolTab } from '../types/studio';
import { studioStorage, createEmptyStudioPage } from '../storage/studioStorage';
import { StudioSidebar } from '../studio/StudioSidebar';
import { StudioCanvas } from '../studio/StudioCanvas';
import { StudioPropertiesPanel } from '../studio/StudioPropertiesPanel';
import { createStarterTemplateDocument } from '../studio/studioConverter';
import { useLanguage } from '../i18n/LanguageContext';
import { TemplateId } from '../types/cv';
import { exportElementToPDF, printCv, shareCv } from '../pdf/pdfExport';
import {
  ArrowLeft,
  Undo2,
  Redo2,
  Download,
  Printer,
  Share2,
  ZoomIn,
  ZoomOut,
  Maximize2,
  Check,
  Edit2,
  Cloud,
  Database
} from 'lucide-react';
import { useAuth } from '../firebase/AuthContext';
import { saveStudioDocToCloud } from '../firebase/cvFirestore';

interface DesignStudioPageProps {
  initialDocument: StudioDocument;
  onBackToHome: () => void;
}

export const DesignStudioPage: React.FC<DesignStudioPageProps> = ({
  initialDocument,
  onBackToHome
}) => {
  const { t, language } = useLanguage();
  const { user } = useAuth();
  const [cloudSynced, setCloudSynced] = useState<boolean>(false);

  // Document State
  const [doc, setDoc] = useState<StudioDocument>(initialDocument);
  const [activePageIndex, setActivePageIndex] = useState<number>(0);
  const [selectedElementId, setSelectedElementId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<StudioToolTab>('text');

  // History for Undo / Redo
  const [history, setHistory] = useState<StudioDocument[]>([initialDocument]);
  const [historyIndex, setHistoryIndex] = useState<number>(0);

  // Zoom calculation
  const calculateAutoFit = () => {
    if (typeof window === 'undefined') return 0.75;
    // Account for sidebar on desktop (320px) and margins
    const sidebarWidth = window.innerWidth >= 768 ? 340 : 20;
    const availableWidth = window.innerWidth - sidebarWidth - 40;
    const computed = Math.min(1.0, Math.max(0.35, availableWidth / 794));
    return Number(computed.toFixed(2));
  };

  const [zoom, setZoom] = useState<number>(() => calculateAutoFit());
  const [isSaved, setIsSaved] = useState(true);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [isExporting, setIsExporting] = useState(false);
  const [isRenaming, setIsRenaming] = useState(false);
  const [titleInput, setTitleInput] = useState(doc.title);

  const activePage = doc.pages[activePageIndex] || doc.pages[0];
  const selectedElement = activePage?.elements.find(el => el.id === selectedElementId) || null;

  // Commit changes to history stack and autosave
  const commitDocChange = useCallback((newDoc: StudioDocument) => {
    setDoc(newDoc);
    setIsSaved(false);

    // Update history stack
    const newHistory = history.slice(0, historyIndex + 1);
    newHistory.push(newDoc);
    // Keep history reasonable (up to 40 steps)
    if (newHistory.length > 40) {
      newHistory.shift();
    }
    setHistory(newHistory);
    setHistoryIndex(newHistory.length - 1);

    // LocalStorage save
    studioStorage.saveDocument(newDoc);
    setIsSaved(true);

    // Cloud Database Save if signed in
    if (user?.uid) {
      saveStudioDocToCloud(user.uid, newDoc)
        .then(() => setCloudSynced(true))
        .catch(err => console.warn('Cloud sync studio doc notice:', err));
    }
  }, [history, historyIndex, user]);

  // Undo / Redo handlers
  const handleUndo = useCallback(() => {
    if (historyIndex > 0) {
      const prevDoc = history[historyIndex - 1];
      setHistoryIndex(historyIndex - 1);
      setDoc(prevDoc);
      studioStorage.saveDocument(prevDoc);
    }
  }, [history, historyIndex]);

  const handleRedo = useCallback(() => {
    if (historyIndex < history.length - 1) {
      const nextDoc = history[historyIndex + 1];
      setHistoryIndex(historyIndex + 1);
      setDoc(nextDoc);
      studioStorage.saveDocument(nextDoc);
    }
  }, [history, historyIndex]);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't trigger shortcuts if typing inside an input or textarea
      if (['INPUT', 'TEXTAREA'].includes((e.target as HTMLElement)?.tagName)) {
        return;
      }

      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'z') {
        e.preventDefault();
        if (e.shiftKey) {
          handleRedo();
        } else {
          handleUndo();
        }
      } else if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'y') {
        e.preventDefault();
        handleRedo();
      } else if (e.key === 'Delete' || e.key === 'Backspace') {
        if (selectedElementId && selectedElement && !selectedElement.isLocked) {
          e.preventDefault();
          handleDeleteElement(selectedElementId);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleUndo, handleRedo, selectedElementId, selectedElement]);

  // Element CRUD Operations
  const handleAddElement = (newElement: StudioElement) => {
    const updatedElements = [...activePage.elements, newElement];
    const updatedPages = doc.pages.map((p, idx) =>
      idx === activePageIndex ? { ...p, elements: updatedElements } : p
    );
    commitDocChange({ ...doc, pages: updatedPages });
    setSelectedElementId(newElement.id);
  };

  const handleUpdateElement = (updatedElement: StudioElement) => {
    const updatedElements = activePage.elements.map(el =>
      el.id === updatedElement.id ? updatedElement : el
    );
    const updatedPages = doc.pages.map((p, idx) =>
      idx === activePageIndex ? { ...p, elements: updatedElements } : p
    );
    setDoc({ ...doc, pages: updatedPages });
  };

  const handleCommitCanvasChange = (committedElements: StudioElement[]) => {
    const updatedPages = doc.pages.map((p, idx) =>
      idx === activePageIndex ? { ...p, elements: committedElements } : p
    );
    commitDocChange({ ...doc, pages: updatedPages });
  };

  const handleDuplicateElement = (element: StudioElement) => {
    const duplicated: StudioElement = {
      ...element,
      id: `${element.type}_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      x: element.x + 20,
      y: element.y + 20,
      zIndex: element.zIndex + 1
    };
    handleAddElement(duplicated);
  };

  const handleDeleteElement = (id: string) => {
    const updatedElements = activePage.elements.filter(el => el.id !== id);
    const updatedPages = doc.pages.map((p, idx) =>
      idx === activePageIndex ? { ...p, elements: updatedElements } : p
    );
    commitDocChange({ ...doc, pages: updatedPages });
    setSelectedElementId(null);
  };

  const handleBringForward = (id: string) => {
    const updatedElements = activePage.elements.map(el =>
      el.id === id ? { ...el, zIndex: el.zIndex + 1 } : el
    );
    handleCommitCanvasChange(updatedElements);
  };

  const handleSendBackward = (id: string) => {
    const updatedElements = activePage.elements.map(el =>
      el.id === id ? { ...el, zIndex: Math.max(1, el.zIndex - 1) } : el
    );
    handleCommitCanvasChange(updatedElements);
  };

  // Page Operations
  const handleAddPage = () => {
    const newPage = createEmptyStudioPage(doc.pages.length + 1);
    const updatedPages = [...doc.pages, newPage];
    commitDocChange({ ...doc, pages: updatedPages });
    setActivePageIndex(updatedPages.length - 1);
    setSelectedElementId(null);
  };

  const handleDuplicatePage = (index: number) => {
    const sourcePage = doc.pages[index];
    const duplicatedElements = sourcePage.elements.map(el => ({
      ...el,
      id: `${el.type}_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`
    }));

    const newPage: StudioPage = {
      ...sourcePage,
      id: `page_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      pageNumber: doc.pages.length + 1,
      elements: duplicatedElements
    };

    const updatedPages = [...doc.pages];
    updatedPages.splice(index + 1, 0, newPage);
    commitDocChange({ ...doc, pages: updatedPages });
    setActivePageIndex(index + 1);
  };

  const handleDeletePage = (index: number) => {
    if (doc.pages.length <= 1) {
      alert(t('cannotDeleteLastPage'));
      return;
    }
    const updatedPages = doc.pages.filter((_, idx) => idx !== index);
    commitDocChange({ ...doc, pages: updatedPages });
    setActivePageIndex(Math.max(0, index - 1));
    setSelectedElementId(null);
  };

  // Apply Template
  const handleApplyTemplate = (templateId: string) => {
    const templateDoc = createStarterTemplateDocument(templateId as TemplateId, doc.title);
    commitDocChange({
      ...doc,
      pages: templateDoc.pages,
      sourceTemplateId: templateId
    });
    setSelectedElementId(null);
    showToast('Template layout applied!');
  };

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleExportPDF = async () => {
    setIsExporting(true);
    setSelectedElementId(null); // Clear selection outline before capture
    try {
      const sanitized = (doc.title || 'CV_Design').replace(/[^a-zA-Z0-9]/g, '_');
      await exportElementToPDF({
        elementId: 'cv-studio-active-page',
        fileName: `${sanitized}.pdf`,
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

  const handleSaveTitle = () => {
    setIsRenaming(false);
    if (titleInput.trim()) {
      commitDocChange({ ...doc, title: titleInput.trim() });
    }
  };

  return (
    <div className="min-h-screen bg-slate-100/90 text-slate-800 flex flex-col overflow-hidden">
      {/* Top Design Studio Bar */}
      <header className="no-print bg-white border-b border-slate-200 px-3 sm:px-6 py-2.5 flex items-center justify-between gap-3 sticky top-0 z-30 shadow-2xs">
        {/* Left: Back & Document Title */}
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onBackToHome}
            className="p-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl cursor-pointer transition-colors"
            title="Back to Home"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>

          {isRenaming ? (
            <input
              type="text"
              autoFocus
              value={titleInput}
              onChange={(e) => setTitleInput(e.target.value)}
              onBlur={handleSaveTitle}
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleSaveTitle();
              }}
              className="text-sm font-bold text-slate-900 border border-blue-400 rounded-lg px-2 py-1 outline-hidden"
            />
          ) : (
            <button
              type="button"
              onClick={() => setIsRenaming(true)}
              className="flex items-center gap-1.5 text-sm font-bold text-slate-900 hover:text-blue-600 cursor-pointer group text-left"
            >
              <span className="max-w-[150px] sm:max-w-[240px] truncate">{doc.title}</span>
              <Edit2 className="w-3.5 h-3.5 text-slate-400 group-hover:text-blue-600 opacity-0 group-hover:opacity-100 transition-opacity" />
            </button>
          )}

          {/* Autosave status indicator */}
          <span className="hidden sm:inline-flex items-center gap-1.5 text-[11px] text-emerald-700 bg-emerald-50 border border-emerald-200/80 px-2 py-0.5 rounded-full font-medium">
            <Check className="w-3 h-3 text-emerald-600" />
            <span>{user ? t('cloudSaved') : 'Saved locally'}</span>
            {user && <Cloud className="w-3 h-3 text-emerald-600" />}
          </span>
        </div>

        {/* Center: Undo & Redo */}
        <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl">
          <button
            type="button"
            disabled={historyIndex <= 0}
            onClick={handleUndo}
            title={t('undoBtn')}
            className="p-1.5 text-slate-600 hover:text-slate-900 hover:bg-white rounded-lg disabled:opacity-30 disabled:hover:bg-transparent cursor-pointer transition-colors"
          >
            <Undo2 className="w-4 h-4" />
          </button>

          <button
            type="button"
            disabled={historyIndex >= history.length - 1}
            onClick={handleRedo}
            title={t('redoBtn')}
            className="p-1.5 text-slate-600 hover:text-slate-900 hover:bg-white rounded-lg disabled:opacity-30 disabled:hover:bg-transparent cursor-pointer transition-colors"
          >
            <Redo2 className="w-4 h-4" />
          </button>
        </div>

        {/* Right: Zoom & Export */}
        <div className="flex items-center gap-2">
          {/* Zoom Toolbar */}
          <div className="hidden sm:flex items-center gap-1 bg-slate-100 p-1 rounded-xl">
            <button
              type="button"
              onClick={() => setZoom(Math.max(0.3, Number((zoom - 0.1).toFixed(2))))}
              title={t('zoomOut')}
              className="p-1 text-slate-600 hover:text-slate-900 rounded-md cursor-pointer"
            >
              <ZoomOut className="w-3.5 h-3.5" />
            </button>
            <span className="text-[11px] font-bold text-slate-700 px-1 w-10 text-center">
              {Math.round(zoom * 100)}%
            </span>
            <button
              type="button"
              onClick={() => setZoom(Math.min(1.4, Number((zoom + 0.1).toFixed(2))))}
              title={t('zoomIn')}
              className="p-1 text-slate-600 hover:text-slate-900 rounded-md cursor-pointer"
            >
              <ZoomIn className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              onClick={() => setZoom(calculateAutoFit())}
              title={t('zoomFit')}
              className="p-1 text-blue-600 hover:text-blue-800 rounded-md cursor-pointer"
            >
              <Maximize2 className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Export PDF Button */}
          <button
            type="button"
            disabled={isExporting}
            onClick={handleExportPDF}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white rounded-xl text-xs font-semibold cursor-pointer transition-colors shadow-2xs"
          >
            <Download className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">{isExporting ? t('downloadingPdf') : t('downloadPdfBtn')}</span>
          </button>
        </div>
      </header>

      {/* Contextual Properties Panel (Visible when an element is selected) */}
      <StudioPropertiesPanel
        element={selectedElement}
        onUpdateElement={handleUpdateElement}
        onDuplicate={handleDuplicateElement}
        onDelete={handleDeleteElement}
        onBringForward={handleBringForward}
        onSendBackward={handleSendBackward}
      />

      {/* Main Studio Body: Sidebar + Canvas */}
      <div className="flex-1 flex flex-col md:flex-row overflow-hidden relative">
        {/* Left Elements Sidebar */}
        <StudioSidebar
          activeTab={activeTab}
          onSelectTab={setActiveTab}
          onAddElement={handleAddElement}
          pages={doc.pages}
          activePageIndex={activePageIndex}
          onSelectPage={setActivePageIndex}
          onAddPage={handleAddPage}
          onDuplicatePage={handleDuplicatePage}
          onDeletePage={handleDeletePage}
          onApplyTemplate={handleApplyTemplate}
        />

        {/* Central Workspace Canvas */}
        <StudioCanvas
          page={activePage}
          zoom={zoom}
          selectedElementId={selectedElementId}
          onSelectElement={setSelectedElementId}
          onUpdateElement={handleUpdateElement}
          onCommitChange={handleCommitCanvasChange}
        />
      </div>

      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white text-xs font-medium px-4 py-3 rounded-2xl shadow-xl flex items-center gap-2 border border-slate-700 animate-slideUp">
          <Check className="w-4 h-4 text-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}
    </div>
  );
};
