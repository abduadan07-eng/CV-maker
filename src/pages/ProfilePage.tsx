import React, { useState, useEffect } from 'react';
import {
  User as UserIcon,
  Camera,
  Trash2,
  Edit2,
  Check,
  Cloud,
  LogOut,
  LogIn,
  Shield,
  Sparkles,
  FileText,
  Clock,
  Layers,
  ExternalLink,
  Save,
  CheckCircle,
  Database
} from 'lucide-react';
import { useLanguage } from '../i18n/LanguageContext';
import { useAuth } from '../firebase/AuthContext';
import { cvStorage } from '../storage/cvStorage';
import { studioStorage } from '../storage/studioStorage';
import { communityStorage } from '../storage/communityStorage';
import { CommunityTemplate } from '../types/community';
import { syncUserProfile } from '../firebase/cvFirestore';
import { CVDraft } from '../types/cv';

interface ProfilePageProps {
  onOpenAdminDashboard: () => void;
  onNavigateToTemplates: () => void;
  onOpenDraft: (draft: CVDraft) => void;
}

export const ProfilePage: React.FC<ProfilePageProps> = ({
  onOpenAdminDashboard,
  onNavigateToTemplates,
  onOpenDraft
}) => {
  const { t, language, setLanguage } = useLanguage();
  const { user, openAuthModal, signOutUser, isCloudConnected } = useAuth();

  const [displayName, setDisplayName] = useState(user?.displayName || '');
  const [username, setUsername] = useState('');
  const [photoUrl, setPhotoUrl] = useState(user?.photoURL || '');
  const [isEditingName, setIsEditingName] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Stats
  const [draftsCount, setDraftsCount] = useState(0);
  const [studioDocsCount, setStudioDocsCount] = useState(0);
  const [myTemplates, setMyTemplates] = useState<CommunityTemplate[]>([]);

  const isAdmin =
    user?.email?.toLowerCase() === 'yahy38989@gmail.com' ||
    user?.email?.toLowerCase() === 'aa8402502@gmail.com';

  useEffect(() => {
    if (user) {
      setDisplayName(user.displayName || '');
      setPhotoUrl(user.photoURL || '');
      const localUsername = localStorage.getItem(`cv_user_${user.uid}_username`);
      if (localUsername) setUsername(localUsername);
    }

    const drafts = cvStorage.getDrafts();
    setDraftsCount(drafts.length);

    const studioDocs = studioStorage.getDocuments();
    setStudioDocsCount(studioDocs.length);

    const templates = communityStorage.getTemplates();
    const mine = templates.filter(
      t => t.creatorId === (user?.uid || 'guest_user')
    );
    setMyTemplates(mine);
  }, [user]);

  // Handle Photo Upload
  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        alert(language === 'so' ? 'Fadlan dooro sawir ka yar 2MB' : 'Please select an image smaller than 2MB');
        return;
      }
      const reader = new FileReader();
      reader.onload = (event) => {
        const result = event.target?.result as string;
        setPhotoUrl(result);
        if (user) {
          syncUserProfile({ ...user, photoURL: result } as any, language);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemovePhoto = () => {
    setPhotoUrl('');
    if (user) {
      syncUserProfile({ ...user, photoURL: '' } as any, language);
    }
  };

  const handleSaveProfile = async () => {
    if (user) {
      localStorage.setItem(`cv_user_${user.uid}_username`, username.trim());
      await syncUserProfile(
        {
          ...user,
          displayName: displayName.trim() || user.displayName
        } as any,
        language
      );
    }
    setIsEditingName(false);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 2500);
  };

  const creatorApp = communityStorage.getApplicationByUserId(user?.uid || 'guest_user');

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 pb-28 pt-4 px-4 sm:px-6 max-w-4xl mx-auto space-y-6">
      {/* Toast Alert */}
      {saveSuccess && (
        <div className="fixed top-20 right-4 z-50 bg-emerald-600 text-white text-xs font-semibold px-4 py-2.5 rounded-xl shadow-lg flex items-center gap-2 animate-bounce">
          <Check className="w-4 h-4" />
          <span>{language === 'so' ? 'Xogta akoonka waa la cusbooneysiiyey!' : 'Profile updated successfully!'}</span>
        </div>
      )}

      {/* Profile Card Header */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-blue-500/10 to-transparent rounded-bl-full pointer-events-none" />

        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5">
          {/* Avatar with Camera Overlay */}
          <div className="relative group">
            <div className="w-24 h-24 rounded-2xl overflow-hidden bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white text-3xl font-bold shadow-md ring-4 ring-white">
              {photoUrl ? (
                <img src={photoUrl} alt="Profile" className="w-full h-full object-cover" />
              ) : (
                <span>{displayName ? displayName.charAt(0).toUpperCase() : 'U'}</span>
              )}
            </div>

            <label
              htmlFor="profile-photo-input"
              className="absolute -bottom-2 -right-2 p-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl shadow-md cursor-pointer transition"
              title={language === 'so' ? 'Beddel Sawirka' : 'Change Photo'}
            >
              <Camera className="w-4 h-4" />
            </label>
            <input
              id="profile-photo-input"
              type="file"
              accept="image/*"
              onChange={handlePhotoUpload}
              className="hidden"
            />
          </div>

          {/* User Info Details */}
          <div className="flex-1 text-center sm:text-left space-y-2">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                  {displayName || (language === 'so' ? 'Isticmaale CV Maker' : 'CV Maker User')}
                </h2>
                <p className="text-xs text-slate-500 font-mono">
                  {username ? `@${username}` : (user?.email || 'Guest Session')}
                </p>
              </div>

              {/* Status Pill */}
              <div className="flex items-center justify-center sm:justify-end gap-2">
                {user ? (
                  <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 rounded-full flex items-center gap-1.5">
                    <Cloud className="w-3 h-3 text-emerald-600" />
                    <span>{language === 'so' ? 'Ku Xiran Google' : 'Google Connected'}</span>
                  </span>
                ) : (
                  <button
                    type="button"
                    onClick={() => openAuthModal()}
                    className="text-[11px] font-bold text-blue-700 bg-blue-50 border border-blue-200 hover:bg-blue-100 px-3 py-1 rounded-xl flex items-center gap-1 cursor-pointer transition shadow-2xs"
                  >
                    <LogIn className="w-3.5 h-3.5" />
                    <span>{language === 'so' ? 'Ku Xiro Akoon' : 'Connect Account'}</span>
                  </button>
                )}
              </div>
            </div>

            {/* Profile Action Buttons */}
            <div className="pt-2 flex flex-wrap items-center justify-center sm:justify-start gap-2">
              <button
                type="button"
                onClick={() => setIsEditingName(!isEditingName)}
                className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold flex items-center gap-1 cursor-pointer transition"
              >
                <Edit2 className="w-3.5 h-3.5" />
                <span>{language === 'so' ? 'Wax ka beddel Xogta' : 'Edit Profile'}</span>
              </button>

              {photoUrl && (
                <button
                  type="button"
                  onClick={handleRemovePhoto}
                  className="px-3 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-700 rounded-xl text-xs font-semibold flex items-center gap-1 cursor-pointer transition"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>{language === 'so' ? 'Tir Sawirka' : 'Remove Photo'}</span>
                </button>
              )}

              {user && (
                <button
                  type="button"
                  onClick={() => signOutUser()}
                  className="px-3 py-1.5 bg-slate-100 hover:bg-rose-50 hover:text-rose-700 text-slate-700 rounded-xl text-xs font-semibold flex items-center gap-1 cursor-pointer transition"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>{language === 'so' ? 'Ka Bax' : 'Sign Out'}</span>
                </button>
              )}
            </div>

            {/* Editing Form */}
            {isEditingName && (
              <div className="mt-4 p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-3">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">
                      {language === 'so' ? 'Magaca La Muujinayo' : 'Display Name'}
                    </label>
                    <input
                      type="text"
                      value={displayName}
                      onChange={(e) => setDisplayName(e.target.value)}
                      className="w-full p-2 bg-white border border-slate-300 rounded-lg text-slate-800"
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">
                      {language === 'so' ? 'Username / Handle' : 'Username'}
                    </label>
                    <input
                      type="text"
                      value={username}
                      onChange={(e) => setUsername(e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, ''))}
                      placeholder="e.g. yahye_dev"
                      className="w-full p-2 bg-white border border-slate-300 rounded-lg text-slate-800"
                    />
                  </div>
                </div>
                <div className="flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setIsEditingName(false)}
                    className="px-3 py-1.5 text-xs text-slate-600 hover:bg-slate-200 rounded-lg"
                  >
                    {language === 'so' ? 'Ka noqo' : 'Cancel'}
                  </button>
                  <button
                    type="button"
                    onClick={handleSaveProfile}
                    className="px-4 py-1.5 bg-blue-600 text-white rounded-lg text-xs font-bold hover:bg-blue-700 flex items-center gap-1"
                  >
                    <Save className="w-3.5 h-3.5" />
                    <span>{language === 'so' ? 'Kaydi' : 'Save Changes'}</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Document & Workspace Stats */}
      <div className="grid grid-cols-3 gap-3">
        <div className="bg-white border border-slate-200 rounded-2xl p-4 text-center shadow-2xs">
          <p className="text-2xl font-black text-slate-900">{draftsCount}</p>
          <p className="text-[11px] font-semibold text-slate-500 mt-0.5">
            {language === 'so' ? 'CV-yada Kaydsan' : 'Saved CVs'}
          </p>
        </div>
        <div className="bg-white border border-slate-200 rounded-2xl p-4 text-center shadow-2xs">
          <p className="text-2xl font-black text-slate-900">{studioDocsCount}</p>
          <p className="text-[11px] font-semibold text-slate-500 mt-0.5">
            {language === 'so' ? 'Naqshadaha Studio' : 'Studio Designs'}
          </p>
        </div>
        <div className="bg-white border border-slate-200 rounded-2xl p-4 text-center shadow-2xs">
          <p className="text-2xl font-black text-slate-900">{myTemplates.length}</p>
          <p className="text-[11px] font-semibold text-slate-500 mt-0.5">
            {language === 'so' ? 'Templates-kayga' : 'My Templates'}
          </p>
        </div>
      </div>

      {/* Creator Application Status & Shortcut */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-2xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-indigo-50 border border-indigo-200 flex items-center justify-center text-indigo-600">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <h4 className="font-bold text-sm text-slate-900">
              {language === 'so' ? 'Xaaladda Creator-ka' : 'Creator Status'}
            </h4>
            <p className="text-xs text-slate-500">
              {creatorApp?.status === 'approved'
                ? (language === 'so' ? 'Waxaad tahay Creator la ansixiyey! Waad daabaci kartaa templates.' : 'You are an Approved Creator with publishing rights.')
                : creatorApp?.status === 'pending'
                ? (language === 'so' ? 'Codsigaagu wuxuu ku jiraa dib u eegis.' : 'Your creator application is under review.')
                : (language === 'so' ? 'Codso oggolaansho si aad u daabacdo templates-ka bulshada.' : 'Apply for creator privileges to publish community templates.')}
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={onNavigateToTemplates}
          className="px-4 py-2 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200 rounded-xl text-xs font-bold transition cursor-pointer flex items-center gap-1.5 whitespace-nowrap"
        >
          <span>{creatorApp?.status === 'approved' ? (language === 'so' ? 'Fur Creator Studio' : 'Open Creator Studio') : (language === 'so' ? 'Maamul Codsiga' : 'Manage Application')}</span>
          <ExternalLink className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* My Published / Draft Templates List */}
      {myTemplates.length > 0 && (
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-2xs space-y-3">
          <h4 className="font-bold text-sm text-slate-900">
            {language === 'so' ? 'Templates-kaaga' : 'Your Community Templates'}
          </h4>
          <div className="divide-y divide-slate-100">
            {myTemplates.map(tpl => (
              <div key={tpl.id} className="py-2.5 flex items-center justify-between gap-3 text-xs">
                <div>
                  <p className="font-bold text-slate-800">{tpl.name}</p>
                  <p className="text-[11px] text-slate-400">
                    Status: <span className="font-semibold text-slate-700">{tpl.status}</span> · {tpl.usageCount} uses
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    communityStorage.deleteTemplate(tpl.id);
                    setMyTemplates(prev => prev.filter(t => t.id !== tpl.id));
                  }}
                  className="p-1.5 text-rose-600 hover:bg-rose-50 rounded-lg"
                  title="Delete Template"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Language & Preferences */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-2xs space-y-3">
        <h4 className="font-bold text-sm text-slate-900">
          {language === 'so' ? 'Dookhyada Luuqadda' : 'Language Preferences'}
        </h4>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setLanguage('en')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer ${
              language === 'en'
                ? 'bg-blue-600 text-white shadow-2xs'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            English
          </button>
          <button
            type="button"
            onClick={() => setLanguage('so')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer ${
              language === 'so'
                ? 'bg-blue-600 text-white shadow-2xs'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            Af Soomaali
          </button>
        </div>
      </div>

      {/* AUTHORIZED ADMIN DASHBOARD SHORTCUT (Strictly protected) */}
      {isAdmin && (
        <div className="bg-slate-900 text-white rounded-2xl p-5 shadow-lg border border-slate-800 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-400/20 text-amber-400 flex items-center justify-center">
              <Shield className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h4 className="font-black text-sm">
                  {language === 'so' ? 'Dashboard-ka Maamulka (Admin)' : 'Administrator Management'}
                </h4>
                <span className="text-[9px] font-bold uppercase tracking-wider bg-amber-400/20 text-amber-300 px-1.5 py-0.2 rounded-md">
                  Authorized
                </span>
              </div>
              <p className="text-xs text-slate-400">
                {language === 'so'
                  ? 'Anxi ama diid codsiyada creators-ka iyo templates-ka la soo gudbiyey.'
                  : 'Review creator applications, approve community templates, and manage reports.'}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onOpenAdminDashboard}
            className="px-4 py-2.5 bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold rounded-xl text-xs transition cursor-pointer whitespace-nowrap shadow-md"
          >
            {language === 'so' ? 'Fur Dashboard' : 'Open Dashboard'}
          </button>
        </div>
      )}
    </div>
  );
};
