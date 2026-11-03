import React from 'react';
import { TemplateProps } from './types';
import { getSectionTitles, formatLocation, formatDates } from './templateUtils';
import { CVProfilePhoto } from '../components/CVProfilePhoto';
import { Mail, Phone, MapPin, Globe, Linkedin, Briefcase, Award } from 'lucide-react';

export const CorporateProfessionalTemplate: React.FC<TemplateProps> = ({ cvData }) => {
  const titles = getSectionTitles(cvData);
  const { personal, experiences, education, skills, languages, additional } = cvData;
  const location = formatLocation(personal.city, personal.country);

  return (
    <div className="font-inter bg-white text-slate-800 w-full text-[13px] leading-relaxed box-border">
      {/* Top Corporate Bar */}
      <div className="h-3 bg-slate-900 w-full" />

      {/* Corporate Header */}
      <header className="p-8 md:p-10 pb-6 border-b border-slate-200">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div className="space-y-1">
            <h1 className="text-3xl font-bold tracking-tight text-slate-900">
              {personal.fullName || 'Corporate Candidate'}
            </h1>
            {personal.jobTitle && (
              <p className="text-sm font-semibold uppercase tracking-wider text-slate-600">
                {personal.jobTitle}
              </p>
            )}
          </div>

          {personal.photoUrl && (
            <CVProfilePhoto
              photoUrl={personal.photoUrl}
              alt={personal.fullName}
              shape={personal.photoShape || 'rounded'}
              border={personal.photoBorder || 'thin'}
              className="w-24 h-24 shadow-xs"
            />
          )}
        </div>

        {/* Corporate Contact Row */}
        <div className="flex flex-wrap gap-x-6 gap-y-1.5 text-xs text-slate-600 mt-4 pt-4 border-t border-slate-100">
          {personal.email && (
            <div className="flex items-center gap-1.5">
              <Mail className="w-3.5 h-3.5 text-slate-700" />
              <span>{personal.email}</span>
            </div>
          )}
          {personal.phone && (
            <div className="flex items-center gap-1.5">
              <Phone className="w-3.5 h-3.5 text-slate-700" />
              <span>{personal.phone}</span>
            </div>
          )}
          {location && (
            <div className="flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-slate-700" />
              <span>{location}</span>
            </div>
          )}
          {personal.linkedin && (
            <div className="flex items-center gap-1.5">
              <Linkedin className="w-3.5 h-3.5 text-slate-700" />
              <span>{personal.linkedin}</span>
            </div>
          )}
        </div>
      </header>

      {/* Dual Column Layout */}
      <div className="p-8 md:p-10 pt-6 grid grid-cols-1 md:grid-cols-12 gap-8">
        {/* Left Primary Column: Summary, Experience, Projects (8 cols) */}
        <div className="md:col-span-8 space-y-6">
          {/* Summary */}
          {personal.summary && (
            <section>
              <h2 className="text-xs font-bold uppercase tracking-wider text-slate-900 border-b-2 border-slate-800 pb-1 mb-2">
                {titles.summary}
              </h2>
              <p className="text-slate-700 text-justify leading-relaxed whitespace-pre-line text-xs">
                {personal.summary}
              </p>
            </section>
          )}

          {/* Experience */}
          {experiences.length > 0 && (
            <section>
              <h2 className="text-xs font-bold uppercase tracking-wider text-slate-900 border-b-2 border-slate-800 pb-1 mb-3">
                {titles.experience}
              </h2>
              <div className="space-y-4">
                {experiences.map((exp) => (
                  <div key={exp.id}>
                    <div className="flex justify-between items-baseline flex-wrap">
                      <h3 className="font-bold text-slate-900 text-sm">{exp.jobTitle}</h3>
                      <span className="text-xs font-medium text-slate-500">
                        {formatDates(exp.startDate, exp.endDate, exp.isCurrent, titles.present)}
                      </span>
                    </div>
                    <p className="text-xs font-semibold text-slate-700 mb-1.5">
                      {exp.company} {exp.location && `· ${exp.location}`}
                    </p>
                    {exp.description && (
                      <p className="text-xs text-slate-600 leading-relaxed whitespace-pre-line">
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
              <h2 className="text-xs font-bold uppercase tracking-wider text-slate-900 border-b-2 border-slate-800 pb-1 mb-3">
                {titles.projects}
              </h2>
              <div className="space-y-3 text-xs">
                {additional.projects.map((p) => (
                  <div key={p.id}>
                    <div className="flex justify-between font-semibold text-slate-900">
                      <span>{p.title} {p.role && <span className="font-normal text-slate-600">— {p.role}</span>}</span>
                      {p.link && <a href={p.link} className="text-blue-700 underline text-[11px]">{p.link}</a>}
                    </div>
                    {p.description && <p className="text-slate-600 mt-0.5">{p.description}</p>}
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>

        {/* Right Rail: Skills, Education, Certs, Languages (4 cols) */}
        <div className="md:col-span-4 space-y-6">
          {/* Skills */}
          {skills.length > 0 && (
            <section>
              <h2 className="text-xs font-bold uppercase tracking-wider text-slate-900 border-b border-slate-300 pb-1 mb-2">
                {titles.skills}
              </h2>
              <div className="space-y-1.5 text-xs">
                {skills.map((s) => (
                  <div key={s.id} className="flex justify-between items-center py-0.5 border-b border-slate-100">
                    <span className="font-medium text-slate-800">{s.name}</span>
                    {s.level && <span className="text-[10px] text-slate-500 uppercase">{s.level}</span>}
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Education */}
          {education.length > 0 && (
            <section>
              <h2 className="text-xs font-bold uppercase tracking-wider text-slate-900 border-b border-slate-300 pb-1 mb-2">
                {titles.education}
              </h2>
              <div className="space-y-2.5 text-xs">
                {education.map((edu) => (
                  <div key={edu.id}>
                    <p className="font-bold text-slate-900">{edu.degree}</p>
                    <p className="text-slate-600">{edu.fieldOfStudy}</p>
                    <p className="text-slate-500 text-[11px]">{edu.institution} ({formatDates(edu.startDate, edu.endDate, false, titles.present)})</p>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Certifications */}
          {additional.certifications.length > 0 && (
            <section>
              <h2 className="text-xs font-bold uppercase tracking-wider text-slate-900 border-b border-slate-300 pb-1 mb-2">
                {titles.certifications}
              </h2>
              <div className="space-y-2 text-xs">
                {additional.certifications.map((c) => (
                  <div key={c.id}>
                    <p className="font-semibold text-slate-900">{c.name}</p>
                    <p className="text-slate-500 text-[11px]">{c.issuer} {c.date && `(${c.date})`}</p>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Languages */}
          {languages.length > 0 && (
            <section>
              <h2 className="text-xs font-bold uppercase tracking-wider text-slate-900 border-b border-slate-300 pb-1 mb-2">
                {titles.languages}
              </h2>
              <div className="space-y-1 text-xs">
                {languages.map((l) => (
                  <div key={l.id} className="flex justify-between">
                    <span>{l.name}</span>
                    <span className="text-slate-500 text-[11px]">{l.proficiency}</span>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* References */}
          {additional.references.length > 0 && (
            <section>
              <h2 className="text-xs font-bold uppercase tracking-wider text-slate-900 border-b border-slate-300 pb-1 mb-2">
                {titles.references}
              </h2>
              <p className="text-xs text-slate-500 italic">Furnished upon request</p>
            </section>
          )}
        </div>
      </div>
    </div>
  );
};
