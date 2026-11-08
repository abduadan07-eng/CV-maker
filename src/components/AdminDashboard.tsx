import React, { useState, useEffect } from 'react';
import {
  Shield,
  CheckCircle,
  XCircle,
  Clock,
  Trash2,
  AlertTriangle,
  UserCheck,
  FileText,
  X,
  Search,
  Check,
  Eye
} from 'lucide-react';
import { useLanguage } from '../i18n/LanguageContext';
import { useAuth } from '../firebase/AuthContext';
import { CreatorApplication, CommunityTemplate } from '../types/community';
import { communityStorage } from '../storage/communityStorage';
import {
  getAllCreatorApplicationsForAdmin,
  updateCreatorApplicationStatus,
  getAllCommunityTemplatesForAdmin,
  saveCommunityTemplateToCloud
} from '../firebase/communityFirestore';

interface AdminDashboardProps {
  onClose: () => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ onClose }) => {
  const { language } = useLanguage();
  const { user } = useAuth();

  const [activeTab, setActiveTab] = useState<'applications' | 'templates' | 'stats'>('applications');
  const [applications, setApplications] = useState<CreatorApplication[]>([]);
  const [templates, setTemplates] = useState<CommunityTemplate[]>([]);

  // Rejection modal state
  const [rejectingItem, setRejectingItem] = useState<{ type: 'app' | 'template'; id: string } | null>(null);
  const [rejectionReason, setRejectionReason] = useState('');
  const [actionSuccess, setActionSuccess] = useState<string | null>(null);

  const isAdmin =
    user?.email?.toLowerCase() === 'yahy38989@gmail.com' ||
    user?.email?.toLowerCase() === 'aa8402502@gmail.com';

  useEffect(() => {
    // Load applications locally and from cloud
    const localApps = communityStorage.getApplications();
    setApplications(localApps);

    getAllCreatorApplicationsForAdmin().then(cloudApps => {
      if (cloudApps.length > 0) {
        setApplications(cloudApps);
      }
    }).catch(() => {});

    // Load templates locally and from cloud
    const localTpls = communityStorage.getTemplates();
    setTemplates(localTpls);

    getAllCommunityTemplatesForAdmin().then(cloudTpls => {
      if (cloudTpls.length > 0) {
        setTemplates(cloudTpls);
      }
    }).catch(() => {});
  }, []);

  const handleApproveApplication = async (appId: string) => {
    const updated = applications.map(a =>
      a.id === appId
        ? { ...a, status: 'approved' as const, reviewedBy: user?.email || 'admin', reviewedAt: new Date().toISOString() }
        : a
    );
    setApplications(updated);
    const target = updated.find(a => a.id === appId);
    if (target) {
      communityStorage.saveApplication(target);
    }

    try {
      await updateCreatorApplicationStatus(appId, 'approved', undefined, user?.email || 'admin');
    } catch (e) {
      console.warn(e);
    }

    setActionSuccess(language === 'so' ? 'Codsiga waa la ansixiyey!' : 'Creator application approved!');
    setTimeout(() => setActionSuccess(null), 3000);
  };

  const handleApproveTemplate = async (templateId: string) => {
    const updated = templates.map(t =>
      t.id === templateId
        ? {
            ...t,
            status: 'approved' as const,
            visibility: 'public' as const,
            approvedBy: user?.email || 'admin',
            approvedAt: new Date().toISOString()
          }
        : t
    );
    setTemplates(updated);
    const target = updated.find(t => t.id === templateId);
    if (target) {
      communityStorage.saveTemplate(target);
      saveCommunityTemplateToCloud(target).catch(() => {});
    }

    setActionSuccess(language === 'so' ? 'Template-ka si rasmi ah ayaa loo ansixiyey oo loo daabacay!' : 'Template approved and published!');
    setTimeout(() => setActionSuccess(null), 3000);
  };

  const handleConfirmRejection = async () => {
    if (!rejectingItem || !rejectionReason.trim()) return;

    if (rejectingItem.type === 'app') {
      const updated = applications.map(a =>
        a.id === rejectingItem.id
          ? {
              ...a,
              status: 'rejected' as const,
              rejectionReason: rejectionReason.trim(),
              reviewedBy: user?.email || 'admin',
              reviewedAt: new Date().toISOString()
            }
          : a
      );
      setApplications(updated);
      const target = updated.find(a => a.id === rejectingItem.id);
      if (target) communityStorage.saveApplication(target);
      updateCreatorApplicationStatus(rejectingItem.id, 'rejected', rejectionReason.trim(), user?.email || 'admin').catch(() => {});
    } else {
      const updated = templates.map(t =>
        t.id === rejectingItem.id
          ? {
              ...t,
              status: 'rejected' as const,
              rejectionReason: rejectionReason.trim()
            }
          : t
      );
      setTemplates(updated);
      const target = updated.find(t => t.id === rejectingItem.id);
      if (target) {
        communityStorage.saveTemplate(target);
        saveCommunityTemplateToCloud(target).catch(() => {});
      }
    }

    setRejectingItem(null);
    setRejectionReason('');
    setActionSuccess(language === 'so' ? 'Waa la diiday xogtaan.' : 'Item rejected with feedback.');
    setTimeout(() => setActionSuccess(null), 3000);
  };

  const handleSuspendTemplate = (templateId: string) => {
    const updated = templates.map(t =>
      t.id === templateId ? { ...t, status: 'suspended' as const, visibility: 'private' as const } : t
    );
    setTemplates(updated);
    const target = updated.find(t => t.id === templateId);
    if (target) {
      communityStorage.saveTemplate(target);
      saveCommunityTemplateToCloud(target).catch(() => {});
    }
  };

  if (!isAdmin) {
    return (
      <div className="fixed inset-0 z-50 bg-slate-900/80 backdrop-blur-xs flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl p-6 max-w-sm text-center space-y-4">
          <AlertTriangle className="w-10 h-10 text-rose-500 mx-auto" />
          <h3 className="font-bold text-slate-900">Access Restricted</h3>
          <p className="text-xs text-slate-500">
            Authorized administrator email Yahy38989@gmail.com required to access this portal.
          </p>
          <button
            onClick={onClose}
            className="w-full py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold"
          >
            Close
          </button>
        </div>
      </div>
    );
  }

  const pendingApps = applications.filter(a => a.status === 'pending');
  const pendingTemplates = templates.filter(t => t.status === 'pending');

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 animate-in fade-in">
      <div className="bg-white w-full max-w-4xl rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        {/* Toast Alert */}
        {actionSuccess && (
          <div className="absolute top-4 right-4 z-50 bg-emerald-600 text-white text-xs font-semibold px-4 py-2.5 rounded-xl shadow-lg flex items-center gap-2 animate-bounce">
            <Check className="w-4 h-4" />
            <span>{actionSuccess}</span>
          </div>
        )}

        {/* Header */}
        <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-amber-400 text-slate-950 flex items-center justify-center font-bold">
              <Shield className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-extrabold text-base">Administrator Management</h2>
              <p className="text-[11px] text-slate-400 font-mono">
                Logged in: {user?.email}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="px-6 py-2 bg-slate-100 border-b border-slate-200 flex items-center gap-3">
          <button
            onClick={() => setActiveTab('applications')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'applications'
                ? 'bg-blue-600 text-white shadow-2xs'
                : 'text-slate-600 hover:bg-slate-200'
            }`}
          >
            <span>Creator Applications</span>
            {pendingApps.length > 0 && (
              <span className="w-4 h-4 rounded-full bg-amber-400 text-slate-950 text-[10px] flex items-center justify-center font-black">
                {pendingApps.length}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab('templates')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'templates'
                ? 'bg-blue-600 text-white shadow-2xs'
                : 'text-slate-600 hover:bg-slate-200'
            }`}
          >
            <span>Submitted Templates</span>
            {pendingTemplates.length > 0 && (
              <span className="w-4 h-4 rounded-full bg-amber-400 text-slate-950 text-[10px] flex items-center justify-center font-black">
                {pendingTemplates.length}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab('stats')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
              activeTab === 'stats'
                ? 'bg-blue-600 text-white shadow-2xs'
                : 'text-slate-600 hover:bg-slate-200'
            }`}
          >
            Overview & Stats
          </button>
        </div>

        {/* Tab Content */}
        <div className="p-6 overflow-y-auto flex-1 bg-slate-50 space-y-4">
          {/* 1. APPLICATIONS TAB */}
          {activeTab === 'applications' && (
            <div className="space-y-4">
              <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                Pending & Past Applications ({applications.length})
              </h3>

              {applications.length === 0 ? (
                <div className="bg-white p-8 rounded-xl border border-slate-200 text-center text-xs text-slate-500">
                  No creator applications recorded.
                </div>
              ) : (
                <div className="space-y-3">
                  {applications.map(app => (
                    <div
                      key={app.id}
                      className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs space-y-3"
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-slate-900 text-sm">
                              {app.applicantName}
                            </span>
                            <span
                              className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${
                                app.status === 'approved'
                                  ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                                  : app.status === 'rejected'
                                  ? 'bg-rose-50 text-rose-700 border border-rose-200'
                                  : 'bg-amber-50 text-amber-700 border border-amber-200 animate-pulse'
                              }`}
                            >
                              {app.status.toUpperCase()}
                            </span>
                          </div>
                          <p className="text-xs text-slate-500">{app.email} · Applied on {new Date(app.createdAt).toLocaleDateString()}</p>
                        </div>

                        {app.status === 'pending' && (
                          <div className="flex items-center gap-2">
                            <button
                              type="button"
                              onClick={() => handleApproveApplication(app.id)}
                              className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold transition flex items-center gap-1 cursor-pointer"
                            >
                              <CheckCircle className="w-3.5 h-3.5" />
                              <span>Approve</span>
                            </button>
                            <button
                              type="button"
                              onClick={() => setRejectingItem({ type: 'app', id: app.id })}
                              className="px-3 py-1.5 bg-rose-600 hover:bg-rose-700 text-white rounded-lg text-xs font-bold transition flex items-center gap-1 cursor-pointer"
                            >
                              <XCircle className="w-3.5 h-3.5" />
                              <span>Reject</span>
                            </button>
                          </div>
                        )}
                      </div>

                      <div className="p-3 bg-slate-50 rounded-lg text-xs text-slate-700 space-y-1">
                        <p className="font-semibold text-slate-900">Application Motivation:</p>
                        <p className="leading-relaxed whitespace-pre-wrap">{app.description}</p>
                        {app.portfolioUrl && (
                          <p className="pt-1">
                            <span className="font-semibold text-slate-900">Portfolio: </span>
                            <a href={app.portfolioUrl} target="_blank" rel="noreferrer" className="text-blue-600 hover:underline">
                              {app.portfolioUrl}
                            </a>
                          </p>
                        )}
                        {app.rejectionReason && (
                          <p className="pt-1 text-rose-700 font-mono">
                            Rejection Reason: {app.rejectionReason}
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* 2. TEMPLATES TAB */}
          {activeTab === 'templates' && (
            <div className="space-y-4">
              <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                Community Templates ({templates.length})
              </h3>

              <div className="space-y-3">
                {templates.map(tpl => (
                  <div key={tpl.id} className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs space-y-3">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-slate-900 text-sm">{tpl.name}</span>
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-slate-100 text-slate-700">
                            {tpl.status.toUpperCase()}
                          </span>
                          <span className="text-[10px] text-slate-500 bg-blue-50 px-2 py-0.5 rounded">
                            {tpl.category}
                          </span>
                        </div>
                        <p className="text-xs text-slate-500">
                          Creator: <span className="font-semibold">{tpl.creatorDisplayName}</span> · Permission: {tpl.usagePermission} · Uses: {tpl.usageCount}
                        </p>
                      </div>

                      <div className="flex items-center gap-1.5">
                        {tpl.status !== 'approved' && (
                          <button
                            type="button"
                            onClick={() => handleApproveTemplate(tpl.id)}
                            className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold flex items-center gap-1 cursor-pointer"
                          >
                            <CheckCircle className="w-3.5 h-3.5" />
                            <span>Approve & Publish</span>
                          </button>
                        )}
                        {tpl.status !== 'rejected' && tpl.status !== 'suspended' && (
                          <button
                            type="button"
                            onClick={() => setRejectingItem({ type: 'template', id: tpl.id })}
                            className="px-3 py-1.5 bg-rose-600 hover:bg-rose-700 text-white rounded-lg text-xs font-bold flex items-center gap-1 cursor-pointer"
                          >
                            <XCircle className="w-3.5 h-3.5" />
                            <span>Reject / Suspend</span>
                          </button>
                        )}
                        {tpl.status === 'approved' && (
                          <button
                            type="button"
                            onClick={() => handleSuspendTemplate(tpl.id)}
                            className="px-2.5 py-1.5 bg-slate-200 hover:bg-slate-300 text-slate-700 rounded-lg text-xs font-semibold cursor-pointer"
                          >
                            Suspend
                          </button>
                        )}
                      </div>
                    </div>

                    <p className="text-xs text-slate-600">{tpl.description}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 3. STATS TAB */}
          {activeTab === 'stats' && (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-2xs text-center space-y-1">
                <p className="text-3xl font-black text-blue-600">{applications.length}</p>
                <p className="text-xs font-bold text-slate-600">Total Applications</p>
                <p className="text-[11px] text-slate-400">{pendingApps.length} pending review</p>
              </div>
              <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-2xs text-center space-y-1">
                <p className="text-3xl font-black text-emerald-600">
                  {applications.filter(a => a.status === 'approved').length}
                </p>
                <p className="text-xs font-bold text-slate-600">Approved Creators</p>
                <p className="text-[11px] text-slate-400">Authorized to publish</p>
              </div>
              <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-2xs text-center space-y-1">
                <p className="text-3xl font-black text-indigo-600">
                  {templates.filter(t => t.status === 'approved').length}
                </p>
                <p className="text-xs font-bold text-slate-600">Live Public Templates</p>
                <p className="text-[11px] text-slate-400">Available in Library</p>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-3 bg-white border-t border-slate-200 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold cursor-pointer"
          >
            Close Dashboard
          </button>
        </div>
      </div>

      {/* REJECTION REASON MODAL */}
      {rejectingItem && (
        <div className="fixed inset-0 z-60 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 space-y-4 shadow-2xl">
            <h4 className="font-extrabold text-slate-900 text-sm">
              Provide Rejection Reason
            </h4>
            <p className="text-xs text-slate-500">
              Explain why this submission is not approved so the creator can improve their submission.
            </p>
            <textarea
              required
              rows={3}
              value={rejectionReason}
              onChange={(e) => setRejectionReason(e.target.value)}
              placeholder="e.g. Please provide additional portfolio work or verify typography layout standards..."
              className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-800"
            />
            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setRejectingItem(null)}
                className="px-3 py-1.5 text-xs text-slate-600 hover:bg-slate-100 rounded-lg"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmRejection}
                disabled={!rejectionReason.trim()}
                className="px-4 py-1.5 bg-rose-600 hover:bg-rose-700 text-white rounded-lg text-xs font-bold disabled:opacity-50"
              >
                Confirm Rejection
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
