import React from 'react';
import { Home, BookOpen, Sparkles, User as UserIcon } from 'lucide-react';
import { useLanguage } from '../i18n/LanguageContext';

export type MainTab = 'home' | 'library' | 'templates' | 'me';

interface BottomNavigationProps {
  currentTab: MainTab;
  onSelectTab: (tab: MainTab) => void;
}

export const BottomNavigation: React.FC<BottomNavigationProps> = ({
  currentTab,
  onSelectTab
}) => {
  const { language } = useLanguage();

  const tabs: { id: MainTab; labelEn: string; labelSo: string; icon: React.FC<{ className?: string }> }[] = [
    {
      id: 'home',
      labelEn: 'Home',
      labelSo: 'Hoyga',
      icon: Home
    },
    {
      id: 'library',
      labelEn: 'Library',
      labelSo: 'Maktabadda',
      icon: BookOpen
    },
    {
      id: 'templates',
      labelEn: 'Templates',
      labelSo: 'Templates',
      icon: Sparkles
    },
    {
      id: 'me',
      labelEn: 'Me',
      labelSo: 'Aniga',
      icon: UserIcon
    }
  ];

  return (
    <nav
      aria-label="Bottom Navigation"
      className="no-print fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200/90 shadow-lg px-2 py-1 safe-area-pb"
    >
      <div className="max-w-md mx-auto grid grid-cols-4 gap-1">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = currentTab === tab.id;

          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => onSelectTab(tab.id)}
              className={`flex flex-col items-center justify-center py-1.5 px-1 rounded-xl transition-all cursor-pointer select-none ${
                isActive
                  ? 'text-blue-600 font-bold'
                  : 'text-slate-500 hover:text-slate-800 font-medium'
              }`}
            >
              <div
                className={`relative flex items-center justify-center w-9 h-7 rounded-lg transition-transform ${
                  isActive ? 'scale-110 bg-blue-50 text-blue-600' : ''
                }`}
              >
                <Icon className="w-5 h-5" />
              </div>
              <span className="text-[11px] leading-tight tracking-tight mt-0.5">
                {language === 'so' ? tab.labelSo : tab.labelEn}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
