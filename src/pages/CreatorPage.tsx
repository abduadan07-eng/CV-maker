import React, { useState, useEffect } from 'react';
import { Sparkles, Send, Clock, CheckCircle, XCircle, AlertCircle, Plus, FileText, Globe, User, Edit3, Trash2, ArrowRight } from 'lucide-react';
import { useLanguage } from '../i18n/LanguageContext';
import { useAuth } from '../firebase/AuthContext';
import { CreatorApplication, CreatorApplicationStatus, CommunityTemplate, TemplateCategory } from '../types/community';
import { communityStorage } from '../storage/communityStorage';
import {
  submitCreatorApplicationToCloud,
  getCreatorApplicationFromCloud,
  saveCommunityTemplateToCloud
} from '../firebase/communityFirestore';
import { cvStorage } from '../storage/cvStorage';
import { studioStorage } from '../storage/studioStorage';

interface CreatorPageProps {
  onOpenStudio: () => void;
  onOpenBuilder: () => void;
}

export const CreatorPage: React.FC<CreatorPageProps> = ({
  onOpenStudio,
  onOpenBuilder
}) => {
  const { t, language } = useLanguage();
  const { user, openAuthModal } = useAuth();

  const [application, setApplication] = useState<CreatorApplication | null>(null);
  const [applicantName, setApplicantName] = useState('');
  const [email, setEmail] = useState('');
  const [description, setDescription] = useState('');
  const [portfolioUrl, setPortfolioUrl] = useState('');
  const [sampleExperience, setSampleExperience] = useState('');

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Creator Studio State for approved creators
  const [myTemplates, setMyTemplates] = useState<CommunityTemplate[]>([]);
  const [activeTab, setActiveTab] = useState<'published' | 'drafts' | 'pending' | 'rejected'>('published');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newTemplateName, setNewTemplateName] = useState('');
  const [newTemplateDesc, setNewTemplateDesc] = useState('');
  const [newTemplateCategory, setNewTemplateCategory] = useState<TemplateCategory>('professional');
  const [newTemplateTags, setNewTemplateTags] = useState('');
  const [newTemplatePermission, setNewTemplatePermission] = useState<'reusable' | 'view_only'>('reusable');

  // Load application status
  useEffect(() => {
    const userId = user?.uid || 'guest_user';
    const localApp = communityStorage.getApplicationByUserId(userId);
    if (localApp) {
      setApplication(localApp);
      setApplicantName(localApp.applicantName);
      setEmail(localApp.email);
    } else if (user) {
      setApplicantName(user.displayName || '');
      setEmail(user.email || '');
    }

    if (user) {
      getCreatorApplicationFromCloud(user.uid).then(cloudApp => {
        if (cloudApp) {
          setApplication(cloudApp);
          communityStorage.saveApplication(cloudApp);
        }
      }).catch(() => {});
    }

    // Load creator templates
    const all = communityStorage.getTemplates();
    setMyTemplates(all.filter(t => t.creatorId === userId || (user && t.creatorId === user.uid)));
  }, [user]);

  const appStatus: CreatorApplicationStatus = application?.status || 'not_applied';

  const handleSubmitApplication = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!applicantName.trim() || !description.trim()) {
      alert(language === 'so' ? 'Fadlan buuxi magacaaga iyo faahfaahinta codsiga.' : 'Please enter your name and application description.');
      return;
    }

    const userId = user?.uid || 'guest_user';
    const newApp: CreatorApplication = {
      id: 'app_' + Date.now().toString(36),
      userId,
      applicantName: applicantName.trim(),
      email: email.trim() || (user?.email || ''),
      description: description.trim(),
      portfolioUrl: portfolioUrl.trim(),
      sampleExperience: sampleExperience.trim(),
      status: 'pending',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    setIsSubmitting(true);
    try {
      // Save locally
      communityStorage.saveApplication(newApp);
      setApplication(newApp);

      // Save to cloud if signed in
      if (user) {
        await submitCreatorApplicationToCloud(newApp);
      }

      setToastMessage(
        language === 'so'
          ? 'Codsigaaga si guul leh ayaa loo diray! Waxaa dib u eegi doona maamulka.'
          : 'Your application has been submitted! It is currently under review by our admin team.'
      );
      setTimeout(() => setToastMessage(null), 4000);
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCreateNewTemplate = async () => {
    if (!newTemplateName.trim()) return;

    const userId = user?.uid || 'guest_user';
    const sampleData = cvStorage.getDrafts()[0]?.cvData || cvStorage.createSampleDraft().cvData;

    const newTemplate: CommunityTemplate = {
      id: 'comm_' + Date.now().toString(36) + Math.random().toString(36).substr(2, 4),
      creatorId: userId,
      creatorDisplayName: user?.displayName || applicantName || 'Creator',
      creatorPhotoUrl: user?.photoURL || undefined,
      name: newTemplateName.trim(),
      description: newTemplateDesc.trim() || 'A modern professional community template.',
      category: newTemplateCategory,
      tags: newTemplateTags.split(',').map(t => t.trim()).filter(Boolean),
      type: 'cv',
      baseTemplateId: 'modern-blue',
      designData: sampleData,
      visibility: 'public',
      usagePermission: newTemplatePermission,
      status: 'draft',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      usageCount: 0
    };

    communityStorage.saveTemplate(newTemplate);
    if (user) {
      saveCommunityTemplateToCloud(newTemplate).catch(() => {});
    }

    setMyTemplates(prev => [newTemplate, ...prev]);
    setShowCreateModal(false);
    setNewTemplateName('');
    setNewTemplateDesc('');
    setNewTemplateTags('');

    setToastMessage(language === 'so' ? 'Qabyo-qoraalka template-ka waa la kaydiyey!' : 'Template draft created successfully!');
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleSubmitTemplateForReview = (tpl: CommunityTemplate) => {
    const updated: CommunityTemplate = {
      ...tpl,
      status: 'pending',
      updatedAt: new Date().toISOString()
    };
    communityStorage.saveTemplate(updated);
    if (user) {
      saveCommunityTemplateToCloud(updated).catch(() => {});
    }
    setMyTemplates(prev => prev.map(t => t.id === tpl.id ? updated : t));
    setToastMessage(language === 'so' ? 'Template-ka waxaa loo gudbiyey dib-u-eegidda Admin-ka!' : 'Template submitted for admin review!');
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleDeleteTemplate = (id: string) => {
    if (confirm(language === 'so' ? 'Ma hubtaa inaad tirtirto template-kan?' : 'Are you sure you want to delete this template?')) {
      communityStorage.deleteTemplate(id);
      setMyTemplates(prev => prev.filter(t => t.id !== id));
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 pb-28 pt-4 px-4 sm:px-6 max-w-5xl mx-auto">
      {/* Toast Alert */}
      {toastMessage && (
        <div className="fixed top-20 right-4 z-50 bg-blue-600 text-white text-xs font-semibold px-4 py-3 rounded-2xl shadow-xl flex items-center gap-2 animate-bounce">
          <CheckCircle className="w-4 h-4 text-emerald-300" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Header */}
      <div className="mb-6 space-y-2">
        <div className="flex items-center gap-2 text-indigo-600 font-semibold text-xs uppercase tracking-wider">
          <Sparkles className="w-4 h-4" />
          <span>{language === 'so' ? 'Nidaamka Creators-ka' : 'Creator Portal & Studio'}</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900">
          {appStatus === 'approved'
            ? (language === 'so' ? 'Creator Studio: Maamul Templates-kaaga' : 'Creator Studio: Manage Your Templates')
            : (language === 'so' ? 'Codso inaad noqoto Template Creator' : 'Apply to Become a Template Creator')}
        </h1>
        <p className="text-xs sm:text-sm text-slate-600 max-w-2xl">
          {language === 'so'
            ? 'Ku biir jaaliyadda creators-ka CV Maker si aad u samayso, una daabacdo CV templates ay boqolaal isticmaale ka faa\'iidaystaan.'
            : 'Join our vetted network of template designers to build, publish, and share ATS and creative templates with the community.'}
        </p>
      </div>

      {/* Status Banner when not approved */}
      {appStatus !== 'approved' && (
        <div className="mb-6 p-4 rounded-2xl border bg-white shadow-2xs space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              {language === 'so' ? 'Xaaladda Codsigaaga' : 'Application Status'}
            </span>
            {appStatus === 'not_applied' && (
              <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-slate-100 text-slate-700 flex items-center gap-1.5">
                <AlertCircle className="w-3.5 h-3.5" />
                {language === 'so' ? 'Lama Codsan' : 'Not Applied'}
              </span>
            )}
            {appStatus === 'pending' && (
              <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-amber-50 text-amber-700 border border-amber-200 flex items-center gap-1.5 animate-pulse">
                <Clock className="w-3.5 h-3.5" />
                {language === 'so' ? 'Dib u Eegis ku Jirta (Pending)' : 'Under Review'}
              </span>
            )}
            {appStatus === 'rejected' && (
              <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-rose-50 text-rose-700 border border-rose-200 flex items-center gap-1.5">
                <XCircle className="w-3.5 h-3.5" />
                {language === 'so' ? 'Lama Aqbalin (Rejected)' : 'Rejected'}
              </span>
            )}
          </div>

          {appStatus === 'pending' && (
            <div className="bg-amber-50/70 border border-amber-200/60 rounded-xl p-3.5 text-xs text-amber-900 space-y-1">
              <p className="font-semibold">
                {language === 'so'
                  ? 'Codsigaaga waxaa baaraya maamulka.'
                  : 'Your creator application has been received and is being verified.'}
              </p>
              <p className="text-[11px] text-amber-800">
                {language === 'so'
                  ? 'Waxaan eegaynaa tayada iyo khibradaada naqshadaynta. Marka la ansixiyo waxaad toos u heli doontaa daabacaadda templates-ka.'
                  : 'Once approved by an administrator, you will gain full creator privileges to design and publish public templates.'}
              </p>
            </div>
          )}

          {appStatus === 'rejected' && (
            <div className="bg-rose-50 border border-rose-200 rounded-xl p-3.5 text-xs text-rose-900 space-y-1">
              <p className="font-semibold">
                {language === 'so'
                  ? 'Codsigaaga markan lama ansixin.'
                  : 'Application was not approved at this time.'}
              </p>
              {application?.rejectionReason && (
                <p className="text-[11px] text-rose-800 font-mono">
                  Reason: {application.rejectionReason}
                </p>
              )}
              <p className="text-[11px] text-rose-700 pt-1">
                {language === 'so'
                  ? 'Waad dib u buuxin kartaa foomka adigoo ku daraya tusaalooyin dheeraad ah.'
                  : 'You may update your portfolio links and re-submit for review.'}
              </p>
            </div>
          )}
        </div>
      )}

      {/* APPROVED CREATOR VIEW */}
      {appStatus === 'approved' ? (
        <div className="space-y-6">
          {/* Creator Welcome Card */}
          <div className="bg-gradient-to-r from-blue-700 to-indigo-700 rounded-2xl p-6 text-white shadow-lg flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-bold tracking-wider uppercase bg-white/20 px-2 py-0.5 rounded-full">
                  Verified Creator
                </span>
                <CheckCircle className="w-4 h-4 text-emerald-300" />
              </div>
              <h2 className="text-xl font-black">
                {language === 'so' ? 'Ku soo dhowow Creator Studio' : 'Welcome to Creator Studio'}
              </h2>
              <p className="text-xs text-blue-100 max-w-lg">
                {language === 'so'
                  ? 'Halkan waxaad ku samayn kartaa, ku daabici kartaa, kuna maamuli kartaa templates-kaaga bulshada.'
                  : 'Create custom ATS-compliant or Canva-style templates, submit them for approval, and track community downloads.'}
              </p>
            </div>

            <button
              type="button"
              onClick={() => setShowCreateModal(true)}
              className="px-4 py-3 bg-white text-blue-900 hover:bg-blue-50 text-xs font-bold rounded-xl shadow-md transition flex items-center gap-1.5 cursor-pointer whitespace-nowrap"
            >
              <Plus className="w-4 h-4 text-blue-600" />
              <span>{language === 'so' ? 'Samee Template Cusub' : 'Create New Template'}</span>
            </button>
          </div>

          {/* Template Tabs */}
          <div className="flex items-center gap-2 border-b border-slate-200 pb-2 overflow-x-auto scrollbar-none">
            {[
              { id: 'published', label: language === 'so' ? 'La Daabacay' : 'Published' },
              { id: 'drafts', label: language === 'so' ? 'Qabyooyin' : 'Drafts' },
              { id: 'pending', label: language === 'so' ? 'Dib u Eegis' : 'Pending Review' },
              { id: 'rejected', label: language === 'so' ? 'Sixitaan Loo Baahan Yahay' : 'Needs Fix' }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`px-3 py-1.5 text-xs font-bold rounded-lg transition cursor-pointer ${
                  activeTab === tab.id
                    ? 'bg-blue-600 text-white shadow-2xs'
                    : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Creator Templates List */}
          {(() => {
            const list = myTemplates.filter(t => {
              if (activeTab === 'published') return t.status === 'approved';
              if (activeTab === 'drafts') return t.status === 'draft';
              if (activeTab === 'pending') return t.status === 'pending';
              if (activeTab === 'rejected') return t.status === 'rejected';
              return true;
            });

            if (list.length === 0) {
              return (
                <div className="bg-white rounded-2xl border border-slate-200 p-8 text-center space-y-3">
                  <p className="text-xs text-slate-500 font-medium">
                    {language === 'so' ? 'Ma jiraan wax templates ah qeybtan.' : 'No templates found in this section.'}
                  </p>
                  <button
                    onClick={() => setShowCreateModal(true)}
                    className="inline-flex items-center gap-1 text-xs text-blue-600 font-semibold hover:underline"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>{language === 'so' ? 'Bilow sameynta template cusub' : 'Start a new template'}</span>
                  </button>
                </div>
              );
            }

            return (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {list.map(tpl => (
                  <div key={tpl.id} className="bg-white rounded-xl border border-slate-200 p-4 shadow-2xs space-y-3">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <h4 className="font-bold text-sm text-slate-900">{tpl.name}</h4>
                        <p className="text-xs text-slate-500 line-clamp-1">{tpl.description}</p>
                      </div>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-slate-100 text-slate-700">
                        {tpl.status.toUpperCase()}
                      </span>
                    </div>

                    <div className="flex items-center justify-between text-[11px] text-slate-500 pt-2 border-t border-slate-100">
                      <span>{tpl.category}</span>
                      <span>{tpl.usageCount || 0} {language === 'so' ? 'isticmaal' : 'uses'}</span>
                    </div>

                    <div className="flex items-center gap-2 pt-1">
                      {tpl.status === 'draft' && (
                        <button
                          type="button"
                          onClick={() => handleSubmitTemplateForReview(tpl)}
                          className="flex-1 py-1.5 bg-blue-600 text-white rounded-lg text-xs font-bold hover:bg-blue-700 transition"
                        >
                          {language === 'so' ? 'U Dir Dib-u-eegis' : 'Submit for Review'}
                        </button>
                      )}
                      {tpl.status === 'rejected' && (
                        <button
                          type="button"
                          onClick={() => handleSubmitTemplateForReview(tpl)}
                          className="flex-1 py-1.5 bg-amber-600 text-white rounded-lg text-xs font-bold hover:bg-amber-700 transition"
                        >
                          {language === 'so' ? 'Dib u Dir' : 'Resubmit'}
                        </button>
                      )}
                      <button
                        type="button"
                        onClick={() => handleDeleteTemplate(tpl.id)}
                        className="p-1.5 text-rose-600 hover:bg-rose-50 rounded-lg transition"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            );
          })()}
        </div>
      ) : (
        /* APPLICATION FORM */
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-5">
          <div className="space-y-1 border-b border-slate-100 pb-4">
            <h2 className="text-base sm:text-lg font-bold text-slate-900">
              {language === 'so' ? 'Foomka Codsiga Creator-ka' : 'Creator Application Form'}
            </h2>
            <p className="text-xs text-slate-500">
              {language === 'so'
                ? 'Fadlan na sii faahfaahin ku saabsan khibradaada naqshadaynta CV-yada ama documents-ka.'
                : 'Share your background and motivation so our admin team can verify and approve your account.'}
            </p>
          </div>

          <form onSubmit={handleSubmitApplication} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  {language === 'so' ? 'Magacaaga oo Buuxa' : 'Full Name / Creator Name'} *
                </label>
                <input
                  type="text"
                  required
                  value={applicantName}
                  onChange={(e) => setApplicantName(e.target.value)}
                  placeholder="e.g. Yahye Abdi or Yahye Tech Studio"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs sm:text-sm text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-blue-500/20"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  {language === 'so' ? 'Email-kaaga' : 'Contact Email'} *
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs sm:text-sm text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-blue-500/20"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                {language === 'so' ? 'Xiriirka Portfolio / Shaqooyinkaaga (Haddii aad leedahay)' : 'Portfolio / Work Link (Optional)'}
              </label>
              <input
                type="url"
                value={portfolioUrl}
                onChange={(e) => setPortfolioUrl(e.target.value)}
                placeholder="https://behance.net/username or https://github.com/username"
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs sm:text-sm text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-blue-500/20"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                {language === 'so' ? 'Maxaad u doonaysaa inaad noqoto Creator? Khibradaada naqshadda' : 'Why do you want to become a Creator? Your design experience'} *
              </label>
              <textarea
                required
                rows={4}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder={
                  language === 'so'
                    ? 'Sharax noocyada templates ee aad doonayso inaad soo saarto (sida ATS modern templates, Canva design layouts, ama Somaliland/Somalia corporate CVs)...'
                    : 'Describe the kinds of templates you plan to publish (e.g. ATS corporate, tech engineering, executive creative, or regional bilingual layouts)...'
                }
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs sm:text-sm text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-blue-500/20"
              />
            </div>

            {!user && (
              <div className="p-3 bg-blue-50 border border-blue-200 rounded-xl text-xs text-blue-900 flex items-center justify-between">
                <span>
                  {language === 'so'
                    ? 'Ku gal Google si codsigaagu ugu xirnaado akoonkaaga rasmiga ah.'
                    : 'Sign in with Google to associate your application with your cloud account.'}
                </span>
                <button
                  type="button"
                  onClick={() => openAuthModal()}
                  className="px-3 py-1 bg-blue-600 text-white rounded-lg font-bold hover:bg-blue-700 cursor-pointer"
                >
                  {language === 'so' ? 'Gal Akoonkaaga' : 'Account Login'}
                </button>
              </div>
            )}

            <div className="pt-2">
              <button
                type="submit"
                disabled={isSubmitting || appStatus === 'pending'}
                className="w-full sm:w-auto px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition flex items-center justify-center gap-2 cursor-pointer shadow-md disabled:opacity-50"
              >
                <Send className="w-4 h-4" />
                <span>
                  {isSubmitting
                    ? (language === 'so' ? 'Waa la dirayaa...' : 'Submitting...')
                    : (language === 'so' ? 'Gudbi Codsiga Creator-ka' : 'Submit Application')}
                </span>
              </button>
            </div>
          </form>
        </div>
      )}

      {/* CREATE NEW TEMPLATE MODAL */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-md rounded-2xl shadow-xl overflow-hidden p-6 space-y-4">
            <h3 className="font-extrabold text-base text-slate-900">
              {language === 'so' ? 'Samee Community Template Cusub' : 'Create New Community Template'}
            </h3>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  {language === 'so' ? 'Magaca Template-ka' : 'Template Title'} *
                </label>
                <input
                  type="text"
                  value={newTemplateName}
                  onChange={(e) => setNewTemplateName(e.target.value)}
                  placeholder="e.g. Horn Executive Minimalist"
                  className="w-full p-2 bg-slate-50 border border-slate-300 rounded-lg text-slate-800"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  {language === 'so' ? 'Sharaxaad Kooban' : 'Description'}
                </label>
                <input
                  type="text"
                  value={newTemplateDesc}
                  onChange={(e) => setNewTemplateDesc(e.target.value)}
                  placeholder="High pass rate ATS template..."
                  className="w-full p-2 bg-slate-50 border border-slate-300 rounded-lg text-slate-800"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  {language === 'so' ? 'Qaybta (Category)' : 'Category'}
                </label>
                <select
                  value={newTemplateCategory}
                  onChange={(e) => setNewTemplateCategory(e.target.value as any)}
                  className="w-full p-2 bg-slate-50 border border-slate-300 rounded-lg text-slate-800"
                >
                  <option value="professional">Professional</option>
                  <option value="modern">Modern</option>
                  <option value="creative">Creative</option>
                  <option value="academic">Academic</option>
                  <option value="minimal">Minimalist</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  {language === 'so' ? 'Oggolaanshaha Isticmaalka (Usage Permission)' : 'Usage Permission'}
                </label>
                <select
                  value={newTemplatePermission}
                  onChange={(e) => setNewTemplatePermission(e.target.value as any)}
                  className="w-full p-2 bg-slate-50 border border-slate-300 rounded-lg text-slate-800"
                >
                  <option value="reusable">
                    {language === 'so' ? 'Waa la guurin karaa / Isticmaali karaa (Reusable)' : 'Reusable (Anyone can copy & use)'}
                  </option>
                  <option value="view_only">
                    {language === 'so' ? 'Daawasho Keliya (View Only)' : 'View Only (Inspection only)'}
                  </option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  {language === 'so' ? 'Tags (Kala saar hakad)' : 'Tags (comma separated)'}
                </label>
                <input
                  type="text"
                  value={newTemplateTags}
                  onChange={(e) => setNewTemplateTags(e.target.value)}
                  placeholder="Tech, ATS, Executive, Modern"
                  className="w-full p-2 bg-slate-50 border border-slate-300 rounded-lg text-slate-800"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setShowCreateModal(false)}
                className="px-3 py-1.5 text-xs text-slate-600 hover:bg-slate-100 rounded-lg"
              >
                {language === 'so' ? 'Ka noqo' : 'Cancel'}
              </button>
              <button
                type="button"
                onClick={handleCreateNewTemplate}
                className="px-4 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-lg"
              >
                {language === 'so' ? 'Kaydi Qabyo' : 'Save Draft'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
