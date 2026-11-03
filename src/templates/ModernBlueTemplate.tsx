import React from 'react';
import { TemplateProps } from './types';
import { getSectionTitles, formatLocation, formatDates } from './templateUtils';
import { CVProfilePhoto } from '../components/CVProfilePhoto';
import { Mail, Phone, MapPin, Globe, Linkedin, CheckCircle2 } from 'lucide-react';

export const ModernBlueTemplate: React.FC<TemplateProps> = ({ cvData }) => {
  const titles = getSectionTitles(cvData);
  const { personal, experiences, education, skills, languages, additional } = cvData;
  const location = formatLocation(personal.city, personal.country);

  return (
    <div className="font-jakarta text-slate-800 bg-white w-full text-[13px] leading-relaxed box-border">
      {/* Bold Modern Blue Header */}
      <header className="bg-gradient-to-r from-blue-900 via-blue-800 to-indigo-900 text-white p-8 md:p-10">
        <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
          {personal.photoUrl && (
            <CVProfilePhoto
              photoUrl={personal.photoUrl}
              alt={personal.fullName}
              shape={personal.photoShape || 'rounded'}
              border={personal.photoBorder || 'accent'}
              accentColor="#93c5fd"
              className="w-28 h-28 shadow-md"
            />
          )}
          <div className="flex-1 text-center md:text-left">
            <h1 className="text-3xl font-extrabold tracking-tight text-white">
              {personal.fullName || 'Your Full Name'}
            </h1>
            {personal.jobTitle && (
              <p className="text-blue-200 text-base font-medium mt-1 tracking-wide">
                {personal.jobTitle}
              </p>
            )}

            {/* Contact Pills */}
            <div className="flex flex-wrap justify-center md:justify-start gap-3 mt-4 text-xs text-blue-100">
              {personal.email && (
                <div className="flex items-center gap-1.5 bg-white/10 backdrop-blur-xs px-2.5 py-1 rounded-md">
                  <Mail className="w-3.5 h-3.5 text-blue-300" />
                  <span>{personal.email}</span>
                </div>
              )}
              {personal.phone && (
                <div className="flex items-center gap-1.5 bg-white/10 backdrop-blur-xs px-2.5 py-1 rounded-md">
                  <Phone className="w-3.5 h-3.5 text-blue-300" />
                  <span>{personal.phone}</span>
                </div>
              )}
              {location && (
                <div className="flex items-center gap-1.5 bg-white/10 backdrop-blur-xs px-2.5 py-1 rounded-md">
                  <MapPin className="w-3.5 h-3.5 text-blue-300" />
                  <span>{location}</span>
                </div>
              )}
              {personal.linkedin && (
                <div className="flex items-center gap-1.5 bg-white/10 backdrop-blur-xs px-2.5 py-1 rounded-md">
                  <Linkedin className="w-3.5 h-3.5 text-blue-300" />
                  <span>{personal.linkedin}</span>
                </div>
              )}
              {personal.website && (
                <div className="flex items-center gap-1.5 bg-white/10 backdrop-blur-xs px-2.5 py-1 rounded-md">
                  <Globe className="w-3.5 h-3.5 text-blue-300" />
                  <span>{personal.website}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <div className="p-8 md:p-10 grid grid-cols-1 md:grid-cols-12 gap-8">
        {/* Left Column (Main Experience & Summary, 7 cols) */}
        <main className="md:col-span-8 space-y-6">
          {/* Summary */}
          {personal.summary && (
            <section>
              <h2 className="text-sm font-bold uppercase tracking-wider text-blue-900 flex items-center gap-2 border-b-2 border-blue-100 pb-1.5 mb-2.5">
                <span className="w-2 h-2 rounded-full bg-blue-600"></span>
                {titles.summary}
              </h2>
              <p className="text-slate-700 leading-relaxed text-justify whitespace-pre-line text-[13px]">
                {personal.summary}
              </p>
            </section>
          )}

          {/* Work Experience */}
          {experiences.length > 0 && (
            <section>
              <h2 className="text-sm font-bold uppercase tracking-wider text-blue-900 flex items-center gap-2 border-b-2 border-blue-100 pb-1.5 mb-3">
                <span className="w-2 h-2 rounded-full bg-blue-600"></span>
                {titles.experience}
              </h2>
              <div className="space-y-4">
                {experiences.map((exp) => (
                  <div key={exp.id} className="relative pl-4 border-l-2 border-blue-200">
                    <div className="absolute -left-[5px] top-1.5 w-2 h-2 rounded-full bg-blue-600 ring-4 ring-white" />
                    <div className="flex justify-between items-baseline flex-wrap gap-1">
                      <h3 className="font-bold text-slate-900 text-sm">{exp.jobTitle}</h3>
                      <span className="text-xs font-semibold text-blue-700 bg-blue-50 px-2 py-0.5 rounded">
                        {formatDates(exp.startDate, exp.endDate, exp.isCurrent, titles.present)}
                      </span>
                    </div>
                    <p className="text-xs font-medium text-slate-600 mb-1.5">
                      {exp.company} {exp.location && `• ${exp.location}`}
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

          {/* Projects */}
          {additional.projects.length > 0 && (
            <section>
              <h2 className="text-sm font-bold uppercase tracking-wider text-blue-900 flex items-center gap-2 border-b-2 border-blue-100 pb-1.5 mb-3">
                <span className="w-2 h-2 rounded-full bg-blue-600"></span>
                {titles.projects}
              </h2>
              <div className="space-y-3">
                {additional.projects.map((proj) => (
                  <div key={proj.id} className="bg-slate-50 p-3 rounded-lg border border-slate-200/80">
                    <div className="flex justify-between items-baseline font-bold text-slate-900 text-xs">
                      <span>{proj.title} {proj.role && <span className="font-normal text-slate-500">({proj.role})</span>}</span>
                      {proj.link && <a href={proj.link} target="_blank" rel="noreferrer" className="text-blue-600 underline font-normal text-[11px]">{proj.link}</a>}
                    </div>
                    {proj.description && <p className="text-xs text-slate-600 mt-1">{proj.description}</p>}
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Volunteer */}
          {additional.volunteer.length > 0 && (
            <section>
              <h2 className="text-sm font-bold uppercase tracking-wider text-blue-900 flex items-center gap-2 border-b-2 border-blue-100 pb-1.5 mb-2.5">
                <span className="w-2 h-2 rounded-full bg-blue-600"></span>
                {titles.volunteer}
              </h2>
              <div className="space-y-2 text-xs">
                {additional.volunteer.map((v) => (
                  <div key={v.id}>
                    <div className="flex justify-between font-semibold text-slate-900">
                      <span>{v.role} – {v.organization}</span>
                      <span className="text-slate-500 font-normal">{formatDates(v.startDate, v.endDate, false, titles.present)}</span>
                    </div>
                    {v.description && <p className="text-slate-600">{v.description}</p>}
                  </div>
                ))}
              </div>
            </section>
          )}
        </main>

        {/* Right Sidebar (Skills, Education, Languages, 4 cols) */}
        <aside className="md:col-span-4 space-y-6">
          {/* Skills */}
          {skills.length > 0 && (
            <section>
              <h2 className="text-xs font-bold uppercase tracking-wider text-slate-900 border-b border-slate-200 pb-1.5 mb-3">
                {titles.skills}
              </h2>
              <div className="space-y-2 text-xs">
                {skills.map((skill) => (
                  <div key={skill.id} className="bg-slate-50 p-2 rounded border border-slate-100">
                    <div className="flex justify-between items-center font-medium text-slate-800">
                      <span>{skill.name}</span>
                      {skill.level && <span className="text-[11px] text-blue-700 font-semibold">{skill.level}</span>}
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Education */}
          {education.length > 0 && (
            <section>
              <h2 className="text-xs font-bold uppercase tracking-wider text-slate-900 border-b border-slate-200 pb-1.5 mb-3">
                {titles.education}
              </h2>
              <div className="space-y-3 text-xs">
                {education.map((edu) => (
                  <div key={edu.id}>
                    <p className="font-bold text-slate-900">{edu.degree}</p>
                    {edu.fieldOfStudy && <p className="text-blue-700 font-medium">{edu.fieldOfStudy}</p>}
                    <p className="text-slate-600">{edu.institution}</p>
                    <p className="text-[11px] text-slate-500">{formatDates(edu.startDate, edu.endDate, false, titles.present)}</p>
                    {edu.description && <p className="text-[11px] text-slate-600 mt-1">{edu.description}</p>}
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Languages */}
          {languages.length > 0 && (
            <section>
              <h2 className="text-xs font-bold uppercase tracking-wider text-slate-900 border-b border-slate-200 pb-1.5 mb-3">
                {titles.languages}
              </h2>
              <div className="space-y-1.5 text-xs">
                {languages.map((lang) => (
                  <div key={lang.id} className="flex justify-between items-center py-0.5 border-b border-slate-100">
                    <span className="font-medium text-slate-800">{lang.name}</span>
                    <span className="text-[11px] text-slate-500">{lang.proficiency}</span>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Certifications */}
          {additional.certifications.length > 0 && (
            <section>
              <h2 className="text-xs font-bold uppercase tracking-wider text-slate-900 border-b border-slate-200 pb-1.5 mb-3">
                {titles.certifications}
              </h2>
              <div className="space-y-2 text-xs">
                {additional.certifications.map((c) => (
                  <div key={c.id} className="flex items-start gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-blue-600 shrink-0 mt-0.5" />
                    <div>
                      <p className="font-semibold text-slate-900">{c.name}</p>
                      <p className="text-[11px] text-slate-500">{c.issuer} {c.date && `• ${c.date}`}</p>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* References */}
          {additional.references.length > 0 && (
            <section>
              <h2 className="text-xs font-bold uppercase tracking-wider text-slate-900 border-b border-slate-200 pb-1.5 mb-2">
                {titles.references}
              </h2>
              <div className="space-y-2 text-xs">
                {additional.references.map((r) => (
                  <div key={r.id} className="text-[11px]">
                    <p className="font-bold text-slate-800">{r.fullName}</p>
                    <p className="text-slate-600">{r.jobTitle}, {r.company}</p>
                    {r.email && <p className="text-blue-600">{r.email}</p>}
                  </div>
                ))}
              </div>
            </section>
          )}
        </aside>
      </div>
    </div>
  );
};
