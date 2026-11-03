import React from 'react';
import { TemplateProps } from './types';
import { getSectionTitles, formatLocation, formatDates } from './templateUtils';

export const CompactOnePageTemplate: React.FC<TemplateProps> = ({ cvData }) => {
  const titles = getSectionTitles(cvData);
  const { personal, experiences, education, skills, languages, additional } = cvData;
  const location = formatLocation(personal.city, personal.country);

  return (
    <div className="font-inter bg-white text-slate-800 p-6 sm:p-8 w-full text-[11px] leading-snug box-border">
      {/* Super Compact Header */}
      <header className="border-b-2 border-slate-800 pb-2.5 mb-3 flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight uppercase">
            {personal.fullName || 'Candidate Name'}
          </h1>
          {personal.jobTitle && (
            <p className="text-xs font-semibold text-blue-700 tracking-wide">
              {personal.jobTitle}
            </p>
          )}
        </div>

        {/* Dense Inline Contact Info */}
        <div className="text-right text-[11px] text-slate-600 space-y-0.5">
          <div>
            {personal.email && <span className="font-medium text-slate-900">{personal.email}</span>}
            {personal.phone && <span> · {personal.phone}</span>}
          </div>
          <div>
            {location && <span>{location}</span>}
            {personal.linkedin && <span> · {personal.linkedin}</span>}
          </div>
        </div>
      </header>

      {/* Summary */}
      {personal.summary && (
        <section className="mb-2.5">
          <p className="text-slate-700 text-[11px] leading-tight">
            <span className="font-bold text-slate-900 uppercase tracking-wide mr-1.5">{titles.summary}:</span>
            {personal.summary}
          </p>
        </section>
      )}

      {/* Two-Column Grid Body */}
      <div className="grid grid-cols-12 gap-4">
        {/* Left Column: Experience & Projects (8 cols) */}
        <div className="col-span-8 space-y-3">
          {/* Work Experience */}
          {experiences.length > 0 && (
            <section>
              <h2 className="text-[11px] font-bold uppercase tracking-wider text-slate-900 border-b border-slate-300 pb-0.5 mb-1.5">
                {titles.experience}
              </h2>
              <div className="space-y-2">
                {experiences.map((exp) => (
                  <div key={exp.id}>
                    <div className="flex justify-between items-baseline font-bold text-slate-900">
                      <span>{exp.jobTitle} <span className="text-slate-500 font-normal">| {exp.company}</span></span>
                      <span className="text-[10px] text-slate-500 font-normal">
                        {formatDates(exp.startDate, exp.endDate, exp.isCurrent, titles.present)}
                      </span>
                    </div>
                    {exp.description && (
                      <p className="text-slate-600 text-[10.5px] leading-tight whitespace-pre-line mt-0.5">
                        {exp.description}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Projects */}
          {additional.projects.length > 0 && (
            <section>
              <h2 className="text-[11px] font-bold uppercase tracking-wider text-slate-900 border-b border-slate-300 pb-0.5 mb-1.5">
                {titles.projects}
              </h2>
              <div className="space-y-1.5">
                {additional.projects.map((p) => (
                  <div key={p.id}>
                    <span className="font-bold text-slate-900">{p.title}</span>
                    {p.role && <span className="text-slate-500"> ({p.role})</span>}
                    {p.description && <p className="text-slate-600 text-[10.5px]">{p.description}</p>}
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Volunteer */}
          {additional.volunteer.length > 0 && (
            <section>
              <h2 className="text-[11px] font-bold uppercase tracking-wider text-slate-900 border-b border-slate-300 pb-0.5 mb-1.5">
                {titles.volunteer}
              </h2>
              <div className="space-y-1">
                {additional.volunteer.map((v) => (
                  <div key={v.id} className="text-[10.5px]">
                    <span className="font-bold text-slate-900">{v.role}</span> – {v.organization}
                    {v.description && <span className="text-slate-600"> ({v.description})</span>}
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>

        {/* Right Column: Skills, Education, Languages, Certs (4 cols) */}
        <div className="col-span-4 space-y-3">
          {/* Skills */}
          {skills.length > 0 && (
            <section>
              <h2 className="text-[11px] font-bold uppercase tracking-wider text-slate-900 border-b border-slate-300 pb-0.5 mb-1">
                {titles.skills}
              </h2>
              <div className="space-y-0.5 text-[10.5px]">
                {skills.map((s) => (
                  <div key={s.id} className="flex justify-between">
                    <span className="font-medium text-slate-800">{s.name}</span>
                    {s.level && <span className="text-slate-400 text-[9.5px]">{s.level}</span>}
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Education */}
          {education.length > 0 && (
            <section>
              <h2 className="text-[11px] font-bold uppercase tracking-wider text-slate-900 border-b border-slate-300 pb-0.5 mb-1">
                {titles.education}
              </h2>
              <div className="space-y-1.5 text-[10.5px]">
                {education.map((edu) => (
                  <div key={edu.id}>
                    <p className="font-bold text-slate-900">{edu.degree}</p>
                    <p className="text-slate-600">{edu.institution}</p>
                    <p className="text-[9.5px] text-slate-400">{formatDates(edu.startDate, edu.endDate, false, titles.present)}</p>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Languages */}
          {languages.length > 0 && (
            <section>
              <h2 className="text-[11px] font-bold uppercase tracking-wider text-slate-900 border-b border-slate-300 pb-0.5 mb-1">
                {titles.languages}
              </h2>
              <div className="space-y-0.5 text-[10.5px]">
                {languages.map((l) => (
                  <div key={l.id} className="flex justify-between text-slate-700">
                    <span>{l.name}</span>
                    <span className="text-slate-400 text-[9.5px]">{l.proficiency}</span>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Certifications */}
          {additional.certifications.length > 0 && (
            <section>
              <h2 className="text-[11px] font-bold uppercase tracking-wider text-slate-900 border-b border-slate-300 pb-0.5 mb-1">
                {titles.certifications}
              </h2>
              <div className="space-y-1 text-[10px]">
                {additional.certifications.map((c) => (
                  <div key={c.id}>
                    <p className="font-semibold text-slate-900">{c.name}</p>
                    <p className="text-slate-500">{c.issuer}</p>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* References */}
          {additional.references.length > 0 && (
            <section>
              <h2 className="text-[11px] font-bold uppercase tracking-wider text-slate-900 border-b border-slate-300 pb-0.5 mb-1">
                {titles.references}
              </h2>
              <p className="text-slate-500 text-[10px]">Available on request</p>
            </section>
          )}
        </div>
      </div>
    </div>
  );
};
