import React, { useState } from 'react';
import { Language, LanguageProficiency } from '../types/cv';
import { useLanguage } from '../i18n/LanguageContext';
import { Plus, Trash2, Languages as LangIcon } from 'lucide-react';

interface LanguagesStepProps {
  languages: Language[];
  onChange: (languages: Language[]) => void;
}

export const LanguagesStep: React.FC<LanguagesStepProps> = ({ languages, onChange }) => {
  const { t } = useLanguage();
  const [langName, setLangName] = useState('');
  const [proficiency, setProficiency] = useState<LanguageProficiency>('Fluent');

  const proficiencies: LanguageProficiency[] = [
    'Native',
    'Fluent',
    'Professional',
    'Intermediate',
    'Basic'
  ];

  const getProficiencyLabel = (prof: LanguageProficiency) => {
    switch (prof) {
      case 'Native': return t('profNative');
      case 'Fluent': return t('profFluent');
      case 'Professional': return t('profProfessional');
      case 'Intermediate': return t('profIntermediate');
      case 'Basic': return t('profBasic');
      default: return prof;
    }
  };

  const addLanguage = () => {
    const trimmed = langName.trim();
    if (!trimmed) return;

    const newLang: Language = {
      id: 'lang_' + Date.now(),
      name: trimmed,
      proficiency
    };

    onChange([...languages, newLang]);
    setLangName('');
  };

  const removeLanguage = (id: string) => {
    onChange(languages.filter(l => l.id !== id));
  };

  const updateProficiency = (id: string, prof: LanguageProficiency) => {
    onChange(languages.map(l => l.id === id ? { ...l, proficiency: prof } : l));
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-slate-900">{t('languagesTitle')}</h2>
        <p className="text-xs text-slate-500 mt-1">{t('languagesSubtitle')}</p>
      </div>

      {/* Add Language Form */}
      <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200/80">
        <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-end">
          <div className="sm:col-span-6">
            <label className="block text-xs font-bold text-slate-700 mb-1">
              {t('languageName')}
            </label>
            <input
              type="text"
              value={langName}
              onChange={(e) => setLangName(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  addLanguage();
                }
              }}
              placeholder={t('languageNamePlaceholder')}
              className="w-full px-3.5 py-2.5 bg-white border border-slate-300 rounded-xl text-xs text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="sm:col-span-4">
            <label className="block text-xs font-bold text-slate-700 mb-1">
              {t('proficiencyLevel')}
            </label>
            <select
              value={proficiency}
              onChange={(e) => setProficiency(e.target.value as LanguageProficiency)}
              className="w-full px-3.5 py-2.5 bg-white border border-slate-300 rounded-xl text-xs text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-blue-500 cursor-pointer"
            >
              {proficiencies.map((p) => (
                <option key={p} value={p}>{getProficiencyLabel(p)}</option>
              ))}
            </select>
          </div>

          <div className="sm:col-span-2">
            <button
              type="button"
              onClick={addLanguage}
              disabled={!langName.trim()}
              className="w-full py-2.5 px-3 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-200 disabled:text-slate-400 text-white rounded-xl text-xs font-semibold cursor-pointer transition-colors shadow-xs flex items-center justify-center gap-1.5"
            >
              <Plus className="w-4 h-4" />
              {t('addLanguageBtn')}
            </button>
          </div>
        </div>
      </div>

      {/* Languages List */}
      {languages.length === 0 ? (
        <div className="text-center py-8 px-4 bg-slate-50 rounded-2xl border-2 border-dashed border-slate-200">
          <LangIcon className="w-8 h-8 text-slate-400 mx-auto mb-2" />
          <p className="text-xs text-slate-500">
            List languages you speak to stand out for multinational and bilingual roles.
          </p>
        </div>
      ) : (
        <div className="space-y-2">
          {languages.map((l) => (
            <div
              key={l.id}
              className="bg-white border border-slate-200 rounded-xl px-4 py-3 flex items-center justify-between gap-3 shadow-2xs"
            >
              <div className="min-w-0">
                <p className="font-semibold text-slate-800 text-xs">{l.name}</p>
                <p className="text-[11px] text-blue-700 font-medium">{getProficiencyLabel(l.proficiency)}</p>
              </div>

              <div className="flex items-center gap-2">
                <select
                  value={l.proficiency}
                  onChange={(e) => updateProficiency(l.id, e.target.value as LanguageProficiency)}
                  className="text-[11px] py-1 px-2 border border-slate-200 rounded-lg text-slate-700 bg-slate-50"
                >
                  {proficiencies.map((p) => (
                    <option key={p} value={p}>{getProficiencyLabel(p)}</option>
                  ))}
                </select>

                <button
                  type="button"
                  onClick={() => removeLanguage(l.id)}
                  className="p-1 text-red-500 hover:text-red-700 cursor-pointer"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
