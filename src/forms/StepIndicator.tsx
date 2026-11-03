import React from 'react';
import { useLanguage } from '../i18n/LanguageContext';
import { User, Briefcase, GraduationCap, Wrench, Languages, PlusCircle, Check } from 'lucide-react';

export type FormStepKey = 'personal' | 'experience' | 'education' | 'skills' | 'languages' | 'additional';

interface StepIndicatorProps {
  currentStep: FormStepKey;
  onSelectStep: (step: FormStepKey) => void;
  completedSteps: Set<FormStepKey>;
}

export const StepIndicator: React.FC<StepIndicatorProps> = ({
  currentStep,
  onSelectStep,
  completedSteps
}) => {
  const { t } = useLanguage();

  const steps: { key: FormStepKey; label: string; icon: React.FC<{ className?: string }> }[] = [
    { key: 'personal', label: t('stepPersonal'), icon: User },
    { key: 'experience', label: t('stepExperience'), icon: Briefcase },
    { key: 'education', label: t('stepEducation'), icon: GraduationCap },
    { key: 'skills', label: t('stepSkills'), icon: Wrench },
    { key: 'languages', label: t('stepLanguages'), icon: Languages },
    { key: 'additional', label: t('stepAdditional'), icon: PlusCircle }
  ];

  const currentIndex = steps.findIndex(s => s.key === currentStep);

  return (
    <nav aria-label="Progress" className="w-full bg-white border-b border-slate-200 sticky top-0 z-20 shadow-xs">
      {/* Mobile Horizontal Scroll Step Bar */}
      <div className="max-w-4xl mx-auto px-4 py-3 overflow-x-auto scrollbar-none flex items-center justify-between gap-1 sm:gap-2">
        {steps.map((step, idx) => {
          const Icon = step.icon;
          const isCurrent = step.key === currentStep;
          const isCompleted = completedSteps.has(step.key);
          const isPast = idx < currentIndex;

          return (
            <button
              key={step.key}
              onClick={() => onSelectStep(step.key)}
              type="button"
              className={`flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer shrink-0 ${
                isCurrent
                  ? 'bg-blue-600 text-white shadow-sm ring-2 ring-blue-600/30'
                  : isCompleted || isPast
                  ? 'bg-blue-50 text-blue-900 hover:bg-blue-100'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${
                isCurrent
                  ? 'bg-white text-blue-600'
                  : isCompleted
                  ? 'bg-blue-600 text-white'
                  : 'bg-slate-200 text-slate-600'
              }`}>
                {isCompleted ? <Check className="w-3 h-3" /> : idx + 1}
              </span>
              <span>{step.label}</span>
            </button>
          );
        })}
      </div>

      {/* Progress percentage bar */}
      <div className="w-full bg-slate-100 h-1">
        <div
          className="bg-blue-600 h-1 transition-all duration-300"
          style={{ width: `${((currentIndex + 1) / steps.length) * 100}%` }}
        />
      </div>
    </nav>
  );
};
