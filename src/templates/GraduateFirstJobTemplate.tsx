import React from 'react';
import { TemplateProps } from './types';
import { getSectionTitles, formatLocation, formatDates } from './templateUtils';
import { CVProfilePhoto } from '../components/CVProfilePhoto';
import { GraduationCap, Briefcase, Award, HeartHandshake, Mail, Phone, MapPin, Globe } from 'lucide-react';

export const GraduateFirstJobTemplate: React.FC<TemplateProps> = ({ cvData }) => {
  const titles = getSectionTitles(cvData);
  const { personal, experiences, education, skills, languages, additional } = cvData;
  const location = formatLocation(personal.city, personal.country);

  return (
    <div className="font-jakarta bg-white text-slate-800 p-8 sm:p-10 w-full text-[13px] leading-relaxed box-border">
      {/* Friendly, Professional Graduate Header */}
      <header className="border-b-2 border-emerald-600/30 pb-6 mb-6">
        <div className="flex flex-col sm:flex-row items-center sm:items-start justify-between gap-4">
          <div className="text-center sm:text-left">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-md inline-block mb-2">
              Early Career Candidate
            </span>
            <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
              {personal.fullName || 'Graduate Candidate'}
            </h1>
            {personal.jobTitle && (
              <p className="text-slate-600 font-medium text-sm mt-0.5">
                {personal.jobTitle}
              </p>
            )}

            <div className="flex flex-wrap justify-center sm:justify-start gap-x-4 gap-y-1 mt-3 text-xs text-slate-600">
              {personal.email && (
                <span className="flex items-center gap-1">
                  <Mail className="w-3.5 h-3.5 text-emerald-600" />
                  {personal.email}
                </span>
              )}
              {personal.phone && (
                <span className="flex items-center gap-1">
                  <Phone className="w-3.5 h-3.5 text-emerald-600" />
                  {personal.phone}
                </span>
              )}
              {location && (
                <span className="flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-emerald-600" />
                  {location}
                </span>
              )}
            </div>
          </div>

          {personal.photoUrl && (
            <CVProfilePhoto
              photoUrl={personal.photoUrl}
              alt={personal.fullName}
              shape={personal.photoShape || 'circle'}
              border={personal.photoBorder || 'accent'}
              accentColor="#10b981"
              className="w-24 h-24 shadow-sm"
            />
          )}
        </div>
      </header>

      {/* Career Objective / Summary */}
      {personal.summary && (
        <section className="bg-emerald-50/50 p-4 rounded-lg border border-emerald-100 mb-6">
          <h2 className="text-xs font-bold uppercase tracking-wider text-emerald-900 mb-1.5">
            Career Objective & Profile
          </h2>
          <p className="text-xs text-slate-700 leading-relaxed text-justify whitespace-pre-line">
            {personal.summary}
          </p>
        </section>
      )}

      {/* Education First for Graduates */}
      {education.length > 0 && (
        <section className="mb-6">
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-900 flex items-center gap-2 border-b border-slate-200 pb-1 mb-3">
            <GraduationCap className="w-4 h-4 text-emerald-600" />
            {titles.education} & Academic Achievements
          </h2>
          <div className="space-y-3">
            {education.map((edu) => (
              <div key={edu.id} className="p-3 bg-slate-50/80 rounded-lg border border-slate-100">
                <div className="flex justify-between items-baseline font-bold text-slate-900 text-xs">
                  <span>{edu.degree} in {edu.fieldOfStudy}</span>
                  <span className="text-emerald-700 text-[11px] font-semibold">
                    {formatDates(edu.startDate, edu.endDate, false, titles.present)}
                  </span>
                </div>
                <p className="text-xs text-slate-600 font-medium">{edu.institution}</p>
                {edu.description && (
                  <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                    {edu.description}
                  </p>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Key Projects (Demonstrating hands-on capability) */}
      {additional.projects.length > 0 && (
        <section className="mb-6">
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-900 flex items-center gap-2 border-b border-slate-200 pb-1 mb-3">
            <Award className="w-4 h-4 text-emerald-600" />
            {titles.projects} & Practical Work
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            {additional.projects.map((p) => (
              <div key={p.id} className="p-3 bg-white border border-slate-200 rounded-lg">
                <div className="flex justify-between font-bold text-slate-900">
                  <span>{p.title}</span>
                  {p.link && <a href={p.link} target="_blank" rel="noreferrer" className="text-emerald-600 underline font-normal text-[10px]">View</a>}
                </div>
                {p.role && <p className="text-[11px] text-emerald-700 font-medium">{p.role}</p>}
                {p.description && <p className="text-slate-600 text-xs mt-1">{p.description}</p>}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Practical Experience / Internships */}
      {experiences.length > 0 && (
        <section className="mb-6">
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-900 flex items-center gap-2 border-b border-slate-200 pb-1 mb-3">
            <Briefcase className="w-4 h-4 text-emerald-600" />
            {titles.experience} & Internships
          </h2>
          <div className="space-y-3">
            {experiences.map((exp) => (
              <div key={exp.id} className="text-xs">
                <div className="flex justify-between items-baseline font-bold text-slate-900">
                  <span>{exp.jobTitle} – <span className="text-slate-600 font-normal">{exp.company}</span></span>
                  <span className="text-slate-500 font-normal">{formatDates(exp.startDate, exp.endDate, exp.isCurrent, titles.present)}</span>
                </div>
                {exp.description && <p className="text-slate-600 mt-1 whitespace-pre-line leading-relaxed">{exp.description}</p>}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Two columns: Skills & Volunteer */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        {/* Skills */}
        {skills.length > 0 && (
          <div>
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-900 border-b border-slate-200 pb-1 mb-2">
              {titles.skills}
            </h2>
            <div className="flex flex-wrap gap-1.5">
              {skills.map((s) => (
                <span key={s.id} className="bg-slate-100 text-slate-800 text-[11px] px-2.5 py-1 rounded-md">
                  {s.name} {s.level && <span className="text-slate-400">({s.level})</span>}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Volunteer & Extracurricular */}
        {additional.volunteer.length > 0 && (
          <div>
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-900 flex items-center gap-1.5 border-b border-slate-200 pb-1 mb-2">
              <HeartHandshake className="w-3.5 h-3.5 text-emerald-600" />
              {titles.volunteer} & Activities
            </h2>
            <div className="space-y-2 text-xs">
              {additional.volunteer.map((v) => (
                <div key={v.id}>
                  <p className="font-semibold text-slate-800">{v.role} – {v.organization}</p>
                  {v.description && <p className="text-slate-600 text-[11px]">{v.description}</p>}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Languages & References Footer */}
      {(languages.length > 0 || additional.references.length > 0) && (
        <footer className="pt-3 border-t border-slate-200 text-xs flex flex-wrap justify-between gap-4">
          {languages.length > 0 && (
            <div>
              <span className="font-bold text-slate-900 mr-2">{titles.languages}:</span>
              <span className="text-slate-600">
                {languages.map((l) => `${l.name} (${l.proficiency})`).join(' · ')}
              </span>
            </div>
          )}
          {additional.references.length > 0 && (
            <p className="text-slate-500 italic">References available upon request</p>
          )}
        </footer>
      )}
    </div>
  );
};
