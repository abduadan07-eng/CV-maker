import React, { useState } from 'react';
import { WorkExperience } from '../types/cv';
import { useLanguage } from '../i18n/LanguageContext';
import { Plus, Trash2, ArrowUp, ArrowDown, Briefcase, ChevronDown, ChevronUp, Sparkles } from 'lucide-react';

interface ExperienceStepProps {
  experiences: WorkExperience[];
  onChange: (experiences: WorkExperience[]) => void;
}

export const ExperienceStep: React.FC<ExperienceStepProps> = ({ experiences, onChange }) => {
  const { t, language } = useLanguage();
  const [expandedId, setExpandedId] = useState<string | null>(experiences[0]?.id || null);

  const addExperience = () => {
    const newEntry: WorkExperience = {
      id: 'exp_' + Date.now(),
      jobTitle: '',
      company: '',
      location: '',
      startDate: '',
      endDate: '',
      isCurrent: false,
      description: ''
    };
    onChange([...experiences, newEntry]);
    setExpandedId(newEntry.id);
  };

  const updateExperience = (id: string, updates: Partial<WorkExperience>) => {
    onChange(
      experiences.map((exp) => (exp.id === id ? { ...exp, ...updates } : exp))
    );
  };

  const deleteExperience = (id: string) => {
    onChange(experiences.filter((exp) => exp.id !== id));
  };

  const moveExperience = (index: number, direction: 'up' | 'down') => {
    const newIndex = direction === 'up' ? index - 1 : index + 1;
    if (newIndex < 0 || newIndex >= experiences.length) return;
    const items = [...experiences];
    const [moved] = items.splice(index, 1);
    items.splice(newIndex, 0, moved);
    onChange(items);
  };

  const bulletExamples = language === 'so' ? [
    '• Hogaamiyey koox ka kooban 4 qof oo fuliyey...',
    '• Kordhiyey dakhliga shirkadda 15% muddo 6 bilood ah...',
    '• Dib u habeeyey nidaamka xogta si loo dardargeliyo shaqada...'
  ] : [
    '• Spearheaded key initiatives resulting in a 20% increase in productivity...',
    '• Managed cross-functional projects delivered on time and within budget...',
    '• Mentored 3 junior team members and fostered collaboration...'
  ];

  return (
    <div className="space-y-6">
      {/* Step Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-xl font-bold text-slate-900">{t('experienceTitle')}</h2>
          <p className="text-xs text-slate-500 mt-1">{t('experienceSubtitle')}</p>
        </div>
        <button
          type="button"
          onClick={addExperience}
          className="inline-flex items-center gap-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-semibold cursor-pointer transition-colors shadow-xs self-start sm:self-center"
        >
          <Plus className="w-4 h-4" />
          {t('addExperienceBtn')}
        </button>
      </div>

      {/* Empty State / Student Friendly Banner */}
      {experiences.length === 0 ? (
        <div className="text-center py-10 px-4 bg-slate-50 rounded-2xl border-2 border-dashed border-slate-200">
          <div className="w-12 h-12 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center mx-auto mb-3">
            <Briefcase className="w-6 h-6" />
          </div>
          <h3 className="text-sm font-bold text-slate-800">{t('noExperienceTitle')}</h3>
          <p className="text-xs text-slate-500 max-w-md mx-auto mt-1 leading-relaxed">
            {t('noExperienceDesc')}
          </p>
          <button
            type="button"
            onClick={addExperience}
            className="mt-4 inline-flex items-center gap-1.5 px-4 py-2 bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 rounded-xl text-xs font-semibold cursor-pointer transition-colors shadow-xs"
          >
            <Plus className="w-4 h-4 text-blue-600" />
            {t('addExperienceBtn')}
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {experiences.map((exp, index) => {
            const isExpanded = expandedId === exp.id;
            return (
              <div
                key={exp.id}
                className="bg-white border border-slate-200 rounded-2xl shadow-xs overflow-hidden transition-all"
              >
                {/* Header bar of the card */}
                <div
                  className="px-4 py-3 bg-slate-50/70 border-b border-slate-200/60 flex items-center justify-between gap-3 cursor-pointer select-none"
                  onClick={() => setExpandedId(isExpanded ? null : exp.id)}
                >
                  <div className="flex items-center gap-2.5 truncate">
                    <span className="w-6 h-6 rounded-full bg-blue-100 text-blue-700 text-xs font-bold flex items-center justify-center shrink-0">
                      {index + 1}
                    </span>
                    <span className="font-semibold text-slate-800 text-sm truncate">
                      {exp.jobTitle || 'New Role'}
                      {exp.company && (
                        <span className="text-xs font-normal text-slate-500 ml-1.5">
                          at {exp.company}
                        </span>
                      )}
                    </span>
                  </div>

                  <div className="flex items-center gap-1 shrink-0" onClick={(e) => e.stopPropagation()}>
                    <button
                      type="button"
                      disabled={index === 0}
                      onClick={() => moveExperience(index, 'up')}
                      title={t('moveUp')}
                      className="p-1 text-slate-400 hover:text-slate-700 disabled:opacity-30 disabled:hover:text-slate-400 cursor-pointer"
                    >
                      <ArrowUp className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      disabled={index === experiences.length - 1}
                      onClick={() => moveExperience(index, 'down')}
                      title={t('moveDown')}
                      className="p-1 text-slate-400 hover:text-slate-700 disabled:opacity-30 disabled:hover:text-slate-400 cursor-pointer"
                    >
                      <ArrowDown className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => deleteExperience(exp.id)}
                      className="p-1 text-red-500 hover:text-red-700 cursor-pointer ml-1"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => setExpandedId(isExpanded ? null : exp.id)}
                      className="p-1 text-slate-400 hover:text-slate-700 cursor-pointer ml-1"
                    >
                      {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {/* Form fields inside card */}
                {isExpanded && (
                  <div className="p-4 sm:p-5 space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">
                          {t('jobTitle')} *
                        </label>
                        <input
                          type="text"
                          value={exp.jobTitle}
                          onChange={(e) => updateExperience(exp.id, { jobTitle: e.target.value })}
                          placeholder={t('jobTitlePlaceholder')}
                          className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-blue-500"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">
                          {t('companyName')}
                        </label>
                        <input
                          type="text"
                          value={exp.company}
                          onChange={(e) => updateExperience(exp.id, { company: e.target.value })}
                          placeholder={t('companyPlaceholder')}
                          className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-blue-500"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">
                          {t('location')}
                        </label>
                        <input
                          type="text"
                          value={exp.location}
                          onChange={(e) => updateExperience(exp.id, { location: e.target.value })}
                          placeholder={t('locationPlaceholder')}
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
                            value={exp.startDate}
                            onChange={(e) => updateExperience(exp.id, { startDate: e.target.value })}
                            placeholder="e.g. 2021 / Jan 2021"
                            className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-blue-500"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-bold text-slate-700 mb-1">
                            {t('endDate')}
                          </label>
                          <input
                            type="text"
                            disabled={exp.isCurrent}
                            value={exp.isCurrent ? t('cvPresent') : exp.endDate}
                            onChange={(e) => updateExperience(exp.id, { endDate: e.target.value })}
                            placeholder="e.g. 2024 / Present"
                            className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-blue-500 disabled:bg-slate-100 disabled:text-slate-500"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Current Position Checkbox */}
                    <div className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        id={`current-${exp.id}`}
                        checked={exp.isCurrent}
                        onChange={(e) => updateExperience(exp.id, { isCurrent: e.target.checked })}
                        className="w-4 h-4 text-blue-600 rounded border-slate-300 focus:ring-blue-500 cursor-pointer"
                      />
                      <label htmlFor={`current-${exp.id}`} className="text-xs font-medium text-slate-700 cursor-pointer">
                        {t('currentPositionCheckbox')}
                      </label>
                    </div>

                    {/* Responsibilities */}
                    <div>
                      <div className="flex justify-between items-baseline mb-1">
                        <label className="text-xs font-bold text-slate-700">
                          {t('responsibilities')}
                        </label>
                        <span className="text-[11px] text-slate-400">
                          {t('responsibilitiesHint')}
                        </span>
                      </div>
                      <textarea
                        rows={4}
                        value={exp.description}
                        onChange={(e) => updateExperience(exp.id, { description: e.target.value })}
                        placeholder={t('responsibilitiesPlaceholder')}
                        className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-blue-500 leading-relaxed font-sans"
                      />
                      {/* Helpful starter bullets */}
                      <div className="mt-2 flex flex-wrap gap-1.5 items-center">
                        <span className="text-[11px] text-slate-500 font-medium flex items-center gap-1">
                          <Sparkles className="w-3 h-3 text-amber-500" />
                          Quick insert:
                        </span>
                        {bulletExamples.map((bullet, bIdx) => (
                          <button
                            key={bIdx}
                            type="button"
                            onClick={() => {
                              const existing = exp.description ? `${exp.description}\n${bullet}` : bullet;
                              updateExperience(exp.id, { description: existing });
                            }}
                            className="text-[10.5px] bg-slate-100 hover:bg-slate-200 text-slate-700 px-2 py-0.5 rounded cursor-pointer transition-colors"
                          >
                            + {bullet.slice(0, 32)}...
                          </button>
                        ))}
                      </div>
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
