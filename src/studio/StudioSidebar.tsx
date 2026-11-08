import React, { useRef, useState } from 'react';
import { StudioToolTab, StudioElement, StudioPage, ImageShape } from '../types/studio';
import { TEMPLATES_REGISTRY } from '../templates/TemplateRegistry';
import { useLanguage } from '../i18n/LanguageContext';
import {
  LayoutTemplate,
  Type,
  Square,
  Briefcase,
  Image as ImageIcon,
  Files,
  Plus,
  Trash2,
  Copy,
  Upload,
  Sparkles,
  User,
  GraduationCap,
  Wrench,
  Languages,
  Minus
} from 'lucide-react';

interface StudioSidebarProps {
  activeTab: StudioToolTab;
  onSelectTab: (tab: StudioToolTab) => void;
  onAddElement: (element: StudioElement) => void;
  pages: StudioPage[];
  activePageIndex: number;
  onSelectPage: (index: number) => void;
  onAddPage: () => void;
  onDuplicatePage: (index: number) => void;
  onDeletePage: (index: number) => void;
  onApplyTemplate: (templateId: string) => void;
}

export const StudioSidebar: React.FC<StudioSidebarProps> = ({
  activeTab,
  onSelectTab,
  onAddElement,
  pages,
  activePageIndex,
  onSelectPage,
  onAddPage,
  onDuplicatePage,
  onDeletePage,
  onApplyTemplate
}) => {
  const { t, language } = useLanguage();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [defaultImageShape, setDefaultImageShape] = useState<ImageShape>('circle');

  const makeId = (prefix: string) => `${prefix}_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;

  // Quick Text Helpers
  const addTextElement = (role: 'heading' | 'subheading' | 'body', sampleText: string, size: number, weight: any) => {
    onAddElement({
      id: makeId('text'),
      type: 'text',
      role,
      text: sampleText,
      x: 60,
      y: 120,
      width: role === 'heading' ? 500 : 400,
      height: role === 'heading' ? 44 : 28,
      zIndex: 10,
      fontFamily: 'Plus Jakarta Sans',
      fontSize: size,
      fontWeight: weight,
      fontStyle: 'normal',
      textAlign: 'left',
      color: '#0f172a'
    });
  };

  // Quick Shape Helpers
  const addShape = (shapeType: 'rectangle' | 'circle' | 'rounded-rectangle', color = '#2563eb', w = 140, h = 100) => {
    onAddElement({
      id: makeId('shape'),
      type: 'shape',
      shapeType,
      x: 100,
      y: 150,
      width: w,
      height: h,
      zIndex: 5,
      fillColor: color,
      borderRadius: shapeType === 'rounded-rectangle' ? 12 : undefined
    });
  };

  const addDivider = () => {
    onAddElement({
      id: makeId('div'),
      type: 'divider',
      x: 48,
      y: 200,
      width: 698,
      height: 2,
      zIndex: 5,
      color: '#cbd5e1',
      thickness: 2,
      style: 'solid'
    });
  };

  // Quick Image Upload
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      alert('Please upload a valid image file');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const src = event.target?.result as string;
      onAddElement({
        id: makeId('img'),
        type: 'image',
        src,
        shape: defaultImageShape,
        x: 100,
        y: 100,
        width: 120,
        height: 120,
        zIndex: 15,
        borderRadius: defaultImageShape === 'circle' ? 9999 : defaultImageShape === 'rounded' ? 18 : 0,
        borderWidth: 2,
        borderColor: '#2563eb'
      });
    };
    reader.readAsDataURL(file);
    e.target.value = '';
  };

  // Quick Resume Blocks
  const addContactBlock = () => {
    onAddElement({
      id: makeId('contact_block'),
      type: 'text',
      role: 'caption',
      text: 'name@example.com  •  +1 (555) 019-2834  •  City, Country  •  linkedin.com/in/user',
      x: 48,
      y: 110,
      width: 698,
      height: 24,
      zIndex: 10,
      fontFamily: 'Inter',
      fontSize: 11,
      fontWeight: 'normal',
      fontStyle: 'normal',
      textAlign: 'center',
      color: '#475569'
    });
  };

  const addExperienceBlock = () => {
    onAddElement({
      id: makeId('exp_block'),
      type: 'text',
      role: 'body',
      text: 'Senior Software Engineer — Tech Innovations Ltd (2021 – Present)\n• Spearheaded high-throughput microservices reducing latency by 35%.\n• Collaborated with UX squad to deliver responsive accessible customer dashboards.',
      x: 48,
      y: 240,
      width: 698,
      height: 70,
      zIndex: 10,
      fontFamily: 'Inter',
      fontSize: 11.5,
      fontWeight: 'normal',
      fontStyle: 'normal',
      textAlign: 'left',
      color: '#334155',
      lineHeight: 1.45
    });
  };

  const addEducationBlock = () => {
    onAddElement({
      id: makeId('edu_block'),
      type: 'text',
      role: 'body',
      text: 'Bachelor of Science in Computer Science — University (2017 – 2021)\nGraduated with First Class Honors, Dean’s List for academic excellence.',
      x: 48,
      y: 340,
      width: 698,
      height: 44,
      zIndex: 10,
      fontFamily: 'Inter',
      fontSize: 11.5,
      fontWeight: 'normal',
      fontStyle: 'normal',
      textAlign: 'left',
      color: '#334155'
    });
  };

  const addSkillsBlock = () => {
    onAddElement({
      id: makeId('skills_block'),
      type: 'text',
      role: 'body',
      text: 'React • TypeScript • Node.js • PostgreSQL • Cloud Architecture • Agile Leadership',
      x: 48,
      y: 410,
      width: 698,
      height: 30,
      zIndex: 10,
      fontFamily: 'Inter',
      fontSize: 11.5,
      fontWeight: 'semibold',
      fontStyle: 'normal',
      textAlign: 'left',
      color: '#1e3a8a'
    });
  };

  const tabs: { key: StudioToolTab; label: string; icon: React.FC<{ className?: string }> }[] = [
    { key: 'templates', label: t('studioTemplates'), icon: LayoutTemplate },
    { key: 'text', label: t('studioText'), icon: Type },
    { key: 'elements', label: t('studioElements'), icon: Square },
    { key: 'blocks', label: t('studioBlocks'), icon: Briefcase },
    { key: 'uploads', label: t('studioUploads'), icon: ImageIcon },
    { key: 'pages', label: t('studioPages'), icon: Files }
  ];

  return (
    <aside className="w-full md:w-80 bg-white border-r border-slate-200 flex flex-col shrink-0 shadow-xs h-auto md:h-full z-10">
      {/* Tab Navigation Strip */}
      <div className="flex border-b border-slate-200 bg-slate-50/80 overflow-x-auto scrollbar-none p-1 gap-1">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.key;
          return (
            <button
              key={tab.key}
              type="button"
              onClick={() => onSelectTab(tab.key)}
              className={`flex-1 min-w-[55px] py-2 px-1 rounded-xl flex flex-col items-center justify-center gap-1 text-[10px] font-semibold transition-all cursor-pointer ${
                isActive
                  ? 'bg-white text-blue-700 shadow-2xs border border-slate-200'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Tab Content Panel */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {/* 1. TEMPLATES */}
        {activeTab === 'templates' && (
          <div className="space-y-3">
            <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
              {t('templatesModalTitle')}
            </h3>
            <p className="text-[11px] text-slate-500">
              {t('templatesModalDesc')}
            </p>
            <div className="grid grid-cols-2 gap-2.5">
              {TEMPLATES_REGISTRY.map((tmpl) => {
                const name = language === 'so' ? tmpl.nameSo : tmpl.nameEn;
                return (
                  <button
                    key={tmpl.id}
                    type="button"
                    onClick={() => onApplyTemplate(tmpl.id)}
                    className="p-2.5 rounded-xl border border-slate-200 hover:border-blue-500 bg-slate-50/60 hover:bg-blue-50/30 text-left transition-all cursor-pointer group flex flex-col justify-between"
                  >
                    <div>
                      <div className={`w-full h-8 rounded-md mb-2 ${tmpl.accentClass}`} />
                      <span className="font-bold text-slate-800 text-xs block group-hover:text-blue-700">
                        {name}
                      </span>
                    </div>
                    <span className="text-[10px] text-blue-600 font-semibold mt-2">
                      Load Layout →
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* 2. TEXT */}
        {activeTab === 'text' && (
          <div className="space-y-3">
            <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
              {t('studioText')}
            </h3>
            <div className="space-y-2">
              <button
                type="button"
                onClick={() => addTextElement('heading', 'HEADING TITLE', 28, 'extrabold')}
                className="w-full py-3 px-4 bg-slate-100 hover:bg-slate-200 text-slate-900 rounded-xl text-left font-extrabold text-base cursor-pointer transition-colors shadow-2xs flex items-center justify-between"
              >
                <span>{t('addHeading')}</span>
                <Plus className="w-4 h-4 text-slate-500" />
              </button>

              <button
                type="button"
                onClick={() => addTextElement('subheading', 'Subheading or Job Role', 16, 'bold')}
                className="w-full py-2.5 px-4 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl text-left font-bold text-sm cursor-pointer transition-colors shadow-2xs flex items-center justify-between"
              >
                <span>{t('addSubheading')}</span>
                <Plus className="w-4 h-4 text-slate-500" />
              </button>

              <button
                type="button"
                onClick={() => addTextElement('body', 'Paragraph body text with clean description and key highlights...', 12, 'normal')}
                className="w-full py-2.5 px-4 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-left text-xs cursor-pointer transition-colors shadow-2xs flex items-center justify-between"
              >
                <span>{t('addBodyText')}</span>
                <Plus className="w-4 h-4 text-slate-500" />
              </button>

              <button
                type="button"
                onClick={() => addTextElement('body', 'Experienced specialist with a proven track record delivering strategic impact, cross-functional project execution, and sustainable organizational growth across competitive markets.', 11, 'normal')}
                className="w-full py-2.5 px-4 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-left text-xs cursor-pointer transition-colors shadow-2xs flex items-center justify-between"
              >
                <span>Add Long Paragraph</span>
                <Plus className="w-4 h-4 text-slate-500" />
              </button>
            </div>
          </div>
        )}

        {/* 3. ELEMENTS & SHAPES */}
        {activeTab === 'elements' && (
          <div className="space-y-3">
            <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
              {t('studioElements')}
            </h3>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => addShape('rectangle', '#1e3a8a', 794, 120)}
                className="p-3 bg-slate-50 border border-slate-200 rounded-xl hover:border-blue-400 cursor-pointer text-left flex flex-col items-center justify-center gap-1.5"
              >
                <div className="w-16 h-8 bg-blue-900 rounded-xs" />
                <span className="text-[11px] font-semibold text-slate-700">Header Banner</span>
              </button>

              <button
                type="button"
                onClick={() => addShape('rounded-rectangle', '#f1f5f9', 200, 100)}
                className="p-3 bg-slate-50 border border-slate-200 rounded-xl hover:border-blue-400 cursor-pointer text-left flex flex-col items-center justify-center gap-1.5"
              >
                <div className="w-14 h-8 bg-slate-300 rounded-lg" />
                <span className="text-[11px] font-semibold text-slate-700">{t('addRectangle')}</span>
              </button>

              <button
                type="button"
                onClick={() => addShape('circle', '#2563eb', 100, 100)}
                className="p-3 bg-slate-50 border border-slate-200 rounded-xl hover:border-blue-400 cursor-pointer text-left flex flex-col items-center justify-center gap-1.5"
              >
                <div className="w-9 h-9 bg-blue-600 rounded-full" />
                <span className="text-[11px] font-semibold text-slate-700">{t('addCircle')}</span>
              </button>

              <button
                type="button"
                onClick={addDivider}
                className="p-3 bg-slate-50 border border-slate-200 rounded-xl hover:border-blue-400 cursor-pointer text-left flex flex-col items-center justify-center gap-1.5"
              >
                <div className="w-14 h-0.5 bg-slate-400 my-4" />
                <span className="text-[11px] font-semibold text-slate-700">{t('addLine')}</span>
              </button>
            </div>

            {/* Quick Resume Icons */}
            <div className="pt-2 border-t border-slate-100">
              <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-2">
                Resume Icons
              </span>
              <div className="grid grid-cols-4 gap-1.5">
                {[
                  { label: 'Phone', icon: '📞' },
                  { label: 'Email', icon: '✉️' },
                  { label: 'Location', icon: '📍' },
                  { label: 'Web', icon: '🌐' },
                  { label: 'LinkedIn', icon: '💼' },
                  { label: 'Award', icon: '🏆' },
                  { label: 'Degree', icon: '🎓' },
                  { label: 'Check', icon: '✓' }
                ].map(item => (
                  <button
                    key={item.label}
                    type="button"
                    onClick={() => addTextElement('body', item.icon, 20, 'normal')}
                    className="p-2 bg-slate-50 border border-slate-200 rounded-lg hover:bg-blue-50 text-base text-center cursor-pointer transition"
                    title={item.label}
                  >
                    {item.icon}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* 4. RESUME BLOCKS */}
        {activeTab === 'blocks' && (
          <div className="space-y-3">
            <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
              {t('studioBlocks')}
            </h3>
            <div className="space-y-2">
              <button
                type="button"
                onClick={addContactBlock}
                className="w-full p-2.5 bg-slate-50 border border-slate-200 hover:border-blue-400 rounded-xl text-left cursor-pointer flex items-center gap-2.5 transition-colors"
              >
                <User className="w-4 h-4 text-blue-600 shrink-0" />
                <div>
                  <span className="text-xs font-bold text-slate-800 block">{t('blockContact')}</span>
                  <span className="text-[10px] text-slate-500">Email, phone, location strip</span>
                </div>
              </button>

              <button
                type="button"
                onClick={addExperienceBlock}
                className="w-full p-2.5 bg-slate-50 border border-slate-200 hover:border-blue-400 rounded-xl text-left cursor-pointer flex items-center gap-2.5 transition-colors"
              >
                <Briefcase className="w-4 h-4 text-blue-600 shrink-0" />
                <div>
                  <span className="text-xs font-bold text-slate-800 block">{t('blockExperience')}</span>
                  <span className="text-[10px] text-slate-500">Role, company, dates and bullet points</span>
                </div>
              </button>

              <button
                type="button"
                onClick={addEducationBlock}
                className="w-full p-2.5 bg-slate-50 border border-slate-200 hover:border-blue-400 rounded-xl text-left cursor-pointer flex items-center gap-2.5 transition-colors"
              >
                <GraduationCap className="w-4 h-4 text-blue-600 shrink-0" />
                <div>
                  <span className="text-xs font-bold text-slate-800 block">{t('blockEducation')}</span>
                  <span className="text-[10px] text-slate-500">Degree, institution, and achievements</span>
                </div>
              </button>

              <button
                type="button"
                onClick={addSkillsBlock}
                className="w-full p-2.5 bg-slate-50 border border-slate-200 hover:border-blue-400 rounded-xl text-left cursor-pointer flex items-center gap-2.5 transition-colors"
              >
                <Wrench className="w-4 h-4 text-blue-600 shrink-0" />
                <div>
                  <span className="text-xs font-bold text-slate-800 block">{t('blockSkills')}</span>
                  <span className="text-[10px] text-slate-500">Formatted competencies list</span>
                </div>
              </button>
            </div>
          </div>
        )}

        {/* 5. UPLOADS */}
        {activeTab === 'uploads' && (
          <div className="space-y-4">
            <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
              {t('studioUploads')}
            </h3>

            {/* Shape selection before/after upload */}
            <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
              <label className="text-[11px] font-bold text-slate-700 block mb-2">
                {t('photoShapeLabel')}:
              </label>
              <div className="grid grid-cols-3 gap-1.5">
                {[
                  { shape: 'circle', label: t('photoShapeCircle'), icon: '●' },
                  { shape: 'rounded', label: t('photoShapeRounded'), icon: '■' },
                  { shape: 'rectangle', label: t('photoShapeSquare'), icon: '■' },
                  { shape: 'oval', label: t('photoShapeOval'), icon: '0' },
                  { shape: 'hexagon', label: t('photoShapeHexagon'), icon: '⬡' },
                  { shape: 'badge', label: t('photoShapeBadge'), icon: '🛡' }
                ].map((item) => (
                  <button
                    key={item.shape}
                    type="button"
                    onClick={() => setDefaultImageShape(item.shape as any)}
                    className={`py-1.5 px-2 rounded-lg border text-[10px] font-semibold flex items-center justify-center gap-1 cursor-pointer transition-colors ${
                      defaultImageShape === item.shape
                        ? 'bg-blue-600 border-blue-600 text-white'
                        : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    <span>{item.icon}</span>
                    <span className="truncate">{item.label}</span>
                  </button>
                ))}
              </div>
            </div>

            <input
              type="file"
              ref={fileInputRef}
              accept="image/*"
              onChange={handleImageUpload}
              className="hidden"
              id="studio-file-upload"
            />
            <label
              htmlFor="studio-file-upload"
              className="w-full py-6 border-2 border-dashed border-blue-300 hover:border-blue-500 bg-blue-50/40 rounded-2xl flex flex-col items-center justify-center gap-2 cursor-pointer transition-colors"
            >
              <Upload className="w-6 h-6 text-blue-600" />
              <span className="text-xs font-bold text-blue-900">Upload Image / Photo</span>
              <span className="text-[10px] text-slate-500">Will be added in selected shape</span>
            </label>
          </div>
        )}

        {/* 6. PAGES */}
        {activeTab === 'pages' && (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                {t('studioPages')} ({pages.length})
              </h3>
              <button
                type="button"
                onClick={onAddPage}
                className="inline-flex items-center gap-1 text-[11px] font-bold text-blue-600 hover:text-blue-800 cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                {t('addPageBtn')}
              </button>
            </div>

            <div className="space-y-2">
              {pages.map((p, idx) => {
                const isCurrent = idx === activePageIndex;
                return (
                  <div
                    key={p.id}
                    onClick={() => onSelectPage(idx)}
                    className={`p-3 rounded-xl border flex items-center justify-between gap-2 cursor-pointer transition-all ${
                      isCurrent
                        ? 'border-blue-600 bg-blue-50/50 shadow-2xs'
                        : 'border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <span className="w-6 h-6 rounded-full bg-slate-200 text-slate-700 text-xs font-bold flex items-center justify-center">
                        {idx + 1}
                      </span>
                      <span className="text-xs font-semibold text-slate-800">
                        {t('pageLabel')} {idx + 1}
                      </span>
                    </div>

                    <div className="flex items-center gap-1" onClick={(e) => e.stopPropagation()}>
                      <button
                        type="button"
                        onClick={() => onDuplicatePage(idx)}
                        title={t('duplicatePageBtn')}
                        className="p-1 text-slate-400 hover:text-slate-700 cursor-pointer"
                      >
                        <Copy className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => onDeletePage(idx)}
                        title={t('deletePageBtn')}
                        className="p-1 text-red-500 hover:text-red-700 cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </aside>
  );
};
