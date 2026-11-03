import { CVData } from '../types/cv';
import { translations } from '../i18n/translations';

export function getSectionTitles(cvData: CVData) {
  const lang = cvData.cvLanguage || 'en';
  const dict = translations[lang] || translations.en;
  return {
    summary: dict.cvSecSummary,
    experience: dict.cvSecExperience,
    education: dict.cvSecEducation,
    skills: dict.cvSecSkills,
    languages: dict.cvSecLanguages,
    projects: dict.cvSecProjects,
    certifications: dict.cvSecCertifications,
    awards: dict.cvSecAwards,
    volunteer: dict.cvSecVolunteer,
    references: dict.cvSecReferences,
    present: dict.cvPresent
  };
}

export function formatLocation(city?: string, country?: string): string {
  const parts = [city, country].filter(Boolean);
  return parts.join(', ');
}

export function formatDates(start?: string, end?: string, isCurrent?: boolean, presentWord = 'Present'): string {
  if (!start && !end && !isCurrent) return '';
  if (isCurrent) {
    return start ? `${start} – ${presentWord}` : presentWord;
  }
  if (start && end) return `${start} – ${end}`;
  return start || end || '';
}
