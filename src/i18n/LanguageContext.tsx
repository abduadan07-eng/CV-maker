import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { InterfaceLanguage, CVLanguage } from '../types/cv';
import { translations, TranslationDictionary } from './translations';

interface LanguageContextType {
  language: InterfaceLanguage;
  setLanguage: (lang: InterfaceLanguage) => void;
  t: (key: keyof TranslationDictionary) => string;
  getCVSectionTitle: (sectionKey: CVSectionKey, cvLanguage?: CVLanguage) => string;
}

export type CVSectionKey =
  | 'summary'
  | 'experience'
  | 'education'
  | 'skills'
  | 'languages'
  | 'projects'
  | 'certifications'
  | 'awards'
  | 'volunteer'
  | 'references'
  | 'present';

const STORAGE_KEY_LANG = 'cv_maker_ui_language';

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<InterfaceLanguage>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_LANG);
      if (saved === 'en' || saved === 'so') {
        return saved;
      }
    } catch {
      // Ignore localStorage errors
    }
    return 'en';
  });

  const setLanguage = (lang: InterfaceLanguage) => {
    setLanguageState(lang);
    try {
      localStorage.setItem(STORAGE_KEY_LANG, lang);
    } catch {
      // Ignore
    }
  };

  const t = (key: keyof TranslationDictionary): string => {
    const dict = translations[language] || translations.en;
    return dict[key] || translations.en[key] || (key as string);
  };

  const getCVSectionTitle = (sectionKey: CVSectionKey, cvLanguage: CVLanguage = 'en'): string => {
    const dict = translations[cvLanguage] || translations.en;
    switch (sectionKey) {
      case 'summary':
        return dict.cvSecSummary;
      case 'experience':
        return dict.cvSecExperience;
      case 'education':
        return dict.cvSecEducation;
      case 'skills':
        return dict.cvSecSkills;
      case 'languages':
        return dict.cvSecLanguages;
      case 'projects':
        return dict.cvSecProjects;
      case 'certifications':
        return dict.cvSecCertifications;
      case 'awards':
        return dict.cvSecAwards;
      case 'volunteer':
        return dict.cvSecVolunteer;
      case 'references':
        return dict.cvSecReferences;
      case 'present':
        return dict.cvPresent;
      default:
        return '';
    }
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t, getCVSectionTitle }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = (): LanguageContextType => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
