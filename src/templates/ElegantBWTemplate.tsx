import React from 'react';
import { TemplateProps } from './types';
import { getSectionTitles, formatLocation, formatDates } from './templateUtils';
import { CVProfilePhoto } from '../components/CVProfilePhoto';

export const ElegantBWTemplate: React.FC<TemplateProps> = ({ cvData }) => {
  const titles = getSectionTitles(cvData);
  const { personal, experiences, education, skills, languages, additional } = cvData;
  const location = formatLocation(personal.city, personal.country);

  return (
    <div className="font-merriweather bg-white text-black p-8 sm:p-10 w-full text-[13px] leading-relaxed border border-neutral-300 box-border">
      {/* Editorial Header */}
      <header className="border-b-2 border-black pb-6 mb-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <span className="font-sans text-[11px] uppercase tracking-[0.25em] text-neutral-600 block mb-1">
              Curriculum Vitae
            </span>
            <h1 className="text-3xl md:text-4xl font-normal tracking-tight uppercase text-black">
              {personal.fullName || 'Candidate Name'}
            </h1>
            {personal.jobTitle && (
              <p className="font-sans text-xs uppercase tracking-widest text-neutral-700 mt-1.5">
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
              className="w-24 h-24 filter grayscale border border-black"
            />
          )}
        </div>

        {/* Contact info in refined monochrome strip */}
        <div className="font-sans text-[11px] text-neutral-600 flex flex-wrap gap-x-5 gap-y-1 mt-4 pt-3 border-t border-neutral-200">
          {personal.email && <span>EMAIL: <span className="text-black">{personal.email}</span></span>}
          {personal.phone && <span>TEL: <span className="text-black">{personal.phone}</span></span>}
          {location && <span>LOCATION: <span className="text-black">{location}</span></span>}
          {personal.linkedin && <span>LINKEDIN: <span className="text-black">{personal.linkedin}</span></span>}
          {personal.website && <span>WEB: <span className="text-black">{personal.website}</span></span>}
        </div>
      </header>

      {/* Summary */}
      {personal.summary && (
        <section className="mb-6 pb-6 border-b border-neutral-200">
          <p className="text-neutral-800 text-justify text-xs leading-relaxed italic">
            "{personal.summary}"
          </p>
        </section>
      )}

      {/* Experience */}
      {experiences.length > 0 && (
        <section className="mb-6">
          <h2 className="font-sans text-xs font-bold uppercase tracking-[0.2em] text-black border-b border-black pb-1 mb-4">
            {titles.experience}
          </h2>
          <div className="space-y-5">
            {experiences.map((exp) => (
              <div key={exp.id}>
                <div className="flex justify-between items-baseline flex-wrap font-sans">
                  <h3 className="font-bold text-black text-sm uppercase tracking-wide">
                    {exp.jobTitle}
                  </h3>
                  <span className="text-xs text-neutral-500">
                    {formatDates(exp.startDate, exp.endDate, exp.isCurrent, titles.present)}
                  </span>
                </div>
                <p className="font-sans text-xs text-neutral-600 mb-2 italic">
                  {exp.company} {exp.location && `— ${exp.location}`}
                </p>
                {exp.description && (
                  <p className="text-xs text-neutral-800 leading-relaxed whitespace-pre-line font-sans">
                    {exp.description}
                  </p>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Two Column Grid: Education & Skills */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-6">
        {education.length > 0 && (
          <section>
            <h2 className="font-sans text-xs font-bold uppercase tracking-[0.2em] text-black border-b border-black pb-1 mb-3">
              {titles.education}
            </h2>
            <div className="space-y-3 font-sans text-xs">
              {education.map((edu) => (
                <div key={edu.id}>
                  <p className="font-bold text-black uppercase">{edu.degree}</p>
                  <p className="text-neutral-700">{edu.fieldOfStudy}</p>
                  <p className="text-neutral-500">{edu.institution} ({formatDates(edu.startDate, edu.endDate, false, titles.present)})</p>
                  {edu.description && <p className="text-neutral-600 mt-0.5">{edu.description}</p>}
                </div>
              ))}
            </div>
          </section>
        )}

        {skills.length > 0 && (
          <section>
            <h2 className="font-sans text-xs font-bold uppercase tracking-[0.2em] text-black border-b border-black pb-1 mb-3">
              {titles.skills}
            </h2>
            <div className="font-sans text-xs space-y-1.5">
              {skills.map((s) => (
                <div key={s.id} className="flex justify-between border-b border-neutral-100 py-0.5">
                  <span className="text-neutral-900 font-medium">{s.name}</span>
                  {s.level && <span className="text-neutral-500 uppercase text-[10px]">{s.level}</span>}
                </div>
              ))}
            </div>
          </section>
        )}
      </div>

      {/* Projects */}
      {additional.projects.length > 0 && (
        <section className="mb-6 font-sans text-xs">
          <h2 className="text-xs font-bold uppercase tracking-[0.2em] text-black border-b border-black pb-1 mb-3">
            {titles.projects}
          </h2>
          <div className="space-y-2.5">
            {additional.projects.map((p) => (
              <div key={p.id}>
                <span className="font-bold text-black">{p.title}</span>
                {p.role && <span className="text-neutral-500"> ({p.role})</span>}
                {p.description && <p className="text-neutral-700 mt-0.5">{p.description}</p>}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Additional footer (Languages & Certs) */}
      {(languages.length > 0 || additional.certifications.length > 0) && (
        <footer className="font-sans text-xs pt-4 border-t border-black flex flex-wrap justify-between gap-4">
          {languages.length > 0 && (
            <div>
              <span className="font-bold uppercase tracking-wider block mb-1">{titles.languages}:</span>
              <span className="text-neutral-600">
                {languages.map((l) => `${l.name} (${l.proficiency})`).join(', ')}
              </span>
            </div>
          )}
          {additional.certifications.length > 0 && (
            <div>
              <span className="font-bold uppercase tracking-wider block mb-1">{titles.certifications}:</span>
              <span className="text-neutral-600">
                {additional.certifications.map((c) => c.name).join(' · ')}
              </span>
            </div>
          )}
        </footer>
      )}
    </div>
  );
};
