import React, { useState } from 'react';
import { CVDraft } from '../types/cv';
import { cvStorage } from '../storage/cvStorage';
import { useLanguage } from '../i18n/LanguageContext';
import { useAuth } from '../firebase/AuthContext';
import { saveCVToCloud } from '../firebase/cvFirestore';
import { getTemplateMeta } from '../templates/TemplateRegistry';
import { ConfirmModal } from '../components/ConfirmModal';
import { RenameDraftModal } from '../components/RenameDraftModal';
import {
  Plus,
  FileText,
  Sparkles,
  Clock,
  MoreVertical,
  Trash2,
  Copy,
  Edit2,
  ExternalLink,
  ShieldCheck,
  CheckCircle,
  Smartphone,
  Languages,
  Printer,
  Database,
  Cloud,
  LogIn,
  RefreshCw,
  Check
} from 'lucide-react';

interface HomePageProps {
  drafts: CVDraft[];
  onOpenDraft: (draft: CVDraft) => void;
  onEditDraft: (draft: CVDraft) => void;
  onCreateNew: () => void;
  onLoadSample: () => void;
  onOpenPreview: () => void;
  onOpenStudio: () => void;
  onImportDraftToStudio: (draft: CVDraft) => void;
  onRefreshDrafts: () => void;
  onDeleteDraft?: (id: string) => void;
  isCloudSyncing?: boolean;
}

export const HomePage: React.FC<HomePageProps> = ({
  drafts,
  onOpenDraft,
  onEditDraft,
  onCreateNew,
  onLoadSample,
  onOpenPreview,
  onOpenStudio,
  onImportDraftToStudio,
  onRefreshDrafts,
  onDeleteDraft,
  isCloudSyncing = false
}) => {
  const { t, language } = useLanguage();
  const { user, signInWithGoogle, isCloudConnected } = useAuth();
  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null);
  const [renameTarget, setRenameTarget] = useState<{ id: string; title: string } | null>(null);
  const [menuOpenId, setMenuOpenId] = useState<string | null>(null);
  const [manualSyncing, setManualSyncing] = useState<boolean>(false);
  const [syncToast, setSyncToast] = useState<string | null>(null);

  const handleDeleteConfirm = () => {
    if (deleteTargetId) {
      if (onDeleteDraft) {
        onDeleteDraft(deleteTargetId);
      } else {
        cvStorage.deleteDraft(deleteTargetId);
        onRefreshDrafts();
      }
      setDeleteTargetId(null);
    }
  };

  const handleDuplicate = (id: string) => {
    const dup = cvStorage.duplicateDraft(id);
    if (dup && user) {
      saveCVToCloud(user.uid, dup).catch(() => {});
    }
    setMenuOpenId(null);
    onRefreshDrafts();
  };

  const handleRenameConfirm = (newTitle: string) => {
    if (renameTarget) {
      cvStorage.renameDraft(renameTarget.id, newTitle);
      const updated = cvStorage.getDraftById(renameTarget.id);
      if (updated && user) {
        saveCVToCloud(user.uid, updated).catch(() => {});
      }
      setRenameTarget(null);
      onRefreshDrafts();
    }
  };

  const handleManualSyncAll = async () => {
    if (!user) {
      try {
        await signInWithGoogle();
      } catch (err) {
        console.error(err);
      }
      return;
    }

    try {
      setManualSyncing(true);
      for (const d of drafts) {
        await saveCVToCloud(user.uid, d);
      }
      setSyncToast(language === 'so' ? 'Dhammaan CV-yadaada waxaa lagu kaydiyey Database-ka!' : 'All CV drafts backed up to Cloud Database!');
      setTimeout(() => setSyncToast(null), 3500);
    } catch (err) {
      console.error(err);
    } finally {
      setManualSyncing(false);
    }
  };

  const formatDate = (isoStr: string) => {
    try {
      const d = new Date(isoStr);
      return d.toLocaleDateString(language === 'so' ? 'so-SO' : 'en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
      });
    } catch {
      return isoStr;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 pb-24">
      {/* Toast Alert */}
      {syncToast && (
        <div className="fixed top-20 right-4 z-50 bg-emerald-600 text-white text-xs font-semibold px-4 py-2.5 rounded-xl shadow-lg flex items-center gap-2 animate-bounce">
          <Check className="w-4 h-4" />
          <span>{syncToast}</span>
        </div>
      )}

      {/* Hero Section */}
      <section className="bg-gradient-to-b from-blue-900 via-blue-800 to-indigo-900 text-white pt-12 pb-16 px-4">
        <div className="max-w-4xl mx-auto text-center space-y-5">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-500/20 border border-blue-400/30 text-xs font-semibold text-blue-200 backdrop-blur-xs">
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            <span>Automatic Builder + Canva-Style Studio + Cloud Database</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-white max-w-2xl mx-auto leading-tight">
            {t('heroTitle')}
          </h1>

          <p className="text-sm sm:text-base text-blue-100 max-w-2xl mx-auto font-normal leading-relaxed">
            {t('heroSubtitle')}
          </p>

          {/* Hero CTAs: Dual Pathway */}
          <div className="pt-3 flex flex-wrap items-center justify-center gap-3">
            {/* 1. Create Automatically */}
            <button
              type="button"
              onClick={onCreateNew}
              className="inline-flex items-center gap-2 px-5 py-3.5 bg-white hover:bg-blue-50 text-blue-900 font-bold rounded-2xl text-sm transition-all shadow-lg hover:scale-[1.02] cursor-pointer"
            >
              <Plus className="w-5 h-5 text-blue-600" />
              <span>{t('createCvAuto')}</span>
            </button>

            {/* 2. Design Manually (Canva Studio) */}
            <button
              type="button"
              onClick={onOpenStudio}
              className="inline-flex items-center gap-2 px-5 py-3.5 bg-indigo-500 hover:bg-indigo-600 text-white font-bold rounded-2xl text-sm transition-all shadow-lg hover:scale-[1.02] cursor-pointer border border-indigo-400/40"
            >
              <span className="text-base">🎨</span>
              <span>{t('designCvManually')}</span>
            </button>

            {/* 3. Live Preview */}
            <button
              type="button"
              onClick={onOpenPreview}
              className="inline-flex items-center gap-2 px-4 py-3.5 bg-blue-700/70 hover:bg-blue-700 text-white font-semibold rounded-2xl text-sm transition-colors border border-blue-400/30 cursor-pointer"
            >
              <FileText className="w-4 h-4 text-amber-300" />
              <span>{t('previewBtn')}</span>
            </button>
          </div>

          {/* Value Props Row */}
          <div className="pt-6 flex flex-wrap justify-center items-center gap-x-6 gap-y-2 text-xs text-blue-200">
            <span className="flex items-center gap-1.5">
              <CheckCircle className="w-4 h-4 text-emerald-400" /> 12 ATS-Optimized Templates
            </span>
            <span className="flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-amber-300" /> Canva-Style Freeform Studio
            </span>
            <span className="flex items-center gap-1.5">
              <Languages className="w-4 h-4 text-cyan-300" /> English & Af Soomaali
            </span>
            <span className="flex items-center gap-1.5">
              <Printer className="w-4 h-4 text-amber-300" /> Free PDF Export & Print
            </span>
            <span className="flex items-center gap-1.5 text-emerald-300 font-medium">
              <Database className="w-4 h-4 text-emerald-400" /> Cloud Firestore Database Active
            </span>
          </div>
        </div>
      </section>

      {/* Main Container */}
      <main className="max-w-4xl mx-auto px-4 -mt-6">
        {/* Cloud Database Connected Banner */}
        <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200 shadow-sm mb-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-start gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0 border border-emerald-100">
              <Database className="w-5 h-5" />
            </div>
            <div className="text-xs">
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-slate-900 text-sm">{t('cloudDatabase')}</h3>
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-100 text-emerald-800">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                  {t('cloudConnected')}
                </span>
              </div>
              <p className="text-slate-600 mt-0.5 leading-relaxed">
                {user
                  ? t('cloudBackupNotice')
                  : t('signInToBackup')}
              </p>
            </div>
          </div>

          <div className="w-full sm:w-auto shrink-0 flex items-center gap-2">
            {user ? (
              <button
                type="button"
                onClick={handleManualSyncAll}
                disabled={manualSyncing || isCloudSyncing}
                className="w-full sm:w-auto flex items-center justify-center gap-1.5 px-3.5 py-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 rounded-xl text-xs font-semibold cursor-pointer transition disabled:opacity-50"
              >
                <RefreshCw className={`w-3.5 h-3.5 text-emerald-600 ${manualSyncing || isCloudSyncing ? 'animate-spin' : ''}`} />
                <span>{manualSyncing || isCloudSyncing ? t('cloudSyncing') : t('syncToCloud')}</span>
              </button>
            ) : (
              <button
                type="button"
                onClick={() => signInWithGoogle().catch(console.error)}
                className="w-full sm:w-auto flex items-center justify-center gap-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-semibold cursor-pointer transition shadow-xs"
              >
                <LogIn className="w-3.5 h-3.5" />
                <span>{t('signInWithGoogle')}</span>
              </button>
            )}
          </div>
        </div>

        {/* My Saved CVs Section */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg sm:text-xl font-bold text-slate-900">{t('myCvsTitle')}</h2>
              <p className="text-xs text-slate-500">{t('myCvsSubtitle')}</p>
            </div>
            {drafts.length > 0 && (
              <button
                type="button"
                onClick={onCreateNew}
                className="inline-flex items-center gap-1.5 px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-semibold cursor-pointer transition-colors shadow-2xs"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>{t('createCvBtn')}</span>
              </button>
            )}
          </div>

          {/* Drafts List or Empty State */}
          {drafts.length === 0 ? (
            <div className="text-center py-12 px-6 bg-white rounded-3xl border border-slate-200 shadow-2xs">
              <div className="w-14 h-14 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mx-auto mb-3">
                <FileText className="w-7 h-7" />
              </div>
              <h3 className="text-base font-bold text-slate-800">{t('noCvsTitle')}</h3>
              <p className="text-xs text-slate-500 max-w-md mx-auto mt-1 leading-relaxed">
                {t('noCvsDesc')}
              </p>
              <div className="mt-5 flex justify-center gap-3">
                <button
                  type="button"
                  onClick={onCreateNew}
                  className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-semibold cursor-pointer transition-colors shadow-xs"
                >
                  {t('createFirstCv')}
                </button>
                <button
                  type="button"
                  onClick={onLoadSample}
                  className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold cursor-pointer transition-colors"
                >
                  {t('loadSampleBtn')}
                </button>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {drafts.map((draft) => {
                const meta = getTemplateMeta(draft.templateId);
                const templateName = language === 'so' ? meta.nameSo : meta.nameEn;
                const isMenuOpen = menuOpenId === draft.id;

                return (
                  <div
                    key={draft.id}
                    className="bg-white rounded-2xl border border-slate-200 hover:border-blue-300 p-4 sm:p-5 shadow-xs hover:shadow-sm transition-all flex flex-col justify-between relative group"
                  >
                    <div>
                      {/* Top Row: Template Badge & Action Menu */}
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-[11px] font-semibold text-slate-500 bg-slate-100 px-2.5 py-0.5 rounded-md flex items-center gap-1.5">
                          <span className={`w-2 h-2 rounded-full ${meta.accentClass}`} />
                          {templateName}
                        </span>

                        <div className="flex items-center gap-1">
                          {user && (
                            <span className="text-emerald-600" title={t('cloudSaved')}>
                              <Cloud className="w-3.5 h-3.5" />
                            </span>
                          )}

                          {/* Dropdown Menu Trigger */}
                          <div className="relative">
                            <button
                              type="button"
                              onClick={() => setMenuOpenId(isMenuOpen ? null : draft.id)}
                              className="p-1 text-slate-400 hover:text-slate-700 rounded-lg cursor-pointer"
                            >
                              <MoreVertical className="w-4 h-4" />
                            </button>

                            {isMenuOpen && (
                              <div className="absolute right-0 top-7 w-40 bg-white rounded-xl shadow-lg border border-slate-200 py-1 z-20 text-xs">
                                <button
                                  type="button"
                                  onClick={() => {
                                    setMenuOpenId(null);
                                    setRenameTarget({ id: draft.id, title: draft.title });
                                  }}
                                  className="w-full text-left px-3 py-1.5 hover:bg-slate-50 text-slate-700 flex items-center gap-2 cursor-pointer"
                                >
                                  <Edit2 className="w-3.5 h-3.5" />
                                  {t('renameBtn')}
                                </button>
                                <button
                                  type="button"
                                  onClick={() => handleDuplicate(draft.id)}
                                  className="w-full text-left px-3 py-1.5 hover:bg-slate-50 text-slate-700 flex items-center gap-2 cursor-pointer"
                                >
                                  <Copy className="w-3.5 h-3.5" />
                                  {t('duplicateBtn')}
                                </button>
                                {user && (
                                  <button
                                    type="button"
                                    onClick={async () => {
                                      setMenuOpenId(null);
                                      try {
                                        await saveCVToCloud(user.uid, draft);
                                        setSyncToast(language === 'so' ? 'CV-ga waxaa lagu kaydiyey Database-ka!' : 'CV saved to database!');
                                        setTimeout(() => setSyncToast(null), 3000);
                                      } catch (e) {
                                        console.error(e);
                                      }
                                    }}
                                    className="w-full text-left px-3 py-1.5 hover:bg-emerald-50 text-emerald-700 flex items-center gap-2 cursor-pointer"
                                  >
                                    <Cloud className="w-3.5 h-3.5 text-emerald-600" />
                                    {t('saveToDatabase')}
                                  </button>
                                )}
                                <button
                                  type="button"
                                  onClick={() => {
                                    setMenuOpenId(null);
                                    onImportDraftToStudio(draft);
                                  }}
                                  className="w-full text-left px-3 py-1.5 hover:bg-indigo-50 text-indigo-700 font-medium flex items-center gap-2 cursor-pointer"
                                >
                                  <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
                                  {t('openInStudio')}
                                </button>
                                <button
                                  type="button"
                                  onClick={() => {
                                    setMenuOpenId(null);
                                    setDeleteTargetId(draft.id);
                                  }}
                                  className="w-full text-left px-3 py-1.5 hover:bg-red-50 text-red-600 flex items-center gap-2 cursor-pointer"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                  {t('deleteBtn')}
                                </button>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Title & Candidate Name */}
                      <h3 className="font-bold text-slate-900 text-base line-clamp-1">
                        {draft.title}
                      </h3>
                      <p className="text-xs text-slate-500 mt-0.5">
                        {draft.cvData.personal.fullName || 'No name entered'}
                        {draft.cvData.personal.jobTitle && ` • ${draft.cvData.personal.jobTitle}`}
                      </p>

                      {/* Timestamps */}
                      <div className="flex items-center gap-1 text-[11px] text-slate-400 mt-3">
                        <Clock className="w-3 h-3" />
                        <span>{t('lastEdited')}: {formatDate(draft.updatedAt)}</span>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="mt-4 pt-3 border-t border-slate-100 flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => onEditDraft(draft)}
                        className="flex-1 py-2 px-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-semibold cursor-pointer transition-colors shadow-2xs text-center"
                      >
                        {t('editBtn')}
                      </button>
                      <button
                        type="button"
                        onClick={() => onImportDraftToStudio(draft)}
                        className="py-2 px-2.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 rounded-xl text-xs font-semibold cursor-pointer transition-colors flex items-center gap-1"
                        title={t('designCvManually')}
                      >
                        <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
                        <span>Studio</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => onOpenDraft(draft)}
                        className="py-2 px-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold cursor-pointer transition-colors flex items-center gap-1"
                        title={t('previewBtn')}
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                        <span>{t('previewBtn')}</span>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </main>

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={Boolean(deleteTargetId)}
        title={t('deleteModalTitle')}
        message={t('deleteModalText')}
        confirmLabel={t('deleteBtn')}
        isDestructive={true}
        onConfirm={handleDeleteConfirm}
        onCancel={() => setDeleteTargetId(null)}
      />

      {/* Rename Modal */}
      <RenameDraftModal
        isOpen={Boolean(renameTarget)}
        currentTitle={renameTarget?.title || ''}
        onRename={handleRenameConfirm}
        onCancel={() => setRenameTarget(null)}
      />
    </div>
  );
};
