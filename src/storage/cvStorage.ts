/**
 * Modular LocalStorage Persistence Layer for CV Maker
 * Cleanly separated from UI for future backend/Firebase integration.
 */

import { CVDraft, CVData, TemplateId } from '../types/cv';

const STORAGE_KEY_DRAFTS = 'cv_maker_saved_drafts';
const STORAGE_KEY_ACTIVE_ID = 'cv_maker_active_draft_id';

export const createEmptyCVData = (): CVData => ({
  personal: {
    fullName: '',
    jobTitle: '',
    email: '',
    phone: '',
    city: '',
    country: '',
    summary: '',
    photoUrl: '',
    photoShape: 'circle',
    photoBorder: 'none',
    website: '',
    linkedin: ''
  },
  experiences: [],
  education: [],
  skills: [],
  languages: [],
  additional: {
    projects: [],
    certifications: [],
    awards: [],
    volunteer: [],
    references: []
  },
  cvLanguage: 'en'
});

export const getSampleCVData = (): CVData => ({
  personal: {
    fullName: 'Ahmed Abdi Hassan',
    jobTitle: 'Senior Full-Stack Engineer & Cloud Architect',
    email: 'ahmed.abdi.hassan@example.com',
    phone: '+252 61 789 4521',
    city: 'Mogadishu',
    country: 'Somalia',
    summary: 'Results-driven Senior Full-Stack Engineer with over 6 years of experience architecting scalable web applications, RESTful APIs, and cloud microservices. Proven track record leading agile developer squads and driving 40% performance gains in mission-critical payment gateways.',
    photoUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
    photoShape: 'circle',
    photoBorder: 'accent',
    website: 'https://ahmedhassan.dev',
    linkedin: 'linkedin.com/in/ahmed-abdi-hassan'
  },
  experiences: [
    {
      id: 'exp-1',
      jobTitle: 'Lead Software Architect',
      company: 'Somali FinTech Solutions',
      location: 'Mogadishu, Somalia',
      startDate: '2022',
      endDate: 'Present',
      isCurrent: true,
      description: '• Architected and deployed a multi-currency mobile payments engine handling 250,000+ daily transactions with 99.98% uptime.\n• Spearheaded the migration from monolithic architecture to distributed microservices on Docker & AWS.\n• Mentored a team of 8 junior and mid-level software engineers through code reviews and bi-weekly architecture sessions.'
    },
    {
      id: 'exp-2',
      jobTitle: 'Senior Software Engineer',
      company: 'Horn Digital Lab',
      location: 'Hargeisa, Somalia',
      startDate: '2019',
      endDate: '2022',
      isCurrent: false,
      description: '• Developed high-throughput web dashboards using React, TypeScript, Node.js, and PostgreSQL.\n• Reduced frontend load times by 45% through client-side bundle splitting, code modularization, and edge caching.\n• Designed automated CI/CD deployment pipelines that reduced deployment release cycles from 3 days to under 30 minutes.'
    },
    {
      id: 'exp-3',
      jobTitle: 'Software Developer',
      company: 'Global Tech Innovations',
      location: 'Nairobi, Kenya',
      startDate: '2017',
      endDate: '2019',
      isCurrent: false,
      description: '• Built responsive customer-facing portals and REST API endpoints supporting 50,000+ registered active users.\n• Collaborated closely with UI/UX designers to implement pixel-perfect user flows.'
    }
  ],
  education: [
    {
      id: 'edu-1',
      institution: 'Somali National University',
      degree: 'Bachelor of Science (B.Sc.)',
      fieldOfStudy: 'Computer Science & Software Engineering',
      startDate: '2013',
      endDate: '2017',
      description: 'First Class Honors (GPA 3.89/4.00). President of Computer Science Student Association. Dean’s Honor Roll all 4 years.'
    }
  ],
  skills: [
    { id: 'sk-1', name: 'TypeScript & JavaScript', level: 'Expert' },
    { id: 'sk-2', name: 'React & Next.js', level: 'Expert' },
    { id: 'sk-3', name: 'Node.js & Express', level: 'Advanced' },
    { id: 'sk-4', name: 'PostgreSQL & MongoDB', level: 'Advanced' },
    { id: 'sk-5', name: 'Docker & Kubernetes', level: 'Intermediate' },
    { id: 'sk-6', name: 'Tailwind CSS & UI Systems', level: 'Expert' },
    { id: 'sk-7', name: 'System Architecture & Security', level: 'Advanced' },
    { id: 'sk-8', name: 'Agile & Team Leadership', level: 'Advanced' }
  ],
  languages: [
    { id: 'lang-1', name: 'Somali', proficiency: 'Native' },
    { id: 'lang-2', name: 'English', proficiency: 'Fluent' },
    { id: 'lang-3', name: 'Arabic', proficiency: 'Professional' }
  ],
  additional: {
    projects: [
      {
        id: 'proj-1',
        title: 'SahalPay Merchant Gateway',
        role: 'Lead Architect',
        link: 'https://github.com/ahmed/sahalpay',
        description: 'End-to-end QR payment gateway integrating telecom USSD APIs with merchant e-commerce platforms.'
      },
      {
        id: 'proj-2',
        title: 'Open Somali Spellchecker',
        role: 'Creator & Maintainer',
        link: 'https://github.com/ahmed/somali-nlp',
        description: 'Open-source natural language dictionary and spell-checking extension used by 12,000+ students and writers.'
      }
    ],
    certifications: [
      {
        id: 'cert-1',
        name: 'AWS Certified Solutions Architect – Associate',
        issuer: 'Amazon Web Services',
        date: '2023'
      },
      {
        id: 'cert-2',
        name: 'Professional Scrum Master I (PSM I)',
        issuer: 'Scrum.org',
        date: '2022'
      }
    ],
    awards: [
      {
        id: 'aw-1',
        title: 'National Tech Innovator of the Year',
        issuer: 'Ministry of Communications and Technology',
        date: '2023',
        description: 'Awarded for pioneering open digital tools and youth technology mentorship.'
      }
    ],
    volunteer: [
      {
        id: 'vol-1',
        role: 'Coding Mentor',
        organization: 'Horn of Africa Tech Youth Initiative',
        startDate: '2021',
        endDate: 'Present',
        description: 'Taught foundational web development to over 150 high school and university students.'
      }
    ],
    references: [
      {
        id: 'ref-1',
        fullName: 'Dr. Khadar Warsame',
        company: 'Somali National University',
        jobTitle: 'Dean of Faculty of Computing',
        email: 'k.warsame@snu.edu.so',
        phone: '+252 61 500 0011'
      },
      {
        id: 'ref-2',
        fullName: 'Fartun Jama',
        company: 'Somali FinTech Solutions',
        jobTitle: 'Chief Technology Officer',
        email: 'fartun.jama@somalifintech.so',
        phone: '+252 61 500 0022'
      }
    ]
  },
  cvLanguage: 'en'
});

export const cvStorage = {
  getDrafts(): CVDraft[] {
    try {
      const data = localStorage.getItem(STORAGE_KEY_DRAFTS);
      if (!data) return [];
      const parsed = JSON.parse(data);
      if (Array.isArray(parsed)) {
        return parsed;
      }
      return [];
    } catch (err) {
      console.error('Failed to read drafts from localStorage', err);
      return [];
    }
  },

  getDraftById(id: string): CVDraft | null {
    const drafts = this.getDrafts();
    return drafts.find(d => d.id === id) || null;
  },

  saveDraft(draft: CVDraft): void {
    try {
      const drafts = this.getDrafts();
      const existingIndex = drafts.findIndex(d => d.id === draft.id);
      const updatedDraft = {
        ...draft,
        updatedAt: new Date().toISOString()
      };

      let newDrafts: CVDraft[];
      if (existingIndex >= 0) {
        newDrafts = [...drafts];
        newDrafts[existingIndex] = updatedDraft;
      } else {
        newDrafts = [updatedDraft, ...drafts];
      }

      localStorage.setItem(STORAGE_KEY_DRAFTS, JSON.stringify(newDrafts));
      localStorage.setItem(STORAGE_KEY_ACTIVE_ID, draft.id);
    } catch (err) {
      console.error('Failed to save draft to localStorage', err);
    }
  },

  deleteDraft(id: string): void {
    try {
      const drafts = this.getDrafts().filter(d => d.id !== id);
      localStorage.setItem(STORAGE_KEY_DRAFTS, JSON.stringify(drafts));
      const activeId = localStorage.getItem(STORAGE_KEY_ACTIVE_ID);
      if (activeId === id) {
        localStorage.removeItem(STORAGE_KEY_ACTIVE_ID);
      }
    } catch (err) {
      console.error('Failed to delete draft', err);
    }
  },

  duplicateDraft(id: string): CVDraft | null {
    const original = this.getDraftById(id);
    if (!original) return null;

    const newId = 'draft_' + Date.now() + '_' + Math.random().toString(36).substring(2, 7);
    const newDraft: CVDraft = {
      ...original,
      id: newId,
      title: `${original.title} (Copy)`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    this.saveDraft(newDraft);
    return newDraft;
  },

  renameDraft(id: string, newTitle: string): void {
    const draft = this.getDraftById(id);
    if (draft) {
      this.saveDraft({
        ...draft,
        title: newTitle.trim() || draft.title
      });
    }
  },

  createNewDraft(title?: string, templateId: TemplateId = 'classic-professional'): CVDraft {
    const newId = 'draft_' + Date.now() + '_' + Math.random().toString(36).substring(2, 7);
    const draft: CVDraft = {
      id: newId,
      title: title || 'Untitled CV',
      templateId,
      cvData: createEmptyCVData(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    this.saveDraft(draft);
    return draft;
  },

  createSampleDraft(title = 'Sample Professional CV'): CVDraft {
    const newId = 'draft_' + Date.now() + '_' + Math.random().toString(36).substring(2, 7);
    const draft: CVDraft = {
      id: newId,
      title,
      templateId: 'modern-blue',
      cvData: getSampleCVData(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    this.saveDraft(draft);
    return draft;
  },

  getActiveDraftId(): string | null {
    try {
      return localStorage.getItem(STORAGE_KEY_ACTIVE_ID);
    } catch {
      return null;
    }
  },

  setActiveDraftId(id: string): void {
    try {
      localStorage.setItem(STORAGE_KEY_ACTIVE_ID, id);
    } catch {
      // Ignore
    }
  }
};
