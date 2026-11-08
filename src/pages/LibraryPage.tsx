import React, { useState, useEffect, useMemo } from 'react';
import { Search, Eye, Copy, Lock, Sparkles, Filter, Check, User, ArrowRight, X } from 'lucide-react';
import { useLanguage } from '../i18n/LanguageContext';
import { useAuth } from '../firebase/AuthContext';
import { CommunityTemplate, TemplateCategory } from '../types/community';
import { communityStorage } from '../storage/communityStorage';
import { getApprovedCommunityTemplatesFromCloud, incrementCloudTemplateUsage } from '../firebase/communityFirestore';
import { CVDraft } from '../types/cv';
import { cvStorage } from '../storage/cvStorage';
import { saveCVToCloud } from '../firebase/cvFirestore';
import { StudioDocument } from '../types/studio';
import { studioStorage } from '../storage/studioStorage';
import { saveStudioDocToCloud } from '../firebase/cvFirestore';
import { getTemplateComponent } from '../templates/TemplateRegistry';

interface LibraryPageProps {
  onUseTemplateAsCV: (draft: CVDraft) => void;
  onUseTemplateInStudio: (doc: StudioDocument) => void;
}

export const LibraryPage: React.FC<LibraryPageProps> = ({
  onUseTemplateAsCV,
  onUseTemplateInStudio
}) => {
  const { t, language } = useLanguage();
  const { user } = useAuth();

  const [templates, setTemplates] = useState<CommunityTemplate[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [previewTemplate, setPreviewTemplate] = useState<CommunityTemplate | null>(null);
  const [successToast, setSuccessToast] = useState<string | null>(null);

  // Load templates from local storage & sync with cloud
  useEffect(() => {
    // 1. Initial load from local store
    const local = communityStorage.getTemplates().filter(
      t => t.status === 'approved' && t.visibility === 'public'
    );
    setTemplates(local);

    // 2. Fetch fresh approved templates from Firestore
    getApprovedCommunityTemplatesFromCloud().then(cloudList => {
      if (cloudList && cloudList.length > 0) {
        // Merge with local list avoiding duplicates
        const map = new Map<string, CommunityTemplate>();
        local.forEach(tpl => map.set(tpl.id, tpl));
        cloudList.forEach(tpl => map.set(tpl.id, tpl));
        const merged = Array.from(map.values());
        setTemplates(merged);
        merged.forEach(tpl => communityStorage.saveTemplate(tpl));
      }
    }).catch(() => {});
  }, []);

  const categories: { id: string; labelEn: string; labelSo: string }[] = [
    { id: 'all', labelEn: 'All Templates', labelSo: 'Dhammaan' },
    { id: 'professional', labelEn: 'Professional', labelSo: 'Xirfadeed' },
    { id: 'modern', labelEn: 'Modern', labelSo: 'Casri ah' },
    { id: 'creative', labelEn: 'Creative', labelSo: 'Hal-abuur' },
    { id: 'academic', labelEn: 'Academic', labelSo: 'Akaadeemik' },
    { id: 'minimal', labelEn: 'Minimalist', labelSo: 'Kooban' }
  ];

  const filteredTemplates = useMemo(() => {
    return templates.filter(tpl => {
      const matchesCategory = selectedCategory === 'all' || tpl.category === selectedCategory;
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        tpl.name.toLowerCase().includes(q) ||
        tpl.description.toLowerCase().includes(q) ||
        tpl.creatorDisplayName.toLowerCase().includes(q) ||
        tpl.tags.some(tag => tag.toLowerCase().includes(q));

      return matchesCategory && matchesSearch;
    });
  }, [templates, selectedCategory, searchQuery]);

  const handleUseTemplate = async (template: CommunityTemplate) => {
    if (template.usagePermission === 'view_only') {
      return;
    }

    // Increment usage count locally & in cloud
    communityStorage.incrementUsageCount(template.id);
    incrementCloudTemplateUsage(template.id);

    // Create an independent copy
    const newId = 'draft_' + Date.now().toString(36) + Math.random().toString(36).substr(2, 5);

    if (template.type === 'cv' && 'personal' in template.designData) {
      const newDraft: CVDraft = {
        id: newId,
        title: `${template.name} (Copy)`,
        templateId: template.baseTemplateId || 'modern-blue',
        cvData: JSON.parse(JSON.stringify(template.designData)),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      // Save to local CV storage
      cvStorage.saveDraft(newDraft);
      cvStorage.setActiveDraftId(newDraft.id);

      // Save to Firestore if signed in
      if (user) {
        saveCVToCloud(user.uid, newDraft).catch(() => {});
      }

      setSuccessToast(
        language === 'so'
          ? `Template-ka "${template.name}" waxaa loo soo guuriyey mashruucaaga!`
          : `Template "${template.name}" copied to your workspace!`
      );
      setTimeout(() => {
        setSuccessToast(null);
        setPreviewTemplate(null);
        onUseTemplateAsCV(newDraft);
      }, 700);
    } else {
      // Studio Document Copy
      const docData = template.designData as StudioDocument;
      const newStudioDoc: StudioDocument = {
        ...JSON.parse(JSON.stringify(docData)),
        id: newId,
        title: `${template.name} (Copy)`,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      studioStorage.saveDocument(newStudioDoc);
      studioStorage.setActiveDocumentId(newStudioDoc.id);

      if (user) {
        saveStudioDocToCloud(user.uid, newStudioDoc).catch(() => {});
      }

      setSuccessToast(
        language === 'so'
          ? `Template-ka "${template.name}" waxaa loo soo guuriyey Studio-gaaga!`
          : `Template "${template.name}" copied to your Studio!`
      );
      setTimeout(() => {
        setSuccessToast(null);
        setPreviewTemplate(null);
        onUseTemplateInStudio(newStudioDoc);
      }, 700);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 pb-28 pt-4 px-4 sm:px-6 max-w-6xl mx-auto">
      {/* Toast Notification */}
      {successToast && (
        <div className="fixed top-20 right-4 z-50 bg-emerald-600 text-white text-xs font-semibold px-4 py-3 rounded-2xl shadow-xl flex items-center gap-2 animate-bounce">
          <Check className="w-4 h-4" />
          <span>{successToast}</span>
        </div>
      )}

      {/* Header */}
      <div className="mb-6 space-y-2">
        <div className="flex items-center gap-2 text-blue-600 font-semibold text-xs uppercase tracking-wider">
          <Sparkles className="w-4 h-4" />
          <span>{language === 'so' ? 'Maktabadda Bulshada' : 'Community Template Library'}</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900">
          {language === 'so' ? 'Dooro Template Diyaar ah' : 'Discover Community Templates'}
        </h1>
        <p className="text-xs sm:text-sm text-slate-600 max-w-2xl">
          {language === 'so'
            ? 'Ka baaro templates tayo sare leh oo ay diyaariyeen creators xirfadlayaal ah. Isticmaal ama dheeho qaabab cusub.'
            : 'Browse high-impact, verified templates published by creators. Copy reusable designs directly into your workspace.'}
        </p>
      </div>

      {/* Search & Category Filter Bar */}
      <div className="space-y-3 mb-8">
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={
              language === 'so'
                ? 'Raadi template, magac, xirfad, ama creator...'
                : 'Search templates by title, skill, or creator name...'
            }
            className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-300 rounded-xl text-xs sm:text-sm text-slate-800 placeholder-slate-400 focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition shadow-2xs"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Filter Categories */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition cursor-pointer ${
                selectedCategory === cat.id
                  ? 'bg-blue-600 text-white shadow-2xs'
                  : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              {language === 'so' ? cat.labelSo : cat.labelEn}
            </button>
          ))}
        </div>
      </div>

      {/* Templates Grid */}
      {filteredTemplates.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200 p-10 text-center space-y-3">
          <div className="w-12 h-12 bg-slate-100 text-slate-400 rounded-2xl flex items-center justify-center mx-auto">
            <Filter className="w-6 h-6" />
          </div>
          <h3 className="font-bold text-slate-800 text-sm">
            {language === 'so' ? 'Wax template ah lagama helin' : 'No templates match your search'}
          </h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            {language === 'so'
              ? 'Isku day inaad beddesho qaybta aad dooratay ama aad qorto erey kale.'
              : 'Try clearing your search filters or check back later for new creator submissions.'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredTemplates.map((tpl) => {
            const isReusable = tpl.usagePermission === 'reusable';

            return (
              <div
                key={tpl.id}
                className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-2xs hover:shadow-md transition group flex flex-col justify-between"
              >
                {/* Template Visual Card Header */}
                <div
                  onClick={() => setPreviewTemplate(tpl)}
                  className="relative h-48 bg-gradient-to-tr from-slate-100 to-slate-200 cursor-pointer overflow-hidden flex items-center justify-center p-4 border-b border-slate-100"
                >
                  {/* Decorative Mini Layout Representation */}
                  <div className="w-32 h-44 bg-white rounded-md shadow-md border border-slate-200 p-2 space-y-1.5 transition-transform group-hover:scale-105 duration-300 pointer-events-none">
                    <div className="w-8 h-8 rounded-full bg-blue-100 mx-auto" />
                    <div className="w-16 h-2 bg-slate-800 rounded mx-auto" />
                    <div className="w-10 h-1.5 bg-slate-400 rounded mx-auto" />
                    <div className="border-t border-slate-200 pt-1 space-y-1">
                      <div className="w-full h-1 bg-slate-300 rounded" />
                      <div className="w-4/5 h-1 bg-slate-200 rounded" />
                      <div className="w-3/4 h-1 bg-slate-200 rounded" />
                    </div>
                  </div>

                  {/* Usage Permission Badge */}
                  <div className="absolute top-3 left-3">
                    {isReusable ? (
                      <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-md flex items-center gap-1 shadow-2xs">
                        <Check className="w-2.5 h-2.5" />
                        {language === 'so' ? 'Waa la isticmaali karaa' : 'Reusable'}
                      </span>
                    ) : (
                      <span className="text-[10px] font-bold text-slate-700 bg-slate-100 border border-slate-300 px-2 py-0.5 rounded-md flex items-center gap-1 shadow-2xs">
                        <Lock className="w-2.5 h-2.5" />
                        {language === 'so' ? 'Daawasho Keliya' : 'View Only'}
                      </span>
                    )}
                  </div>

                  {/* Quick Preview Hover Trigger */}
                  <div className="absolute inset-0 bg-slate-900/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <span className="inline-flex items-center gap-1.5 bg-white text-slate-900 px-3 py-1.5 rounded-xl text-xs font-bold shadow-lg">
                      <Eye className="w-3.5 h-3.5" />
                      {language === 'so' ? 'Daawo' : 'Preview'}
                    </span>
                  </div>
                </div>

                {/* Content Details */}
                <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                  <div>
                    <h3 className="font-bold text-sm text-slate-900 line-clamp-1 group-hover:text-blue-600 transition">
                      {tpl.name}
                    </h3>
                    <p className="text-xs text-slate-500 line-clamp-2 mt-1 leading-relaxed">
                      {tpl.description}
                    </p>
                  </div>

                  {/* Creator and Usage Stats */}
                  <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-600">
                    <div className="flex items-center gap-1.5">
                      {tpl.creatorPhotoUrl ? (
                        <img
                          src={tpl.creatorPhotoUrl}
                          alt={tpl.creatorDisplayName}
                          className="w-5 h-5 rounded-full object-cover ring-1 ring-slate-200"
                        />
                      ) : (
                        <div className="w-5 h-5 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center text-[9px] font-bold">
                          {tpl.creatorDisplayName.charAt(0)}
                        </div>
                      )}
                      <span className="font-medium truncate max-w-[110px]">
                        {tpl.creatorDisplayName}
                      </span>
                    </div>

                    <span className="text-slate-400 font-medium">
                      {tpl.usageCount || 0} {language === 'so' ? 'isticmaal' : 'uses'}
                    </span>
                  </div>

                  {/* Action Buttons */}
                  <div className="pt-1 flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setPreviewTemplate(tpl)}
                      className="flex-1 py-2 px-3 border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-xl text-xs font-semibold transition cursor-pointer flex items-center justify-center gap-1"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>{language === 'so' ? 'Faahfaahin' : 'Preview'}</span>
                    </button>

                    {isReusable ? (
                      <button
                        type="button"
                        onClick={() => handleUseTemplate(tpl)}
                        className="flex-1 py-2 px-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition cursor-pointer flex items-center justify-center gap-1 shadow-2xs"
                      >
                        <Copy className="w-3.5 h-3.5" />
                        <span>{language === 'so' ? 'Isticmaal' : 'Use'}</span>
                      </button>
                    ) : (
                      <button
                        type="button"
                        disabled
                        className="flex-1 py-2 px-3 bg-slate-100 text-slate-400 rounded-xl text-xs font-medium cursor-not-allowed flex items-center justify-center gap-1"
                      >
                        <Lock className="w-3.5 h-3.5" />
                        <span>{language === 'so' ? 'View Only' : 'View Only'}</span>
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Template Fullscreen Preview Modal */}
      {previewTemplate && (
        <div className="fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 animate-in fade-in">
          <div className="bg-white w-full max-w-3xl rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
            {/* Modal Header */}
            <div className="px-5 py-3 border-b border-slate-200 flex items-center justify-between bg-slate-50">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-blue-600 text-white flex items-center justify-center font-bold">
                  <Sparkles className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-extrabold text-sm sm:text-base text-slate-900">
                    {previewTemplate.name}
                  </h3>
                  <p className="text-[11px] text-slate-500">
                    {language === 'so' ? 'Waxaa sameeyey' : 'By'} {previewTemplate.creatorDisplayName} · {previewTemplate.category}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setPreviewTemplate(null)}
                className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-200 rounded-lg cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body Preview Content */}
            <div className="p-4 sm:p-6 overflow-y-auto flex-1 space-y-4 bg-slate-100">
              <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm space-y-4">
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold px-2 py-0.5 rounded-md bg-blue-50 text-blue-700 border border-blue-200">
                      {previewTemplate.category.toUpperCase()}
                    </span>
                    {previewTemplate.usagePermission === 'reusable' ? (
                      <span className="text-xs font-bold px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center gap-1">
                        <Check className="w-3 h-3" />
                        {language === 'so' ? 'Waa la Isticmaali Karaa (Reusable)' : 'Reusable Template'}
                      </span>
                    ) : (
                      <span className="text-xs font-bold px-2 py-0.5 rounded-md bg-amber-50 text-amber-700 border border-amber-200 flex items-center gap-1">
                        <Lock className="w-3 h-3" />
                        {language === 'so' ? 'Daawasho Keliya (View Only)' : 'View Only'}
                      </span>
                    )}
                  </div>
                  <span className="text-xs text-slate-500 font-medium">
                    {previewTemplate.usageCount} {language === 'so' ? 'qof ayaa isticmaalay' : 'downloads/uses'}
                  </span>
                </div>

                <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
                  {previewTemplate.description}
                </p>

                {previewTemplate.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 pt-2">
                    {previewTemplate.tags.map((tag) => (
                      <span
                        key={tag}
                        className="text-[11px] font-medium bg-slate-100 text-slate-600 px-2 py-0.5 rounded-md"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* Sample Preview Container */}
              <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm text-center">
                <p className="text-xs font-semibold text-slate-500 mb-3 uppercase tracking-wider">
                  {language === 'so' ? 'Muuqaalka Naqshadda' : 'Design Preview'}
                </p>
                <div className="max-w-md mx-auto bg-slate-50 border border-slate-200 rounded-lg p-6 space-y-3 text-left">
                  <div className="h-4 bg-slate-300 rounded w-2/3" />
                  <div className="h-3 bg-slate-200 rounded w-1/2" />
                  <div className="border-t border-slate-200 pt-3 space-y-2">
                    <div className="h-2.5 bg-slate-200 rounded w-full" />
                    <div className="h-2.5 bg-slate-200 rounded w-5/6" />
                    <div className="h-2.5 bg-slate-200 rounded w-4/6" />
                  </div>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="px-5 py-3 border-t border-slate-200 flex items-center justify-between bg-white">
              <button
                type="button"
                onClick={() => setPreviewTemplate(null)}
                className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl cursor-pointer"
              >
                {language === 'so' ? 'Xir' : 'Close'}
              </button>

              {previewTemplate.usagePermission === 'reusable' ? (
                <button
                  type="button"
                  onClick={() => handleUseTemplate(previewTemplate)}
                  className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl transition cursor-pointer flex items-center gap-1.5 shadow-md"
                >
                  <Copy className="w-4 h-4" />
                  <span>{language === 'so' ? 'Isticmaal Template-kan' : 'Use this Template'}</span>
                </button>
              ) : (
                <div className="flex items-center gap-1.5 text-xs text-amber-700 font-medium">
                  <Lock className="w-3.5 h-3.5" />
                  <span>{language === 'so' ? 'Template-kani waa View Only' : 'This template is View Only'}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
