import React from 'react';
import { TemplateProps } from './types';
import { getSectionTitles, formatLocation, formatDates } from './templateUtils';
import { CVProfilePhoto } from '../components/CVProfilePhoto';
import { Mail, Phone, MapPin, Globe, Linkedin, Shield } from 'lucide-react';

export const ExecutiveTemplate: React.FC<TemplateProps> = ({ cvData }) => {
  const titles = getSectionTitles(cvData);
  const { personal, experiences, education, skills, languages, additional } = cvData;
  const location = formatLocation(personal.city, personal.country);

  return (
    <div className="font-inter text-slate-900 bg-white p-8 sm:p-10 w-full text-[13px] leading-relaxed box-border">
      {/* Executive Header */}
      <header className="border-b-4 border-slate-900 pb-6 mb-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-widest text-slate-500 mb-1">
              <Shield className="w-3.5 h-3.5 text-slate-700" />
              <span>Executive Dossier</span>
            </div>
            <h1 className="text-3xl md:text-4xl font-extrabold text-slate-950 tracking-tight font-serif">
              {personal.fullName || 'Executive Candidate'}
            </h1>
            {personal.jobTitle && (
              <p className="text-base font-semibold text-slate-700 mt-1 uppercase tracking-wide">
                {personal.jobTitle}
              </p>
            )}
          </div>

          {personal.photoUrl && (
            <CVProfilePhoto
              photoUrl={personal.photoUrl}
              alt={personal.fullName}
              shape={personal.photoShape || 'square'}
              border={personal.photoBorder || 'thin'}
              className="w-24 h-24 shadow-sm"
            />
          )}
        </div>

        {/* Executive Contact Strip */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs text-slate-700 mt-5 pt-4 border-t border-slate-200">
          {personal.email && (
            <div className="flex items-center gap-1.5">
              <Mail className="w-3.5 h-3.5 text-slate-900 shrink-0" />
              <span className="truncate">{personal.email}</span>
            </div>
          )}
          {personal.phone && (
            <div className="flex items-center gap-1.5">
              <Phone className="w-3.5 h-3.5 text-slate-900 shrink-0" />
              <span>{personal.phone}</span>
            </div>
          )}
          {location && (
            <div className="flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-slate-900 shrink-0" />
              <span>{location}</span>
            </div>
          )}
          {personal.linkedin && (
            <div className="flex items-center gap-1.5">
              <Linkedin className="w-3.5 h-3.5 text-slate-900 shrink-0" />
              <span className="truncate">{personal.linkedin}</span>
            </div>
          )}
        </div>
      </header>

      {/* Executive Summary Box */}
      {personal.summary && (
        <section className="bg-slate-50 border-l-4 border-slate-900 p-4 mb-6">
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-900 mb-1.5 font-serif">
            {titles.summary}
          </h2>
          <p className="text-slate-800 text-justify text-xs leading-relaxed whitespace-pre-line">
            {personal.summary}
          </p>
        </section>
      )}

      {/* Core Competencies / Skills */}
      {skills.length > 0 && (
        <section className="mb-6">
          <h2 className="text-xs font-bold uppercase tracking-widest text-slate-900 border-b-2 border-slate-900 pb-1 mb-2 font-serif">
            Core Leadership Competencies
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
            {skills.map((skill) => (
              <div key={skill.id} className="bg-white border border-slate-200 p-2 text-center rounded-xs">
                <span className="font-semibold text-slate-900 block truncate">{skill.name}</span>
                {skill.level && <span className="text-[10px] text-slate-500 uppercase">{skill.level}</span>}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Work Experience */}
      {experiences.length > 0 && (
        <section className="mb-6">
          <h2 className="text-xs font-bold uppercase tracking-widest text-slate-900 border-b-2 border-slate-900 pb-1 mb-3 font-serif">
            {titles.experience}
          </h2>
          <div className="space-y-5">
            {experiences.map((exp) => (
              <div key={exp.id}>
                <div className="flex justify-between items-baseline flex-wrap gap-1">
                  <div>
                    <h3 className="font-bold text-slate-900 text-sm">{exp.jobTitle}</h3>
                    <p className="text-xs font-semibold text-slate-700">{exp.company} {exp.location && `| ${exp.location}`}</p>
                  </div>
                  <span className="text-xs font-bold text-slate-900 bg-slate-100 px-2 py-0.5 rounded-xs">
                    {formatDates(exp.startDate, exp.endDate, exp.isCurrent, titles.present)}
                  </span>
                </div>
                {exp.description && (
                  <div className="text-xs text-slate-700 leading-relaxed whitespace-pre-line mt-2 pl-2 border-l border-slate-200">
                    {exp.description}
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Education & Certifications */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        {education.length > 0 && (
          <section>
            <h2 className="text-xs font-bold uppercase tracking-widest text-slate-900 border-b-2 border-slate-900 pb-1 mb-3 font-serif">
              {titles.education}
            </h2>
            <div className="space-y-3 text-xs">
              {education.map((edu) => (
                <div key={edu.id}>
                  <p className="font-bold text-slate-900">{edu.degree}</p>
                  <p className="text-slate-700">{edu.institution} {edu.fieldOfStudy && `— ${edu.fieldOfStudy}`}</p>
                  <p className="text-[11px] text-slate-500">{formatDates(edu.startDate, edu.endDate, false, titles.present)}</p>
                </div>
              ))}
            </div>
          </section>
        )}

        {additional.certifications.length > 0 && (
          <section>
            <h2 className="text-xs font-bold uppercase tracking-widest text-slate-900 border-b-2 border-slate-900 pb-1 mb-3 font-serif">
              {titles.certifications}
            </h2>
            <div className="space-y-2 text-xs">
              {additional.certifications.map((c) => (
                <div key={c.id}>
                  <p className="font-bold text-slate-900">{c.name}</p>
                  <p className="text-[11px] text-slate-600">{c.issuer} {c.date && `(${c.date})`}</p>
                </div>
              ))}
            </div>
          </section>
        )}
      </div>

      {/* Languages & References */}
      {(languages.length > 0 || additional.references.length > 0) && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2 border-t border-slate-200 text-xs">
          {languages.length > 0 && (
            <div>
              <h3 className="font-bold uppercase tracking-wider text-slate-800 mb-1">{titles.languages}</h3>
              <div className="flex flex-wrap gap-x-4 gap-y-1 text-slate-700">
                {languages.map((l) => (
                  <span key={l.id}>{l.name} ({l.proficiency})</span>
                ))}
              </div>
            </div>
          )}

          {additional.references.length > 0 && (
            <div>
              <h3 className="font-bold uppercase tracking-wider text-slate-800 mb-1">{titles.references}</h3>
              <p className="text-slate-600">
                {additional.references.length} executive reference(s) available upon request.
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
