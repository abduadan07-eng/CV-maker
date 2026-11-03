import React from 'react';
import { TemplateProps } from './types';
import { getSectionTitles, formatLocation, formatDates } from './templateUtils';
import { CVProfilePhoto } from '../components/CVProfilePhoto';
import { Mail, Phone, MapPin, Globe, Linkedin, ChevronRight, Bookmark } from 'lucide-react';

export const ContemporaryAccentTemplate: React.FC<TemplateProps> = ({ cvData }) => {
  const titles = getSectionTitles(cvData);
  const { personal, experiences, education, skills, languages, additional } = cvData;
  const location = formatLocation(personal.city, personal.country);

  return (
    <div className="font-jakarta bg-white text-slate-800 p-8 sm:p-10 w-full text-[13px] leading-relaxed box-border">
      {/* Contemporary Header Card */}
      <header className="bg-teal-950 text-white rounded-2xl p-6 md:p-8 mb-6 shadow-sm">
        <div className="flex flex-col md:flex-row justify-between items-center md:items-start gap-6">
          <div className="text-center md:text-left">
            <span className="text-[11px] font-bold uppercase tracking-widest text-teal-400 block mb-1">
              Curriculum Vitae
            </span>
            <h1 className="text-3xl font-extrabold text-white tracking-tight">
              {personal.fullName || 'Candidate Name'}
            </h1>
            {personal.jobTitle && (
              <p className="text-teal-200 text-sm font-medium mt-1">
                {personal.jobTitle}
              </p>
            )}

            <div className="flex flex-wrap justify-center md:justify-start gap-x-4 gap-y-1.5 text-xs text-teal-100 mt-4">
              {personal.email && (
                <span className="flex items-center gap-1.5">
                  <Mail className="w-3.5 h-3.5 text-teal-400" />
                  {personal.email}
                </span>
              )}
              {personal.phone && (
                <span className="flex items-center gap-1.5">
                  <Phone className="w-3.5 h-3.5 text-teal-400" />
                  {personal.phone}
                </span>
              )}
              {location && (
                <span className="flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-teal-400" />
                  {location}
                </span>
              )}
              {personal.website && (
                <span className="flex items-center gap-1.5">
                  <Globe className="w-3.5 h-3.5 text-teal-400" />
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
              accentColor="#2dd4bf"
              className="w-24 h-24 shadow-md"
            />
          )}
        </div>
      </header>

      {/* Summary */}
      {personal.summary && (
        <section className="mb-6 p-4 rounded-xl bg-teal-50/50 border border-teal-100">
          <h2 className="text-xs font-bold uppercase tracking-wider text-teal-900 mb-1.5 flex items-center gap-1.5">
            <Bookmark className="w-3.5 h-3.5 text-teal-600" />
            {titles.summary}
          </h2>
          <p className="text-slate-700 text-xs leading-relaxed text-justify whitespace-pre-line">
            {personal.summary}
          </p>
        </section>
      )}

      {/* Experience */}
      {experiences.length > 0 && (
        <section className="mb-6">
          <h2 className="text-xs font-bold uppercase tracking-wider text-teal-950 flex items-center gap-1.5 pb-2 border-b border-teal-100 mb-3">
            <ChevronRight className="w-4 h-4 text-teal-600" />
            {titles.experience}
          </h2>
          <div className="space-y-4">
            {experiences.map((exp) => (
              <div key={exp.id} className="relative pl-3 border-l-2 border-teal-600">
                <div className="flex justify-between items-baseline flex-wrap gap-1">
                  <h3 className="font-bold text-slate-900 text-sm">{exp.jobTitle}</h3>
                  <span className="text-xs font-semibold text-teal-800 bg-teal-50 px-2 py-0.5 rounded-md">
                    {formatDates(exp.startDate, exp.endDate, exp.isCurrent, titles.present)}
                  </span>
                </div>
                <p className="text-xs font-medium text-slate-600 mb-1">
                  {exp.company} {exp.location && `· ${exp.location}`}
                </p>
                {exp.description && (
                  <p className="text-xs text-slate-700 leading-relaxed whitespace-pre-line">
                    {exp.description}
                  </p>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Dual Column: Education & Skills */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        {education.length > 0 && (
          <section>
            <h2 className="text-xs font-bold uppercase tracking-wider text-teal-950 flex items-center gap-1.5 pb-1 border-b border-teal-100 mb-3">
              <ChevronRight className="w-4 h-4 text-teal-600" />
              {titles.education}
            </h2>
            <div className="space-y-3 text-xs">
              {education.map((edu) => (
                <div key={edu.id}>
                  <p className="font-bold text-slate-900">{edu.degree}</p>
                  <p className="text-teal-700 font-medium">{edu.fieldOfStudy}</p>
                  <p className="text-slate-600">{edu.institution} ({formatDates(edu.startDate, edu.endDate, false, titles.present)})</p>
                </div>
              ))}
            </div>
          </section>
        )}

        {skills.length > 0 && (
          <section>
            <h2 className="text-xs font-bold uppercase tracking-wider text-teal-950 flex items-center gap-1.5 pb-1 border-b border-teal-100 mb-3">
              <ChevronRight className="w-4 h-4 text-teal-600" />
              {titles.skills}
            </h2>
            <div className="flex flex-wrap gap-1.5">
              {skills.map((s) => (
                <span key={s.id} className="bg-slate-100 text-slate-800 text-[11px] font-medium px-2.5 py-1 rounded-md">
                  {s.name} {s.level && <span className="text-teal-700 font-semibold">· {s.level}</span>}
                </span>
              ))}
            </div>
          </section>
        )}
      </div>

      {/* Projects */}
      {additional.projects.length > 0 && (
        <section className="mb-6">
          <h2 className="text-xs font-bold uppercase tracking-wider text-teal-950 flex items-center gap-1.5 pb-1 border-b border-teal-100 mb-3">
            <ChevronRight className="w-4 h-4 text-teal-600" />
            {titles.projects}
          </h2>
          <div className="space-y-2 text-xs">
            {additional.projects.map((p) => (
              <div key={p.id}>
                <span className="font-bold text-slate-900">{p.title}</span>
                {p.role && <span className="text-slate-500"> ({p.role})</span>}
                {p.description && <p className="text-slate-600 text-xs mt-0.5">{p.description}</p>}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Footer Details: Languages, Certs, References */}
      {(languages.length > 0 || additional.certifications.length > 0) && (
        <footer className="pt-3 border-t border-slate-200 text-xs flex flex-wrap justify-between gap-4">
          {languages.length > 0 && (
            <div>
              <span className="font-bold text-slate-900 mr-1.5">{titles.languages}:</span>
              <span className="text-slate-600">{languages.map((l) => `${l.name} (${l.proficiency})`).join(', ')}</span>
            </div>
          )}
          {additional.certifications.length > 0 && (
            <div>
              <span className="font-bold text-slate-900 mr-1.5">{titles.certifications}:</span>
              <span className="text-slate-600">{additional.certifications.map((c) => c.name).join(' · ')}</span>
            </div>
          )}
        </footer>
      )}
    </div>
  );
};
