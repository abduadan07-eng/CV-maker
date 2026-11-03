import React, { useState } from 'react';
import { AdditionalSections, Project, Certification, Award, VolunteerExperience, Reference } from '../types/cv';
import { useLanguage } from '../i18n/LanguageContext';
import { Plus, Trash2, FolderGit2, Award as AwardIcon, CheckCircle2, HeartHandshake, Users } from 'lucide-react';

interface AdditionalStepProps {
  data: AdditionalSections;
  onChange: (data: AdditionalSections) => void;
}

type TabType = 'projects' | 'certifications' | 'awards' | 'volunteer' | 'references';

export const AdditionalStep: React.FC<AdditionalStepProps> = ({ data, onChange }) => {
  const { t } = useLanguage();
  const [activeTab, setActiveTab] = useState<TabType>('projects');

  // --- PROJECTS ---
  const addProject = () => {
    const newProj: Project = {
      id: 'proj_' + Date.now(),
      title: '',
      role: '',
      link: '',
      description: ''
    };
    onChange({ ...data, projects: [...data.projects, newProj] });
  };
  const updateProject = (id: string, updates: Partial<Project>) => {
    onChange({
      ...data,
      projects: data.projects.map(p => p.id === id ? { ...p, ...updates } : p)
    });
  };
  const deleteProject = (id: string) => {
    onChange({
      ...data,
      projects: data.projects.filter(p => p.id !== id)
    });
  };

  // --- CERTIFICATIONS ---
  const addCert = () => {
    const newCert: Certification = {
      id: 'cert_' + Date.now(),
      name: '',
      issuer: '',
      date: ''
    };
    onChange({ ...data, certifications: [...data.certifications, newCert] });
  };
  const updateCert = (id: string, updates: Partial<Certification>) => {
    onChange({
      ...data,
      certifications: data.certifications.map(c => c.id === id ? { ...c, ...updates } : c)
    });
  };
  const deleteCert = (id: string) => {
    onChange({
      ...data,
      certifications: data.certifications.filter(c => c.id !== id)
    });
  };

  // --- AWARDS ---
  const addAward = () => {
    const newAward: Award = {
      id: 'award_' + Date.now(),
      title: '',
      issuer: '',
      date: '',
      description: ''
    };
    onChange({ ...data, awards: [...data.awards, newAward] });
  };
  const updateAward = (id: string, updates: Partial<Award>) => {
    onChange({
      ...data,
      awards: data.awards.map(a => a.id === id ? { ...a, ...updates } : a)
    });
  };
  const deleteAward = (id: string) => {
    onChange({
      ...data,
      awards: data.awards.filter(a => a.id !== id)
    });
  };

  // --- VOLUNTEER ---
  const addVolunteer = () => {
    const newVol: VolunteerExperience = {
      id: 'vol_' + Date.now(),
      role: '',
      organization: '',
      startDate: '',
      endDate: '',
      description: ''
    };
    onChange({ ...data, volunteer: [...data.volunteer, newVol] });
  };
  const updateVolunteer = (id: string, updates: Partial<VolunteerExperience>) => {
    onChange({
      ...data,
      volunteer: data.volunteer.map(v => v.id === id ? { ...v, ...updates } : v)
    });
  };
  const deleteVolunteer = (id: string) => {
    onChange({
      ...data,
      volunteer: data.volunteer.filter(v => v.id !== id)
    });
  };

  // --- REFERENCES ---
  const addReference = () => {
    const newRef: Reference = {
      id: 'ref_' + Date.now(),
      fullName: '',
      company: '',
      jobTitle: '',
      email: '',
      phone: ''
    };
    onChange({ ...data, references: [...data.references, newRef] });
  };
  const updateReference = (id: string, updates: Partial<Reference>) => {
    onChange({
      ...data,
      references: data.references.map(r => r.id === id ? { ...r, ...updates } : r)
    });
  };
  const deleteReference = (id: string) => {
    onChange({
      ...data,
      references: data.references.filter(r => r.id !== id)
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-slate-900">{t('additionalTitle')}</h2>
        <p className="text-xs text-slate-500 mt-1">{t('additionalSubtitle')}</p>
      </div>

      {/* Tabs Bar */}
      <div className="flex border-b border-slate-200 overflow-x-auto gap-2 pb-1 scrollbar-none">
        <button
          type="button"
          onClick={() => setActiveTab('projects')}
          className={`flex items-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-lg whitespace-nowrap cursor-pointer transition-colors ${
            activeTab === 'projects'
              ? 'bg-blue-50 text-blue-700 border-b-2 border-blue-600'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <FolderGit2 className="w-3.5 h-3.5" />
          <span>{t('tabProjects')}</span>
          <span className="text-[10px] bg-slate-200 text-slate-700 px-1.5 py-0.2 rounded-full">{data.projects.length}</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('certifications')}
          className={`flex items-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-lg whitespace-nowrap cursor-pointer transition-colors ${
            activeTab === 'certifications'
              ? 'bg-blue-50 text-blue-700 border-b-2 border-blue-600'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <CheckCircle2 className="w-3.5 h-3.5" />
          <span>{t('tabCertifications')}</span>
          <span className="text-[10px] bg-slate-200 text-slate-700 px-1.5 py-0.2 rounded-full">{data.certifications.length}</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('awards')}
          className={`flex items-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-lg whitespace-nowrap cursor-pointer transition-colors ${
            activeTab === 'awards'
              ? 'bg-blue-50 text-blue-700 border-b-2 border-blue-600'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <AwardIcon className="w-3.5 h-3.5" />
          <span>{t('tabAwards')}</span>
          <span className="text-[10px] bg-slate-200 text-slate-700 px-1.5 py-0.2 rounded-full">{data.awards.length}</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('volunteer')}
          className={`flex items-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-lg whitespace-nowrap cursor-pointer transition-colors ${
            activeTab === 'volunteer'
              ? 'bg-blue-50 text-blue-700 border-b-2 border-blue-600'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <HeartHandshake className="w-3.5 h-3.5" />
          <span>{t('tabVolunteer')}</span>
          <span className="text-[10px] bg-slate-200 text-slate-700 px-1.5 py-0.2 rounded-full">{data.volunteer.length}</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('references')}
          className={`flex items-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-lg whitespace-nowrap cursor-pointer transition-colors ${
            activeTab === 'references'
              ? 'bg-blue-50 text-blue-700 border-b-2 border-blue-600'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Users className="w-3.5 h-3.5" />
          <span>{t('tabReferences')}</span>
          <span className="text-[10px] bg-slate-200 text-slate-700 px-1.5 py-0.2 rounded-full">{data.references.length}</span>
        </button>
      </div>

      {/* Tab Panels */}
      {/* 1. PROJECTS */}
      {activeTab === 'projects' && (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <span className="text-xs text-slate-500 font-medium">Showcase notable side projects, websites, or client work.</span>
            <button
              type="button"
              onClick={addProject}
              className="inline-flex items-center gap-1 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold cursor-pointer shadow-xs"
            >
              <Plus className="w-3.5 h-3.5" />
              {t('addProjectBtn')}
            </button>
          </div>

          {data.projects.length === 0 ? (
            <p className="text-xs text-slate-400 py-6 text-center italic">No projects added yet.</p>
          ) : (
            data.projects.map((proj, idx) => (
              <div key={proj.id} className="p-4 bg-white border border-slate-200 rounded-xl space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-xs font-bold text-slate-700">Project #{idx + 1}</span>
                  <button type="button" onClick={() => deleteProject(proj.id)} className="text-red-500 hover:text-red-700 p-1 cursor-pointer">
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 mb-1">{t('projectTitle')}</label>
                    <input
                      type="text"
                      value={proj.title}
                      onChange={(e) => updateProject(proj.id, { title: e.target.value })}
                      placeholder="e.g. E-Commerce Mobile App"
                      className="w-full px-3 py-1.5 border border-slate-300 rounded-lg text-xs"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 mb-1">{t('projectRole')}</label>
                    <input
                      type="text"
                      value={proj.role || ''}
                      onChange={(e) => updateProject(proj.id, { role: e.target.value })}
                      placeholder="e.g. Lead Designer / Frontend Dev"
                      className="w-full px-3 py-1.5 border border-slate-300 rounded-lg text-xs"
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="block text-[11px] font-bold text-slate-600 mb-1">{t('projectLink')}</label>
                    <input
                      type="text"
                      value={proj.link || ''}
                      onChange={(e) => updateProject(proj.id, { link: e.target.value })}
                      placeholder="https://github.com/username/project"
                      className="w-full px-3 py-1.5 border border-slate-300 rounded-lg text-xs"
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="block text-[11px] font-bold text-slate-600 mb-1">{t('projectDesc')}</label>
                    <textarea
                      rows={2}
                      value={proj.description}
                      onChange={(e) => updateProject(proj.id, { description: e.target.value })}
                      placeholder="Brief overview of the problem solved, tech stack used, and outcomes..."
                      className="w-full px-3 py-1.5 border border-slate-300 rounded-lg text-xs"
                    />
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* 2. CERTIFICATIONS */}
      {activeTab === 'certifications' && (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <span className="text-xs text-slate-500 font-medium">Add professional licenses, certificates, and credentials.</span>
            <button
              type="button"
              onClick={addCert}
              className="inline-flex items-center gap-1 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold cursor-pointer shadow-xs"
            >
              <Plus className="w-3.5 h-3.5" />
              {t('addCertBtn')}
            </button>
          </div>

          {data.certifications.length === 0 ? (
            <p className="text-xs text-slate-400 py-6 text-center italic">No certifications added yet.</p>
          ) : (
            data.certifications.map((c) => (
              <div key={c.id} className="p-3 bg-white border border-slate-200 rounded-xl flex flex-col sm:flex-row items-start sm:items-center gap-3">
                <div className="flex-1 grid grid-cols-1 sm:grid-cols-3 gap-2 w-full">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 mb-1">{t('certName')}</label>
                    <input
                      type="text"
                      value={c.name}
                      onChange={(e) => updateCert(c.id, { name: e.target.value })}
                      placeholder="e.g. AWS Solutions Architect"
                      className="w-full px-2.5 py-1.5 border border-slate-300 rounded-lg text-xs"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 mb-1">{t('certIssuer')}</label>
                    <input
                      type="text"
                      value={c.issuer}
                      onChange={(e) => updateCert(c.id, { issuer: e.target.value })}
                      placeholder="e.g. Amazon Web Services"
                      className="w-full px-2.5 py-1.5 border border-slate-300 rounded-lg text-xs"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 mb-1">{t('certDate')}</label>
                    <input
                      type="text"
                      value={c.date}
                      onChange={(e) => updateCert(c.id, { date: e.target.value })}
                      placeholder="e.g. 2023"
                      className="w-full px-2.5 py-1.5 border border-slate-300 rounded-lg text-xs"
                    />
                  </div>
                </div>
                <button type="button" onClick={() => deleteCert(c.id)} className="text-red-500 hover:text-red-700 p-1 self-end sm:self-center cursor-pointer">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))
          )}
        </div>
      )}

      {/* 3. AWARDS */}
      {activeTab === 'awards' && (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <span className="text-xs text-slate-500 font-medium">Add honors, scholarships, hackathons, or company awards.</span>
            <button
              type="button"
              onClick={addAward}
              className="inline-flex items-center gap-1 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold cursor-pointer shadow-xs"
            >
              <Plus className="w-3.5 h-3.5" />
              {t('addAwardBtn')}
            </button>
          </div>

          {data.awards.length === 0 ? (
            <p className="text-xs text-slate-400 py-6 text-center italic">No awards added yet.</p>
          ) : (
            data.awards.map((a) => (
              <div key={a.id} className="p-3 bg-white border border-slate-200 rounded-xl space-y-2">
                <div className="flex justify-between">
                  <span className="text-xs font-bold text-slate-700">Award</span>
                  <button type="button" onClick={() => deleteAward(a.id)} className="text-red-500 hover:text-red-700 p-1 cursor-pointer">
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 mb-1">{t('awardTitle')}</label>
                    <input
                      type="text"
                      value={a.title}
                      onChange={(e) => updateAward(a.id, { title: e.target.value })}
                      placeholder="e.g. Employee of the Year"
                      className="w-full px-2.5 py-1.5 border border-slate-300 rounded-lg text-xs"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 mb-1">{t('awardIssuer')}</label>
                    <input
                      type="text"
                      value={a.issuer}
                      onChange={(e) => updateAward(a.id, { issuer: e.target.value })}
                      placeholder="e.g. Ministry / Tech Organization"
                      className="w-full px-2.5 py-1.5 border border-slate-300 rounded-lg text-xs"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 mb-1">{t('awardDate')}</label>
                    <input
                      type="text"
                      value={a.date}
                      onChange={(e) => updateAward(a.id, { date: e.target.value })}
                      placeholder="e.g. 2023"
                      className="w-full px-2.5 py-1.5 border border-slate-300 rounded-lg text-xs"
                    />
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* 4. VOLUNTEER */}
      {activeTab === 'volunteer' && (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <span className="text-xs text-slate-500 font-medium">Highlight community service, student leadership, or NGO contributions.</span>
            <button
              type="button"
              onClick={addVolunteer}
              className="inline-flex items-center gap-1 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold cursor-pointer shadow-xs"
            >
              <Plus className="w-3.5 h-3.5" />
              {t('addVolunteerBtn')}
            </button>
          </div>

          {data.volunteer.length === 0 ? (
            <p className="text-xs text-slate-400 py-6 text-center italic">No volunteer experience added yet.</p>
          ) : (
            data.volunteer.map((v) => (
              <div key={v.id} className="p-3 bg-white border border-slate-200 rounded-xl space-y-2">
                <div className="flex justify-between">
                  <span className="text-xs font-bold text-slate-700">Volunteer Role</span>
                  <button type="button" onClick={() => deleteVolunteer(v.id)} className="text-red-500 hover:text-red-700 p-1 cursor-pointer">
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 mb-1">{t('volunteerRole')}</label>
                    <input
                      type="text"
                      value={v.role}
                      onChange={(e) => updateVolunteer(v.id, { role: e.target.value })}
                      placeholder="e.g. Youth Coding Mentor"
                      className="w-full px-2.5 py-1.5 border border-slate-300 rounded-lg text-xs"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 mb-1">{t('volunteerOrg')}</label>
                    <input
                      type="text"
                      value={v.organization}
                      onChange={(e) => updateVolunteer(v.id, { organization: e.target.value })}
                      placeholder="e.g. Red Crescent / Somali Youth Tech"
                      className="w-full px-2.5 py-1.5 border border-slate-300 rounded-lg text-xs"
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="block text-[11px] font-bold text-slate-600 mb-1">{t('volunteerDesc')}</label>
                    <textarea
                      rows={2}
                      value={v.description}
                      onChange={(e) => updateVolunteer(v.id, { description: e.target.value })}
                      placeholder="Responsibilities, beneficiaries reached, or community results..."
                      className="w-full px-2.5 py-1.5 border border-slate-300 rounded-lg text-xs"
                    />
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* 5. REFERENCES */}
      {activeTab === 'references' && (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <span className="text-xs text-slate-500 font-medium">{t('referencesNotice')}</span>
            <button
              type="button"
              onClick={addReference}
              className="inline-flex items-center gap-1 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold cursor-pointer shadow-xs"
            >
              <Plus className="w-3.5 h-3.5" />
              {t('addRefBtn')}
            </button>
          </div>

          {data.references.length === 0 ? (
            <p className="text-xs text-slate-400 py-6 text-center italic">No individual references added yet. (Most employers are fine with "Available upon request")</p>
          ) : (
            data.references.map((r) => (
              <div key={r.id} className="p-3 bg-white border border-slate-200 rounded-xl space-y-2">
                <div className="flex justify-between">
                  <span className="text-xs font-bold text-slate-700">Referee</span>
                  <button type="button" onClick={() => deleteReference(r.id)} className="text-red-500 hover:text-red-700 p-1 cursor-pointer">
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 mb-1">{t('refName')}</label>
                    <input
                      type="text"
                      value={r.fullName}
                      onChange={(e) => updateReference(r.id, { fullName: e.target.value })}
                      placeholder="e.g. Dr. Khadar Warsame"
                      className="w-full px-2.5 py-1.5 border border-slate-300 rounded-lg text-xs"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 mb-1">{t('refTitle')}</label>
                    <input
                      type="text"
                      value={r.jobTitle}
                      onChange={(e) => updateReference(r.id, { jobTitle: e.target.value })}
                      placeholder="e.g. Dean of Faculty / VP Engineering"
                      className="w-full px-2.5 py-1.5 border border-slate-300 rounded-lg text-xs"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 mb-1">{t('refCompany')}</label>
                    <input
                      type="text"
                      value={r.company}
                      onChange={(e) => updateReference(r.id, { company: e.target.value })}
                      placeholder="e.g. University / Tech Org"
                      className="w-full px-2.5 py-1.5 border border-slate-300 rounded-lg text-xs"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 mb-1">{t('refEmail')}</label>
                    <input
                      type="email"
                      value={r.email}
                      onChange={(e) => updateReference(r.id, { email: e.target.value })}
                      placeholder="k.warsame@example.com"
                      className="w-full px-2.5 py-1.5 border border-slate-300 rounded-lg text-xs"
                    />
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};
