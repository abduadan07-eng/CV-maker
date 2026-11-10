import React, { useState, useEffect, useCallback } from 'react';
import { CVDraft, TemplateId, CVLanguage, CVData } from './types/cv';
import { cvStorage } from './storage/cvStorage';
import { LanguageProvider } from './i18n/LanguageContext';
import { Navbar, AppNavView } from './components/Navbar';
import { BottomNavigation, MainTab } from './components/BottomNavigation';
import { SplashScreen } from './components/SplashScreen';
import { HomePage } from './pages/HomePage';
import { BuilderPage } from './pages/BuilderPage';
import { LivePreview } from './preview/LivePreview';
import { DesignStudioPage } from './pages/DesignStudioPage';
import { LibraryPage } from './pages/LibraryPage';
import { CreatorPage } from './pages/CreatorPage';
import { ProfilePage } from './pages/ProfilePage';
import { AdminDashboard } from './components/AdminDashboard';
import { AuthModal } from './components/AuthModal';
import { StudioDocument } from './types/studio';
import { studioStorage } from './storage/studioStorage';
import { createBlankStudioDocument, convertCvDataToStudioDocument } from './studio/studioConverter';
import { useAuth } from './firebase/AuthContext';
import {
  getUserCVsFromCloud,
  saveCVToCloud,
  deleteCVFromCloud,
  getUserStudioDocsFromCloud
} from './firebase/cvFirestore';

export default function App() {
  const { user } = useAuth();
  const [showSplash, setShowSplash] = useState<boolean>(true);
  const [activeView, setActiveView] = useState<AppNavView>('home');
  const [showAdminDashboard, setShowAdminDashboard] = useState<boolean>(false);

  const [drafts, setDrafts] = useState<CVDraft[]>([]);
  const [activeDraft, setActiveDraft] = useState<CVDraft | null>(null);
  const [activeStudioDoc, setActiveStudioDoc] = useState<StudioDocument | null>(null);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState<boolean>(false);
  const [isCloudSyncing, setIsCloudSyncing] = useState<boolean>(false);

  // Initialize drafts from localStorage or seed initial sample
  useEffect(() => {
    refreshDraftsList();
  }, []);

  // When user signs in, load their cloud CVs and sync with local storage
  useEffect(() => {
    if (!user) return;

    const syncWithCloud = async () => {
      try {
        setIsCloudSyncing(true);
        // 1. Fetch Cloud CVs
        const cloudCVs = await getUserCVsFromCloud(user.uid);
        const localCVs = cvStorage.getDrafts();

        // 2. Merge local and cloud CVs safely without deleting local data
        const mergedMap = new Map<string, CVDraft>();

        // Add cloud CVs first
        cloudCVs.forEach(cv => mergedMap.set(cv.id, cv));

        // Add local CVs (and back them up to cloud if missing)
        for (const localCV of localCVs) {
          if (!mergedMap.has(localCV.id)) {
            mergedMap.set(localCV.id, localCV);
            await saveCVToCloud(user.uid, localCV).catch(() => {});
          }
        }

        const mergedList = Array.from(mergedMap.values()).sort(
          (a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
        );

        if (mergedList.length > 0) {
          mergedList.forEach(d => cvStorage.saveDraft(d));
          setDrafts(mergedList);
          if (!activeDraft) {
            setActiveDraft(mergedList[0]);
          }
        }

        // Also fetch cloud studio documents
        const cloudStudioDocs = await getUserStudioDocsFromCloud(user.uid);
        if (cloudStudioDocs.length > 0) {
          cloudStudioDocs.forEach(sd => studioStorage.saveDocument(sd));
        }
      } catch (err) {
        console.warn('Error during cloud sync:', err);
      } finally {
        setIsCloudSyncing(false);
      }
    };

    syncWithCloud();
  }, [user]);

  const refreshDraftsList = () => {
    let loaded = cvStorage.getDrafts();
    if (loaded.length === 0) {
      const initialSample = cvStorage.createSampleDraft('Sample Professional CV');
      loaded = [initialSample];
    }
    setDrafts(loaded);

    const activeId = cvStorage.getActiveDraftId();
    if (activeId) {
      const found = loaded.find(d => d.id === activeId);
      if (found) {
        setActiveDraft(found);
        return;
      }
    }
    if (loaded.length > 0) {
      setActiveDraft(loaded[0]);
    }
  };

  const handleCreateNew = () => {
    const newDraft = cvStorage.createNewDraft('My New CV');
    setActiveDraft(newDraft);
    setHasUnsavedChanges(false);
    refreshDraftsList();

    if (user) {
      saveCVToCloud(user.uid, newDraft).catch(() => {});
    }

    setActiveView('builder');
  };

  const handleLoadSample = () => {
    const sampleDraft = cvStorage.createSampleDraft('Professional Sample CV');
    setActiveDraft(sampleDraft);
    setHasUnsavedChanges(false);
    refreshDraftsList();

    if (user) {
      saveCVToCloud(user.uid, sampleDraft).catch(() => {});
    }

    setActiveView('preview');
  };

  const handleOpenDraft = (draft: CVDraft) => {
    setActiveDraft(draft);
    cvStorage.setActiveDraftId(draft.id);
    setHasUnsavedChanges(false);
    setActiveView('preview');
  };

  const handleEditDraft = (draft: CVDraft) => {
    setActiveDraft(draft);
    cvStorage.setActiveDraftId(draft.id);
    setHasUnsavedChanges(false);
    setActiveView('builder');
  };

  const handleUpdateDraft = (updated: CVDraft) => {
    setActiveDraft(updated);
    setHasUnsavedChanges(true);
    cvStorage.saveDraft(updated);
    setDrafts(cvStorage.getDrafts());

    if (user) {
      saveCVToCloud(user.uid, updated).catch(err => {
        console.warn('Auto cloud sync notice:', err);
      });
    }
  };

  const handleSaveDraft = () => {
    if (activeDraft) {
      cvStorage.saveDraft(activeDraft);
      setHasUnsavedChanges(false);
      setDrafts(cvStorage.getDrafts());

      if (user) {
        saveCVToCloud(user.uid, activeDraft).catch(err => {
          console.warn('Cloud save notice:', err);
        });
      }
    }
  };

  const handleDeleteDraft = (draftId: string) => {
    cvStorage.deleteDraft(draftId);
    if (user) {
      deleteCVFromCloud(user.uid, draftId).catch(() => {});
    }
    refreshDraftsList();
  };

  const handleSelectTemplate = (templateId: TemplateId) => {
    if (activeDraft) {
      const updated = {
        ...activeDraft,
        templateId
      };
      handleUpdateDraft(updated);
    }
  };

  const handleUpdateCVLanguage = (cvLang: CVLanguage) => {
    if (activeDraft) {
      const updated = {
        ...activeDraft,
        cvData: {
          ...activeDraft.cvData,
          cvLanguage: cvLang
        }
      };
      handleUpdateDraft(updated);
    }
  };

  // Studio handlers
  const handleOpenStudio = (doc?: StudioDocument) => {
    if (doc) {
      setActiveStudioDoc(doc);
    } else {
      const existing = activeStudioDoc || studioStorage.getActiveDocument() || studioStorage.getDocuments()[0];
      if (existing) {
        setActiveStudioDoc(existing);
      } else {
        const fresh = createBlankStudioDocument();
        studioStorage.saveDocument(fresh);
        setActiveStudioDoc(fresh);
      }
    }
    setActiveView('studio');
  };

  const handleImportDraftToStudio = (draft: CVDraft) => {
    const doc = convertCvDataToStudioDocument(draft.cvData, `${draft.title} (Design)`);
    studioStorage.saveDocument(doc);
    setActiveStudioDoc(doc);
    setActiveView('studio');
  };

  // Determine current active bottom tab
  const currentBottomTab: MainTab =
    activeView === 'library'
      ? 'library'
      : activeView === 'templates'
      ? 'templates'
      : activeView === 'me'
      ? 'me'
      : 'home';

  return (
    <LanguageProvider>
      <div className="min-h-screen flex flex-col font-inter bg-slate-50 text-slate-900 selection:bg-blue-600 selection:text-white relative">
        {/* Splash Screen */}
        {showSplash && (
          <SplashScreen onDismiss={() => setShowSplash(false)} />
        )}

        {/* Navigation Header */}
        <Navbar
          activeView={activeView}
          onNavigate={(view) => {
            if (view === 'studio') {
              handleOpenStudio();
              return;
            }
            if ((view === 'preview' || view === 'builder') && !activeDraft) {
              const fallback = drafts[0] || cvStorage.createSampleDraft();
              setActiveDraft(fallback);
            }
            setActiveView(view);
          }}
          draftTitle={activeView === 'studio' ? activeStudioDoc?.title : activeDraft?.title}
          hasUnsavedChanges={hasUnsavedChanges}
        />

        {/* View Routing */}
        <div className="flex-1 pb-16">
          {activeView === 'home' && (
            <HomePage
              drafts={drafts}
              onOpenDraft={handleOpenDraft}
              onEditDraft={handleEditDraft}
              onCreateNew={handleCreateNew}
              onLoadSample={handleLoadSample}
              onOpenPreview={() => {
                const target = activeDraft || drafts[0] || cvStorage.createSampleDraft();
                setActiveDraft(target);
                setActiveView('preview');
              }}
              onOpenStudio={() => handleOpenStudio()}
              onImportDraftToStudio={handleImportDraftToStudio}
              onRefreshDrafts={refreshDraftsList}
              onDeleteDraft={handleDeleteDraft}
              isCloudSyncing={isCloudSyncing}
            />
          )}

          {activeView === 'library' && (
            <LibraryPage
              onUseTemplateAsCV={(draft) => {
                setActiveDraft(draft);
                refreshDraftsList();
                setActiveView('builder');
              }}
              onUseTemplateInStudio={(studioDoc) => {
                setActiveStudioDoc(studioDoc);
                setActiveView('studio');
              }}
            />
          )}

          {activeView === 'templates' && (
            <CreatorPage
              onOpenStudio={() => handleOpenStudio()}
              onOpenBuilder={handleCreateNew}
            />
          )}

          {activeView === 'me' && (
            <ProfilePage
              onOpenAdminDashboard={() => setShowAdminDashboard(true)}
              onNavigateToTemplates={() => setActiveView('templates')}
              onOpenDraft={handleOpenDraft}
            />
          )}

          {activeView === 'builder' && activeDraft && (
            <BuilderPage
              draft={activeDraft}
              onUpdateDraft={handleUpdateDraft}
              onSaveDraft={handleSaveDraft}
              onGoToPreview={() => setActiveView('preview')}
              onBackToHome={() => {
                refreshDraftsList();
                setActiveView('home');
              }}
            />
          )}

          {activeView === 'preview' && activeDraft && (
            <LivePreview
              cvData={activeDraft.cvData}
              templateId={activeDraft.templateId}
              onSelectTemplate={handleSelectTemplate}
              onEdit={() => setActiveView('builder')}
              onUpdateCVLanguage={handleUpdateCVLanguage}
              onOpenInStudio={() => handleImportDraftToStudio(activeDraft)}
              onUpdateCVData={(updatedCVData: CVData) => {
                const updatedDraft: CVDraft = {
                  ...activeDraft,
                  cvData: updatedCVData,
                  updatedAt: new Date().toISOString()
                };
                handleUpdateDraft(updatedDraft);
              }}
            />
          )}

          {activeView === 'studio' && (
            <DesignStudioPage
              key={activeStudioDoc?.id || 'design-studio'}
              initialDocument={activeStudioDoc || studioStorage.getActiveDocument() || createBlankStudioDocument()}
              onBackToHome={() => {
                refreshDraftsList();
                setActiveView('home');
              }}
            />
          )}
        </div>

        {/* 4-Tab Bottom Navigation (Home, Library, Templates, Me) */}
        <BottomNavigation
          currentTab={currentBottomTab}
          onSelectTab={(tab: MainTab) => {
            setActiveView(tab);
          }}
        />

        {/* Authorized Admin Dashboard Modal */}
        {showAdminDashboard && (
          <AdminDashboard onClose={() => setShowAdminDashboard(false)} />
        )}

        {/* Global Authentication Modal (Google, Email/Password, Guest mode) */}
        <AuthModal />
      </div>
    </LanguageProvider>
  );
}
