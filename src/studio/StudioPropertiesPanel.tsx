import React, { useState } from 'react';
import { StudioElement, TextElement, ShapeElement, DividerElement, ImageElement } from '../types/studio';
import { useLanguage } from '../i18n/LanguageContext';
import {
  Bold,
  Italic,
  Underline,
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
  Layers,
  Edit3,
  RotateCw,
  Sliders,
  Check,
  X
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
  const { t, language } = useLanguage();
  const [showTextModal, setShowTextModal] = useState(false);
  const [editingTextVal, setEditingTextVal] = useState('');

  if (!element) return null;

  const fontOptions = [
    { label: 'Plus Jakarta Sans', value: 'Plus Jakarta Sans' },
    { label: 'Inter (Clean Sans)', value: 'Inter' },
    { label: 'Merriweather (Classic Serif)', value: 'Merriweather' },
    { label: 'Space Grotesk (Tech)', value: 'Space Grotesk' },
    { label: 'Cinzel (Luxury Serif)', value: 'Cinzel' },
    { label: 'Roboto', value: 'Roboto' }
  ];

  const presetColors = [
    '#0f172a', '#1e3a8a', '#2563eb', '#0284c7', '#0d9488',
    '#059669', '#7c3aed', '#dc2626', '#d97706', '#475569',
    '#ffffff', '#000000'
  ];

  const handleOpenTextModal = () => {
    if (element.type === 'text') {
      setEditingTextVal((element as TextElement).text);
      setShowTextModal(true);
    }
  };

  const handleSaveTextModal = () => {
    if (element.type === 'text') {
      onUpdateElement({
        ...element,
        text: editingTextVal
      } as TextElement);
      setShowTextModal(false);
    }
  };

  return (
    <>
      <div className="bg-white border-b border-slate-200 px-3 sm:px-6 py-2 flex flex-wrap items-center justify-between gap-2 shadow-2xs z-20 overflow-x-auto">
        {/* Left Side Controls */}
        <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none py-0.5">
          {/* Element Type Indicator */}
          <span className="text-[10px] font-black text-slate-500 uppercase px-2 py-0.5 bg-slate-100 rounded-md">
            {element.type}
          </span>

          {/* Quick Edit Text Modal Button (Crucial for mobile users) */}
          {element.type === 'text' && (
            <button
              type="button"
              onClick={handleOpenTextModal}
              className="px-2.5 py-1 bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200 rounded-lg text-xs font-bold flex items-center gap-1 cursor-pointer"
              title="Edit text content"
            >
              <Edit3 className="w-3.5 h-3.5" />
              <span>{language === 'so' ? 'Qor Text' : 'Edit Text'}</span>
            </button>
          )}

          {/* Text Specific Controls */}
          {element.type === 'text' && (
            <>
              {/* Font Family */}
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

              {/* Bold */}
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

              {/* Italic */}
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

              {/* Underline */}
              <button
                type="button"
                onClick={() => {
                  const currentUnderline = (element as any).textDecoration === 'underline';
                  onUpdateElement({ ...element, textDecoration: currentUnderline ? 'none' : 'underline' } as any);
                }}
                className={`p-1.5 rounded-lg border cursor-pointer ${
                  (element as any).textDecoration === 'underline'
                    ? 'bg-blue-50 border-blue-400 text-blue-700'
                    : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}
              >
                <Underline className="w-3.5 h-3.5" />
              </button>

              {/* Text Alignment */}
              <div className="flex items-center border border-slate-200 rounded-lg overflow-hidden bg-white">
                <button
                  type="button"
                  onClick={() => onUpdateElement({ ...element, textAlign: 'left' } as TextElement)}
                  className={`p-1.5 cursor-pointer ${(element as TextElement).textAlign === 'left' ? 'bg-blue-50 text-blue-700 font-bold' : 'text-slate-600'}`}
                >
                  <AlignLeft className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => onUpdateElement({ ...element, textAlign: 'center' } as TextElement)}
                  className={`p-1.5 cursor-pointer ${(element as TextElement).textAlign === 'center' ? 'bg-blue-50 text-blue-700 font-bold' : 'text-slate-600'}`}
                >
                  <AlignCenter className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => onUpdateElement({ ...element, textAlign: 'right' } as TextElement)}
                  className={`p-1.5 cursor-pointer ${(element as TextElement).textAlign === 'right' ? 'bg-blue-50 text-blue-700 font-bold' : 'text-slate-600'}`}
                >
                  <AlignRight className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Color Picker */}
              <label className="flex items-center gap-1 cursor-pointer" title="Text Color">
                <input
                  type="color"
                  value={(element as TextElement).color || '#000000'}
                  onChange={(e) => onUpdateElement({ ...element, color: e.target.value } as TextElement)}
                  className="w-7 h-7 rounded-lg border border-slate-300 cursor-pointer p-0.5 bg-white"
                />
              </label>

              {/* Opacity Slider */}
              <div className="flex items-center gap-1 text-[11px] text-slate-500 pl-1">
                <span>Opacity:</span>
                <input
                  type="range"
                  min="0.1"
                  max="1"
                  step="0.05"
                  value={element.opacity !== undefined ? element.opacity : 1}
                  onChange={(e) => onUpdateElement({ ...element, opacity: parseFloat(e.target.value) })}
                  className="w-16 accent-blue-600 cursor-pointer"
                />
              </div>
            </>
          )}

          {/* Shape Specific Controls */}
          {element.type === 'shape' && (
            <div className="flex items-center gap-2">
              <label className="text-xs font-semibold text-slate-600 flex items-center gap-1.5">
                <span>Fill:</span>
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
            <div className="flex items-center gap-2 text-xs">
              <input
                type="color"
                value={(element as DividerElement).color || '#cbd5e1'}
                onChange={(e) => onUpdateElement({ ...element, color: e.target.value } as DividerElement)}
                className="w-7 h-7 rounded-lg border border-slate-300 cursor-pointer p-0.5 bg-white"
              />
              <select
                value={(element as DividerElement).style}
                onChange={(e) => onUpdateElement({ ...element, style: e.target.value as any } as DividerElement)}
                className="text-xs py-1 px-2 border border-slate-300 rounded-lg bg-slate-50"
              >
                <option value="solid">Solid</option>
                <option value="dashed">Dashed</option>
                <option value="dotted">Dotted</option>
              </select>
            </div>
          )}
        </div>

        {/* Right Side: Common Object Controls (Order, Lock, Duplicate, Delete) */}
        <div className="flex items-center gap-1">
          {/* Rotate 90deg */}
          <button
            type="button"
            onClick={() => {
              const current = element.rotation || 0;
              onUpdateElement({ ...element, rotation: (current + 90) % 360 });
            }}
            className="p-1.5 text-slate-600 hover:bg-slate-100 rounded-lg cursor-pointer"
            title="Rotate 90°"
          >
            <RotateCw className="w-3.5 h-3.5" />
          </button>

          {/* Layer Ordering */}
          <button
            type="button"
            onClick={() => onBringForward(element.id)}
            className="p-1.5 text-slate-600 hover:bg-slate-100 rounded-lg cursor-pointer"
            title="Bring Forward"
          >
            <ArrowUp className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={() => onSendBackward(element.id)}
            className="p-1.5 text-slate-600 hover:bg-slate-100 rounded-lg cursor-pointer"
            title="Send Backward"
          >
            <ArrowDown className="w-3.5 h-3.5" />
          </button>

          {/* Lock / Unlock */}
          <button
            type="button"
            onClick={() => onUpdateElement({ ...element, isLocked: !element.isLocked })}
            className={`p-1.5 rounded-lg cursor-pointer ${
              element.isLocked ? 'bg-amber-50 text-amber-600 border border-amber-300' : 'text-slate-600 hover:bg-slate-100'
            }`}
            title={element.isLocked ? 'Unlock Object' : 'Lock Object'}
          >
            {element.isLocked ? <Lock className="w-3.5 h-3.5" /> : <Unlock className="w-3.5 h-3.5" />}
          </button>

          {/* Duplicate */}
          <button
            type="button"
            onClick={() => onDuplicate(element)}
            className="p-1.5 text-slate-600 hover:bg-slate-100 rounded-lg cursor-pointer"
            title="Duplicate"
          >
            <Copy className="w-3.5 h-3.5" />
          </button>

          {/* Delete */}
          <button
            type="button"
            onClick={() => onDelete(element.id)}
            className="p-1.5 text-rose-600 hover:bg-rose-50 rounded-lg cursor-pointer"
            title="Delete Object"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* QUICK TEXT EDIT MODAL (Ensures 100% Mobile & Desktop Usability) */}
      {showTextModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-md p-5 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between">
              <h4 className="font-extrabold text-sm text-slate-900">
                {language === 'so' ? 'Tafatyr Qoraalka' : 'Edit Text Content'}
              </h4>
              <button
                type="button"
                onClick={() => setShowTextModal(false)}
                className="p-1 text-slate-400 hover:text-slate-600 rounded-lg"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <textarea
              rows={5}
              autoFocus
              value={editingTextVal}
              onChange={(e) => setEditingTextVal(e.target.value)}
              className="w-full p-3 bg-slate-50 border border-slate-300 rounded-xl text-xs sm:text-sm text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-blue-500/20"
              placeholder="Enter text..."
            />

            <div className="flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => setShowTextModal(false)}
                className="px-3 py-1.5 text-xs text-slate-600 hover:bg-slate-100 rounded-lg"
              >
                {language === 'so' ? 'Ka noqo' : 'Cancel'}
              </button>
              <button
                type="button"
                onClick={handleSaveTextModal}
                className="px-4 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-bold flex items-center gap-1 shadow-sm"
              >
                <Check className="w-3.5 h-3.5" />
                <span>{language === 'so' ? 'Dabbaq' : 'Apply Text'}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
