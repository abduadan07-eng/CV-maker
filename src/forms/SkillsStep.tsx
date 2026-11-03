import React, { useState } from 'react';
import { Skill, SkillLevel } from '../types/cv';
import { useLanguage } from '../i18n/LanguageContext';
import { Plus, Trash2, ArrowUp, ArrowDown, Wrench, Sparkles } from 'lucide-react';

interface SkillsStepProps {
  skills: Skill[];
  onChange: (skills: Skill[]) => void;
}

export const SkillsStep: React.FC<SkillsStepProps> = ({ skills, onChange }) => {
  const { t, language } = useLanguage();
  const [newSkillName, setNewSkillName] = useState('');
  const [newSkillLevel, setNewSkillLevel] = useState<SkillLevel | ''>('');

  const levels: SkillLevel[] = ['Beginner', 'Intermediate', 'Advanced', 'Expert'];

  const getLevelLabel = (level: SkillLevel) => {
    switch (level) {
      case 'Beginner': return t('levelBeginner');
      case 'Intermediate': return t('levelIntermediate');
      case 'Advanced': return t('levelAdvanced');
      case 'Expert': return t('levelExpert');
      default: return level;
    }
  };

  const addSkill = (name = newSkillName, level = newSkillLevel) => {
    const trimmed = name.trim();
    if (!trimmed) return;

    // Check duplicate
    if (skills.some(s => s.name.toLowerCase() === trimmed.toLowerCase())) {
      setNewSkillName('');
      return;
    }

    const newSkill: Skill = {
      id: 'skill_' + Date.now() + Math.random().toString(36).substring(2, 5),
      name: trimmed,
      level: level ? (level as SkillLevel) : undefined
    };

    onChange([...skills, newSkill]);
    setNewSkillName('');
    setNewSkillLevel('');
  };

  const removeSkill = (id: string) => {
    onChange(skills.filter(s => s.id !== id));
  };

  const updateSkillLevel = (id: string, level: SkillLevel | undefined) => {
    onChange(skills.map(s => s.id === id ? { ...s, level } : s));
  };

  const moveSkill = (index: number, direction: 'up' | 'down') => {
    const newIndex = direction === 'up' ? index - 1 : index + 1;
    if (newIndex < 0 || newIndex >= skills.length) return;
    const items = [...skills];
    const [moved] = items.splice(index, 1);
    items.splice(newIndex, 0, moved);
    onChange(items);
  };

  const popularSkills = language === 'so' ? [
    'Maamulka Mashruuca', 'Falanqaynta Xogta', 'Xiriirka & Wada-shaqeynta',
    'Adeegga Macmiilka', 'Xisaabaadka & Maaliyadda', 'Kumbuyuutarka & IT',
    'Hogaaminta Kooxda', 'Xalinta Khilaafaadka', 'Qoraalka Warbixinnada'
  ] : [
    'Project Management', 'JavaScript & TypeScript', 'Data Analysis',
    'Communication & Teamwork', 'Customer Service', 'Problem Solving',
    'Financial Modeling', 'Public Speaking', 'Git & Agile/Scrum'
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-slate-900">{t('skillsTitle')}</h2>
        <p className="text-xs text-slate-500 mt-1">{t('skillsSubtitle')}</p>
      </div>

      {/* Add Skill Input Card */}
      <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200/80 space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-end">
          <div className="sm:col-span-6">
            <label className="block text-xs font-bold text-slate-700 mb-1">
              {t('skillName')}
            </label>
            <input
              type="text"
              value={newSkillName}
              onChange={(e) => setNewSkillName(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  addSkill();
                }
              }}
              placeholder={t('skillNamePlaceholder')}
              className="w-full px-3.5 py-2.5 bg-white border border-slate-300 rounded-xl text-xs text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="sm:col-span-4">
            <label className="block text-xs font-bold text-slate-700 mb-1">
              {t('skillLevel')}
            </label>
            <select
              value={newSkillLevel}
              onChange={(e) => setNewSkillLevel(e.target.value as SkillLevel | '')}
              className="w-full px-3.5 py-2.5 bg-white border border-slate-300 rounded-xl text-xs text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-blue-500 cursor-pointer"
            >
              <option value="">No level specified</option>
              {levels.map((lvl) => (
                <option key={lvl} value={lvl}>{getLevelLabel(lvl)}</option>
              ))}
            </select>
          </div>

          <div className="sm:col-span-2">
            <button
              type="button"
              onClick={() => addSkill()}
              disabled={!newSkillName.trim()}
              className="w-full py-2.5 px-3 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-200 disabled:text-slate-400 text-white rounded-xl text-xs font-semibold cursor-pointer transition-colors shadow-xs flex items-center justify-center gap-1.5"
            >
              <Plus className="w-4 h-4" />
              {t('addSkillBtn')}
            </button>
          </div>
        </div>

        {/* Quick suggestions */}
        <div className="pt-2 border-t border-slate-200/60">
          <span className="text-[11px] text-slate-500 font-medium flex items-center gap-1 mb-2">
            <Sparkles className="w-3 h-3 text-blue-600" />
            {t('quickAddSkills')}
          </span>
          <div className="flex flex-wrap gap-1.5">
            {popularSkills.map((ps) => {
              const alreadyAdded = skills.some(s => s.name.toLowerCase() === ps.toLowerCase());
              return (
                <button
                  key={ps}
                  type="button"
                  disabled={alreadyAdded}
                  onClick={() => addSkill(ps)}
                  className={`text-[11px] px-2.5 py-1 rounded-lg border transition-colors cursor-pointer ${
                    alreadyAdded
                      ? 'bg-slate-100 border-slate-200 text-slate-400 cursor-not-allowed'
                      : 'bg-white hover:bg-blue-50 border-slate-200 text-slate-700 hover:text-blue-700 hover:border-blue-300 shadow-2xs'
                  }`}
                >
                  + {ps}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Skills List */}
      {skills.length === 0 ? (
        <div className="text-center py-8 px-4 bg-slate-50 rounded-2xl border-2 border-dashed border-slate-200">
          <Wrench className="w-8 h-8 text-slate-400 mx-auto mb-2" />
          <h3 className="text-sm font-bold text-slate-700">{t('noSkillsTitle')}</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1">{t('noSkillsDesc')}</p>
        </div>
      ) : (
        <div className="space-y-2">
          {skills.map((skill, index) => (
            <div
              key={skill.id}
              className="bg-white border border-slate-200 rounded-xl px-4 py-2.5 flex items-center justify-between gap-3 shadow-2xs"
            >
              <div className="flex items-center gap-3 min-w-0">
                <span className="w-5 h-5 rounded-full bg-slate-100 text-slate-600 text-[10px] font-bold flex items-center justify-center shrink-0">
                  {index + 1}
                </span>
                <span className="font-semibold text-slate-800 text-xs truncate">
                  {skill.name}
                </span>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <select
                  value={skill.level || ''}
                  onChange={(e) => updateSkillLevel(skill.id, e.target.value as SkillLevel || undefined)}
                  className="text-[11px] py-1 px-2 border border-slate-200 rounded-lg text-slate-700 bg-slate-50 focus:outline-hidden"
                >
                  <option value="">No level</option>
                  {levels.map((lvl) => (
                    <option key={lvl} value={lvl}>{getLevelLabel(lvl)}</option>
                  ))}
                </select>

                <button
                  type="button"
                  disabled={index === 0}
                  onClick={() => moveSkill(index, 'up')}
                  className="p-1 text-slate-400 hover:text-slate-700 disabled:opacity-20 cursor-pointer"
                >
                  <ArrowUp className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  disabled={index === skills.length - 1}
                  onClick={() => moveSkill(index, 'down')}
                  className="p-1 text-slate-400 hover:text-slate-700 disabled:opacity-20 cursor-pointer"
                >
                  <ArrowDown className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => removeSkill(skill.id)}
                  className="p-1 text-red-500 hover:text-red-700 cursor-pointer ml-1"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
