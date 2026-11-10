import React, { useState } from 'react';
import {
  X,
  Mail,
  Lock,
  User as UserIcon,
  LogIn,
  UserPlus,
  AlertCircle,
  CheckCircle2,
  Smartphone,
  ShieldCheck,
  Sparkles
} from 'lucide-react';
import { useAuth } from '../firebase/AuthContext';
import { useLanguage } from '../i18n/LanguageContext';

export const AuthModal: React.FC = () => {
  const {
    isAuthModalOpen,
    closeAuthModal,
    signInWithGoogle,
    signInWithEmail,
    signUpWithEmail
  } = useAuth();
  const { language } = useLanguage();

  const [authMode, setAuthMode] = useState<'signin' | 'signup' | 'google'>('signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  if (!isAuthModalOpen) return null;

  const getFriendlyError = (err: any): string => {
    const code = err?.code || '';
    const msg = String(err?.message || '');

    if (code === 'auth/wrong-password' || code === 'auth/invalid-credential' || msg.includes('khalad')) {
      return language === 'so'
        ? 'Email-ka ama Password-ka aad galisay waa khalad.'
        : 'Invalid email or password credentials.';
    }
    if (code === 'auth/user-not-found' || msg.includes('Lama helin akoon')) {
      return language === 'so'
        ? 'Lama helin akoon leh email-kan. Fadlan marka hore guji "Isdiiwaangeli" si aad akoon cusub u sameysatid.'
        : 'No account found with this email. Please switch to "Sign Up" to create an account.';
    }
    if (code === 'auth/email-already-in-use' || msg.includes('hore ayaa loo isticmaalay')) {
      return language === 'so'
        ? 'Email-kan hore ayaa akoon loogu furtay. Fadlan guji "Gal Akoon" oo gali password-kaaga.'
        : 'This email is already in use. Please switch to "Sign In" and enter your password.';
    }
    if (code === 'auth/weak-password') {
      return language === 'so'
        ? 'Password-ku waa inuu ka koobnaadaa ugu yaraan 6 xaraf.'
        : 'Password must be at least 6 characters.';
    }
    if (code === 'auth/invalid-email') {
      return language === 'so'
        ? 'Email-ka aad qortay sax ma aha.'
        : 'Please enter a valid email address.';
    }
    if (msg.includes('The requested action is invalid') || msg.includes('invalid-action-code') || msg.includes('popup-blocked')) {
      return language === 'so'
        ? 'Mobile browser-ka ama taleefankaagu wuxuu xiray popup-ka Google. Fadlan si toos ah u isticmaal Email & Password.'
        : 'Mobile browser blocked Google popup. Please use Email & Password instead.';
    }
    return msg || (language === 'so' ? 'Cilad ayaa dhacday, fadlan dib u tijaabi.' : 'An error occurred, please try again.');
  };

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password) return;

    try {
      setIsSubmitting(true);
      setErrorMessage(null);
      setSuccessMessage(null);

      if (authMode === 'signup') {
        await signUpWithEmail(email, password, displayName);
        setSuccessMessage(language === 'so' ? 'Akoonkaaga si guul leh ayaa loo sameeyey!' : 'Account created successfully!');
      } else {
        await signInWithEmail(email, password);
        setSuccessMessage(language === 'so' ? 'Si guul leh ayaad u gashay!' : 'Signed in successfully!');
      }
    } catch (err: any) {
      setErrorMessage(getFriendlyError(err));
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGoogleSignIn = async (useRedirect: boolean = false) => {
    try {
      setIsSubmitting(true);
      setErrorMessage(null);
      setSuccessMessage(null);
      await signInWithGoogle(useRedirect);
    } catch (err: any) {
      setErrorMessage(getFriendlyError(err));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="auth-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs animate-in fade-in duration-200"
    >
      <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-100 relative max-h-[92vh] overflow-y-auto">
        {/* Close Button */}
        <button
          type="button"
          onClick={closeAuthModal}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-full transition cursor-pointer"
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="text-center mb-5">
          <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-3 shadow-inner">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <h2 id="auth-modal-title" className="text-xl font-bold text-slate-900 tracking-tight flex items-center justify-center gap-1.5">
            <span>{language === 'so' ? 'Gal Akoonkaaga' : 'Account Sign In'}</span>
            <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full">
              {language === 'so' ? 'Rasmi' : 'Official'}
            </span>
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            {language === 'so'
              ? 'Gali email-kaaga iyo password-kaaga si CV-yadaadu u kaydsanaadaan'
              : 'Enter your email and password to sync and backup your CVs'}
          </p>
        </div>

        {/* Mode Selector Tabs */}
        <div className="flex bg-slate-100 p-1 rounded-2xl mb-5 text-xs font-semibold text-slate-600">
          <button
            type="button"
            onClick={() => { setAuthMode('signin'); setErrorMessage(null); setSuccessMessage(null); }}
            className={`flex-1 py-2 rounded-xl transition cursor-pointer flex items-center justify-center gap-1 ${
              authMode === 'signin' ? 'bg-white text-blue-600 shadow-2xs font-bold' : 'hover:text-slate-900'
            }`}
          >
            <LogIn className="w-3.5 h-3.5" />
            <span>{language === 'so' ? 'Gal Akoon' : 'Sign In'}</span>
          </button>

          <button
            type="button"
            onClick={() => { setAuthMode('signup'); setErrorMessage(null); setSuccessMessage(null); }}
            className={`flex-1 py-2 rounded-xl transition cursor-pointer flex items-center justify-center gap-1 ${
              authMode === 'signup' ? 'bg-white text-blue-600 shadow-2xs font-bold' : 'hover:text-slate-900'
            }`}
          >
            <UserPlus className="w-3.5 h-3.5" />
            <span>{language === 'so' ? 'Isdiiwaangeli' : 'Sign Up'}</span>
          </button>

          <button
            type="button"
            onClick={() => { setAuthMode('google'); setErrorMessage(null); setSuccessMessage(null); }}
            className={`py-2 px-3 rounded-xl transition cursor-pointer flex items-center justify-center gap-1 text-[11px] ${
              authMode === 'google' ? 'bg-white text-blue-600 shadow-2xs font-bold' : 'hover:text-slate-900'
            }`}
          >
            Google
          </button>
        </div>

        {/* Success Alert */}
        {successMessage && (
          <div className="mb-4 p-3 bg-emerald-50 border border-emerald-200 rounded-2xl text-xs text-emerald-800 flex items-center gap-2.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <div className="flex-1 font-medium">{successMessage}</div>
          </div>
        )}

        {/* Error Alert */}
        {errorMessage && (
          <div className="mb-4 p-3 bg-rose-50 border border-rose-200 rounded-2xl text-xs text-rose-700 flex items-start gap-2.5">
            <AlertCircle className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
            <div className="flex-1 leading-relaxed">{errorMessage}</div>
          </div>
        )}

        {/* SIGN IN & SIGN UP FORM */}
        {(authMode === 'signin' || authMode === 'signup') && (
          <form onSubmit={handleEmailSubmit} className="space-y-3.5">
            {authMode === 'signup' && (
              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">
                  {language === 'so' ? 'Magacaaga oo buuxa' : 'Full Name'}
                </label>
                <div className="relative">
                  <UserIcon className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    required
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
                    placeholder={language === 'so' ? 'Tusaale: Axmed Cabdi' : 'e.g. Alex Johnson'}
                    className="w-full pl-10 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition"
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block text-[11px] font-bold text-slate-700 mb-1">
                {language === 'so' ? 'Email-kaaga' : 'Email Address'}
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="tusaale@gmail.com"
                  className="w-full pl-10 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-[11px] font-bold text-slate-700">
                  {language === 'so' ? 'Password-kaaga' : 'Password'}
                </label>
                <span className="text-[10px] text-slate-400">
                  {language === 'so' ? 'Ugu yaraan 6 xaraf' : 'Min 6 chars'}
                </span>
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  required
                  minLength={6}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl font-bold text-xs flex items-center justify-center gap-2 transition cursor-pointer shadow-md shadow-blue-500/20 disabled:opacity-50"
            >
              {isSubmitting ? (
                <span>{language === 'so' ? 'Waa la xaqiijinayaa...' : 'Verifying...'}</span>
              ) : authMode === 'signup' ? (
                <>
                  <UserPlus className="w-4 h-4" />
                  <span>{language === 'so' ? 'Sameyso Akoonkaaga' : 'Create My Account'}</span>
                </>
              ) : (
                <>
                  <LogIn className="w-4 h-4" />
                  <span>{language === 'so' ? 'Gal Akoonkaaga' : 'Sign In'}</span>
                </>
              )}
            </button>

            {/* Quick Switch Link */}
            <div className="text-center pt-1">
              {authMode === 'signin' ? (
                <button
                  type="button"
                  onClick={() => { setAuthMode('signup'); setErrorMessage(null); }}
                  className="text-[11px] text-blue-600 hover:underline font-semibold cursor-pointer"
                >
                  {language === 'so'
                    ? 'Miyaadan lahayn akoon? Guji halkan si aad isu diiwaangelisid.'
                    : "Don't have an account? Click here to sign up."}
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => { setAuthMode('signin'); setErrorMessage(null); }}
                  className="text-[11px] text-blue-600 hover:underline font-semibold cursor-pointer"
                >
                  {language === 'so'
                    ? 'Hore ma u leedahay akoon? Guji halkan si aad u gashid.'
                    : 'Already have an account? Click here to sign in.'}
                </button>
              )}
            </div>
          </form>
        )}

        {/* GOOGLE SIGN IN TAB */}
        {authMode === 'google' && (
          <div className="space-y-4">
            <button
              type="button"
              disabled={isSubmitting}
              onClick={() => handleGoogleSignIn(false)}
              className="w-full py-3 px-4 bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 hover:border-slate-400 rounded-2xl font-semibold text-sm flex items-center justify-center gap-3 transition cursor-pointer shadow-2xs disabled:opacity-50"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                />
              </svg>
              <span>{isSubmitting ? (language === 'so' ? 'Waa la xaqiijinayaa...' : 'Signing in...') : (language === 'so' ? 'Ku Gal Google' : 'Sign in with Google')}</span>
            </button>

            <div className="p-3 bg-amber-50/80 border border-amber-200 rounded-2xl text-[11px] text-amber-900 leading-relaxed flex items-start gap-2">
              <Smartphone className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
              <div>
                <strong>{language === 'so' ? 'Talo muhiim ah:' : 'Mobile Tip:'}</strong>{' '}
                {language === 'so'
                  ? 'Gudaha APK-ga iyo Samsung Browser-ka, Google inta badan wuu xiraa popup-ka. Waxaa 100% lagu taliyaa inaad isticmaasho tab-ka "Gal Akoon" oo aad ku gashid Email & Password.'
                  : 'Inside Android APKs or Samsung Browser, popups are frequently blocked. We strongly recommend using the "Sign In" tab with Email & Password.'}
              </div>
            </div>
          </div>
        )}

        {/* GUEST MODE - 100% FUNCTIONAL */}
        <div className="mt-5 pt-4 border-t border-slate-100 text-center">
          <button
            type="button"
            onClick={closeAuthModal}
            className="w-full py-2.5 px-3 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-2xl text-xs font-semibold text-slate-700 transition cursor-pointer flex items-center justify-center gap-1.5"
          >
            <Sparkles className="w-3.5 h-3.5 text-blue-500" />
            <span>{language === 'so' ? 'Sii wad bilaa Akoon (Guest Mode)' : 'Continue as Guest'}</span>
          </button>
          <p className="text-[10px] text-slate-400 mt-2 leading-relaxed">
            {language === 'so'
              ? 'CV Maker wuxuu si buuxda ugu shaqeynayaa taleefankaaga adigoon wax akoon ah galin!'
              : 'All CV Maker features work completely locally on your device without signing in!'}
          </p>
        </div>
      </div>
    </div>
  );
};
