/**
 * Firestore Database integration for Community Templates & Creator Applications
 */

import {
  collection,
  doc,
  getDocs,
  getDoc,
  setDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  increment
} from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from './config';
import { CommunityTemplate, CreatorApplication } from '../types/community';

export async function getApprovedCommunityTemplatesFromCloud(): Promise<CommunityTemplate[]> {
  const path = 'communityTemplates';
  try {
    const colRef = collection(db, path);
    // Query approved & public templates
    const q = query(
      colRef,
      where('status', '==', 'approved'),
      where('visibility', '==', 'public')
    );
    const snapshot = await getDocs(q);
    const templates: CommunityTemplate[] = [];

    snapshot.forEach(docSnap => {
      templates.push(docSnap.data() as CommunityTemplate);
    });

    return templates;
  } catch (error) {
    // If permission or offline, we catch and return empty or propagate according to skill
    try {
      handleFirestoreError(error, OperationType.LIST, path);
    } catch {
      return [];
    }
    return [];
  }
}

export async function getAllCommunityTemplatesForAdmin(): Promise<CommunityTemplate[]> {
  const path = 'communityTemplates';
  try {
    const colRef = collection(db, path);
    const snapshot = await getDocs(colRef);
    const templates: CommunityTemplate[] = [];
    snapshot.forEach(docSnap => {
      templates.push(docSnap.data() as CommunityTemplate);
    });
    return templates;
  } catch (error) {
    try {
      handleFirestoreError(error, OperationType.LIST, path);
    } catch {
      return [];
    }
    return [];
  }
}

export async function saveCommunityTemplateToCloud(template: CommunityTemplate): Promise<void> {
  const path = `communityTemplates/${template.id}`;
  try {
    const docRef = doc(db, 'communityTemplates', template.id);
    await setDoc(docRef, template, { merge: true });
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
}

export async function incrementCloudTemplateUsage(templateId: string): Promise<void> {
  const path = `communityTemplates/${templateId}`;
  try {
    const docRef = doc(db, 'communityTemplates', templateId);
    await updateDoc(docRef, {
      usageCount: increment(1),
      updatedAt: new Date().toISOString()
    });
  } catch (error) {
    console.warn('Notice: usage count increment skipped or handled locally:', error);
  }
}

export async function submitCreatorApplicationToCloud(app: CreatorApplication): Promise<void> {
  const path = `creatorApplications/${app.id}`;
  try {
    const docRef = doc(db, 'creatorApplications', app.id);
    await setDoc(docRef, app, { merge: true });
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
}

export async function getCreatorApplicationFromCloud(userId: string): Promise<CreatorApplication | null> {
  const path = 'creatorApplications';
  try {
    const colRef = collection(db, path);
    const q = query(colRef, where('userId', '==', userId));
    const snapshot = await getDocs(q);
    if (!snapshot.empty) {
      return snapshot.docs[0].data() as CreatorApplication;
    }
    return null;
  } catch (error) {
    return null;
  }
}

export async function getAllCreatorApplicationsForAdmin(): Promise<CreatorApplication[]> {
  const path = 'creatorApplications';
  try {
    const colRef = collection(db, path);
    const snapshot = await getDocs(colRef);
    const apps: CreatorApplication[] = [];
    snapshot.forEach(docSnap => {
      apps.push(docSnap.data() as CreatorApplication);
    });
    return apps;
  } catch (error) {
    try {
      handleFirestoreError(error, OperationType.LIST, path);
    } catch {
      return [];
    }
    return [];
  }
}

export async function updateCreatorApplicationStatus(
  appId: string,
  status: 'approved' | 'rejected',
  rejectionReason?: string,
  reviewedBy?: string
): Promise<void> {
  const path = `creatorApplications/${appId}`;
  try {
    const docRef = doc(db, 'creatorApplications', appId);
    await updateDoc(docRef, {
      status,
      rejectionReason: rejectionReason || '',
      reviewedBy: reviewedBy || 'admin',
      reviewedAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    });
  } catch (error) {
    handleFirestoreError(error, OperationType.UPDATE, path);
  }
}
