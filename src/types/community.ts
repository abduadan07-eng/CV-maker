/**
 * Community Templates and Creator Application Types
 */

import { CVData, TemplateId } from './cv';
import { StudioDocument } from './studio';

export type TemplateVisibility = 'public' | 'private';
export type UsagePermission = 'reusable' | 'view_only';
export type CommunityTemplateStatus = 'draft' | 'pending' | 'approved' | 'rejected' | 'suspended';
export type CreatorApplicationStatus = 'not_applied' | 'pending' | 'approved' | 'rejected';
export type TemplateCategory = 'professional' | 'modern' | 'creative' | 'academic' | 'minimal';

export interface CommunityTemplate {
  id: string;
  creatorId: string;
  creatorDisplayName: string;
  creatorPhotoUrl?: string;
  name: string;
  description: string;
  category: TemplateCategory;
  tags: string[];
  type: 'cv' | 'studio';
  baseTemplateId?: TemplateId;
  designData: CVData | StudioDocument;
  previewPath?: string;
  visibility: TemplateVisibility;
  usagePermission: UsagePermission;
  status: CommunityTemplateStatus;
  createdAt: string;
  updatedAt: string;
  approvedAt?: string;
  approvedBy?: string;
  rejectionReason?: string;
  usageCount: number;
}

export interface CreatorApplication {
  id: string;
  userId: string;
  applicantName: string;
  email: string;
  description: string;
  portfolioUrl?: string;
  sampleExperience?: string;
  status: CreatorApplicationStatus;
  createdAt: string;
  updatedAt: string;
  reviewedAt?: string;
  reviewedBy?: string;
  rejectionReason?: string;
}

export interface TemplateReport {
  id: string;
  templateId: string;
  templateName: string;
  reportedBy: string;
  reason: string;
  createdAt: string;
  status: 'pending' | 'resolved' | 'dismissed';
}
