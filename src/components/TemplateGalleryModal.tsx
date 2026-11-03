import React, { useState } from 'react';
import { TemplateId } from '../types/cv';
import { TEMPLATES_REGISTRY, TemplateMeta } from '../templates/TemplateRegistry';
import { useLanguage } from '../i18n/LanguageContext';
import { X, Check, LayoutTemplate, Sparkles } from 'lucide-react';

interface TemplateGalleryModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedTemplateId: TemplateId;
  onSelectTemplate: (templateId: TemplateId) => void;
}

export const TemplateGalleryModal: React.FC<TemplateGalleryModalProps> = ({
  isOpen,
  onClose,
  selectedTemplateId,
  onSelectTemplate
}) => {
  const { t, language } = useLanguage();
  const [filter, setFilter] = useState<'all' | 'professional' | 'modern' | 'minimal' | 'creative' | 'academic'>('all');

  if (!isOpen) return null;

  const filteredTemplates = TEMPLATES_REGISTRY.filter(tmpl => {
    if (filter === 'all') return true;
    return tmpl.category === filter;
  });

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 animate-fadeIn">
      <div className="bg-white rounded-3xl max-w-4xl w-full max-h-[90vh] flex flex-col shadow-2xl overflow-hidden border border-slate-200">
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-blue-600 text-white flex items-center justify-center shadow-xs">
              <LayoutTemplate className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold text-slate-900">{t('templatesModalTitle')}</h2>
              <p className="text-xs text-slate-500">{t('templatesModalDesc')}</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white border border-slate-200 hover:bg-slate-100 flex items-center justify-center text-slate-500 hover:text-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Filter Bar */}
        <div className="px-6 py-2.5 bg-white border-b border-slate-100 flex items-center gap-1.5 overflow-x-auto scrollbar-none">
          <button
            type="button"
            onClick={() => setFilter('all')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer shrink-0 ${
              filter === 'all' ? 'bg-slate-900 text-white shadow-xs' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            {t('filterAll')}
          </button>
          <button
            type="button"
            onClick={() => setFilter('professional')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer shrink-0 ${
              filter === 'professional' ? 'bg-slate-900 text-white shadow-xs' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            {t('filterProfessional')}
          </button>
          <button
            type="button"
            onClick={() => setFilter('modern')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer shrink-0 ${
              filter === 'modern' ? 'bg-slate-900 text-white shadow-xs' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            {t('filterModern')}
          </button>
          <button
            type="button"
            onClick={() => setFilter('minimal')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer shrink-0 ${
              filter === 'minimal' ? 'bg-slate-900 text-white shadow-xs' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            Minimalist
          </button>
          <button
            type="button"
            onClick={() => setFilter('creative')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer shrink-0 ${
              filter === 'creative' ? 'bg-slate-900 text-white shadow-xs' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            {t('filterCreative')}
          </button>
          <button
            type="button"
            onClick={() => setFilter('academic')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer shrink-0 ${
              filter === 'academic' ? 'bg-slate-900 text-white shadow-xs' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            {t('filterAcademic')}
          </button>
        </div>

        {/* Templates Grid */}
        <div className="flex-1 overflow-y-auto p-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {filteredTemplates.map((template) => {
            const isSelected = template.id === selectedTemplateId;
            const name = language === 'so' ? template.nameSo : template.nameEn;
            const desc = language === 'so' ? template.descriptionSo : template.descriptionEn;
            const rec = language === 'so' ? template.recommendedForSo : template.recommendedForEn;

            return (
              <div
                key={template.id}
                onClick={() => {
                  onSelectTemplate(template.id);
                  onClose();
                }}
                className={`group relative rounded-2xl border-2 p-4 flex flex-col justify-between transition-all cursor-pointer bg-white ${
                  isSelected
                    ? 'border-blue-600 ring-4 ring-blue-600/10 shadow-md'
                    : 'border-slate-200 hover:border-blue-400 hover:shadow-sm'
                }`}
              >
                {/* Visual Thumbnail Representation */}
                <div className="w-full h-32 rounded-xl bg-slate-50 border border-slate-200/80 p-2.5 mb-3 overflow-hidden flex flex-col justify-between group-hover:scale-[1.01] transition-transform">
                  {/* Mock header bar of template */}
                  <div className="space-y-1.5">
                    {template.id === 'modern-blue' && (
                      <div className="h-5 bg-blue-700 rounded-md w-full flex items-center px-2">
                        <div className="w-12 h-1.5 bg-white/70 rounded-full" />
                      </div>
                    )}
                    {template.id === 'classic-professional' && (
                      <div className="text-center py-1 border-b border-slate-300">
                        <div className="h-2 bg-slate-800 rounded-full w-20 mx-auto" />
                        <div className="h-1 bg-slate-400 rounded-full w-14 mx-auto mt-1" />
                      </div>
                    )}
                    {template.id === 'minimalist' && (
                      <div className="py-1">
                        <div className="h-2 bg-slate-900 rounded-full w-24" />
                        <div className="h-1 bg-slate-300 rounded-full w-16 mt-1" />
                      </div>
                    )}
                    {template.id === 'executive' && (
                      <div className="border-b-2 border-slate-900 pb-1 flex justify-between items-center">
                        <div className="h-2.5 bg-slate-950 rounded-full w-24" />
                        <div className="w-4 h-4 rounded-sm bg-slate-300" />
                      </div>
                    )}
                    {template.id === 'two-column-sidebar' && (
                      <div className="flex gap-2 h-full">
                        <div className="w-1/3 bg-slate-900 rounded-l p-1 space-y-1">
                          <div className="w-4 h-4 rounded-full bg-blue-400 mx-auto" />
                          <div className="w-full h-1 bg-slate-600 rounded-full" />
                          <div className="w-full h-1 bg-slate-600 rounded-full" />
                        </div>
                        <div className="w-2/3 space-y-1">
                          <div className="w-16 h-1.5 bg-slate-800 rounded-full" />
                          <div className="w-full h-1 bg-slate-300 rounded-full" />
                          <div className="w-full h-1 bg-slate-300 rounded-full" />
                        </div>
                      </div>
                    )}
                    {template.id === 'creative-designer' && (
                      <div className="h-6 bg-gradient-to-r from-violet-600 to-indigo-600 rounded-lg p-1.5 flex items-center justify-between">
                        <div className="w-16 h-1.5 bg-white rounded-full" />
                        <div className="w-3 h-3 rounded-full bg-purple-300" />
                      </div>
                    )}
                    {template.id === 'academic' && (
                      <div className="text-center pb-1 border-b border-slate-400">
                        <div className="h-2 bg-slate-800 rounded-full w-28 mx-auto" />
                        <div className="h-1 bg-slate-400 rounded-full w-20 mx-auto mt-0.5" />
                      </div>
                    )}
                    {template.id === 'graduate-first-job' && (
                      <div className="p-1 border-b border-emerald-500/30 flex items-center justify-between">
                        <div>
                          <div className="w-8 h-1 bg-emerald-500 rounded-full mb-1" />
                          <div className="w-20 h-1.5 bg-slate-800 rounded-full" />
                        </div>
                        <div className="w-4 h-4 rounded-full bg-emerald-100" />
                      </div>
                    )}
                    {template.id === 'corporate-professional' && (
                      <div>
                        <div className="h-1 bg-slate-900 w-full mb-1" />
                        <div className="w-24 h-1.5 bg-slate-800 rounded-full" />
                      </div>
                    )}
                    {template.id === 'contemporary-accent' && (
                      <div className="h-6 bg-teal-950 rounded-lg p-1.5 flex items-center">
                        <div className="w-16 h-1.5 bg-teal-300 rounded-full" />
                      </div>
                    )}
                    {template.id === 'compact-one-page' && (
                      <div className="border-b border-slate-400 pb-1 flex justify-between">
                        <div className="w-16 h-2 bg-slate-900 rounded-full" />
                        <div className="w-12 h-1 bg-slate-400 rounded-full" />
                      </div>
                    )}
                    {template.id === 'elegant-bw' && (
                      <div className="border-b-2 border-black pb-1">
                        <div className="w-24 h-1.5 bg-black rounded-full" />
                        <div className="w-12 h-1 bg-neutral-400 rounded-full mt-0.5" />
                      </div>
                    )}
                  </div>

                  {/* Mock content lines */}
                  {template.id !== 'two-column-sidebar' && (
                    <div className="space-y-1">
                      <div className="h-1 bg-slate-200 rounded-full w-full" />
                      <div className="h-1 bg-slate-200 rounded-full w-4/5" />
                      <div className="h-1 bg-slate-100 rounded-full w-2/3" />
                    </div>
                  )}
                </div>

                {/* Template Info */}
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <h3 className="font-bold text-slate-900 text-xs sm:text-sm">{name}</h3>
                    {isSelected && (
                      <span className="flex items-center gap-1 text-[10px] font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded-full">
                        <Check className="w-3 h-3" />
                        {t('currentTemplate')}
                      </span>
                    )}
                  </div>
                  <p className="text-[11px] text-slate-500 line-clamp-2 leading-relaxed mb-2">
                    {desc}
                  </p>
                  <p className="text-[10px] text-slate-400 italic">
                    Best for: {rec}
                  </p>
                </div>

                {/* Button */}
                <button
                  type="button"
                  onClick={() => {
                    onSelectTemplate(template.id);
                    onClose();
                  }}
                  className={`mt-3 w-full py-2 px-3 rounded-xl text-xs font-semibold cursor-pointer transition-colors ${
                    isSelected
                      ? 'bg-blue-600 text-white'
                      : 'bg-slate-100 hover:bg-blue-50 hover:text-blue-700 text-slate-700'
                  }`}
                >
                  {isSelected ? t('currentTemplate') : t('selectTemplateBtn')}
                </button>
              </div>
            );
          })}
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-3 border-t border-slate-200 bg-slate-50 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-800 rounded-xl text-xs font-semibold cursor-pointer transition-colors"
          >
            {t('cancelBtn')}
          </button>
        </div>
      </div>
    </div>
  );
};
