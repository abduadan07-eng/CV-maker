import React from 'react';
import { StudioElement, TextElement, ShapeElement, DividerElement, ImageElement } from '../types/studio';
import { useLanguage } from '../i18n/LanguageContext';
import {
  Bold,
  Italic,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
  Copy,
  Trash2,
  Lock,
  Unlock,
  ArrowUp,
  ArrowDown,
  Layers
} from 'lucide-react';

interface StudioPropertiesPanelProps {
  element: StudioElement | null;
  onUpdateElement: (updated: StudioElement) => void;
  onDuplicate: (element: StudioElement) => void;
  onDelete: (id: string) => void;
  onBringForward: (id: string) => void;
  onSendBackward: (id: string) => void;
}

export const StudioPropertiesPanel: React.FC<StudioPropertiesPanelProps> = ({
  element,
  onUpdateElement,
  onDuplicate,
  onDelete,
  onBringForward,
  onSendBackward
}) => {
  const { t } = useLanguage();

  if (!element) return null;

  const fontOptions = [
    { label: 'Plus Jakarta Sans', value: 'Plus Jakarta Sans' },
    { label: 'Inter (Clean Sans)', value: 'Inter' },
    { label: 'Merriweather (Classic Serif)', value: 'Merriweather' },
    { label: 'Space Grotesk (Tech)', value: 'Space Grotesk' },
    { label: 'Cinzel (Luxury Serif)', value: 'Cinzel' }
  ];

  const presetColors = [
    '#0f172a', '#1e3a8a', '#2563eb', '#0284c7', '#0d9488',
    '#059669', '#7c3aed', '#dc2626', '#d97706', '#475569',
    '#94a3b8', '#f8fafc', '#ffffff'
  ];

  return (
    <div className="bg-white border-b border-slate-200 px-3 sm:px-6 py-2 flex flex-wrap items-center justify-between gap-2 shadow-2xs z-20">
      {/* Element Type Tag & Common Quick Actions */}
      <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none">
        <span className="text-[11px] font-bold text-slate-500 uppercase px-2 py-0.5 bg-slate-100 rounded-md">
          {element.type}
        </span>

        {/* Text Specific Controls */}
        {element.type === 'text' && (
          <>
            {/* Font Family Selector */}
            <select
              value={(element as TextElement).fontFamily}
              onChange={(e) => onUpdateElement({ ...element, fontFamily: e.target.value } as TextElement)}
              className="text-xs py-1 px-2 border border-slate-300 rounded-lg bg-slate-50 text-slate-800 focus:outline-hidden cursor-pointer"
            >
              {fontOptions.map(f => (
                <option key={f.value} value={f.value}>{f.label}</option>
              ))}
            </select>

            {/* Font Size */}
            <div className="flex items-center border border-slate-300 rounded-lg bg-slate-50 overflow-hidden">
              <button
                type="button"
                onClick={() => {
                  const curr = (element as TextElement).fontSize || 12;
                  onUpdateElement({ ...element, fontSize: Math.max(8, curr - 1) } as TextElement);
                }}
                className="px-2 py-1 text-xs text-slate-600 hover:bg-slate-200 cursor-pointer font-bold"
              >
                -
              </button>
              <span className="text-xs px-2 font-semibold text-slate-800">
                {(element as TextElement).fontSize}px
              </span>
              <button
                type="button"
                onClick={() => {
                  const curr = (element as TextElement).fontSize || 12;
                  onUpdateElement({ ...element, fontSize: Math.min(72, curr + 1) } as TextElement);
                }}
                className="px-2 py-1 text-xs text-slate-600 hover:bg-slate-200 cursor-pointer font-bold"
              >
                +
              </button>
            </div>

            {/* Bold Toggle */}
            <button
              type="button"
              onClick={() => {
                const currentWeight = (element as TextElement).fontWeight;
                const nextWeight = currentWeight === 'bold' || currentWeight === 'extrabold' ? 'normal' : 'bold';
                onUpdateElement({ ...element, fontWeight: nextWeight } as TextElement);
              }}
              className={`p-1.5 rounded-lg border cursor-pointer ${
                (element as TextElement).fontWeight === 'bold' || (element as TextElement).fontWeight === 'extrabold'
                  ? 'bg-blue-50 border-blue-400 text-blue-700'
                  : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
              }`}
            >
              <Bold className="w-3.5 h-3.5" />
            </button>

            {/* Italic Toggle */}
            <button
              type="button"
              onClick={() => {
                const currentStyle = (element as TextElement).fontStyle;
                onUpdateElement({ ...element, fontStyle: currentStyle === 'italic' ? 'normal' : 'italic' } as TextElement);
              }}
              className={`p-1.5 rounded-lg border cursor-pointer ${
                (element as TextElement).fontStyle === 'italic'
                  ? 'bg-blue-50 border-blue-400 text-blue-700'
                  : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
              }`}
            >
              <Italic className="w-3.5 h-3.5" />
            </button>

            {/* Alignment Toggles */}
            <div className="flex items-center border border-slate-200 rounded-lg overflow-hidden bg-white">
              <button
                type="button"
                onClick={() => onUpdateElement({ ...element, textAlign: 'left' } as TextElement)}
                className={`p-1.5 cursor-pointer ${(element as TextElement).textAlign === 'left' ? 'bg-blue-50 text-blue-700' : 'text-slate-600'}`}
              >
                <AlignLeft className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                onClick={() => onUpdateElement({ ...element, textAlign: 'center' } as TextElement)}
                className={`p-1.5 cursor-pointer ${(element as TextElement).textAlign === 'center' ? 'bg-blue-50 text-blue-700' : 'text-slate-600'}`}
              >
                <AlignCenter className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                onClick={() => onUpdateElement({ ...element, textAlign: 'right' } as TextElement)}
                className={`p-1.5 cursor-pointer ${(element as TextElement).textAlign === 'right' ? 'bg-blue-50 text-blue-700' : 'text-slate-600'}`}
              >
                <AlignRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Text Color Picker */}
            <div className="flex items-center gap-1">
              <input
                type="color"
                value={(element as TextElement).color || '#000000'}
                onChange={(e) => onUpdateElement({ ...element, color: e.target.value } as TextElement)}
                className="w-7 h-7 rounded-lg border border-slate-300 cursor-pointer p-0.5 bg-white"
                title={t('textColorLabel')}
              />
            </div>
          </>
        )}

        {/* Shape Specific Controls */}
        {element.type === 'shape' && (
          <div className="flex items-center gap-2">
            <label className="text-xs font-semibold text-slate-600 flex items-center gap-1.5">
              <span>{t('fillColorLabel')}:</span>
              <input
                type="color"
                value={(element as ShapeElement).fillColor || '#2563eb'}
                onChange={(e) => onUpdateElement({ ...element, fillColor: e.target.value } as ShapeElement)}
                className="w-7 h-7 rounded-lg border border-slate-300 cursor-pointer p-0.5 bg-white"
              />
            </label>

            <label className="text-xs font-semibold text-slate-600 flex items-center gap-1.5">
              <span>Border:</span>
              <input
                type="color"
                value={(element as ShapeElement).borderColor || '#000000'}
                onChange={(e) => onUpdateElement({ ...element, borderColor: e.target.value, borderWidth: (element as ShapeElement).borderWidth || 1 } as ShapeElement)}
                className="w-7 h-7 rounded-lg border border-slate-300 cursor-pointer p-0.5 bg-white"
              />
            </label>
          </div>
        )}

        {/* Divider Controls */}
        {element.type === 'divider' && (
          <div className="flex items-center gap-2">
            <input
              type="color"
              value={(element as DividerElement).color || '#cbd5e1'}
              onChange={(e) => onUpdateElement({ ...element, color: e.target.value } as DividerElement)}
              className="w-7 h-7 rounded-lg border border-slate-300 cursor-pointer p-0.5 bg-white"
            />
            <div className="flex items-center gap-1 text-xs">
              <span className="text-slate-500">Thickness:</span>
              <button
                type="button"
                onClick={() => onUpdateElement({ ...element, thickness: Math.max(1, (element as DividerElement).thickness - 1) } as DividerElement)}
                className="px-1.5 py-0.5 border rounded cursor-pointer"
              >
                -
              </button>
              <span>{(element as DividerElement).thickness}px</span>
              <button
                type="button"
                onClick={() => onUpdateElement({ ...element, thickness: Math.min(8, (element as DividerElement).thickness + 1) } as DividerElement)}
                className="px-1.5 py-0.5 border rounded cursor-pointer"
              >
                +
              </button>
            </div>
          </div>
        )}

        {/* Image Controls */}
        {element.type === 'image' && (
          <div className="flex flex-wrap items-center gap-2">
            {/* Shape Buttons */}
            <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl">
              <span className="text-[11px] font-bold text-slate-500 pl-1 pr-1">{t('imageShapeTitle')}:</span>

              {/* Circle */}
              <button
                type="button"
                onClick={() => onUpdateElement({ ...element, shape: 'circle', borderRadius: 9999 } as ImageElement)}
                title={t('photoShapeCircle')}
                className={`px-2 py-1 text-xs font-semibold rounded-lg flex items-center gap-1 cursor-pointer transition-colors ${
                  (element as ImageElement).shape === 'circle' || ((element as ImageElement).borderRadius && (element as ImageElement).borderRadius! >= 50)
                    ? 'bg-blue-600 text-white shadow-2xs'
                    : 'text-slate-700 hover:bg-slate-200'
                }`}
              >
                <div className="w-2.5 h-2.5 rounded-full border border-current" />
                <span className="hidden sm:inline">{t('photoShapeCircle')}</span>
              </button>

              {/* Rounded */}
              <button
                type="button"
                onClick={() => onUpdateElement({ ...element, shape: 'rounded', borderRadius: 18 } as ImageElement)}
                title={t('photoShapeRounded')}
                className={`px-2 py-1 text-xs font-semibold rounded-lg flex items-center gap-1 cursor-pointer transition-colors ${
                  (element as ImageElement).shape === 'rounded'
                    ? 'bg-blue-600 text-white shadow-2xs'
                    : 'text-slate-700 hover:bg-slate-200'
                }`}
              >
                <div className="w-2.5 h-2.5 rounded-xs border border-current" />
                <span className="hidden sm:inline">{t('photoShapeRounded')}</span>
              </button>

              {/* Square / Rectangle */}
              <button
                type="button"
                onClick={() => onUpdateElement({ ...element, shape: 'rectangle', borderRadius: 0 } as ImageElement)}
                title={t('photoShapeSquare')}
                className={`px-2 py-1 text-xs font-semibold rounded-lg flex items-center gap-1 cursor-pointer transition-colors ${
                  (element as ImageElement).shape === 'rectangle' || (!(element as ImageElement).shape && !(element as ImageElement).borderRadius)
                    ? 'bg-blue-600 text-white shadow-2xs'
                    : 'text-slate-700 hover:bg-slate-200'
                }`}
              >
                <div className="w-2.5 h-2.5 rounded-none border border-current" />
                <span className="hidden sm:inline">{t('photoShapeSquare')}</span>
              </button>

              {/* Oval */}
              <button
                type="button"
                onClick={() => onUpdateElement({ ...element, shape: 'oval' } as ImageElement)}
                title={t('photoShapeOval')}
                className={`px-2 py-1 text-xs font-semibold rounded-lg flex items-center gap-1 cursor-pointer transition-colors ${
                  (element as ImageElement).shape === 'oval'
                    ? 'bg-blue-600 text-white shadow-2xs'
                    : 'text-slate-700 hover:bg-slate-200'
                }`}
              >
                <div className="w-2 h-3 border border-current" style={{ borderRadius: '50% / 40%' }} />
                <span className="hidden sm:inline">{t('photoShapeOval')}</span>
              </button>

              {/* Hexagon */}
              <button
                type="button"
                onClick={() => onUpdateElement({ ...element, shape: 'hexagon' } as ImageElement)}
                title={t('photoShapeHexagon')}
                className={`px-2 py-1 text-xs font-semibold rounded-lg flex items-center gap-1 cursor-pointer transition-colors ${
                  (element as ImageElement).shape === 'hexagon'
                    ? 'bg-blue-600 text-white shadow-2xs'
                    : 'text-slate-700 hover:bg-slate-200'
                }`}
              >
                <span className="text-[10px]">⬡</span>
                <span className="hidden sm:inline">{t('photoShapeHexagon')}</span>
              </button>

              {/* Badge */}
              <button
                type="button"
                onClick={() => onUpdateElement({ ...element, shape: 'badge' } as ImageElement)}
                title={t('photoShapeBadge')}
                className={`px-2 py-1 text-xs font-semibold rounded-lg flex items-center gap-1 cursor-pointer transition-colors ${
                  (element as ImageElement).shape === 'badge'
                    ? 'bg-blue-600 text-white shadow-2xs'
                    : 'text-slate-700 hover:bg-slate-200'
                }`}
              >
                <span className="text-[10px]">🛡</span>
                <span className="hidden sm:inline">{t('photoShapeBadge')}</span>
              </button>
            </div>

            {/* Border Width & Color */}
            <div className="flex items-center gap-1.5 pl-1">
              <span className="text-[11px] font-semibold text-slate-500">Border:</span>
              <button
                type="button"
                onClick={() => {
                  const currentW = (element as ImageElement).borderWidth || 0;
                  const newW = currentW === 0 ? 2 : currentW === 2 ? 4 : 0;
                  onUpdateElement({
                    ...element,
                    borderWidth: newW,
                    borderColor: (element as ImageElement).borderColor || '#2563eb'
                  } as ImageElement);
                }}
                className={`px-2 py-1 text-xs font-semibold rounded-lg border transition-colors cursor-pointer ${
                  (element as ImageElement).borderWidth ? 'bg-blue-50 border-blue-400 text-blue-700' : 'bg-white border-slate-200 text-slate-600'
                }`}
              >
                {(element as ImageElement).borderWidth ? `${(element as ImageElement).borderWidth}px` : 'None'}
              </button>

              {(element as ImageElement).borderWidth ? (
                <input
                  type="color"
                  value={(element as ImageElement).borderColor || '#2563eb'}
                  onChange={(e) => onUpdateElement({ ...element, borderColor: e.target.value } as ImageElement)}
                  className="w-6 h-6 rounded-md border border-slate-300 cursor-pointer p-0.5 bg-white"
                  title="Border Color"
                />
              ) : null}
            </div>

            {/* Fit mode toggle */}
            <button
              type="button"
              onClick={() => {
                const currentFit = (element as ImageElement).objectFit || 'cover';
                onUpdateElement({
                  ...element,
                  objectFit: currentFit === 'cover' ? 'contain' : 'cover'
                } as ImageElement);
              }}
              className="px-2 py-1 text-xs text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-lg cursor-pointer"
              title="Toggle Cover / Contain"
            >
              Fit: {(element as ImageElement).objectFit || 'cover'}
            </button>
          </div>
        )}
      </div>

      {/* Right Action Icons (Layers, Duplicate, Lock, Delete) */}
      <div className="flex items-center gap-1 shrink-0">
        <button
          type="button"
          onClick={() => onBringForward(element.id)}
          title={t('bringForward')}
          className="p-1.5 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg cursor-pointer"
        >
          <ArrowUp className="w-3.5 h-3.5" />
        </button>

        <button
          type="button"
          onClick={() => onSendBackward(element.id)}
          title={t('sendBackward')}
          className="p-1.5 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg cursor-pointer"
        >
          <ArrowDown className="w-3.5 h-3.5" />
        </button>

        <button
          type="button"
          onClick={() => onDuplicate(element)}
          title={t('duplicateElement')}
          className="p-1.5 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg cursor-pointer"
        >
          <Copy className="w-3.5 h-3.5" />
        </button>

        <button
          type="button"
          onClick={() => onUpdateElement({ ...element, isLocked: !element.isLocked })}
          title={element.isLocked ? t('unlockElement') : t('lockElement')}
          className={`p-1.5 rounded-lg cursor-pointer ${element.isLocked ? 'text-amber-600 bg-amber-50' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'}`}
        >
          {element.isLocked ? <Lock className="w-3.5 h-3.5" /> : <Unlock className="w-3.5 h-3.5" />}
        </button>

        <button
          type="button"
          onClick={() => onDelete(element.id)}
          title={t('deleteElement')}
          className="p-1.5 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg cursor-pointer ml-1"
        >
          <Trash2 className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
