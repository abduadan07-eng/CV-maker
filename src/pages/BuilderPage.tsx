import React, { useState } from 'react';
import { CVData, TemplateId, CVDraft, CVLanguage } from '../types/cv';
import { FormStepKey, StepIndicator } from '../forms/StepIndicator';
import { PersonalStep } from '../forms/PersonalStep';
import { ExperienceStep } from '../forms/ExperienceStep';
import { EducationStep } from '../forms/EducationStep';
import { SkillsStep } from '../forms/SkillsStep';
import { LanguagesStep } from '../forms/LanguagesStep';
import { AdditionalStep } from '../forms/AdditionalStep';
import { TemplateGalleryModal } from '../components/TemplateGalleryModal';
import { useLanguage } from '../i18n/LanguageContext';
import { getTemplateMeta } from '../templates/TemplateRegistry';
import {
  ArrowLeft,
  ArrowRight,
  Eye,
  Save,
  LayoutTemplate,
  Check,
  AlertCircle
} from 'lucide-react';

interface BuilderPageProps {
  draft: CVDraft;
  onUpdateDraft: (updated: CVDraft) => void;
  onSaveDraft: () => void;
  onGoToPreview: () => void;
  onBackToHome: () => void;
}

export const BuilderPage: React.FC<BuilderPageProps> = ({
  draft,
  onUpdateDraft,
  onSaveDraft,
  onGoToPreview,
  onBackToHome
}) => {
  const { t, language } = useLanguage();
  const [currentStep, setCurrentStep] = useState<FormStepKey>('personal');
  const [completedSteps, setCompletedSteps] = useState<Set<FormStepKey>>(new Set());
  const [errors, setErrors] = useState<{ fullName?: string; email?: string; jobTitle?: string }>({});
  const [isGalleryOpen, setIsGalleryOpen] = useState(false);
  const [saveToast, setSaveToast] = useState(false);

  const stepOrder: FormStepKey[] = [
    'personal',
    'experience',
    'education',
    'skills',
    'languages',
    'additional'
  ];

  const currentStepIndex = stepOrder.indexOf(currentStep);

  const validatePersonal = (): boolean => {
    const errs: { fullName?: string; email?: string; jobTitle?: string } = {};
    if (!draft.cvData.personal.fullName.trim()) {
      errs.fullName = t('nameRequired');
    }
    if (draft.cvData.personal.email.trim()) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(draft.cvData.personal.email.trim())) {
        errs.email = t('emailInvalid');
      }
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleNext = () => {
    if (currentStep === 'personal') {
      const isValid = validatePersonal();
      if (!isValid) return;
    }

    setCompletedSteps(prev => new Set([...prev, currentStep]));

    if (currentStepIndex < stepOrder.length - 1) {
      setCurrentStep(stepOrder[currentStepIndex + 1]);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      // Reached the end -> jump straight to Live Preview!
      onGoToPreview();
    }
  };

  const handleBack = () => {
    if (currentStepIndex > 0) {
      setCurrentStep(stepOrder[currentStepIndex - 1]);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      onBackToHome();
    }
  };

  const updateCvData = (updater: (prev: CVData) => CVData) => {
    const newCvData = updater(draft.cvData);
    onUpdateDraft({
      ...draft,
      cvData: newCvData
    });
  };

  const handleSaveClick = () => {
    onSaveDraft();
    setSaveToast(true);
    setTimeout(() => setSaveToast(false), 2500);
  };

  const templateMeta = getTemplateMeta(draft.templateId);
  const templateName = language === 'so' ? templateMeta.nameSo : templateMeta.nameEn;

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 pb-28">
      {/* Step Indicator Header Bar */}
      <StepIndicator
        currentStep={currentStep}
        onSelectStep={(step) => {
          if (currentStep === 'personal' && step !== 'personal') {
            if (!validatePersonal()) return;
          }
          setCurrentStep(step);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        completedSteps={completedSteps}
      />

      {/* Builder Subheader (Quick Save & Template Switcher) */}
      <div className="bg-white border-b border-slate-200 px-4 py-2.5">
        <div className="max-w-4xl mx-auto flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onBackToHome}
              className="text-xs text-slate-600 hover:text-slate-900 flex items-center gap-1 cursor-pointer font-medium"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>{t('myCvsTitle')}</span>
            </button>
          </div>

          <div className="flex items-center gap-2">
            {/* Quick Template Switcher Button */}
            <button
              type="button"
              onClick={() => setIsGalleryOpen(true)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-lg text-xs font-semibold cursor-pointer transition-colors"
            >
              <LayoutTemplate className="w-3.5 h-3.5 text-blue-600" />
              <span className="hidden sm:inline">{t('templateLabel')}:</span>
              <span className="font-bold text-blue-700">{templateName}</span>
            </button>

            {/* Save Draft */}
            <button
              type="button"
              onClick={handleSaveClick}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-semibold cursor-pointer transition-colors"
            >
              <Save className="w-3.5 h-3.5" />
              <span>{t('saveDraftBtn')}</span>
            </button>

            {/* Live Preview Button */}
            <button
              type="button"
              onClick={onGoToPreview}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold cursor-pointer transition-colors shadow-2xs"
            >
              <Eye className="w-3.5 h-3.5" />
              <span>{t('previewBtn')}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Step Content Container */}
      <main className="max-w-4xl mx-auto px-4 pt-6">
        <div className="bg-white rounded-3xl border border-slate-200/90 p-5 sm:p-8 shadow-xs">
          {currentStep === 'personal' && (
            <PersonalStep
              data={draft.cvData.personal}
              errors={errors}
              onChange={(updated) => updateCvData(prev => ({ ...prev, personal: updated }))}
            />
          )}

          {currentStep === 'experience' && (
            <ExperienceStep
              experiences={draft.cvData.experiences}
              onChange={(updated) => updateCvData(prev => ({ ...prev, experiences: updated }))}
            />
          )}

          {currentStep === 'education' && (
            <EducationStep
              education={draft.cvData.education}
              onChange={(updated) => updateCvData(prev => ({ ...prev, education: updated }))}
            />
          )}

          {currentStep === 'skills' && (
            <SkillsStep
              skills={draft.cvData.skills}
              onChange={(updated) => updateCvData(prev => ({ ...prev, skills: updated }))}
            />
          )}

          {currentStep === 'languages' && (
            <LanguagesStep
              languages={draft.cvData.languages}
              onChange={(updated) => updateCvData(prev => ({ ...prev, languages: updated }))}
            />
          )}

          {currentStep === 'additional' && (
            <AdditionalStep
              data={draft.cvData.additional}
              onChange={(updated) => updateCvData(prev => ({ ...prev, additional: updated }))}
            />
          )}
        </div>
      </main>

      {/* Sticky Bottom Navigation Bar (Mobile-first) */}
      <footer className="fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-md border-t border-slate-200 py-3 px-4 z-20 shadow-lg">
        <div className="max-w-4xl mx-auto flex items-center justify-between gap-3">
          <button
            type="button"
            onClick={handleBack}
            className="inline-flex items-center gap-1.5 px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold cursor-pointer transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>{t('backBtn')}</span>
          </button>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onGoToPreview}
              className="hidden sm:inline-flex items-center gap-1.5 px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl text-xs font-semibold cursor-pointer transition-colors"
            >
              <Eye className="w-4 h-4" />
              <span>{t('previewBtn')}</span>
            </button>

            <button
              type="button"
              onClick={handleNext}
              className="inline-flex items-center gap-1.5 px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold cursor-pointer transition-colors shadow-sm"
            >
              <span>{currentStepIndex === stepOrder.length - 1 ? t('previewBtn') : t('nextBtn')}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </footer>

      {/* Save Notification Toast */}
      {saveToast && (
        <div className="fixed top-20 right-4 z-50 bg-slate-900 text-white text-xs font-medium px-4 py-2.5 rounded-xl shadow-xl flex items-center gap-2 animate-fadeIn">
          <Check className="w-4 h-4 text-emerald-400" />
          <span>{t('savedSuccessfully')}</span>
        </div>
      )}

      {/* Template Gallery Selector Modal */}
      <TemplateGalleryModal
        isOpen={isGalleryOpen}
        onClose={() => setIsGalleryOpen(false)}
        selectedTemplateId={draft.templateId}
        onSelectTemplate={(newTmpl) => {
          onUpdateDraft({
            ...draft,
            templateId: newTmpl
          });
        }}
      />
    </div>
  );
};
