import React from 'react';
import { TemplateProps } from './types';
import { getSectionTitles, formatLocation, formatDates } from './templateUtils';
import { CVProfilePhoto } from '../components/CVProfilePhoto';
import { Mail, Phone, MapPin, Globe, Linkedin } from 'lucide-react';

export const ClassicProfessionalTemplate: React.FC<TemplateProps> = ({ cvData }) => {
  const titles = getSectionTitles(cvData);
  const { personal, experiences, education, skills, languages, additional } = cvData;
  const location = formatLocation(personal.city, personal.country);

  return (
    <div className="font-merriweather text-slate-900 bg-white p-8 sm:p-10 w-full text-[13px] leading-relaxed box-border">
      {/* Centered Header */}
      <header className="text-center pb-5 border-b-2 border-slate-900 mb-6">
        {personal.photoUrl && (
          <div className="mb-4 flex justify-center">
            <CVProfilePhoto
              photoUrl={personal.photoUrl}
              alt={personal.fullName}
              shape={personal.photoShape || 'circle'}
              border={personal.photoBorder || 'thin'}
              className="w-24 h-24"
            />
          </div>
        )}
        <h1 className="text-3xl font-bold tracking-tight uppercase text-slate-900 font-serif">
          {personal.fullName || 'Your Full Name'}
        </h1>
        {personal.jobTitle && (
          <p className="text-sm font-medium tracking-wide text-slate-700 mt-1 italic">
            {personal.jobTitle}
          </p>
        )}

        {/* Contact Info Row */}
        <div className="flex flex-wrap justify-center items-center gap-x-4 gap-y-1 text-xs text-slate-700 mt-3 font-sans">
          {personal.email && (
            <a href={`mailto:${personal.email}`} className="inline-flex items-center gap-1 hover:underline text-inherit">
              <Mail className="w-3.5 h-3.5 text-slate-500" />
              <span>{personal.email}</span>
            </a>
          )}
          {personal.phone && (
            <a href={`tel:${personal.phone.replace(/[^\d+]/g, '')}`} className="inline-flex items-center gap-1 hover:underline text-inherit">
              <Phone className="w-3.5 h-3.5 text-slate-500" />
              <span>{personal.phone}</span>
            </a>
          )}
          {location && (
            <span className="inline-flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5 text-slate-500" />
              <span>{location}</span>
            </span>
          )}
          {personal.linkedin && (
            <a
              href={personal.linkedin.startsWith('http') ? personal.linkedin : `https://${personal.linkedin}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 hover:underline text-inherit"
            >
              <Linkedin className="w-3.5 h-3.5 text-slate-500" />
              <span>{personal.linkedin}</span>
            </a>
          )}
          {personal.website && (
            <a
              href={personal.website.startsWith('http') ? personal.website : `https://${personal.website}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 hover:underline text-inherit"
            >
              <Globe className="w-3.5 h-3.5 text-slate-500" />
              <span>{personal.website}</span>
            </a>
          )}
        </div>
      </header>

      {/* Summary */}
      {personal.summary && (
        <section className="mb-6">
          <h2 className="text-sm font-bold uppercase tracking-wider text-slate-900 border-b border-slate-300 pb-1 mb-2 font-serif">
            {titles.summary}
          </h2>
          <p className="text-slate-800 text-justify leading-relaxed whitespace-pre-line">
            {personal.summary}
          </p>
        </section>
      )}

      {/* Experience */}
      {experiences.length > 0 && (
        <section className="mb-6">
          <h2 className="text-sm font-bold uppercase tracking-wider text-slate-900 border-b border-slate-300 pb-1 mb-3 font-serif">
            {titles.experience}
          </h2>
          <div className="space-y-4">
            {experiences.map((exp) => (
              <div key={exp.id}>
                <div className="flex justify-between items-baseline flex-wrap gap-1">
                  <h3 className="font-bold text-slate-900 text-sm">
                    {exp.jobTitle}
                  </h3>
                  <span className="text-xs font-sans text-slate-600 font-medium">
                    {formatDates(exp.startDate, exp.endDate, exp.isCurrent, titles.present)}
                  </span>
                </div>
                <div className="flex justify-between items-baseline text-xs text-slate-700 italic font-sans mb-1.5">
                  <span>{exp.company}</span>
                  {exp.location && <span>{exp.location}</span>}
                </div>
                {exp.description && (
                  <div className="text-xs text-slate-800 leading-relaxed whitespace-pre-line font-sans pl-1">
                    {exp.description}
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Education */}
      {education.length > 0 && (
        <section className="mb-6">
          <h2 className="text-sm font-bold uppercase tracking-wider text-slate-900 border-b border-slate-300 pb-1 mb-3 font-serif">
            {titles.education}
          </h2>
          <div className="space-y-3">
            {education.map((edu) => (
              <div key={edu.id}>
                <div className="flex justify-between items-baseline flex-wrap gap-1">
                  <h3 className="font-bold text-slate-900 text-sm">
                    {edu.degree} {edu.fieldOfStudy ? `in ${edu.fieldOfStudy}` : ''}
                  </h3>
                  <span className="text-xs font-sans text-slate-600">
                    {formatDates(edu.startDate, edu.endDate, false, titles.present)}
                  </span>
                </div>
                <div className="text-xs text-slate-700 italic font-sans">
                  {edu.institution}
                </div>
                {edu.description && (
                  <p className="text-xs text-slate-700 mt-1 font-sans">
                    {edu.description}
                  </p>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Skills */}
      {skills.length > 0 && (
        <section className="mb-6">
          <h2 className="text-sm font-bold uppercase tracking-wider text-slate-900 border-b border-slate-300 pb-1 mb-2 font-serif">
            {titles.skills}
          </h2>
          <div className="flex flex-wrap gap-x-4 gap-y-1.5 text-xs font-sans">
            {skills.map((skill) => (
              <span key={skill.id} className="text-slate-800">
                <span className="font-semibold">{skill.name}</span>
                {skill.level && <span className="text-slate-500 text-[11px] ml-1">({skill.level})</span>}
              </span>
            ))}
          </div>
        </section>
      )}

      {/* Languages */}
      {languages.length > 0 && (
        <section className="mb-6">
          <h2 className="text-sm font-bold uppercase tracking-wider text-slate-900 border-b border-slate-300 pb-1 mb-2 font-serif">
            {titles.languages}
          </h2>
          <div className="flex flex-wrap gap-x-6 gap-y-1 text-xs font-sans">
            {languages.map((lang) => (
              <span key={lang.id} className="text-slate-800">
                <span className="font-medium">{lang.name}</span>: <span className="text-slate-600">{lang.proficiency}</span>
              </span>
            ))}
          </div>
        </section>
      )}

      {/* Projects */}
      {additional.projects.length > 0 && (
        <section className="mb-6">
          <h2 className="text-sm font-bold uppercase tracking-wider text-slate-900 border-b border-slate-300 pb-1 mb-2 font-serif">
            {titles.projects}
          </h2>
          <div className="space-y-2.5">
            {additional.projects.map((proj) => (
              <div key={proj.id} className="text-xs font-sans">
                <div className="flex justify-between items-baseline font-bold text-slate-900">
                  <span>{proj.title} {proj.role && <span className="font-normal italic text-slate-700">— {proj.role}</span>}</span>
                  {proj.link && <span className="text-blue-700 text-[11px] underline">{proj.link}</span>}
                </div>
                {proj.description && <p className="text-slate-700 mt-0.5">{proj.description}</p>}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Certifications & Awards */}
      {(additional.certifications.length > 0 || additional.awards.length > 0) && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          {additional.certifications.length > 0 && (
            <div>
              <h2 className="text-sm font-bold uppercase tracking-wider text-slate-900 border-b border-slate-300 pb-1 mb-2 font-serif">
                {titles.certifications}
              </h2>
              <ul className="list-disc list-inside text-xs font-sans space-y-1 text-slate-800">
                {additional.certifications.map((c) => (
                  <li key={c.id}>
                    <span className="font-semibold">{c.name}</span> – {c.issuer} {c.date && `(${c.date})`}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {additional.awards.length > 0 && (
            <div>
              <h2 className="text-sm font-bold uppercase tracking-wider text-slate-900 border-b border-slate-300 pb-1 mb-2 font-serif">
                {titles.awards}
              </h2>
              <ul className="list-disc list-inside text-xs font-sans space-y-1 text-slate-800">
                {additional.awards.map((a) => (
                  <li key={a.id}>
                    <span className="font-semibold">{a.title}</span> – {a.issuer} {a.date && `(${a.date})`}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}

      {/* Volunteer */}
      {additional.volunteer.length > 0 && (
        <section className="mb-6">
          <h2 className="text-sm font-bold uppercase tracking-wider text-slate-900 border-b border-slate-300 pb-1 mb-2 font-serif">
            {titles.volunteer}
          </h2>
          <div className="space-y-2 text-xs font-sans">
            {additional.volunteer.map((v) => (
              <div key={v.id}>
                <div className="flex justify-between font-semibold text-slate-900">
                  <span>{v.role} – {v.organization}</span>
                  <span className="text-slate-600 font-normal">{formatDates(v.startDate, v.endDate, false, titles.present)}</span>
                </div>
                {v.description && <p className="text-slate-700">{v.description}</p>}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* References */}
      {additional.references.length > 0 && (
        <section>
          <h2 className="text-sm font-bold uppercase tracking-wider text-slate-900 border-b border-slate-300 pb-1 mb-2 font-serif">
            {titles.references}
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs font-sans">
            {additional.references.map((ref) => (
              <div key={ref.id} className="p-2 border border-slate-200 rounded-sm">
                <p className="font-bold text-slate-900">{ref.fullName}</p>
                <p className="text-slate-700">{ref.jobTitle}, {ref.company}</p>
                {ref.email && <p className="text-slate-600">{ref.email}</p>}
                {ref.phone && <p className="text-slate-600">{ref.phone}</p>}
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
};
