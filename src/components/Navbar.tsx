import React, { useState } from 'react';
import { useLanguage } from '../i18n/LanguageContext';
import { useAuth } from '../firebase/AuthContext';
import { FileText, Globe, Home, Eye, Check, Database, Cloud, LogIn, LogOut, User as UserIcon } from 'lucide-react';

interface NavbarProps {
  activeView: 'home' | 'builder' | 'preview' | 'studio';
  onNavigate: (view: 'home' | 'builder' | 'preview' | 'studio') => void;
  draftTitle?: string;
  hasUnsavedChanges?: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeView,
  onNavigate,
  draftTitle,
  hasUnsavedChanges
}) => {
  const { language, setLanguage, t } = useLanguage();
  const { user, isCloudConnected, signInWithGoogle, signOutUser, loading: authLoading } = useAuth();
  const [isSigningIn, setIsSigningIn] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);

  const handleSignIn = async () => {
    try {
      setIsSigningIn(true);
      await signInWithGoogle();
    } catch (err) {
      console.error('Sign-in failed:', err);
    } finally {
      setIsSigningIn(false);
    }
  };

  const handleSignOut = async () => {
    try {
      await signOutUser();
      setShowUserMenu(false);
    } catch (err) {
      console.error('Sign-out failed:', err);
    }
  };

  return (
    <header className="no-print bg-white border-b border-slate-200 sticky top-0 z-30 shadow-2xs">
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between gap-3">
        {/* Brand */}
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => onNavigate('home')}
            className="flex items-center gap-2.5 text-left group cursor-pointer focus:outline-hidden"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-700 to-blue-500 text-white flex items-center justify-center shadow-sm ring-2 ring-blue-600/20 group-hover:scale-105 transition-transform">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <span className="font-extrabold text-base tracking-tight text-slate-900 block leading-tight">
                CV Maker
              </span>
              <div className="flex items-center gap-1.5">
                <span className="text-[10px] font-semibold text-blue-600 tracking-wider uppercase block">
                  Builder & Studio
                </span>
                <span className="inline-flex items-center gap-0.5 text-[9px] font-medium text-emerald-700 bg-emerald-50 px-1.5 py-0.2 rounded-full border border-emerald-200" title={t('cloudConnected')}>
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                  <Database className="w-2.5 h-2.5 text-emerald-600" />
                  <span className="hidden sm:inline">DB Active</span>
                </span>
              </div>
            </div>
          </button>

          {/* Current Active Draft Name */}
          {draftTitle && activeView !== 'home' && activeView !== 'studio' && (
            <div className="hidden md:flex items-center gap-2 pl-4 border-l border-slate-200 text-xs">
              <span className="text-slate-400">Draft:</span>
              <span className="font-semibold text-slate-800 max-w-[180px] truncate">{draftTitle}</span>
              {hasUnsavedChanges ? (
                <span className="text-[10px] text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full font-medium">
                  Unsaved changes
                </span>
              ) : (
                <span className="text-[10px] text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full font-medium flex items-center gap-0.5">
                  <Check className="w-3 h-3" /> Saved
                </span>
              )}
            </div>
          )}
        </div>

        {/* Center Navigation Shortcuts */}
        <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl">
          <button
            type="button"
            onClick={() => onNavigate('home')}
            className={`flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
              activeView === 'home'
                ? 'bg-white text-slate-900 shadow-2xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Home className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">{t('myCvsTitle')}</span>
          </button>
          <button
            type="button"
            onClick={() => onNavigate('builder')}
            className={`flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
              activeView === 'builder'
                ? 'bg-white text-slate-900 shadow-2xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <span>{t('editBtn')}</span>
          </button>
          <button
            type="button"
            onClick={() => onNavigate('preview')}
            className={`flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
              activeView === 'preview'
                ? 'bg-blue-600 text-white shadow-2xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Eye className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">{t('previewBtn')}</span>
          </button>
          <button
            type="button"
            onClick={() => onNavigate('studio')}
            className={`flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 text-xs font-bold rounded-lg transition-colors cursor-pointer ${
              activeView === 'studio'
                ? 'bg-indigo-600 text-white shadow-2xs'
                : 'text-indigo-700 hover:text-indigo-900 hover:bg-indigo-50/60'
            }`}
          >
            <span className="flex items-center gap-1">
              🎨 <span className="hidden sm:inline">{t('designStudio')}</span>
              <span className="sm:hidden">Studio</span>
            </span>
          </button>
        </div>

        {/* Right Actions: Firebase Auth & Language Switcher */}
        <div className="flex items-center gap-2">
          {/* User Profile / Google Sign-In */}
          {user ? (
            <div className="relative">
              <button
                type="button"
                onClick={() => setShowUserMenu(!showUserMenu)}
                className="flex items-center gap-2 p-1 pl-2 bg-slate-100 hover:bg-slate-200 border border-slate-200 rounded-xl text-xs font-medium text-slate-800 transition cursor-pointer"
              >
                {user.photoURL ? (
                  <img
                    src={user.photoURL}
                    alt={user.displayName || 'User'}
                    className="w-6 h-6 rounded-full object-cover ring-1 ring-blue-500"
                  />
                ) : (
                  <div className="w-6 h-6 rounded-full bg-blue-600 text-white flex items-center justify-center text-[11px] font-bold">
                    {user.email ? user.email.charAt(0).toUpperCase() : 'U'}
                  </div>
                )}
                <span className="hidden md:inline max-w-[100px] truncate font-semibold">
                  {user.displayName || user.email?.split('@')[0]}
                </span>
                <span className="w-2 h-2 rounded-full bg-emerald-500 mr-1" title="Connected to Firestore"></span>
              </button>

              {/* User Dropdown */}
              {showUserMenu && (
                <div className="absolute right-0 mt-2 w-64 bg-white border border-slate-200 rounded-2xl shadow-xl py-2 z-50 text-xs">
                  <div className="px-3 py-2 border-b border-slate-100">
                    <p className="font-bold text-slate-900 truncate">{user.displayName || 'User'}</p>
                    <p className="text-slate-500 truncate text-[11px]">{user.email}</p>
                    <div className="mt-1.5 flex items-center gap-1.5 text-[10px] text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md font-medium">
                      <Cloud className="w-3 h-3 text-emerald-600" />
                      <span>{t('cloudConnected')}</span>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={handleSignOut}
                    className="w-full text-left px-3 py-2 text-rose-600 hover:bg-rose-50 flex items-center gap-2 font-medium cursor-pointer transition"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    <span>{t('signOut')}</span>
                  </button>
                </div>
              )}
            </div>
          ) : (
            <button
              type="button"
              onClick={handleSignIn}
              disabled={isSigningIn || authLoading}
              className="flex items-center gap-1.5 bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200 px-2.5 sm:px-3 py-1.5 rounded-xl text-xs font-semibold transition cursor-pointer shadow-2xs disabled:opacity-50"
              title={t('signInToBackup')}
            >
              <LogIn className="w-3.5 h-3.5 text-blue-600" />
              <span className="hidden sm:inline">{t('signInWithGoogle')}</span>
              <span className="sm:hidden">Login</span>
            </button>
          )}

          {/* Language Selector */}
          <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl border border-slate-200">
            <Globe className="w-3.5 h-3.5 text-slate-500 ml-1.5 hidden sm:block" />
            <button
              type="button"
              onClick={() => setLanguage('en')}
              className={`px-2.5 py-1 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
                language === 'en'
                  ? 'bg-blue-600 text-white shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              EN
            </button>
            <button
              type="button"
              onClick={() => setLanguage('so')}
              className={`px-2.5 py-1 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
                language === 'so'
                  ? 'bg-blue-600 text-white shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              SO
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
