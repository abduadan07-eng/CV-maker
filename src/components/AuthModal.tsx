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
  HelpCircle,
  ExternalLink,
  Smartphone
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

  const [authMode, setAuthMode] = useState<'google' | 'signin' | 'signup'>('google');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [showSamsungNotice, setShowSamsungNotice] = useState(false);

  if (!isAuthModalOpen) return null;

  const getFriendlyError = (err: any): string => {
    const code = err?.code || '';
    const msg = String(err?.message || '');

    if (code === 'auth/operation-not-allowed') {
      return language === 'so'
        ? 'Adeegga Email/Password weli lagama shidin Firebase Console. Tag Firebase Console ➔ Authentication ➔ Sign-in method ➔ Email/Password.'
        : 'Email/Password sign-in is not yet enabled in Firebase Console. Go to Authentication ➔ Sign-in method ➔ Email/Password.';
    }
    if (code === 'auth/unauthorized-domain' || msg.includes('unauthorized domain')) {
      return language === 'so'
        ? 'Domain-ka app-ka kuma jiro Authorized Domains ee Firebase Console. Tag Authentication ➔ Settings ➔ Authorized Domains si aad ugu darto.'
        : 'App domain is not listed in Authorized Domains in Firebase Console. Add this domain under Authentication ➔ Settings ➔ Authorized Domains.';
    }
    if (code === 'auth/invalid-credential' || code === 'auth/wrong-password') {
      return language === 'so'
        ? 'Email-ka ama Password-ka aad galisay waa khalad.'
        : 'Invalid email or password credentials.';
    }
    if (code === 'auth/user-not-found') {
      return language === 'so'
        ? 'Lama helin akoon leh email-kan. Fadlan marka hore isdiiwaangeli.'
        : 'No account found with this email. Please sign up first.';
    }
    if (code === 'auth/email-already-in-use') {
      return language === 'so'
        ? 'Email-kan hore ayaa akoon loogu furtay. Fadlan dooro Gal (Sign In).'
        : 'This email is already in use. Please select Sign In.';
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
    if (msg.includes('The requested action is invalid') || msg.includes('invalid-action-code')) {
      return language === 'so'
        ? 'Cilad: Browser-ka ayaa joojiyey popup-ka Google. Isticmaal Email & Password ama fur Google Chrome.'
        : 'Notice: Mobile browser blocked the Google popup. Please try Email & Password or switch to Chrome.';
    }
    return msg || (language === 'so' ? 'Cilad ayaa dhacday, fadlan dib u tijaabi.' : 'An error occurred, please try again.');
  };

  const handleGoogleSignIn = async (useRedirect: boolean = false) => {
    try {
      setIsSubmitting(true);
      setErrorMessage(null);
      await signInWithGoogle(useRedirect);
    } catch (err: any) {
      setErrorMessage(getFriendlyError(err));
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password) return;

    try {
      setIsSubmitting(true);
      setErrorMessage(null);

      if (authMode === 'signup') {
        await signUpWithEmail(email, password, displayName);
      } else {
        await signInWithEmail(email, password);
      }
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
      <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-100 relative max-h-[90vh] overflow-y-auto">
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
        <div className="text-center mb-6">
          <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-3 shadow-inner">
            <LogIn className="w-6 h-6" />
          </div>
          <h2 id="auth-modal-title" className="text-xl font-bold text-slate-900 tracking-tight">
            {language === 'so' ? 'Gal Akoonkaaga CV Maker' : 'Sign In to CV Maker'}
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            {language === 'so'
              ? 'Ku xiro akoon si CV-yadaada loogu kaydiyo Cloud-ka'
              : 'Connect your account to sync and backup your CVs to cloud'}
          </p>
        </div>

        {/* Tab Navigation */}
        <div className="flex bg-slate-100 p-1 rounded-2xl mb-5 text-xs font-semibold text-slate-600">
          <button
            type="button"
            onClick={() => { setAuthMode('google'); setErrorMessage(null); }}
            className={`flex-1 py-2 rounded-xl transition cursor-pointer ${
              authMode === 'google' ? 'bg-white text-blue-600 shadow-2xs font-bold' : 'hover:text-slate-900'
            }`}
          >
            Google
          </button>
          <button
            type="button"
            onClick={() => { setAuthMode('signin'); setErrorMessage(null); }}
            className={`flex-1 py-2 rounded-xl transition cursor-pointer ${
              authMode === 'signin' ? 'bg-white text-blue-600 shadow-2xs font-bold' : 'hover:text-slate-900'
            }`}
          >
            {language === 'so' ? 'Gal Email' : 'Email Login'}
          </button>
          <button
            type="button"
            onClick={() => { setAuthMode('signup'); setErrorMessage(null); }}
            className={`flex-1 py-2 rounded-xl transition cursor-pointer ${
              authMode === 'signup' ? 'bg-white text-blue-600 shadow-2xs font-bold' : 'hover:text-slate-900'
            }`}
          >
            {language === 'so' ? 'Isdiiwaangeli' : 'Sign Up'}
          </button>
        </div>

        {/* Error Alert */}
        {errorMessage && (
          <div className="mb-4 p-3 bg-rose-50 border border-rose-200 rounded-2xl text-xs text-rose-700 flex items-start gap-2.5">
            <AlertCircle className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
            <div className="flex-1 leading-relaxed">{errorMessage}</div>
          </div>
        )}

        {/* TAB 1: Google Sign In */}
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

            {/* Mobile Browser Assistance */}
            <div className="pt-2">
              <button
                type="button"
                onClick={() => setShowSamsungNotice(!showSamsungNotice)}
                className="w-full text-[11px] text-slate-500 hover:text-blue-600 flex items-center justify-center gap-1.5 cursor-pointer transition py-1"
              >
                <Smartphone className="w-3.5 h-3.5 text-blue-500" />
                <span>
                  {language === 'so'
                    ? 'Ma isticmaalaysaa Samsung Browser ama Mobile App?'
                    : 'Using Samsung Browser or Mobile APK?'}
                </span>
                <HelpCircle className="w-3 h-3 text-slate-400" />
              </button>

              {showSamsungNotice && (
                <div className="mt-2.5 p-3.5 bg-blue-50/70 border border-blue-200/60 rounded-2xl text-[11px] text-blue-900 leading-relaxed space-y-2">
                  <p className="font-semibold flex items-center gap-1.5 text-blue-800">
                    <CheckCircle2 className="w-3.5 h-3.5 text-blue-600" />
                    <span>
                      {language === 'so'
                        ? 'Haddii shaashadu ku tusto "The requested action is invalid":'
                        : 'If you see "The requested action is invalid":'}
                    </span>
                  </p>
                  <p>
                    {language === 'so'
                      ? 'Samsung Browser iyo Android WebView-yada qaar waxay xiraan popup-ka Google. Waxaad u xallin kartaa laba siyaabood:'
                      : 'Samsung Browser or Android WebViews may block Google OAuth popups. You can resolve this easily:'}
                  </p>
                  <ul className="list-disc list-inside space-y-1 pl-1 text-[11px]">
                    <li>
                      <strong>{language === 'so' ? 'Xalka 1:' : 'Solution 1:'}</strong>{' '}
                      {language === 'so'
                        ? 'Dooro tab-ka "Email Login" ee kore oo gal email iyo password.'
                        : 'Switch to the "Email Login" tab above.'}
                    </li>
                    <li>
                      <strong>{language === 'so' ? 'Xalka 2:' : 'Solution 2:'}</strong>{' '}
                      <button
                        type="button"
                        onClick={() => handleGoogleSignIn(true)}
                        className="text-blue-700 underline font-semibold hover:text-blue-900 cursor-pointer"
                      >
                        {language === 'so'
                          ? 'Guji halkan si aad Google ugu gashid Mobile Redirect'
                          : 'Click here to use Mobile Redirect Google sign-in'}
                      </button>
                    </li>
                  </ul>
                </div>
              )}
            </div>
          </div>
        )}

        {/* TAB 2 & 3: Email Sign In & Sign Up */}
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
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
                    placeholder={language === 'so' ? 'Tusaale: Axmed Cali' : 'e.g. John Doe'}
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
              <label className="block text-[11px] font-bold text-slate-700 mb-1">
                {language === 'so' ? 'Password-kaaga' : 'Password'}
              </label>
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
                <span>{language === 'so' ? 'Waa la socotaa...' : 'Processing...'}</span>
              ) : authMode === 'signup' ? (
                <>
                  <UserPlus className="w-4 h-4" />
                  <span>{language === 'so' ? 'Sameyso Akoon Cusub' : 'Create Account'}</span>
                </>
              ) : (
                <>
                  <LogIn className="w-4 h-4" />
                  <span>{language === 'so' ? 'Gal Akoonkaaga' : 'Sign In'}</span>
                </>
              )}
            </button>
          </form>
        )}

        {/* Guest Mode Callout */}
        <div className="mt-5 pt-4 border-t border-slate-100 text-center">
          <button
            type="button"
            onClick={closeAuthModal}
            className="w-full py-2.5 px-3 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-2xl text-xs font-semibold text-slate-700 transition cursor-pointer"
          >
            {language === 'so' ? 'Sii wad adigoon galin (Guest Mode)' : 'Continue as Guest (Offline Mode)'}
          </button>
          <p className="text-[10px] text-slate-400 mt-2 leading-relaxed">
            {language === 'so'
              ? '✨ Uma baahnid inaad gashid si aad CV u samaysatid ama PDF u soo degsatid. Dhammaan shaqooyinku taleefankaaga ayey ku shaqeynayaan!'
              : '✨ You do not need to sign in to create CVs or export PDFs. All features work 100% locally on your device!'}
          </p>
        </div>
      </div>
    </div>
  );
};
