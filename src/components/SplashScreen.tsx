import React, { useEffect, useState } from 'react';
import { FileText, Sparkles } from 'lucide-react';
import { useLanguage } from '../i18n/LanguageContext';

interface SplashScreenProps {
  onDismiss: () => void;
}

export const SplashScreen: React.FC<SplashScreenProps> = ({ onDismiss }) => {
  const { t, language } = useLanguage();
  const [fading, setFading] = useState(false);

  useEffect(() => {
    // Show splash for 1.4s then smoothly fade out
    const timer = setTimeout(() => {
      setFading(true);
      setTimeout(() => {
        onDismiss();
      }, 350);
    }, 1400);

    return () => clearTimeout(timer);
  }, [onDismiss]);

  return (
    <div
      onClick={() => {
        setFading(true);
        setTimeout(onDismiss, 200);
      }}
      className={`fixed inset-0 z-50 flex flex-col items-center justify-center bg-gradient-to-b from-slate-950 via-blue-950 to-slate-900 text-white transition-opacity duration-300 cursor-pointer ${
        fading ? 'opacity-0 pointer-events-none' : 'opacity-100'
      }`}
    >
      <div className="flex flex-col items-center space-y-6 px-6 text-center animate-in fade-in zoom-in-95 duration-500">
        {/* Animated Brand Icon */}
        <div className="relative">
          <div className="w-20 h-20 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-500 flex items-center justify-center shadow-2xl shadow-blue-500/30 ring-4 ring-white/10 animate-pulse">
            <FileText className="w-10 h-10 text-white" />
          </div>
          <div className="absolute -top-1 -right-1 w-6 h-6 rounded-full bg-amber-400 text-slate-900 flex items-center justify-center shadow-md">
            <Sparkles className="w-3.5 h-3.5 text-slate-950" />
          </div>
        </div>

        {/* Title & Tagline */}
        <div className="space-y-1.5">
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white">
            CV Maker
          </h1>
          <p className="text-xs sm:text-sm font-medium text-blue-200/90 tracking-wide">
            {language === 'so'
              ? 'Dhismaha CV-yada Xirfadeed & Naqshadda Studio'
              : 'Professional CV Builder & Design Studio'}
          </p>
        </div>

        {/* Smooth Loader Bar */}
        <div className="w-48 h-1 bg-white/10 rounded-full overflow-hidden mt-4">
          <div className="w-full h-full bg-blue-500 rounded-full origin-left animate-[marquee_1.4s_ease-in-out_infinite]" />
        </div>

        <p className="text-[11px] text-slate-400 font-mono tracking-wider pt-2">
          {language === 'so' ? 'Fadlan sug... waan diyaarinaynaa' : 'Loading workspace...'}
        </p>
      </div>
    </div>
  );
};
