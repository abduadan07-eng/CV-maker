import React from 'react';
import { TemplateProps } from './types';
import { getSectionTitles, formatLocation, formatDates } from './templateUtils';
import { CVProfilePhoto } from '../components/CVProfilePhoto';

export const AcademicCVTemplate: React.FC<TemplateProps> = ({ cvData }) => {
  const titles = getSectionTitles(cvData);
  const { personal, experiences, education, skills, languages, additional } = cvData;
  const location = formatLocation(personal.city, personal.country);

  return (
    <div className="font-merriweather bg-white text-slate-900 p-8 sm:p-10 w-full text-[13px] leading-relaxed box-border">
      {/* Formal Academic Header */}
      <header className="text-center pb-4 border-b border-slate-900 mb-6">
        {personal.photoUrl && (
          <div className="flex justify-center mb-3">
            <CVProfilePhoto
              photoUrl={personal.photoUrl}
              alt={personal.fullName}
              shape={personal.photoShape || 'circle'}
              border={personal.photoBorder || 'thin'}
              className="w-20 h-20"
            />
          </div>
        )}
        <h1 className="text-3xl font-serif font-bold text-slate-900">
          {personal.fullName || 'Candidate Academic CV'}
        </h1>
        {personal.jobTitle && (
          <p className="text-sm font-sans font-medium text-slate-700 mt-1 italic">
            {personal.jobTitle}
          </p>
        )}
        <div className="text-xs font-sans text-slate-600 mt-2 space-x-3">
          {personal.email && <span>{personal.email}</span>}
          {personal.phone && <span>· {personal.phone}</span>}
          {location && <span>· {location}</span>}
          {personal.website && <span>· {personal.website}</span>}
        </div>
      </header>

      {/* Research Interests / Summary */}
      {personal.summary && (
        <section className="mb-6">
          <h2 className="font-serif text-sm font-bold uppercase tracking-wider text-slate-900 border-b border-slate-400 pb-1 mb-2">
            Research Interests & Executive Profile
          </h2>
          <p className="text-slate-800 text-justify text-xs leading-relaxed">
            {personal.summary}
          </p>
        </section>
      )}

      {/* Education First in Academic CV */}
      {education.length > 0 && (
        <section className="mb-6">
          <h2 className="font-serif text-sm font-bold uppercase tracking-wider text-slate-900 border-b border-slate-400 pb-1 mb-3">
            {titles.education}
          </h2>
          <div className="space-y-4">
            {education.map((edu) => (
              <div key={edu.id} className="grid grid-cols-12 gap-2">
                <div className="col-span-3 text-xs font-sans text-slate-600 font-semibold">
                  {formatDates(edu.startDate, edu.endDate, false, titles.present)}
                </div>
                <div className="col-span-9 text-xs">
                  <p className="font-bold text-slate-900">{edu.degree} in {edu.fieldOfStudy}</p>
                  <p className="text-slate-700 italic">{edu.institution}</p>
                  {edu.description && <p className="text-slate-600 mt-1">{edu.description}</p>}
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Academic & Professional Appointments */}
      {experiences.length > 0 && (
        <section className="mb-6">
          <h2 className="font-serif text-sm font-bold uppercase tracking-wider text-slate-900 border-b border-slate-400 pb-1 mb-3">
            Academic & Professional Appointments
          </h2>
          <div className="space-y-4">
            {experiences.map((exp) => (
              <div key={exp.id} className="grid grid-cols-12 gap-2">
                <div className="col-span-3 text-xs font-sans text-slate-600 font-semibold">
                  {formatDates(exp.startDate, exp.endDate, exp.isCurrent, titles.present)}
                </div>
                <div className="col-span-9 text-xs">
                  <p className="font-bold text-slate-900">{exp.jobTitle}</p>
                  <p className="text-slate-700 italic">{exp.company} {exp.location && `(${exp.location})`}</p>
                  {exp.description && (
                    <p className="text-slate-700 leading-relaxed whitespace-pre-line mt-1">
                      {exp.description}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Research Projects & Publications */}
      {additional.projects.length > 0 && (
        <section className="mb-6">
          <h2 className="font-serif text-sm font-bold uppercase tracking-wider text-slate-900 border-b border-slate-400 pb-1 mb-2">
            Research Projects & Publications
          </h2>
          <div className="space-y-3 text-xs">
            {additional.projects.map((p) => (
              <div key={p.id}>
                <p className="font-bold text-slate-900">
                  {p.title} {p.role && <span className="font-normal italic text-slate-600">— {p.role}</span>}
                </p>
                {p.link && <p className="text-blue-700 font-sans text-[11px]">{p.link}</p>}
                {p.description && <p className="text-slate-700 mt-0.5">{p.description}</p>}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Honors, Awards & Grants */}
      {additional.awards.length > 0 && (
        <section className="mb-6">
          <h2 className="font-serif text-sm font-bold uppercase tracking-wider text-slate-900 border-b border-slate-400 pb-1 mb-2">
            {titles.awards} & Fellowships
          </h2>
          <div className="space-y-2 text-xs">
            {additional.awards.map((a) => (
              <div key={a.id} className="flex justify-between">
                <span><span className="font-bold">{a.title}</span>, {a.issuer}</span>
                <span className="font-sans text-slate-600">{a.date}</span>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Certifications & Skills */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6 text-xs">
        {skills.length > 0 && (
          <div>
            <h2 className="font-serif text-xs font-bold uppercase tracking-wider text-slate-900 border-b border-slate-400 pb-1 mb-2">
              Methodological & Technical Skills
            </h2>
            <p className="text-slate-800 leading-relaxed">
              {skills.map((s) => s.name).join(' · ')}
            </p>
          </div>
        )}

        {languages.length > 0 && (
          <div>
            <h2 className="font-serif text-xs font-bold uppercase tracking-wider text-slate-900 border-b border-slate-400 pb-1 mb-2">
              {titles.languages} (Reading & Translation)
            </h2>
            <div className="space-y-1">
              {languages.map((l) => (
                <div key={l.id} className="flex justify-between">
                  <span>{l.name}</span>
                  <span className="text-slate-600 italic">{l.proficiency}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* References */}
      {additional.references.length > 0 && (
        <section>
          <h2 className="font-serif text-sm font-bold uppercase tracking-wider text-slate-900 border-b border-slate-400 pb-1 mb-3">
            Academic References
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-sans">
            {additional.references.map((r) => (
              <div key={r.id} className="p-3 bg-slate-50 border border-slate-200">
                <p className="font-bold text-slate-900">{r.fullName}</p>
                <p className="text-slate-700">{r.jobTitle}, {r.company}</p>
                {r.email && <p className="text-blue-700">{r.email}</p>}
                {r.phone && <p className="text-slate-500">{r.phone}</p>}
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
};
