import React, { useState, useEffect } from 'react';
import { useLanguage } from '../i18n/LanguageContext';
import { Edit2, X } from 'lucide-react';

interface RenameDraftModalProps {
  isOpen: boolean;
  currentTitle: string;
  onRename: (newTitle: string) => void;
  onCancel: () => void;
}

export const RenameDraftModal: React.FC<RenameDraftModalProps> = ({
  isOpen,
  currentTitle,
  onRename,
  onCancel
}) => {
  const { t } = useLanguage();
  const [title, setTitle] = useState(currentTitle);

  useEffect(() => {
    setTitle(currentTitle);
  }, [currentTitle, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (title.trim()) {
      onRename(title.trim());
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
              <Edit2 className="w-4 h-4" />
            </div>
            <h3 className="text-sm font-bold text-slate-900">{t('renameModalTitle')}</h3>
          </div>
          <button
            type="button"
            onClick={onCancel}
            className="text-slate-400 hover:text-slate-600 p-1 cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-4 space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Title
            </label>
            <input
              type="text"
              autoFocus
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder={t('newTitlePlaceholder')}
              className="w-full px-3.5 py-2.5 bg-white border border-slate-300 rounded-xl text-xs text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={onCancel}
              className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold cursor-pointer"
            >
              {t('cancelBtn')}
            </button>
            <button
              type="submit"
              disabled={!title.trim()}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white rounded-xl text-xs font-semibold cursor-pointer shadow-xs"
            >
              {t('saveBtn')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
