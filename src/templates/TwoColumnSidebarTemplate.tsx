import React from 'react';
import { TemplateProps } from './types';
import { getSectionTitles, formatLocation, formatDates } from './templateUtils';
import { CVProfilePhoto } from '../components/CVProfilePhoto';
import { Mail, Phone, MapPin, Globe, Linkedin, Award, BookOpen } from 'lucide-react';

export const TwoColumnSidebarTemplate: React.FC<TemplateProps> = ({ cvData }) => {
  const titles = getSectionTitles(cvData);
  const { personal, experiences, education, skills, languages, additional } = cvData;
  const location = formatLocation(personal.city, personal.country);

  return (
    <div className="font-inter bg-white w-full text-[13px] leading-relaxed min-h-[1123px] flex flex-col md:flex-row box-border">
      {/* Left Sidebar (35%) */}
      <aside className="w-full md:w-[35%] bg-slate-900 text-slate-100 p-6 md:p-8 flex flex-col justify-between shrink-0">
        <div className="space-y-6">
          {/* Photo */}
          {personal.photoUrl ? (
            <div className="flex justify-center">
              <CVProfilePhoto
                photoUrl={personal.photoUrl}
                alt={personal.fullName}
                shape={personal.photoShape || 'circle'}
                border={personal.photoBorder || 'accent'}
                accentColor="#3b82f6"
                className="w-32 h-32 shadow-lg"
              />
            </div>
          ) : (
            <div className="w-20 h-20 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-xl font-bold text-blue-400 mx-auto">
              {personal.fullName ? personal.fullName.charAt(0) : 'CV'}
            </div>
          )}

          {/* Contact Details */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-blue-400 border-b border-slate-800 pb-1.5 mb-3">
              Contact
            </h3>
            <div className="space-y-2.5 text-xs text-slate-300">
              {personal.email && (
                <div className="flex items-start gap-2 break-all">
                  <Mail className="w-3.5 h-3.5 text-blue-400 shrink-0 mt-0.5" />
                  <span>{personal.email}</span>
                </div>
              )}
              {personal.phone && (
                <div className="flex items-center gap-2">
                  <Phone className="w-3.5 h-3.5 text-blue-400 shrink-0" />
                  <span>{personal.phone}</span>
                </div>
              )}
              {location && (
                <div className="flex items-start gap-2">
                  <MapPin className="w-3.5 h-3.5 text-blue-400 shrink-0 mt-0.5" />
                  <span>{location}</span>
                </div>
              )}
              {personal.linkedin && (
                <div className="flex items-start gap-2 break-all">
                  <Linkedin className="w-3.5 h-3.5 text-blue-400 shrink-0 mt-0.5" />
                  <span>{personal.linkedin}</span>
                </div>
              )}
              {personal.website && (
                <div className="flex items-start gap-2 break-all">
                  <Globe className="w-3.5 h-3.5 text-blue-400 shrink-0 mt-0.5" />
                  <span>{personal.website}</span>
                </div>
              )}
            </div>
          </div>

          {/* Skills */}
          {skills.length > 0 && (
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-blue-400 border-b border-slate-800 pb-1.5 mb-3">
                {titles.skills}
              </h3>
              <div className="space-y-2 text-xs">
                {skills.map((skill) => (
                  <div key={skill.id}>
                    <div className="flex justify-between text-slate-200">
                      <span>{skill.name}</span>
                      {skill.level && <span className="text-[11px] text-blue-400">{skill.level}</span>}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Languages */}
          {languages.length > 0 && (
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-blue-400 border-b border-slate-800 pb-1.5 mb-3">
                {titles.languages}
              </h3>
              <div className="space-y-1.5 text-xs">
                {languages.map((l) => (
                  <div key={l.id} className="flex justify-between text-slate-300">
                    <span>{l.name}</span>
                    <span className="text-slate-400 text-[11px]">{l.proficiency}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Certifications in sidebar */}
          {additional.certifications.length > 0 && (
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-blue-400 border-b border-slate-800 pb-1.5 mb-3">
                {titles.certifications}
              </h3>
              <div className="space-y-2 text-xs text-slate-300">
                {additional.certifications.map((c) => (
                  <div key={c.id}>
                    <p className="font-semibold text-slate-100">{c.name}</p>
                    <p className="text-[11px] text-slate-400">{c.issuer} {c.date && `(${c.date})`}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </aside>

      {/* Right Content Area (65%) */}
      <main className="w-full md:w-[65%] p-6 md:p-10 space-y-6 text-slate-800">
        {/* Name and Title */}
        <header className="border-b border-slate-200 pb-4">
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
            {personal.fullName || 'Your Full Name'}
          </h1>
          {personal.jobTitle && (
            <p className="text-sm font-semibold text-blue-700 uppercase tracking-wider mt-1">
              {personal.jobTitle}
            </p>
          )}
        </header>

        {/* Summary */}
        {personal.summary && (
          <section>
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-900 mb-2 border-b-2 border-blue-600 pb-1 inline-block">
              {titles.summary}
            </h2>
            <p className="text-slate-700 leading-relaxed text-justify whitespace-pre-line text-xs">
              {personal.summary}
            </p>
          </section>
        )}

        {/* Experience */}
        {experiences.length > 0 && (
          <section>
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-900 mb-3 border-b-2 border-blue-600 pb-1 inline-block">
              {titles.experience}
            </h2>
            <div className="space-y-4">
              {experiences.map((exp) => (
                <div key={exp.id}>
                  <div className="flex justify-between items-baseline flex-wrap gap-1">
                    <h3 className="font-bold text-slate-900 text-sm">{exp.jobTitle}</h3>
                    <span className="text-xs font-medium text-slate-500">
                      {formatDates(exp.startDate, exp.endDate, exp.isCurrent, titles.present)}
                    </span>
                  </div>
                  <p className="text-xs text-blue-800 font-medium mb-1">
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

        {/* Education */}
        {education.length > 0 && (
          <section>
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-900 mb-3 border-b-2 border-blue-600 pb-1 inline-block">
              {titles.education}
            </h2>
            <div className="space-y-3">
              {education.map((edu) => (
                <div key={edu.id} className="text-xs">
                  <div className="flex justify-between font-bold text-slate-900">
                    <span>{edu.degree} {edu.fieldOfStudy ? `in ${edu.fieldOfStudy}` : ''}</span>
                    <span className="text-slate-500 font-normal">{formatDates(edu.startDate, edu.endDate, false, titles.present)}</span>
                  </div>
                  <p className="text-slate-600">{edu.institution}</p>
                  {edu.description && <p className="text-slate-600 mt-0.5">{edu.description}</p>}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Projects */}
        {additional.projects.length > 0 && (
          <section>
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-900 mb-3 border-b-2 border-blue-600 pb-1 inline-block">
              {titles.projects}
            </h2>
            <div className="space-y-2 text-xs">
              {additional.projects.map((p) => (
                <div key={p.id}>
                  <div className="flex justify-between font-semibold text-slate-900">
                    <span>{p.title} {p.role && <span className="font-normal text-slate-500">— {p.role}</span>}</span>
                    {p.link && <span className="text-blue-600 text-[11px] underline">{p.link}</span>}
                  </div>
                  {p.description && <p className="text-slate-600">{p.description}</p>}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* References */}
        {additional.references.length > 0 && (
          <section className="pt-2 border-t border-slate-100">
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-900 mb-2">
              {titles.references}
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
              {additional.references.map((r) => (
                <div key={r.id} className="text-[11px]">
                  <p className="font-semibold text-slate-900">{r.fullName}</p>
                  <p className="text-slate-600">{r.jobTitle}, {r.company}</p>
                  {r.email && <p className="text-slate-500">{r.email}</p>}
                </div>
              ))}
            </div>
          </section>
        )}
      </main>
    </div>
  );
};
