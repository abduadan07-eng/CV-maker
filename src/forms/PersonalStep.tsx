import React, { useRef } from 'react';
import { PersonalInfo } from '../types/cv';
import { useLanguage } from '../i18n/LanguageContext';
import { CVProfilePhoto } from '../components/CVProfilePhoto';
import { Camera, Trash2, Sparkles, User, Mail, Phone, MapPin, Globe, Linkedin, AlertCircle } from 'lucide-react';

interface PersonalStepProps {
  data: PersonalInfo;
  onChange: (updated: PersonalInfo) => void;
  errors: { fullName?: string; email?: string; jobTitle?: string };
}

export const PersonalStep: React.FC<PersonalStepProps> = ({ data, onChange, errors }) => {
  const { t, language } = useLanguage();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFieldChange = (field: keyof PersonalInfo, value: string) => {
    onChange({
      ...data,
      [field]: value
    });
  };

  // Safe client-side image compression to ~200x200 data URL
  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      alert('Please select a valid image file');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const maxDim = 300;
        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > maxDim) {
            height = Math.round((height * maxDim) / width);
            width = maxDim;
          }
        } else {
          if (height > maxDim) {
            width = Math.round((width * maxDim) / height);
            height = maxDim;
          }
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.drawImage(img, 0, 0, width, height);
          const compressedDataUrl = canvas.toDataURL('image/jpeg', 0.85);
          handleFieldChange('photoUrl', compressedDataUrl);
        }
      };
      if (typeof event.target?.result === 'string') {
        img.src = event.target.result;
      }
    };
    reader.readAsDataURL(file);
  };

  const removePhoto = () => {
    handleFieldChange('photoUrl', '');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const summaryPrompts = language === 'so' ? [
    {
      title: 'Khibrad Leh (Experienced)',
      text: 'Xirfadle khibrad sare u leh [Magaca Shaqada] oo leh in ka badan [X] sano oo waayo-aragnimo ah. Ku xeeldheer gaarista natiijooyin wax ku ool ah, maamulka kooxaha, iyo horumarinta nidaamyada shaqada si hufan.'
    },
    {
      title: 'Arday / Hadda Qalin-jabiyey (Graduate)',
      text: 'Arday firfircoon oo hadda ka qalin-jabiyey [Takhasuska], leh aqoon qoto dheer iyo xiiso weyn u qaba barashada iyo ku dhaqanka farsamooyinka casriga ah. Diyaar u ah inuu wax ku biiriyo koox horumar doon ah.'
    },
    {
      title: 'Farsamo & Teknooloji (Tech & IT)',
      text: 'Injineer software oo xalliya dhibaatooyinka adag, khibrad u leh dhisidda barnaamijyo casri ah, maamulka xogta, iyo la shaqeynta kooxo kala duwan si loo gaaro yoolalka ganacsiga.'
    }
  ] : [
    {
      title: 'Experienced Professional',
      text: 'Results-driven and seasoned professional with 5+ years of experience delivering impactful solutions in fast-paced environments. Recognized for strong analytical thinking, leadership, and operational excellence.'
    },
    {
      title: 'Recent Graduate / Entry Level',
      text: 'Ambitious and detail-oriented graduate with a strong educational background in related fields. Eager to leverage foundational skills, adapt quickly, and contribute enthusiasm and fresh perspectives to the team.'
    },
    {
      title: 'Technical & Engineering',
      text: 'Analytical software practitioner specializing in scalable architecture and modern engineering workflows. Proven track record of optimizing performance and collaborating effectively across multidisciplinary squads.'
    }
  ];

  return (
    <div className="space-y-6">
      {/* Title & Description */}
      <div>
        <h2 className="text-xl font-bold text-slate-900">{t('personalTitle')}</h2>
        <p className="text-xs text-slate-500 mt-1">{t('personalSubtitle')}</p>
      </div>

      {/* Photo Uploader Card */}
      <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-4 sm:p-5">
        <div className="flex flex-col sm:flex-row items-center gap-5">
          <div className="relative group shrink-0">
            {data.photoUrl ? (
              <CVProfilePhoto
                photoUrl={data.photoUrl}
                alt={data.fullName || 'Candidate'}
                shape={data.photoShape || 'circle'}
                border={data.photoBorder || 'accent'}
                className="w-24 h-24"
              />
            ) : (
              <div
                className="w-24 h-24 bg-slate-200 border-2 border-dashed border-slate-300 flex flex-col items-center justify-center text-slate-400"
                style={{
                  borderRadius: (data.photoShape || 'circle') === 'circle' ? '9999px' : (data.photoShape || 'circle') === 'rounded' ? '1rem' : (data.photoShape || 'circle') === 'oval' ? '50% / 40%' : '0px',
                  clipPath: (data.photoShape || 'circle') === 'hexagon'
                    ? 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)'
                    : (data.photoShape || 'circle') === 'badge'
                    ? 'polygon(0% 0%, 100% 0%, 100% 70%, 50% 100%, 0% 70%)'
                    : undefined
                }}
              >
                <User className="w-8 h-8" />
                <span className="text-[10px] mt-1 font-medium">Photo</span>
              </div>
            )}
          </div>

          <div className="flex-1 text-center sm:text-left space-y-2">
            <h3 className="text-sm font-semibold text-slate-800">{t('photoUploadTitle')}</h3>
            <p className="text-xs text-slate-500">{t('photoUploadHint')}</p>
            <div className="flex flex-wrap gap-2 justify-center sm:justify-start pt-1">
              <input
                type="file"
                ref={fileInputRef}
                accept="image/*"
                onChange={handlePhotoUpload}
                className="hidden"
                id="cv-photo-file-input"
              />
              <label
                htmlFor="cv-photo-file-input"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold cursor-pointer transition-colors shadow-xs"
              >
                <Camera className="w-3.5 h-3.5" />
                {data.photoUrl ? t('changePhoto') : t('uploadPhotoBtn')}
              </label>
              {data.photoUrl && (
                <button
                  type="button"
                  onClick={removePhoto}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-red-50 hover:bg-red-100 text-red-600 rounded-lg text-xs font-medium cursor-pointer transition-colors"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  {t('removePhoto')}
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Photo Shape & Style Selector (Circle, Rounded, Square, Oval, Hexagon, Badge) */}
        <div className="mt-4 pt-4 border-t border-slate-200/80">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
              <span>{t('photoShapeLabel')}</span>
              <span className="text-[10px] text-blue-600 font-semibold bg-blue-50 px-2 py-0.5 rounded-full">
                {t(`photoShape${((data.photoShape || 'circle').charAt(0).toUpperCase() + (data.photoShape || 'circle').slice(1))}` as any) || data.photoShape || 'Circle'}
              </span>
            </span>
          </div>

          {/* Shape Option Buttons */}
          <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
            {/* 1. Circle */}
            <button
              type="button"
              onClick={() => handleFieldChange('photoShape', 'circle')}
              className={`p-2 rounded-xl border text-xs font-semibold flex flex-col items-center gap-1.5 transition-all cursor-pointer ${
                (data.photoShape || 'circle') === 'circle'
                  ? 'border-blue-600 bg-blue-50/80 text-blue-700 shadow-2xs'
                  : 'border-slate-200 bg-white hover:border-slate-300 text-slate-700'
              }`}
            >
              <div className="w-7 h-7 rounded-full bg-blue-600/20 border-2 border-blue-600 flex items-center justify-center text-[10px]">
                ●
              </div>
              <span className="text-[11px] leading-tight">{t('photoShapeCircle')}</span>
            </button>

            {/* 2. Rounded (Squircle) */}
            <button
              type="button"
              onClick={() => handleFieldChange('photoShape', 'rounded')}
              className={`p-2 rounded-xl border text-xs font-semibold flex flex-col items-center gap-1.5 transition-all cursor-pointer ${
                data.photoShape === 'rounded'
                  ? 'border-blue-600 bg-blue-50/80 text-blue-700 shadow-2xs'
                  : 'border-slate-200 bg-white hover:border-slate-300 text-slate-700'
              }`}
            >
              <div className="w-7 h-7 rounded-xl bg-blue-600/20 border-2 border-blue-600 flex items-center justify-center text-[10px]">
                ■
              </div>
              <span className="text-[11px] leading-tight">{t('photoShapeRounded')}</span>
            </button>

            {/* 3. Square */}
            <button
              type="button"
              onClick={() => handleFieldChange('photoShape', 'square')}
              className={`p-2 rounded-xl border text-xs font-semibold flex flex-col items-center gap-1.5 transition-all cursor-pointer ${
                data.photoShape === 'square'
                  ? 'border-blue-600 bg-blue-50/80 text-blue-700 shadow-2xs'
                  : 'border-slate-200 bg-white hover:border-slate-300 text-slate-700'
              }`}
            >
              <div className="w-7 h-7 rounded-none bg-blue-600/20 border-2 border-blue-600 flex items-center justify-center text-[10px]">
                ■
              </div>
              <span className="text-[11px] leading-tight">{t('photoShapeSquare')}</span>
            </button>

            {/* 4. Oval */}
            <button
              type="button"
              onClick={() => handleFieldChange('photoShape', 'oval')}
              className={`p-2 rounded-xl border text-xs font-semibold flex flex-col items-center gap-1.5 transition-all cursor-pointer ${
                data.photoShape === 'oval'
                  ? 'border-blue-600 bg-blue-50/80 text-blue-700 shadow-2xs'
                  : 'border-slate-200 bg-white hover:border-slate-300 text-slate-700'
              }`}
            >
              <div
                className="w-6 h-7 bg-blue-600/20 border-2 border-blue-600 flex items-center justify-center text-[10px]"
                style={{ borderRadius: '50% / 40%' }}
              >
                0
              </div>
              <span className="text-[11px] leading-tight">{t('photoShapeOval')}</span>
            </button>

            {/* 5. Hexagon */}
            <button
              type="button"
              onClick={() => handleFieldChange('photoShape', 'hexagon')}
              className={`p-2 rounded-xl border text-xs font-semibold flex flex-col items-center gap-1.5 transition-all cursor-pointer ${
                data.photoShape === 'hexagon'
                  ? 'border-blue-600 bg-blue-50/80 text-blue-700 shadow-2xs'
                  : 'border-slate-200 bg-white hover:border-slate-300 text-slate-700'
              }`}
            >
              <div
                className="w-7 h-7 bg-blue-600/30 flex items-center justify-center text-[9px] font-bold text-blue-800"
                style={{ clipPath: 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)' }}
              >
                ⬡
              </div>
              <span className="text-[11px] leading-tight">{t('photoShapeHexagon')}</span>
            </button>

            {/* 6. Badge */}
            <button
              type="button"
              onClick={() => handleFieldChange('photoShape', 'badge')}
              className={`p-2 rounded-xl border text-xs font-semibold flex flex-col items-center gap-1.5 transition-all cursor-pointer ${
                data.photoShape === 'badge'
                  ? 'border-blue-600 bg-blue-50/80 text-blue-700 shadow-2xs'
                  : 'border-slate-200 bg-white hover:border-slate-300 text-slate-700'
              }`}
            >
              <div
                className="w-6 h-7 bg-blue-600/30 flex items-center justify-center text-[9px] font-bold text-blue-800"
                style={{ clipPath: 'polygon(0% 0%, 100% 0%, 100% 70%, 50% 100%, 0% 70%)' }}
              >
                🛡
              </div>
              <span className="text-[11px] leading-tight">{t('photoShapeBadge')}</span>
            </button>
          </div>

          {/* Border Styles */}
          <div className="mt-3 flex flex-wrap items-center gap-2">
            <span className="text-xs font-medium text-slate-500 mr-1">{t('photoBorderLabel')}:</span>
            {(['none', 'thin', 'accent', 'double'] as const).map((bStyle) => (
              <button
                key={bStyle}
                type="button"
                onClick={() => handleFieldChange('photoBorder', bStyle)}
                className={`px-2.5 py-1 text-[11px] font-semibold rounded-lg border transition-all cursor-pointer ${
                  (data.photoBorder || (bStyle === 'none' ? 'none' : '')) === bStyle
                    ? 'border-blue-600 bg-blue-600 text-white'
                    : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                }`}
              >
                {t(`photoBorder${bStyle.charAt(0).toUpperCase() + bStyle.slice(1)}` as any)}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Primary Input Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Full Name */}
        <div className="sm:col-span-2">
          <label className="block text-xs font-bold text-slate-700 mb-1.5">
            {t('fullName')}
          </label>
          <div className="relative">
            <input
              type="text"
              value={data.fullName}
              onChange={(e) => handleFieldChange('fullName', e.target.value)}
              placeholder={t('fullNamePlaceholder')}
              className={`w-full px-3.5 py-2.5 bg-white border rounded-xl text-sm text-slate-900 placeholder:text-slate-400 focus:outline-hidden focus:ring-2 focus:ring-blue-500 transition-colors ${
                errors.fullName ? 'border-red-500 bg-red-50/20' : 'border-slate-300'
              }`}
            />
          </div>
          {errors.fullName && (
            <p className="flex items-center gap-1 text-xs text-red-600 mt-1 font-medium">
              <AlertCircle className="w-3.5 h-3.5" />
              {errors.fullName}
            </p>
          )}
        </div>

        {/* Job Title */}
        <div className="sm:col-span-2">
          <label className="block text-xs font-bold text-slate-700 mb-1.5">
            {t('jobTitle')}
          </label>
          <input
            type="text"
            value={data.jobTitle}
            onChange={(e) => handleFieldChange('jobTitle', e.target.value)}
            placeholder={t('jobTitlePlaceholder')}
            className={`w-full px-3.5 py-2.5 bg-white border rounded-xl text-sm text-slate-900 placeholder:text-slate-400 focus:outline-hidden focus:ring-2 focus:ring-blue-500 transition-colors ${
              errors.jobTitle ? 'border-red-500 bg-red-50/20' : 'border-slate-300'
            }`}
          />
          {errors.jobTitle && (
            <p className="flex items-center gap-1 text-xs text-red-600 mt-1 font-medium">
              <AlertCircle className="w-3.5 h-3.5" />
              {errors.jobTitle}
            </p>
          )}
        </div>

        {/* Email */}
        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1.5">
            {t('email')}
          </label>
          <div className="relative">
            <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
            <input
              type="email"
              value={data.email}
              onChange={(e) => handleFieldChange('email', e.target.value)}
              placeholder={t('emailPlaceholder')}
              className={`w-full pl-10 pr-3.5 py-2.5 bg-white border rounded-xl text-sm text-slate-900 placeholder:text-slate-400 focus:outline-hidden focus:ring-2 focus:ring-blue-500 transition-colors ${
                errors.email ? 'border-red-500 bg-red-50/20' : 'border-slate-300'
              }`}
            />
          </div>
          {errors.email && (
            <p className="flex items-center gap-1 text-xs text-red-600 mt-1 font-medium">
              <AlertCircle className="w-3.5 h-3.5" />
              {errors.email}
            </p>
          )}
        </div>

        {/* Phone */}
        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1.5">
            {t('phone')}
          </label>
          <div className="relative">
            <Phone className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
            <input
              type="tel"
              value={data.phone}
              onChange={(e) => handleFieldChange('phone', e.target.value)}
              placeholder={t('phonePlaceholder')}
              className="w-full pl-10 pr-3.5 py-2.5 bg-white border border-slate-300 rounded-xl text-sm text-slate-900 placeholder:text-slate-400 focus:outline-hidden focus:ring-2 focus:ring-blue-500 transition-colors"
            />
          </div>
        </div>

        {/* City */}
        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1.5">
            {t('city')}
          </label>
          <div className="relative">
            <MapPin className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
            <input
              type="text"
              value={data.city}
              onChange={(e) => handleFieldChange('city', e.target.value)}
              placeholder={t('cityPlaceholder')}
              className="w-full pl-10 pr-3.5 py-2.5 bg-white border border-slate-300 rounded-xl text-sm text-slate-900 placeholder:text-slate-400 focus:outline-hidden focus:ring-2 focus:ring-blue-500 transition-colors"
            />
          </div>
        </div>

        {/* Country */}
        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1.5">
            {t('country')}
          </label>
          <input
            type="text"
            value={data.country}
            onChange={(e) => handleFieldChange('country', e.target.value)}
            placeholder={t('countryPlaceholder')}
            className="w-full px-3.5 py-2.5 bg-white border border-slate-300 rounded-xl text-sm text-slate-900 placeholder:text-slate-400 focus:outline-hidden focus:ring-2 focus:ring-blue-500 transition-colors"
          />
        </div>

        {/* LinkedIn */}
        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1.5">
            LinkedIn Profile
          </label>
          <div className="relative">
            <Linkedin className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
            <input
              type="text"
              value={data.linkedin || ''}
              onChange={(e) => handleFieldChange('linkedin', e.target.value)}
              placeholder="linkedin.com/in/username"
              className="w-full pl-10 pr-3.5 py-2.5 bg-white border border-slate-300 rounded-xl text-sm text-slate-900 placeholder:text-slate-400 focus:outline-hidden focus:ring-2 focus:ring-blue-500 transition-colors"
            />
          </div>
        </div>

        {/* Website */}
        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1.5">
            Website or Portfolio
          </label>
          <div className="relative">
            <Globe className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
            <input
              type="text"
              value={data.website || ''}
              onChange={(e) => handleFieldChange('website', e.target.value)}
              placeholder="https://myportfolio.com"
              className="w-full pl-10 pr-3.5 py-2.5 bg-white border border-slate-300 rounded-xl text-sm text-slate-900 placeholder:text-slate-400 focus:outline-hidden focus:ring-2 focus:ring-blue-500 transition-colors"
            />
          </div>
        </div>
      </div>

      {/* Professional Summary */}
      <div className="pt-2">
        <label className="block text-xs font-bold text-slate-700 mb-1.5">
          {t('summary')}
        </label>
        <textarea
          rows={4}
          value={data.summary}
          onChange={(e) => handleFieldChange('summary', e.target.value)}
          placeholder={t('summaryPlaceholder')}
          className="w-full px-3.5 py-2.5 bg-white border border-slate-300 rounded-xl text-sm text-slate-900 placeholder:text-slate-400 focus:outline-hidden focus:ring-2 focus:ring-blue-500 transition-colors leading-relaxed"
        />

        {/* Starter Prompts */}
        <div className="mt-3 bg-blue-50/50 border border-blue-100 rounded-xl p-3.5">
          <p className="text-xs font-bold text-blue-900 flex items-center gap-1.5 mb-2">
            <Sparkles className="w-3.5 h-3.5 text-blue-600" />
            {t('summaryPromptsTitle')}
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
            {summaryPrompts.map((prompt, idx) => (
              <div
                key={idx}
                className="bg-white p-2.5 rounded-lg border border-blue-200/60 hover:border-blue-400 transition-all text-left flex flex-col justify-between"
              >
                <div>
                  <span className="text-[11px] font-bold text-slate-800 block mb-1">
                    {prompt.title}
                  </span>
                  <p className="text-[11px] text-slate-600 line-clamp-3 leading-relaxed">
                    "{prompt.text}"
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => handleFieldChange('summary', prompt.text)}
                  className="mt-2 text-[11px] font-semibold text-blue-600 hover:text-blue-800 self-start cursor-pointer"
                >
                  {t('useThisSummary')} →
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
