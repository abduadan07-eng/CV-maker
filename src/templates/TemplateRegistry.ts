import React from 'react';
import { TemplateId } from '../types/cv';
import { TemplateProps } from './types';
import { ClassicProfessionalTemplate } from './ClassicProfessionalTemplate';
import { ModernBlueTemplate } from './ModernBlueTemplate';
import { MinimalistTemplate } from './MinimalistTemplate';
import { ExecutiveTemplate } from './ExecutiveTemplate';
import { TwoColumnSidebarTemplate } from './TwoColumnSidebarTemplate';
import { ElegantBWTemplate } from './ElegantBWTemplate';
import { CreativeDesignerTemplate } from './CreativeDesignerTemplate';
import { CompactOnePageTemplate } from './CompactOnePageTemplate';
import { AcademicCVTemplate } from './AcademicCVTemplate';
import { GraduateFirstJobTemplate } from './GraduateFirstJobTemplate';
import { CorporateProfessionalTemplate } from './CorporateProfessionalTemplate';
import { ContemporaryAccentTemplate } from './ContemporaryAccentTemplate';

export interface TemplateMeta {
  id: TemplateId;
  nameEn: string;
  nameSo: string;
  descriptionEn: string;
  descriptionSo: string;
  category: 'professional' | 'modern' | 'minimal' | 'academic' | 'creative';
  recommendedForEn: string;
  recommendedForSo: string;
  accentColor: string;
  accentClass: string;
  component: React.FC<TemplateProps>;
}

export const TEMPLATES_REGISTRY: TemplateMeta[] = [
  {
    id: 'classic-professional',
    nameEn: 'Classic Professional',
    nameSo: 'Xirfadeed Qadiimi ah',
    descriptionEn: 'Traditional serif hierarchy with centered header and clean horizontal rules. High ATS pass rate.',
    descriptionSo: 'Qaab qadiimi ah oo leh xariiqo nadiif ah iyo hab-dhaqan caalami ah oo shaqo-bixiyeyaashu jecel yihiin.',
    category: 'professional',
    recommendedForEn: 'Finance, Law, Government, Traditional Corporate',
    recommendedForSo: 'Maaliyadda, Sharciga, Dawladda, Shirkadaha Waaweyn',
    accentColor: '#1e293b',
    accentClass: 'bg-slate-900',
    component: ClassicProfessionalTemplate
  },
  {
    id: 'modern-blue',
    nameEn: 'Modern Blue',
    nameSo: 'Buluug Casri ah',
    descriptionEn: 'Vibrant blue header banner with crisp dual-column layout and contact pills.',
    descriptionSo: 'Dusha sare oo buluug ah oo leh laba tiir oo casri ah oo xogtaada si qurux badan u kala saara.',
    category: 'modern',
    recommendedForEn: 'Software Engineering, Product Management, Tech Startups',
    recommendedForSo: 'Injineerada Software-ka, Maamulka Farsamada, Shirkadaha Casriga ah',
    accentColor: '#2563eb',
    accentClass: 'bg-blue-600',
    component: ModernBlueTemplate
  },
  {
    id: 'minimalist',
    nameEn: 'Minimalist',
    nameSo: 'Nadiif (Minimalist)',
    descriptionEn: 'Swiss typographic restraint with generous whitespace, delicate hairlines, and zero clutter.',
    descriptionSo: 'Naqshad fudud oo nadiif ah oo xogtaada mudnaanta siisa iyada oo aan lahayn wax carqalad ah.',
    category: 'minimal',
    recommendedForEn: 'Designers, Architects, Writers, Consultants',
    recommendedForSo: 'Naqshadeeyeyaasha, Qorayaasha, La-taliyeyaasha',
    accentColor: '#64748b',
    accentClass: 'bg-slate-500',
    component: MinimalistTemplate
  },
  {
    id: 'executive',
    nameEn: 'Executive',
    nameSo: 'Maamule Sare (Executive)',
    descriptionEn: 'High-level executive layout featuring bordered leadership summary and prominent career milestones.',
    descriptionSo: 'Loogu talagalay maamulayaasha sare iyo agaasimayaasha si ay u muujiyaan hogaamintooda.',
    category: 'professional',
    recommendedForEn: 'Directors, VP, C-Suite, Senior Managers',
    recommendedForSo: 'Agaasimayaasha, Madaxda Qeybaha, Maamulayaasha Sare',
    accentColor: '#0f172a',
    accentClass: 'bg-slate-950',
    component: ExecutiveTemplate
  },
  {
    id: 'two-column-sidebar',
    nameEn: 'Two-Column Sidebar',
    nameSo: 'Labo Tiir oo Dhinac leh',
    descriptionEn: 'High-contrast dark navy sidebar with skills, photo, and credentials, paired with an expansive main timeline.',
    descriptionSo: 'Tiir dhinac mugdi ah oo ay ku yaallaan sawirka iyo xirfadaha, iyo tiir weyn oo shaqada ku saabsan.',
    category: 'modern',
    recommendedForEn: 'Full-Stack Developers, Analysts, Operations Leads',
    recommendedForSo: 'Horumariyeyaasha, Xog-falanqeeyeyaasha, Khubarada Shaqada',
    accentColor: '#1e3a8a',
    accentClass: 'bg-blue-900',
    component: TwoColumnSidebarTemplate
  },
  {
    id: 'elegant-bw',
    nameEn: 'Elegant Black & White',
    nameSo: 'Madoow iyo Caddaan Qiimo Leh',
    descriptionEn: 'High-fashion editorial monochrome with luxury serif typography and sharp dividing rules.',
    descriptionSo: 'Madoow iyo caddaan heer sare ah oo ku habboon saxaafadda, suugaanta iyo maamulka.',
    category: 'minimal',
    recommendedForEn: 'Media, Publishing, Fashion, Luxury Brands, Law',
    recommendedForSo: 'Warbaahinta, Saxaafadda, Sharciga, Maamulka Brand-ka',
    accentColor: '#000000',
    accentClass: 'bg-black',
    component: ElegantBWTemplate
  },
  {
    id: 'creative-designer',
    nameEn: 'Creative Designer',
    nameSo: 'Hal-abuur & Naqshad',
    descriptionEn: 'Asymmetric violet gradient hero card, interactive project spotlight, and modern skill badges.',
    descriptionSo: 'Midabbo hal-abuur leh iyo muujinta mashaariicda si gaar ah loogu talagalay hal-abuurayaasha.',
    category: 'creative',
    recommendedForEn: 'UI/UX Designers, Art Directors, Content Creators, Marketers',
    recommendedForSo: 'Naqshadeeyeyaasha UI/UX, Suuq-geynta, Sameeyayaasha Muuqaallada',
    accentColor: '#7c3aed',
    accentClass: 'bg-purple-600',
    component: CreativeDesignerTemplate
  },
  {
    id: 'compact-one-page',
    nameEn: 'Compact One-Page',
    nameSo: 'Hal Bog oo Cufan',
    descriptionEn: 'Engineered for dense data density. Fits maximum experience, projects, and skills without spilling.',
    descriptionSo: 'Loogu talagalay in dhammaan xogtaadu ay ku wada habboonaato hal bog oo keliya.',
    category: 'professional',
    recommendedForEn: 'Experienced Professionals who need a strict 1-page CV',
    recommendedForSo: 'Khubaro leh xog badan oo doonaya inay hal bog ku koobaan',
    accentColor: '#334155',
    accentClass: 'bg-slate-700',
    component: CompactOnePageTemplate
  },
  {
    id: 'academic',
    nameEn: 'Academic CV',
    nameSo: 'CV-ga Tacliinta & Cilmi-baarista',
    descriptionEn: 'Scholarly structure emphasizing education, publications, research projects, grants, and teaching.',
    descriptionSo: 'Loogu talagalay macallimiinta jaamacadaha, cilmi-baarayaasha iyo aqoonyahannada.',
    category: 'academic',
    recommendedForEn: 'Professors, Researchers, PhD Candidates, Lecturers',
    recommendedForSo: 'Borofasoorrada, Cilmi-baarayaasha, Ardayda PhD, Macallimiinta',
    accentColor: '#475569',
    accentClass: 'bg-slate-600',
    component: AcademicCVTemplate
  },
  {
    id: 'graduate-first-job',
    nameEn: 'Graduate / First Job',
    nameSo: 'Arday / Shaqadii Koowaad',
    descriptionEn: 'Education, academic coursework, and practical projects front and center. Empowers early career seekers.',
    descriptionSo: 'Ku habboon qof hadda qalin-jabiyey ama shaqadii koowaad raadinaya.',
    category: 'modern',
    recommendedForEn: 'Recent Graduates, Interns, Career Changers, Students',
    recommendedForSo: 'Ardayda hadda qalin-jabisay, Layli-doonka, Shaqo-doonka cusub',
    accentColor: '#059669',
    accentClass: 'bg-emerald-600',
    component: GraduateFirstJobTemplate
  },
  {
    id: 'corporate-professional',
    nameEn: 'Corporate Professional',
    nameSo: 'Shirkadeed Heer Sare ah',
    descriptionEn: 'Sleek corporate header with dedicated credentials rail and structured achievement bullets.',
    descriptionSo: 'Hab-dhaqan shirkadeed oo casri ah oo leh meel gaar ah oo loogu talagalay shahaadooyinka.',
    category: 'professional',
    recommendedForEn: 'Banking, Telecommunications, Consulting, Logistics',
    recommendedForSo: 'Bangiyada, Isgaarsiinta, La-talinta Ganacsiga, Saadka',
    accentColor: '#1e293b',
    accentClass: 'bg-slate-800',
    component: CorporateProfessionalTemplate
  },
  {
    id: 'contemporary-accent',
    nameEn: 'Contemporary Accent',
    nameSo: 'Midab Casri ah (Contemporary)',
    descriptionEn: 'Deep teal headers, smooth rounded pill accents, and modern tech agency card aesthetics.',
    descriptionSo: 'Midab teal casri ah iyo qaabeyn qurxoon oo ku habboon xilligan.',
    category: 'creative',
    recommendedForEn: 'Agencies, Tech Consultants, Sales Engineers, HR Leaders',
    recommendedForSo: 'Wakaaladaha, Farsamada Casriga ah, Horumarinta Ganacsiga',
    accentColor: '#0d9488',
    accentClass: 'bg-teal-600',
    component: ContemporaryAccentTemplate
  }
];

export function getTemplateMeta(id: TemplateId): TemplateMeta {
  return TEMPLATES_REGISTRY.find(t => t.id === id) || TEMPLATES_REGISTRY[0];
}

export function getTemplateComponent(id: TemplateId): React.FC<TemplateProps> {
  const meta = getTemplateMeta(id);
  return meta.component;
}
