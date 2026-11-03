import React, { useRef, useState, useEffect } from 'react';
import { StudioPage, StudioElement } from '../types/studio';
import { StudioElementRenderer } from './StudioElementRenderer';
import { useLanguage } from '../i18n/LanguageContext';
import { Sparkles, FileText } from 'lucide-react';

interface StudioCanvasProps {
  page: StudioPage;
  zoom: number;
  selectedElementId: string | null;
  onSelectElement: (id: string | null) => void;
  onUpdateElement: (updated: StudioElement) => void;
  onCommitChange: (updatedElements: StudioElement[]) => void;
}

export const StudioCanvas: React.FC<StudioCanvasProps> = ({
  page,
  zoom,
  selectedElementId,
  onSelectElement,
  onUpdateElement,
  onCommitChange
}) => {
  const { t } = useLanguage();
  const pageRef = useRef<HTMLDivElement>(null);

  // Interaction tracking
  const [activeDrag, setActiveDrag] = useState<{
    elementId: string;
    startX: number;
    startY: number;
    initialElemX: number;
    initialElemY: number;
  } | null>(null);

  const [activeResize, setActiveResize] = useState<{
    elementId: string;
    handle: string;
    startX: number;
    startY: number;
    initialX: number;
    initialY: number;
    initialW: number;
    initialH: number;
  } | null>(null);

  const [hasMovedDuringInteraction, setHasMovedDuringInteraction] = useState(false);

  // Global pointer up and move handlers for smooth dragging and resizing
  useEffect(() => {
    const handlePointerMove = (e: PointerEvent) => {
      if (activeDrag) {
        setHasMovedDuringInteraction(true);
        const dx = (e.clientX - activeDrag.startX) / zoom;
        const dy = (e.clientY - activeDrag.startY) / zoom;

        // Keep within page bounds (0 to 794 - width, 0 to 1123 - height)
        const target = page.elements.find(el => el.id === activeDrag.elementId);
        if (target) {
          const newX = Math.max(0, Math.min(794 - target.width, Math.round(activeDrag.initialElemX + dx)));
          const newY = Math.max(0, Math.min(1123 - target.height, Math.round(activeDrag.initialElemY + dy)));
          onUpdateElement({
            ...target,
            x: newX,
            y: newY
          });
        }
      } else if (activeResize) {
        setHasMovedDuringInteraction(true);
        const dx = (e.clientX - activeResize.startX) / zoom;
        const dy = (e.clientY - activeResize.startY) / zoom;

        const target = page.elements.find(el => el.id === activeResize.elementId);
        if (target) {
          let { initialX, initialY, initialW, initialH, handle } = activeResize;
          let newX = initialX;
          let newY = initialY;
          let newW = initialW;
          let newH = initialH;

          const minDim = 15;

          if (handle.includes('e')) {
            newW = Math.max(minDim, Math.round(initialW + dx));
          }
          if (handle.includes('s')) {
            newH = Math.max(minDim, Math.round(initialH + dy));
          }
          if (handle.includes('w')) {
            const possibleW = Math.round(initialW - dx);
            if (possibleW >= minDim) {
              newW = possibleW;
              newX = Math.round(initialX + dx);
            }
          }
          if (handle.includes('n')) {
            const possibleH = Math.round(initialH - dy);
            if (possibleH >= minDim) {
              newH = possibleH;
              newY = Math.round(initialY + dy);
            }
          }

          onUpdateElement({
            ...target,
            x: Math.max(0, newX),
            y: Math.max(0, newY),
            width: newW,
            height: newH
          });
        }
      }
    };

    const handlePointerUp = () => {
      if (activeDrag || activeResize) {
        if (hasMovedDuringInteraction) {
          // Commit current elements to undo history
          onCommitChange(page.elements);
        }
        setActiveDrag(null);
        setActiveResize(null);
        setHasMovedDuringInteraction(false);
      }
    };

    window.addEventListener('pointermove', handlePointerMove);
    window.addEventListener('pointerup', handlePointerUp);
    window.addEventListener('pointercancel', handlePointerUp);

    return () => {
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('pointerup', handlePointerUp);
      window.removeEventListener('pointercancel', handlePointerUp);
    };
  }, [activeDrag, activeResize, hasMovedDuringInteraction, page.elements, zoom, onUpdateElement, onCommitChange]);

  const handleStartDrag = (e: React.PointerEvent, element: StudioElement) => {
    setActiveDrag({
      elementId: element.id,
      startX: e.clientX,
      startY: e.clientY,
      initialElemX: element.x,
      initialElemY: element.y
    });
    setHasMovedDuringInteraction(false);
  };

  const handleStartResize = (e: React.PointerEvent, element: StudioElement, handle: string) => {
    setActiveResize({
      elementId: element.id,
      handle,
      startX: e.clientX,
      startY: e.clientY,
      initialX: element.x,
      initialY: element.y,
      initialW: element.width,
      initialH: element.height
    });
    setHasMovedDuringInteraction(false);
  };

  return (
    <div
      onClick={() => onSelectElement(null)}
      className="w-full flex-1 min-h-[600px] flex items-start justify-center p-4 sm:p-8 overflow-auto select-none"
    >
      {/* Symmetrically Centered Scaled Page Wrapper */}
      <div
        style={{
          width: `${Math.round(794 * zoom)}px`,
          minHeight: `${Math.round(1123 * zoom)}px`,
          height: `${Math.round(1123 * zoom)}px`,
          position: 'relative'
        }}
        className="transition-all mx-auto shrink-0"
      >
        <div
          ref={pageRef}
          id="cv-studio-active-page"
          style={{
            width: '794px',
            height: '1123px',
            backgroundColor: page.backgroundColor || '#ffffff',
            transform: `scale(${zoom})`,
            transformOrigin: 'top center',
            position: 'absolute',
            top: 0,
            left: '50%',
            marginLeft: '-397px', // Exactly 794 / 2
            transition: 'transform 0.1s ease-out'
          }}
          className="shadow-2xl border border-slate-300 rounded-xs overflow-hidden"
        >
          {/* Elements on this page */}
          {page.elements.map((element) => (
            <StudioElementRenderer
              key={element.id}
              element={element}
              isSelected={element.id === selectedElementId}
              zoom={zoom}
              onSelect={(e, el) => onSelectElement(el.id)}
              onUpdate={onUpdateElement}
              onStartDrag={handleStartDrag}
              onStartResize={handleStartResize}
            />
          ))}

          {/* Empty State when page has no elements */}
          {page.elements.length === 0 && (
            <div className="absolute inset-0 flex flex-col items-center justify-center p-8 text-center pointer-events-none">
              <div className="w-16 h-16 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mb-3">
                <FileText className="w-8 h-8" />
              </div>
              <h3 className="text-base font-bold text-slate-800">{t('emptyCanvasTitle')}</h3>
              <p className="text-xs text-slate-500 max-w-sm mt-1 leading-relaxed">
                {t('emptyCanvasDesc')}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
