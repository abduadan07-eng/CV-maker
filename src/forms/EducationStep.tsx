import React, { useState } from 'react';
import { Education } from '../types/cv';
import { useLanguage } from '../i18n/LanguageContext';
import { Plus, Trash2, ArrowUp, ArrowDown, GraduationCap, ChevronDown, ChevronUp } from 'lucide-react';

interface EducationStepProps {
  education: Education[];
  onChange: (education: Education[]) => void;
}

export const EducationStep: React.FC<EducationStepProps> = ({ education, onChange }) => {
  const { t } = useLanguage();
  const [expandedId, setExpandedId] = useState<string | null>(education[0]?.id || null);

  const addEducation = () => {
    const newEntry: Education = {
      id: 'edu_' + Date.now(),
      institution: '',
      degree: '',
      fieldOfStudy: '',
      startDate: '',
      endDate: '',
      description: ''
    };
    onChange([...education, newEntry]);
    setExpandedId(newEntry.id);
  };

  const updateEducation = (id: string, updates: Partial<Education>) => {
    onChange(
      education.map((edu) => (edu.id === id ? { ...edu, ...updates } : edu))
    );
  };

  const deleteEducation = (id: string) => {
    onChange(education.filter((edu) => edu.id !== id));
  };

  const moveEducation = (index: number, direction: 'up' | 'down') => {
    const newIndex = direction === 'up' ? index - 1 : index + 1;
    if (newIndex < 0 || newIndex >= education.length) return;
    const items = [...education];
    const [moved] = items.splice(index, 1);
    items.splice(newIndex, 0, moved);
    onChange(items);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-xl font-bold text-slate-900">{t('educationTitle')}</h2>
          <p className="text-xs text-slate-500 mt-1">{t('educationSubtitle')}</p>
        </div>
        <button
          type="button"
          onClick={addEducation}
          className="inline-flex items-center gap-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-semibold cursor-pointer transition-colors shadow-xs self-start sm:self-center"
        >
          <Plus className="w-4 h-4" />
          {t('addEducationBtn')}
        </button>
      </div>

      {education.length === 0 ? (
        <div className="text-center py-10 px-4 bg-slate-50 rounded-2xl border-2 border-dashed border-slate-200">
          <div className="w-12 h-12 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center mx-auto mb-3">
            <GraduationCap className="w-6 h-6" />
          </div>
          <h3 className="text-sm font-bold text-slate-800">{t('noEducationTitle')}</h3>
          <p className="text-xs text-slate-500 max-w-md mx-auto mt-1 leading-relaxed">
            {t('noEducationDesc')}
          </p>
          <button
            type="button"
            onClick={addEducation}
            className="mt-4 inline-flex items-center gap-1.5 px-4 py-2 bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 rounded-xl text-xs font-semibold cursor-pointer transition-colors shadow-xs"
          >
            <Plus className="w-4 h-4 text-blue-600" />
            {t('addEducationBtn')}
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {education.map((edu, index) => {
            const isExpanded = expandedId === edu.id;
            return (
              <div
                key={edu.id}
                className="bg-white border border-slate-200 rounded-2xl shadow-xs overflow-hidden transition-all"
              >
                <div
                  className="px-4 py-3 bg-slate-50/70 border-b border-slate-200/60 flex items-center justify-between gap-3 cursor-pointer select-none"
                  onClick={() => setExpandedId(isExpanded ? null : edu.id)}
                >
                  <div className="flex items-center gap-2.5 truncate">
                    <span className="w-6 h-6 rounded-full bg-blue-100 text-blue-700 text-xs font-bold flex items-center justify-center shrink-0">
                      {index + 1}
                    </span>
                    <span className="font-semibold text-slate-800 text-sm truncate">
                      {edu.degree || 'Degree / Certificate'}
                      {edu.institution && (
                        <span className="text-xs font-normal text-slate-500 ml-1.5">
                          at {edu.institution}
                        </span>
                      )}
                    </span>
                  </div>

                  <div className="flex items-center gap-1 shrink-0" onClick={(e) => e.stopPropagation()}>
                    <button
                      type="button"
                      disabled={index === 0}
                      onClick={() => moveEducation(index, 'up')}
                      title={t('moveUp')}
                      className="p-1 text-slate-400 hover:text-slate-700 disabled:opacity-30 disabled:hover:text-slate-400 cursor-pointer"
                    >
                      <ArrowUp className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      disabled={index === education.length - 1}
                      onClick={() => moveEducation(index, 'down')}
                      title={t('moveDown')}
                      className="p-1 text-slate-400 hover:text-slate-700 disabled:opacity-30 disabled:hover:text-slate-400 cursor-pointer"
                    >
                      <ArrowDown className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => deleteEducation(edu.id)}
                      className="p-1 text-red-500 hover:text-red-700 cursor-pointer ml-1"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => setExpandedId(isExpanded ? null : edu.id)}
                      className="p-1 text-slate-400 hover:text-slate-700 cursor-pointer ml-1"
                    >
                      {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {isExpanded && (
                  <div className="p-4 sm:p-5 space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">
                          {t('institutionName')} *
                        </label>
                        <input
                          type="text"
                          value={edu.institution}
                          onChange={(e) => updateEducation(edu.id, { institution: e.target.value })}
                          placeholder={t('institutionPlaceholder')}
                          className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-blue-500"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">
                          {t('degree')} *
                        </label>
                        <input
                          type="text"
                          value={edu.degree}
                          onChange={(e) => updateEducation(edu.id, { degree: e.target.value })}
                          placeholder={t('degreePlaceholder')}
                          className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-blue-500"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">
                          {t('fieldOfStudy')}
                        </label>
                        <input
                          type="text"
                          value={edu.fieldOfStudy}
                          onChange={(e) => updateEducation(edu.id, { fieldOfStudy: e.target.value })}
                          placeholder={t('fieldOfStudyPlaceholder')}
                          className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-blue-500"
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <label className="block text-xs font-bold text-slate-700 mb-1">
                            {t('startDate')}
                          </label>
                          <input
                            type="text"
                            value={edu.startDate}
                            onChange={(e) => updateEducation(edu.id, { startDate: e.target.value })}
                            placeholder="e.g. 2018"
                            className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-blue-500"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-bold text-slate-700 mb-1">
                            {t('endDate')}
                          </label>
                          <input
                            type="text"
                            value={edu.endDate}
                            onChange={(e) => updateEducation(edu.id, { endDate: e.target.value })}
                            placeholder="e.g. 2022"
                            className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-blue-500"
                          />
                        </div>
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        {t('educationDesc')}
                      </label>
                      <textarea
                        rows={2}
                        value={edu.description}
                        onChange={(e) => updateEducation(edu.id, { description: e.target.value })}
                        placeholder={t('educationDescPlaceholder')}
                        className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-blue-500 leading-relaxed font-sans"
                      />
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
