import React from 'react';
import { TemplateProps } from './types';
import { getSectionTitles, formatLocation, formatDates } from './templateUtils';
import { CVProfilePhoto } from '../components/CVProfilePhoto';

export const MinimalistTemplate: React.FC<TemplateProps> = ({ cvData }) => {
  const titles = getSectionTitles(cvData);
  const { personal, experiences, education, skills, languages, additional } = cvData;
  const location = formatLocation(personal.city, personal.country);

  return (
    <div className="font-inter text-slate-800 bg-white p-8 sm:p-12 w-full text-[13px] leading-relaxed box-border">
      {/* Header: Left-aligned, stark, architectural */}
      <header className="mb-8 pb-6 border-b border-slate-200">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <h1 className="text-3xl font-light tracking-tight text-slate-950 uppercase">
              {personal.fullName || 'Your Full Name'}
            </h1>
            {personal.jobTitle && (
              <p className="text-sm font-normal text-slate-500 tracking-wider uppercase mt-1">
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
              className="w-20 h-20 grayscale border border-slate-200"
            />
          )}
        </div>

        {/* Minimalist Contact Line */}
        <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-slate-500 mt-4 font-mono">
          {personal.email && <span>{personal.email}</span>}
          {personal.phone && <span>· {personal.phone}</span>}
          {location && <span>· {location}</span>}
          {personal.linkedin && <span>· {personal.linkedin}</span>}
          {personal.website && <span>· {personal.website}</span>}
        </div>
      </header>

      {/* Summary */}
      {personal.summary && (
        <section className="mb-8">
          <p className="text-slate-700 text-sm font-light leading-relaxed">
            {personal.summary}
          </p>
        </section>
      )}

      {/* Experience */}
      {experiences.length > 0 && (
        <section className="mb-8">
          <h2 className="text-xs font-semibold tracking-widest text-slate-400 uppercase mb-4">
            {titles.experience}
          </h2>
          <div className="space-y-6">
            {experiences.map((exp) => (
              <div key={exp.id}>
                <div className="flex justify-between items-baseline flex-wrap gap-1">
                  <h3 className="font-medium text-slate-900 text-sm">
                    {exp.jobTitle} <span className="text-slate-400 font-light">/</span> {exp.company}
                  </h3>
                  <span className="text-xs text-slate-400 font-mono">
                    {formatDates(exp.startDate, exp.endDate, exp.isCurrent, titles.present)}
                  </span>
                </div>
                {exp.location && <p className="text-xs text-slate-400 mb-1">{exp.location}</p>}
                {exp.description && (
                  <p className="text-xs text-slate-600 leading-relaxed whitespace-pre-line mt-1.5">
                    {exp.description}
                  </p>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Two Column Layout for Education & Skills */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
        {/* Education */}
        {education.length > 0 && (
          <section>
            <h2 className="text-xs font-semibold tracking-widest text-slate-400 uppercase mb-4">
              {titles.education}
            </h2>
            <div className="space-y-4">
              {education.map((edu) => (
                <div key={edu.id}>
                  <p className="font-medium text-slate-900 text-xs">
                    {edu.degree} {edu.fieldOfStudy ? `– ${edu.fieldOfStudy}` : ''}
                  </p>
                  <p className="text-xs text-slate-500">{edu.institution}</p>
                  <p className="text-[11px] text-slate-400 font-mono mt-0.5">
                    {formatDates(edu.startDate, edu.endDate, false, titles.present)}
                  </p>
                  {edu.description && <p className="text-xs text-slate-600 mt-1">{edu.description}</p>}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Skills & Languages */}
        <div>
          {skills.length > 0 && (
            <section className="mb-6">
              <h2 className="text-xs font-semibold tracking-widest text-slate-400 uppercase mb-4">
                {titles.skills}
              </h2>
              <div className="flex flex-wrap gap-2 text-xs">
                {skills.map((skill) => (
                  <span key={skill.id} className="text-slate-700 bg-slate-50 border border-slate-200 px-2 py-0.5 text-[11px]">
                    {skill.name} {skill.level && <span className="text-slate-400">({skill.level})</span>}
                  </span>
                ))}
              </div>
            </section>
          )}

          {languages.length > 0 && (
            <section>
              <h2 className="text-xs font-semibold tracking-widest text-slate-400 uppercase mb-2">
                {titles.languages}
              </h2>
              <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-slate-600">
                {languages.map((l) => (
                  <span key={l.id}>{l.name} <span className="text-slate-400">({l.proficiency})</span></span>
                ))}
              </div>
            </section>
          )}
        </div>
      </div>

      {/* Projects */}
      {additional.projects.length > 0 && (
        <section className="mb-8">
          <h2 className="text-xs font-semibold tracking-widest text-slate-400 uppercase mb-4">
            {titles.projects}
          </h2>
          <div className="space-y-3 text-xs">
            {additional.projects.map((proj) => (
              <div key={proj.id}>
                <span className="font-medium text-slate-900">{proj.title}</span>
                {proj.role && <span className="text-slate-500"> — {proj.role}</span>}
                {proj.description && <p className="text-slate-600 mt-0.5">{proj.description}</p>}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Certifications & Awards */}
      {(additional.certifications.length > 0 || additional.awards.length > 0) && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8 text-xs">
          {additional.certifications.length > 0 && (
            <div>
              <h2 className="text-xs font-semibold tracking-widest text-slate-400 uppercase mb-3">
                {titles.certifications}
              </h2>
              <div className="space-y-1.5 text-slate-700">
                {additional.certifications.map((c) => (
                  <div key={c.id}>
                    <span className="font-medium text-slate-900">{c.name}</span> · {c.issuer}
                  </div>
                ))}
              </div>
            </div>
          )}

          {additional.awards.length > 0 && (
            <div>
              <h2 className="text-xs font-semibold tracking-widest text-slate-400 uppercase mb-3">
                {titles.awards}
              </h2>
              <div className="space-y-1.5 text-slate-700">
                {additional.awards.map((a) => (
                  <div key={a.id}>
                    <span className="font-medium text-slate-900">{a.title}</span> · {a.issuer}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* References */}
      {additional.references.length > 0 && (
        <section className="text-xs border-t border-slate-100 pt-4">
          <h2 className="text-xs font-semibold tracking-widest text-slate-400 uppercase mb-3">
            {titles.references}
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-slate-600">
            {additional.references.map((r) => (
              <div key={r.id}>
                <p className="font-medium text-slate-900">{r.fullName}</p>
                <p>{r.jobTitle}, {r.company}</p>
                {r.email && <p className="font-mono text-[11px] text-slate-400">{r.email}</p>}
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
};
