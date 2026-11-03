/**
 * Local Storage Persistence for CV Maker Phase 2: Design Studio
 */

import { StudioDocument, StudioPage } from '../types/studio';

const STORAGE_KEY_STUDIO_DOCS = 'cv_maker_studio_documents';
const STORAGE_KEY_ACTIVE_STUDIO_ID = 'cv_maker_active_studio_id';

export const createEmptyStudioPage = (pageNumber = 1): StudioPage => ({
  id: 'page_' + Date.now() + '_' + Math.random().toString(36).substring(2, 6),
  pageNumber,
  backgroundColor: '#ffffff',
  elements: []
});

export const createBlankStudioDocument = (title = 'Untitled Design'): StudioDocument => {
  const newId = 'studio_' + Date.now() + '_' + Math.random().toString(36).substring(2, 7);
  return {
    id: newId,
    title,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    pages: [createEmptyStudioPage(1)],
    width: 794,
    height: 1123
  };
};

export const studioStorage = {
  getDocuments(): StudioDocument[] {
    try {
      const data = localStorage.getItem(STORAGE_KEY_STUDIO_DOCS);
      if (!data) return [];
      const parsed = JSON.parse(data);
      if (Array.isArray(parsed)) {
        return parsed;
      }
      return [];
    } catch (err) {
      console.error('Failed to load studio documents from localStorage', err);
      return [];
    }
  },

  getDocumentById(id: string): StudioDocument | null {
    const docs = this.getDocuments();
    return docs.find(d => d.id === id) || null;
  },

  saveDocument(doc: StudioDocument): void {
    try {
      const docs = this.getDocuments();
      const existingIdx = docs.findIndex(d => d.id === doc.id);
      const updated = {
        ...doc,
        updatedAt: new Date().toISOString()
      };

      let newDocs: StudioDocument[];
      if (existingIdx >= 0) {
        newDocs = [...docs];
        newDocs[existingIdx] = updated;
      } else {
        newDocs = [updated, ...docs];
      }

      localStorage.setItem(STORAGE_KEY_STUDIO_DOCS, JSON.stringify(newDocs));
      localStorage.setItem(STORAGE_KEY_ACTIVE_STUDIO_ID, doc.id);
    } catch (err) {
      console.error('Failed to save studio document', err);
    }
  },

  deleteDocument(id: string): void {
    try {
      const docs = this.getDocuments().filter(d => d.id !== id);
      localStorage.setItem(STORAGE_KEY_STUDIO_DOCS, JSON.stringify(docs));
      const activeId = localStorage.getItem(STORAGE_KEY_ACTIVE_STUDIO_ID);
      if (activeId === id) {
        localStorage.removeItem(STORAGE_KEY_ACTIVE_STUDIO_ID);
      }
    } catch (err) {
      console.error('Failed to delete studio document', err);
    }
  },

  getActiveDocumentId(): string | null {
    try {
      return localStorage.getItem(STORAGE_KEY_ACTIVE_STUDIO_ID);
    } catch {
      return null;
    }
  },

  getActiveDocument(): StudioDocument | null {
    const activeId = this.getActiveDocumentId();
    if (activeId) {
      const doc = this.getDocumentById(activeId);
      if (doc) return doc;
    }
    const all = this.getDocuments();
    return all.length > 0 ? all[0] : null;
  },

  setActiveDocumentId(id: string): void {
    try {
      localStorage.setItem(STORAGE_KEY_ACTIVE_STUDIO_ID, id);
    } catch {
      // Ignore
    }
  }
};
