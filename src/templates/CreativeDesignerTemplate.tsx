import React from 'react';
import { TemplateProps } from './types';
import { getSectionTitles, formatLocation, formatDates } from './templateUtils';
import { CVProfilePhoto } from '../components/CVProfilePhoto';
import { Sparkles, ExternalLink, Mail, Phone, MapPin, Globe } from 'lucide-react';

export const CreativeDesignerTemplate: React.FC<TemplateProps> = ({ cvData }) => {
  const titles = getSectionTitles(cvData);
  const { personal, experiences, education, skills, languages, additional } = cvData;
  const location = formatLocation(personal.city, personal.country);

  return (
    <div className="font-grotesk bg-slate-50/50 text-slate-800 p-6 sm:p-8 w-full text-[13px] leading-relaxed box-border">
      {/* Creative Asymmetric Header */}
      <header className="bg-gradient-to-br from-violet-600 via-indigo-600 to-purple-800 rounded-2xl text-white p-6 md:p-8 mb-6 shadow-md relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row items-center md:items-start justify-between gap-6">
          <div className="text-center md:text-left flex-1">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 backdrop-blur-xs text-xs font-medium text-purple-100 mb-2">
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              <span>Creative Portfolio & CV</span>
            </div>
            <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight">
              {personal.fullName || 'Creative Name'}
            </h1>
            {personal.jobTitle && (
              <p className="text-purple-200 text-base font-medium mt-1">
                {personal.jobTitle}
              </p>
            )}

            <div className="flex flex-wrap justify-center md:justify-start gap-3 mt-4 text-xs text-purple-100">
              {personal.email && (
                <span className="flex items-center gap-1 bg-white/10 px-2.5 py-1 rounded-lg">
                  <Mail className="w-3.5 h-3.5" />
                  {personal.email}
                </span>
              )}
              {personal.phone && (
                <span className="flex items-center gap-1 bg-white/10 px-2.5 py-1 rounded-lg">
                  <Phone className="w-3.5 h-3.5" />
                  {personal.phone}
                </span>
              )}
              {location && (
                <span className="flex items-center gap-1 bg-white/10 px-2.5 py-1 rounded-lg">
                  <MapPin className="w-3.5 h-3.5" />
                  {location}
                </span>
              )}
              {personal.website && (
                <span className="flex items-center gap-1 bg-white/10 px-2.5 py-1 rounded-lg">
                  <Globe className="w-3.5 h-3.5" />
                  {personal.website}
                </span>
              )}
            </div>
          </div>

          {personal.photoUrl && (
            <CVProfilePhoto
              photoUrl={personal.photoUrl}
              alt={personal.fullName}
              shape={personal.photoShape || 'rounded'}
              border={personal.photoBorder || 'accent'}
              accentColor="#c084fc"
              className="w-24 h-24 md:w-28 md:h-28 shadow-lg"
            />
          )}
        </div>
      </header>

      {/* Summary */}
      {personal.summary && (
        <section className="bg-white p-5 rounded-xl border border-purple-100 shadow-xs mb-6">
          <h2 className="text-xs font-bold uppercase tracking-wider text-indigo-700 mb-2 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-indigo-500"></span>
            {titles.summary}
          </h2>
          <p className="text-slate-700 leading-relaxed text-justify whitespace-pre-line text-xs font-sans">
            {personal.summary}
          </p>
        </section>
      )}

      {/* Featured Projects Front & Center */}
      {additional.projects.length > 0 && (
        <section className="mb-6">
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-900 mb-3 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-violet-600"></span>
            {titles.projects}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {additional.projects.map((proj) => (
              <div key={proj.id} className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-xs">
                <div className="flex justify-between items-start gap-2">
                  <h3 className="font-bold text-slate-900 text-xs">{proj.title}</h3>
                  {proj.link && (
                    <a href={proj.link} target="_blank" rel="noreferrer" className="text-indigo-600 hover:text-indigo-800">
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  )}
                </div>
                {proj.role && <p className="text-[11px] font-medium text-indigo-600 mt-0.5">{proj.role}</p>}
                {proj.description && <p className="text-xs text-slate-600 mt-1 font-sans">{proj.description}</p>}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Work Experience */}
      {experiences.length > 0 && (
        <section className="mb-6">
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-900 mb-3 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-indigo-600"></span>
            {titles.experience}
          </h2>
          <div className="space-y-3">
            {experiences.map((exp) => (
              <div key={exp.id} className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-xs">
                <div className="flex justify-between items-baseline flex-wrap gap-1">
                  <div>
                    <h3 className="font-bold text-slate-900 text-sm">{exp.jobTitle}</h3>
                    <p className="text-xs font-medium text-indigo-600">{exp.company} {exp.location && `· ${exp.location}`}</p>
                  </div>
                  <span className="text-xs font-medium text-slate-500 bg-slate-100 px-2.5 py-0.5 rounded-full">
                    {formatDates(exp.startDate, exp.endDate, exp.isCurrent, titles.present)}
                  </span>
                </div>
                {exp.description && (
                  <p className="text-xs text-slate-600 leading-relaxed whitespace-pre-line mt-2 font-sans">
                    {exp.description}
                  </p>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Two Columns: Skills & Education */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        {/* Creative Skill Tags */}
        {skills.length > 0 && (
          <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-xs">
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-900 mb-3">
              {titles.skills}
            </h2>
            <div className="flex flex-wrap gap-1.5">
              {skills.map((s) => (
                <span
                  key={s.id}
                  className="bg-indigo-50 text-indigo-900 text-[11px] font-medium px-2.5 py-1 rounded-lg border border-indigo-100"
                >
                  {s.name} {s.level && <span className="text-indigo-400 font-normal">· {s.level}</span>}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Education */}
        {education.length > 0 && (
          <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-xs">
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-900 mb-3">
              {titles.education}
            </h2>
            <div className="space-y-2 text-xs">
              {education.map((edu) => (
                <div key={edu.id}>
                  <p className="font-bold text-slate-900">{edu.degree}</p>
                  <p className="text-indigo-600">{edu.fieldOfStudy}</p>
                  <p className="text-[11px] text-slate-500">{edu.institution} ({formatDates(edu.startDate, edu.endDate, false, titles.present)})</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Languages & Awards */}
      {(languages.length > 0 || additional.awards.length > 0) && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          {languages.length > 0 && (
            <div className="bg-white p-3.5 rounded-xl border border-slate-200">
              <span className="font-bold text-slate-900 uppercase block mb-1.5">{titles.languages}</span>
              <div className="flex flex-wrap gap-2 text-slate-700">
                {languages.map((l) => (
                  <span key={l.id} className="bg-slate-100 px-2 py-0.5 rounded text-[11px]">
                    {l.name} ({l.proficiency})
                  </span>
                ))}
              </div>
            </div>
          )}

          {additional.awards.length > 0 && (
            <div className="bg-white p-3.5 rounded-xl border border-slate-200">
              <span className="font-bold text-slate-900 uppercase block mb-1.5">{titles.awards}</span>
              <div className="space-y-1">
                {additional.awards.map((a) => (
                  <p key={a.id} className="text-slate-700 text-[11px]">
                    ★ <span className="font-semibold">{a.title}</span> – {a.issuer}
                  </p>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
