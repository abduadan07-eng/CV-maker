/**
 * Type definitions for CV Maker
 */

export type InterfaceLanguage = 'en' | 'so';
export type CVLanguage = 'en' | 'so';

export type SkillLevel = 'Beginner' | 'Intermediate' | 'Advanced' | 'Expert';
export type LanguageProficiency = 'Native' | 'Fluent' | 'Professional' | 'Intermediate' | 'Basic';

export type PhotoShape = 'circle' | 'rounded' | 'square' | 'oval' | 'hexagon' | 'badge';
export type PhotoBorder = 'none' | 'thin' | 'accent' | 'double';

export interface PersonalInfo {
  fullName: string;
  jobTitle: string;
  email: string;
  phone: string;
  city: string;
  country: string;
  summary: string;
  photoUrl?: string; // Data URL or image link
  photoShape?: PhotoShape; // Shape of the photo: circle, rounded, square, oval, hexagon, badge
  photoBorder?: PhotoBorder; // Border style: none, thin, accent, double
  website?: string;
  linkedin?: string;
}

export interface WorkExperience {
  id: string;
  jobTitle: string;
  company: string;
  location: string;
  startDate: string;
  endDate: string;
  isCurrent: boolean;
  description: string;
}

export interface Education {
  id: string;
  institution: string;
  degree: string;
  fieldOfStudy: string;
  startDate: string;
  endDate: string;
  description: string;
}

export interface Skill {
  id: string;
  name: string;
  level?: SkillLevel;
}

export interface Language {
  id: string;
  name: string;
  proficiency: LanguageProficiency;
}

export interface Project {
  id: string;
  title: string;
  role?: string;
  link?: string;
  description: string;
}

export interface Certification {
  id: string;
  name: string;
  issuer: string;
  date: string;
}

export interface Award {
  id: string;
  title: string;
  issuer: string;
  date: string;
  description?: string;
}

export interface VolunteerExperience {
  id: string;
  role: string;
  organization: string;
  startDate: string;
  endDate: string;
  description: string;
}

export interface Reference {
  id: string;
  fullName: string;
  company: string;
  jobTitle: string;
  email: string;
  phone: string;
}

export interface AdditionalSections {
  projects: Project[];
  certifications: Certification[];
  awards: Award[];
  volunteer: VolunteerExperience[];
  references: Reference[];
}

export type CVSectionKey =
  | 'summary'
  | 'experiences'
  | 'education'
  | 'skills'
  | 'languages'
  | 'projects'
  | 'certifications'
  | 'awards'
  | 'volunteer'
  | 'references';

export interface CVPageConfig {
  pageNumber: number;
  sections: CVSectionKey[];
}

export interface CVPageLayout {
  mode: 'auto' | 'manual';
  totalPages: number; // 1 to 6, or 0 (unlimited)
  pages: CVPageConfig[];
  pageMargins?: 'compact' | 'normal' | 'spacious';
  showPageNumbers?: boolean;
}

export interface CVData {
  personal: PersonalInfo;
  experiences: WorkExperience[];
  education: Education[];
  skills: Skill[];
  languages: Language[];
  additional: AdditionalSections;
  cvLanguage: CVLanguage;
  pageLayout?: CVPageLayout;
}

export type TemplateId =
  | 'classic-professional'
  | 'modern-blue'
  | 'minimalist'
  | 'executive'
  | 'two-column-sidebar'
  | 'elegant-bw'
  | 'creative-designer'
  | 'compact-one-page'
  | 'academic'
  | 'graduate-first-job'
  | 'corporate-professional'
  | 'contemporary-accent';

export interface CVDraft {
  id: string;
  title: string;
  templateId: TemplateId;
  cvData: CVData;
  createdAt: string;
  updatedAt: string;
}

export interface TemplateDefinition {
  id: TemplateId;
  nameKey: string;
  descriptionKey: string;
  category: 'professional' | 'modern' | 'minimal' | 'academic' | 'creative';
  recommendedFor: string;
  accentColor: string;
  previewBg: string;
}
