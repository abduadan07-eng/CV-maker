/**
 * Firestore Database operations for CV Maker
 * Handles persistent Cloud Storage for CVs, Studio Designs, and User Profiles
 */

import {
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  deleteDoc,
  serverTimestamp
} from 'firebase/firestore';
import type { User } from 'firebase/auth';
import { db, handleFirestoreError, OperationType } from './config';
import { CVDraft } from '../types/cv';
import { StudioDocument } from '../types/studio';

export interface CloudSyncState {
  status: 'idle' | 'syncing' | 'saved' | 'error';
  lastSyncedAt?: string;
  errorMessage?: string;
}

/**
 * Creates or updates the user document in `/users/{userId}`
 */
export async function syncUserProfile(
  user: User | { uid: string; email?: string | null; displayName?: string | null; photoURL?: string | null },
  preferredLanguage: 'en' | 'so' = 'en'
): Promise<void> {
  const path = `users/${user.uid}`;
  try {
    const userRef = doc(db, 'users', user.uid);
    await setDoc(
      userRef,
      {
        uid: user.uid,
        email: user.email || '',
        displayName: user.displayName || '',
        photoURL: user.photoURL || '',
        preferredLanguage,
        updatedAt: new Date().toISOString()
      },
      { merge: true }
    );
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
}

/**
 * Saves a CV draft to Firestore in `/users/{userId}/cvs/{cvId}`
 */
export async function saveCVToCloud(userId: string, draft: CVDraft): Promise<void> {
  const path = `users/${userId}/cvs/${draft.id}`;
  try {
    const cvRef = doc(db, 'users', userId, 'cvs', draft.id);
    await setDoc(
      cvRef,
      {
        id: draft.id,
        userId,
        title: draft.title || 'Untitled CV',
        templateId: draft.templateId,
        language: draft.cvData.cvLanguage || 'en',
        data: draft.cvData,
        createdAt: draft.createdAt || new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      { merge: true }
    );
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
}

/**
 * Fetches all CV drafts for a user from Firestore
 */
export async function getUserCVsFromCloud(userId: string): Promise<CVDraft[]> {
  const path = `users/${userId}/cvs`;
  try {
    const colRef = collection(db, 'users', userId, 'cvs');
    const snapshot = await getDocs(colRef);
    const cvs: CVDraft[] = [];

    snapshot.forEach(docSnap => {
      const data = docSnap.data();
      cvs.push({
        id: data.id || docSnap.id,
        title: data.title || 'Untitled CV',
        templateId: data.templateId || 'classic-professional',
        cvData: data.data || {},
        createdAt: data.createdAt || new Date().toISOString(),
        updatedAt: data.updatedAt || new Date().toISOString()
      });
    });

    return cvs.sort(
      (a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
    );
  } catch (error) {
    handleFirestoreError(error, OperationType.LIST, path);
  }
}

/**
 * Deletes a CV draft from Firestore
 */
export async function deleteCVFromCloud(userId: string, cvId: string): Promise<void> {
  const path = `users/${userId}/cvs/${cvId}`;
  try {
    const cvRef = doc(db, 'users', userId, 'cvs', cvId);
    await deleteDoc(cvRef);
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, path);
  }
}

/**
 * Saves a Studio document to Firestore in `/users/{userId}/studioDocuments/{docId}`
 */
export async function saveStudioDocToCloud(userId: string, studioDoc: StudioDocument): Promise<void> {
  const path = `users/${userId}/studioDocuments/${studioDoc.id}`;
  try {
    const docRef = doc(db, 'users', userId, 'studioDocuments', studioDoc.id);
    await setDoc(
      docRef,
      {
        id: studioDoc.id,
        userId,
        title: studioDoc.title || 'Untitled Design',
        pages: studioDoc.pages,
        pageWidth: studioDoc.width,
        pageHeight: studioDoc.height,
        activePageId: studioDoc.pages[0]?.id || 'page_1',
        createdAt: studioDoc.createdAt || new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      { merge: true }
    );
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
}

/**
 * Fetches all Studio documents for a user from Firestore
 */
export async function getUserStudioDocsFromCloud(userId: string): Promise<StudioDocument[]> {
  const path = `users/${userId}/studioDocuments`;
  try {
    const colRef = collection(db, 'users', userId, 'studioDocuments');
    const snapshot = await getDocs(colRef);
    const docs: StudioDocument[] = [];

    snapshot.forEach(docSnap => {
      const data = docSnap.data();
      docs.push({
        id: data.id || docSnap.id,
        title: data.title || 'Untitled Design',
        pages: data.pages || [],
        width: data.pageWidth || 794,
        height: data.pageHeight || 1123,
        createdAt: data.createdAt || new Date().toISOString(),
        updatedAt: data.updatedAt || new Date().toISOString()
      });
    });

    return docs.sort(
      (a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
    );
  } catch (error) {
    handleFirestoreError(error, OperationType.LIST, path);
  }
}

/**
 * Deletes a Studio document from Firestore
 */
export async function deleteStudioDocFromCloud(userId: string, docId: string): Promise<void> {
  const path = `users/${userId}/studioDocuments/${docId}`;
  try {
    const docRef = doc(db, 'users', userId, 'studioDocuments', docId);
    await deleteDoc(docRef);
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, path);
  }
}
