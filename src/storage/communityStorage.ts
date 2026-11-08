/**
 * Local and Offline Storage for Community Templates & Creator Applications
 * Ensures continuous functionality even if offline or before sign-in.
 */

import { CommunityTemplate, CreatorApplication } from '../types/community';
import { getSampleCVData } from './cvStorage';

const STORAGE_KEY_COMMUNITY_TEMPLATES = 'cv_maker_community_templates';
const STORAGE_KEY_CREATOR_APPLICATIONS = 'cv_maker_creator_applications';

export const INITIAL_COMMUNITY_TEMPLATES: CommunityTemplate[] = [
  {
    id: 'comm-tpl-1',
    creatorId: 'creator-yahye-01',
    creatorDisplayName: 'Yahye Tech Studio',
    creatorPhotoUrl: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80',
    name: 'Somali Tech Executive ATS',
    description: 'Clean ATS-compliant two-column layout tailored for East African & remote international engineering leads.',
    category: 'professional',
    tags: ['Tech', 'Engineering', 'ATS Friendly', 'Bilingual'],
    type: 'cv',
    baseTemplateId: 'modern-blue',
    designData: getSampleCVData(),
    visibility: 'public',
    usagePermission: 'reusable',
    status: 'approved',
    createdAt: '2026-01-15T10:00:00.000Z',
    updatedAt: '2026-02-01T12:00:00.000Z',
    approvedAt: '2026-02-01T14:30:00.000Z',
    approvedBy: 'admin',
    usageCount: 142
  },
  {
    id: 'comm-tpl-2',
    creatorId: 'creator-amina-02',
    creatorDisplayName: 'Amina Design Co.',
    creatorPhotoUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80',
    name: 'Nordic Minimalist Clean',
    description: 'Ultra-refined typography with generous whitespace and high-legibility layout for consultants and corporate analysts.',
    category: 'minimal',
    tags: ['Minimal', 'Consulting', 'Executive'],
    type: 'cv',
    baseTemplateId: 'minimalist',
    designData: getSampleCVData(),
    visibility: 'public',
    usagePermission: 'reusable',
    status: 'approved',
    createdAt: '2026-02-10T08:30:00.000Z',
    updatedAt: '2026-02-12T11:00:00.000Z',
    approvedAt: '2026-02-12T15:00:00.000Z',
    approvedBy: 'admin',
    usageCount: 98
  },
  {
    id: 'comm-tpl-3',
    creatorId: 'creator-khalid-03',
    creatorDisplayName: 'Khalid Farah UI/UX',
    creatorPhotoUrl: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?auto=format&fit=crop&w=150&q=80',
    name: 'Creative Portfolio Resume',
    description: 'Showcase design, branding, and product accomplishments with distinctive section highlights.',
    category: 'creative',
    tags: ['Design', 'Portfolio', 'Creative'],
    type: 'cv',
    baseTemplateId: 'creative-designer',
    designData: getSampleCVData(),
    visibility: 'public',
    usagePermission: 'reusable',
    status: 'approved',
    createdAt: '2026-02-20T14:20:00.000Z',
    updatedAt: '2026-02-22T09:15:00.000Z',
    approvedAt: '2026-02-22T10:00:00.000Z',
    approvedBy: 'admin',
    usageCount: 76
  },
  {
    id: 'comm-tpl-4',
    creatorId: 'creator-deqa-04',
    creatorDisplayName: 'Deqa Academia',
    creatorPhotoUrl: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=150&q=80',
    name: 'Academic Fellowship & Research',
    description: 'Comprehensive research and university teaching CV format with full publications & research grants support. (View-Only sample reference).',
    category: 'academic',
    tags: ['Research', 'PhD', 'Fellowship', 'Scholarship'],
    type: 'cv',
    baseTemplateId: 'academic',
    designData: getSampleCVData(),
    visibility: 'public',
    usagePermission: 'view_only',
    status: 'approved',
    createdAt: '2026-02-25T11:00:00.000Z',
    updatedAt: '2026-02-26T16:00:00.000Z',
    approvedAt: '2026-02-26T18:00:00.000Z',
    approvedBy: 'admin',
    usageCount: 45
  }
];

export const communityStorage = {
  getTemplates(): CommunityTemplate[] {
    try {
      const raw = localStorage.getItem(STORAGE_KEY_COMMUNITY_TEMPLATES);
      if (!raw) {
        localStorage.setItem(STORAGE_KEY_COMMUNITY_TEMPLATES, JSON.stringify(INITIAL_COMMUNITY_TEMPLATES));
        return INITIAL_COMMUNITY_TEMPLATES;
      }
      return JSON.parse(raw);
    } catch {
      return INITIAL_COMMUNITY_TEMPLATES;
    }
  },

  saveTemplate(tpl: CommunityTemplate): void {
    const list = this.getTemplates();
    const idx = list.findIndex(t => t.id === tpl.id);
    if (idx >= 0) {
      list[idx] = tpl;
    } else {
      list.unshift(tpl);
    }
    localStorage.setItem(STORAGE_KEY_COMMUNITY_TEMPLATES, JSON.stringify(list));
  },

  deleteTemplate(id: string): void {
    const list = this.getTemplates().filter(t => t.id !== id);
    localStorage.setItem(STORAGE_KEY_COMMUNITY_TEMPLATES, JSON.stringify(list));
  },

  incrementUsageCount(id: string): void {
    const list = this.getTemplates();
    const target = list.find(t => t.id === id);
    if (target) {
      target.usageCount = (target.usageCount || 0) + 1;
      localStorage.setItem(STORAGE_KEY_COMMUNITY_TEMPLATES, JSON.stringify(list));
    }
  },

  // Creator Applications
  getApplications(): CreatorApplication[] {
    try {
      const raw = localStorage.getItem(STORAGE_KEY_CREATOR_APPLICATIONS);
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  },

  getApplicationByUserId(userId: string): CreatorApplication | null {
    const apps = this.getApplications();
    return apps.find(a => a.userId === userId) || null;
  },

  saveApplication(app: CreatorApplication): void {
    const list = this.getApplications();
    const idx = list.findIndex(a => a.id === app.id || a.userId === app.userId);
    if (idx >= 0) {
      list[idx] = app;
    } else {
      list.unshift(app);
    }
    localStorage.setItem(STORAGE_KEY_CREATOR_APPLICATIONS, JSON.stringify(list));
  }
};
