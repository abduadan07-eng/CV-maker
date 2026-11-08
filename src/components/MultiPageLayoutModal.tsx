import React, { useState } from 'react';
import {
  FileText,
  Plus,
  Trash2,
  Copy,
  ArrowUp,
  ArrowDown,
  Layers,
  Check,
  X,
  Sliders,
  Sparkles
} from 'lucide-react';
import { useLanguage } from '../i18n/LanguageContext';
import { CVData, CVPageLayout, CVSectionKey, CVPageConfig } from '../types/cv';

interface MultiPageLayoutModalProps {
  cvData: CVData;
  onUpdateLayout: (newLayout: CVPageLayout) => void;
  onClose: () => void;
}

export const MultiPageLayoutModal: React.FC<MultiPageLayoutModalProps> = ({
  cvData,
  onUpdateLayout,
  onClose
}) => {
  const { language } = useLanguage();

  const allSections: { key: CVSectionKey; labelEn: string; labelSo: string }[] = [
    { key: 'summary', labelEn: 'Professional Summary', labelSo: 'Dulmar Xirfadeed' },
    { key: 'experiences', labelEn: 'Work Experience', labelSo: 'Khibrad Shaqo' },
    { key: 'education', labelEn: 'Education', labelSo: 'Waxbarasho' },
    { key: 'skills', labelEn: 'Key Skills', labelSo: 'Xirfado Muhiim ah' },
    { key: 'languages', labelEn: 'Languages', labelSo: 'Luuqadaha' },
    { key: 'projects', labelEn: 'Projects', labelSo: 'Mashaariicda' },
    { key: 'certifications', labelEn: 'Certifications', labelSo: 'Shahaadooyinka' },
    { key: 'awards', labelEn: 'Awards & Honors', labelSo: 'Abaalmarinnada' },
    { key: 'volunteer', labelEn: 'Volunteer Experience', labelSo: 'Tabarrucaad' },
    { key: 'references', labelEn: 'References', labelSo: 'Tixraacyo' }
  ];

  // Default initial layout if not present
  const initialLayout: CVPageLayout = cvData.pageLayout || {
    mode: 'auto',
    totalPages: 2,
    pages: [
      { pageNumber: 1, sections: ['summary', 'experiences'] },
      { pageNumber: 2, sections: ['education', 'skills', 'languages', 'projects', 'certifications', 'references'] }
    ],
    pageMargins: 'normal',
    showPageNumbers: true
  };

  const [layout, setLayout] = useState<CVPageLayout>(initialLayout);

  const handleAddPage = () => {
    if (layout.totalPages >= 6 && layout.totalPages !== 0) {
      alert(language === 'so' ? 'Ugu badnaan 6 bog ayaa loo oggol yahay habkan, ama dooro Unlimited.' : 'Maximum 6 pages reached, or switch to Unlimited.');
      return;
    }

    const nextNumber = layout.pages.length + 1;
    const newPage: CVPageConfig = {
      pageNumber: nextNumber,
      sections: []
    };

    setLayout(prev => ({
      ...prev,
      totalPages: prev.totalPages === 0 ? 0 : nextNumber,
      pages: [...prev.pages, newPage]
    }));
  };

  const handleDeletePage = (index: number) => {
    if (layout.pages.length <= 1) {
      alert(language === 'so' ? 'Ma tiri kartid bogga keliya ee CV-ga.' : 'Cannot delete the only remaining page.');
      return;
    }

    const remainingPages = layout.pages.filter((_, i) => i !== index).map((p, idx) => ({
      ...p,
      pageNumber: idx + 1
    }));

    setLayout(prev => ({
      ...prev,
      totalPages: prev.totalPages === 0 ? 0 : remainingPages.length,
      pages: remainingPages
    }));
  };

  const handleMovePage = (index: number, direction: 'up' | 'down') => {
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= layout.pages.length) return;

    const newPages = [...layout.pages];
    const temp = newPages[index];
    newPages[index] = newPages[targetIndex];
    newPages[targetIndex] = temp;

    // Re-index page numbers
    const reindexed = newPages.map((p, idx) => ({ ...p, pageNumber: idx + 1 }));

    setLayout(prev => ({
      ...prev,
      pages: reindexed
    }));
  };

  const handleToggleSectionOnPage = (pageIdx: number, sectionKey: CVSectionKey) => {
    const newPages = layout.pages.map((p, idx) => {
      if (idx === pageIdx) {
        const has = p.sections.includes(sectionKey);
        const updated = has ? p.sections.filter(s => s !== sectionKey) : [...p.sections, sectionKey];
        return { ...p, sections: updated };
      }
      // If moving section to this page, remove from other pages to prevent duplicates
      return { ...p, sections: p.sections.filter(s => s !== sectionKey) };
    });

    setLayout(prev => ({ ...prev, mode: 'manual', pages: newPages }));
  };

  const handleSaveAndApply = () => {
    onUpdateLayout(layout);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 animate-in fade-in">
      <div className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="px-5 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-blue-600 text-white flex items-center justify-center">
              <Layers className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-extrabold text-slate-900 text-base">
                {language === 'so' ? 'Maamulka Bogagga CV-ga (Multi-Page)' : 'Multi-Page CV Manager'}
              </h3>
              <p className="text-[11px] text-slate-500">
                {language === 'so' ? 'Kala saar xogta CV-ga 1 ilaa 6 bog ama Unlimited' : 'Distribute CV content across 1 to 6 pages or Unlimited'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body Controls */}
        <div className="p-5 overflow-y-auto flex-1 space-y-5 bg-slate-50">
          {/* Page Target Selector Buttons */}
          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs space-y-2">
            <label className="block text-xs font-bold text-slate-700">
              {language === 'so' ? 'Tirada Bogagga Bartilmaameedka ah' : 'Target Page Count'}
            </label>
            <div className="grid grid-cols-4 sm:grid-cols-7 gap-1.5 text-xs font-bold">
              {[1, 2, 3, 4, 5, 6].map(num => (
                <button
                  key={num}
                  type="button"
                  onClick={() => {
                    const pages: CVPageConfig[] = [];
                    for (let i = 1; i <= num; i++) {
                      pages.push(layout.pages[i - 1] || { pageNumber: i, sections: [] });
                    }
                    setLayout(prev => ({
                      ...prev,
                      totalPages: num,
                      pages
                    }));
                  }}
                  className={`py-2 rounded-lg border transition cursor-pointer ${
                    layout.totalPages === num
                      ? 'bg-blue-600 text-white border-blue-600 shadow-2xs'
                      : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200'
                  }`}
                >
                  {num} {num === 1 ? 'Page' : 'Pages'}
                </button>
              ))}
              <button
                type="button"
                onClick={() => {
                  setLayout(prev => ({
                    ...prev,
                    totalPages: 0 // 0 means Unlimited
                  }));
                }}
                className={`py-2 rounded-lg border transition cursor-pointer ${
                  layout.totalPages === 0
                    ? 'bg-blue-600 text-white border-blue-600 shadow-2xs'
                    : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200'
                }`}
              >
                Auto / All
              </button>
            </div>
          </div>

          {/* Mode & Margins Settings */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <div className="bg-white p-3 rounded-xl border border-slate-200 space-y-1">
              <label className="font-bold text-slate-700 block">
                {language === 'so' ? 'Habka Qaybinta Xogta' : 'Section Flow Mode'}
              </label>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setLayout(p => ({ ...p, mode: 'auto' }))}
                  className={`flex-1 py-1.5 rounded-lg font-bold cursor-pointer ${
                    layout.mode === 'auto' ? 'bg-blue-50 text-blue-700 border border-blue-200' : 'bg-slate-50 text-slate-600'
                  }`}
                >
                  {language === 'so' ? 'Otomaatig (Auto Flow)' : 'Auto Flow'}
                </button>
                <button
                  type="button"
                  onClick={() => setLayout(p => ({ ...p, mode: 'manual' }))}
                  className={`flex-1 py-1.5 rounded-lg font-bold cursor-pointer ${
                    layout.mode === 'manual' ? 'bg-blue-50 text-blue-700 border border-blue-200' : 'bg-slate-50 text-slate-600'
                  }`}
                >
                  {language === 'so' ? 'Gacanta (Manual)' : 'Manual Sections'}
                </button>
              </div>
            </div>

            <div className="bg-white p-3 rounded-xl border border-slate-200 space-y-1">
              <label className="font-bold text-slate-700 block">
                {language === 'so' ? 'Cabbirka Masaafada (Margins)' : 'Page Margins'}
              </label>
              <div className="flex gap-2">
                {(['compact', 'normal', 'spacious'] as const).map(m => (
                  <button
                    key={m}
                    type="button"
                    onClick={() => setLayout(p => ({ ...p, pageMargins: m }))}
                    className={`flex-1 py-1.5 rounded-lg font-bold uppercase text-[10px] cursor-pointer ${
                      layout.pageMargins === m ? 'bg-blue-50 text-blue-700 border border-blue-200' : 'bg-slate-50 text-slate-600'
                    }`}
                  >
                    {m}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Pages List with Section Assignments */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                {language === 'so' ? 'Bogagga & Qaybaha ku Jira' : 'Pages & Section Assignments'} ({layout.pages.length})
              </h4>
              <button
                type="button"
                onClick={handleAddPage}
                className="inline-flex items-center gap-1 text-xs font-bold text-blue-600 hover:text-blue-700 cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>{language === 'so' ? 'Ku Dar Bog Cusub' : 'Add New Page'}</span>
              </button>
            </div>

            {layout.pages.map((page, idx) => (
              <div
                key={page.pageNumber}
                className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs space-y-3"
              >
                <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                  <div className="flex items-center gap-2">
                    <span className="w-6 h-6 rounded-md bg-blue-600 text-white text-xs font-bold flex items-center justify-center">
                      {page.pageNumber}
                    </span>
                    <span className="font-extrabold text-sm text-slate-800">
                      {language === 'so' ? `Bogga ${page.pageNumber}` : `Page ${page.pageNumber}`}
                    </span>
                    <span className="text-[11px] text-slate-400">
                      ({page.sections.length} {language === 'so' ? 'qaybood' : 'sections'})
                    </span>
                  </div>

                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      disabled={idx === 0}
                      onClick={() => handleMovePage(idx, 'up')}
                      className="p-1 text-slate-500 hover:bg-slate-100 rounded disabled:opacity-30 cursor-pointer"
                      title="Move Up"
                    >
                      <ArrowUp className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      disabled={idx === layout.pages.length - 1}
                      onClick={() => handleMovePage(idx, 'down')}
                      className="p-1 text-slate-500 hover:bg-slate-100 rounded disabled:opacity-30 cursor-pointer"
                      title="Move Down"
                    >
                      <ArrowDown className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      disabled={layout.pages.length <= 1}
                      onClick={() => handleDeletePage(idx)}
                      className="p-1 text-rose-600 hover:bg-rose-50 rounded disabled:opacity-30 cursor-pointer"
                      title="Delete Page"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Section checkboxes on this page */}
                <div className="space-y-1">
                  <p className="text-[11px] text-slate-400 font-medium">
                    {language === 'so' ? 'Dooro qaybaha ka muuqanaya boggan:' : 'Select sections to display on this page:'}
                  </p>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-1.5">
                    {allSections.map(sec => {
                      const isSelected = page.sections.includes(sec.key);
                      return (
                        <button
                          key={sec.key}
                          type="button"
                          onClick={() => handleToggleSectionOnPage(idx, sec.key)}
                          className={`p-2 rounded-lg text-left text-[11px] font-semibold border transition cursor-pointer flex items-center justify-between ${
                            isSelected
                              ? 'bg-blue-50 border-blue-300 text-blue-900'
                              : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                          }`}
                        >
                          <span className="truncate">{language === 'so' ? sec.labelSo : sec.labelEn}</span>
                          {isSelected && <Check className="w-3 h-3 text-blue-600 flex-shrink-0" />}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="px-5 py-3 bg-white border-t border-slate-200 flex items-center justify-between">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl"
          >
            {language === 'so' ? 'Ka noqo' : 'Cancel'}
          </button>
          <button
            type="button"
            onClick={handleSaveAndApply}
            className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow-md transition flex items-center gap-1.5"
          >
            <Check className="w-4 h-4" />
            <span>{language === 'so' ? 'Dabbaq Bogaggan' : 'Apply Multi-Page Layout'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
