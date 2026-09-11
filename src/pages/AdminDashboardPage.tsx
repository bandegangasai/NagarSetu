import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  ShieldCheck,
  Settings,
  Search,
  TrendingUp,
  Save
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useComplaints } from '../contexts/ComplaintContext';
import { DEPARTMENTS } from '../data/departments';
import { COMPLAINT_CATEGORIES } from '../data/categories';
import { Complaint } from '../types';
import { getStatusBadgeInfo, getPriorityBadgeInfo } from '../utils/formatters';
import { getSlaDisplayText } from '../services/slaEngine';
import { Link } from 'react-router-dom';

export const AdminDashboardPage: React.FC = () => {
  const { t } = useTranslation();
  const { currentUser } = useAuth();
  const { complaints, transparencyStats, reassign } = useComplaints();

  const [activeTab, setActiveTab] = useState<'all' | 'overdue' | 'escalations' | 'sla_config'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [departmentFilter, setDepartmentFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');

  // Reassignment Modal State
  const [reassignModalComplaint, setReassignModalComplaint] = useState<Complaint | null>(null);
  const [selectedDeptId, setSelectedDeptId] = useState('');
  const [officerNameInput, setOfficerNameInput] = useState('');

  // Configurable SLA Rules local state
  const [categoriesList, setCategoriesList] = useState(COMPLAINT_CATEGORIES);
  const [savedSlaConfig, setSavedSlaConfig] = useState(false);

  const handleReassignSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reassignModalComplaint || !selectedDeptId) return;

    reassign(
      reassignModalComplaint.id,
      selectedDeptId,
      undefined,
      officerNameInput.trim() || undefined
    );

    alert(`Complaint ${reassignModalComplaint.complaintId} reassigned successfully.`);
    setReassignModalComplaint(null);
  };

  const handleSlaDaysChange = (catId: string, days: number) => {
    setCategoriesList((prev) =>
      prev.map((c) => (c.id === catId ? { ...c, slaDays: days, slaHours: days * 24 } : c))
    );
  };

  const handleSaveSlaRules = () => {
    setSavedSlaConfig(true);
    setTimeout(() => setSavedSlaConfig(false), 3000);
  };

  // Filtered Complaints List
  const filteredComplaints = complaints.filter((c) => {
    if (activeTab === 'overdue' && (!c.isOverdue || c.status === 'resolved')) return false;
    if (activeTab === 'escalations' && c.escalationLevel === 'level_1_officer') return false;

    if (categoryFilter !== 'all' && c.categoryId !== categoryFilter) return false;
    if (departmentFilter !== 'all' && c.departmentId !== departmentFilter) return false;
    if (statusFilter !== 'all' && c.status !== statusFilter) return false;

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        c.complaintId.toLowerCase().includes(q) ||
        c.title.toLowerCase().includes(q) ||
        c.locationAddress.toLowerCase().includes(q) ||
        (c.citizenName && c.citizenName.toLowerCase().includes(q))
      );
    }
    return true;
  });

  const overdueComplaints = complaints.filter((c) => c.isOverdue && c.status !== 'resolved');
  const escalatedComplaints = complaints.filter((c) => c.escalationLevel !== 'level_1_officer');

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8">
      {/* Header */}
      <div className="bg-slate-900 rounded-3xl p-6 sm:p-8 text-white shadow-elevated flex flex-wrap items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-purple-900/80 border border-purple-400/40 text-purple-300 text-xs font-bold rounded-full">
            <ShieldCheck className="w-3.5 h-3.5 text-purple-300" /> Municipal Administrator Command Center
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
            {currentUser.name}
          </h1>
          <p className="text-xs sm:text-sm text-slate-300">
            {t('dashboard.adminSubtitle')}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            to="/transparency"
            className="inline-flex items-center gap-1.5 px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs rounded-xl border border-slate-700 shadow-sm"
          >
            <TrendingUp className="w-4 h-4 text-civic-400" />
            <span>Public Analytics</span>
          </Link>
        </div>
      </div>

      {/* KPI Counters */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-3 sm:gap-4">
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-card space-y-1">
          <span className="text-xs text-slate-500 font-bold uppercase tracking-wider">Total Complaints</span>
          <p className="text-3xl font-black text-slate-900">{transparencyStats.totalComplaints}</p>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-card space-y-1">
          <span className="text-xs text-emerald-600 font-bold uppercase tracking-wider">Resolved Fixes</span>
          <p className="text-3xl font-black text-emerald-700">{transparencyStats.resolvedCount}</p>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-card space-y-1">
          <span className="text-xs text-amber-600 font-bold uppercase tracking-wider">In Progress</span>
          <p className="text-3xl font-black text-amber-700">{transparencyStats.inProgressCount}</p>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-card space-y-1">
          <span className="text-xs text-rose-600 font-bold uppercase tracking-wider">⚠️ Overdue Breaches</span>
          <p className="text-3xl font-black text-rose-700">{overdueComplaints.length}</p>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-card space-y-1 col-span-2 lg:col-span-1">
          <span className="text-xs text-purple-600 font-bold uppercase tracking-wider">Active Escalations</span>
          <p className="text-3xl font-black text-purple-700">{escalatedComplaints.length}</p>
        </div>
      </div>

      {/* Main Tab Switcher */}
      <div className="flex flex-wrap items-center gap-2 border-b border-slate-200 pb-3">
        <button
          onClick={() => setActiveTab('all')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'all'
              ? 'bg-slate-900 text-white shadow-sm'
              : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
          }`}
        >
          All Complaints ({complaints.length})
        </button>

        <button
          onClick={() => setActiveTab('overdue')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'overdue'
              ? 'bg-rose-600 text-white shadow-sm'
              : 'bg-rose-50 text-rose-700 hover:bg-rose-100 border border-rose-200'
          }`}
        >
          ⚠️ Overdue Breaches ({overdueComplaints.length})
        </button>

        <button
          onClick={() => setActiveTab('escalations')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'escalations'
              ? 'bg-purple-900 text-white shadow-sm'
              : 'bg-purple-50 text-purple-800 hover:bg-purple-100 border border-purple-200'
          }`}
        >
          ⚡ Supervisor Escalations ({escalatedComplaints.length})
        </button>

        <button
          onClick={() => setActiveTab('sla_config')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'sla_config'
              ? 'bg-civic-700 text-white shadow-sm'
              : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
          }`}
        >
          <Settings className="w-3.5 h-3.5 inline mr-1" /> Category SLA Rules Editor
        </button>
      </div>

      {/* TAB 1, 2, 3: Complaints Table View */}
      {activeTab !== 'sla_config' ? (
        <div className="space-y-4">
          {/* Multi-criteria Filter Bar */}
          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex flex-wrap items-center justify-between gap-3 text-xs">
            <div className="flex flex-wrap items-center gap-2 flex-1">
              <div className="w-full sm:w-60 relative">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search ID, title, citizen..."
                  className="w-full pl-9 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-civic-500 focus:outline-none"
                />
              </div>

              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="p-1.5 bg-slate-50 border border-slate-200 rounded-xl font-medium text-slate-700 focus:outline-none"
              >
                <option value="all">All Categories</option>
                {COMPLAINT_CATEGORIES.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>

              <select
                value={departmentFilter}
                onChange={(e) => setDepartmentFilter(e.target.value)}
                className="p-1.5 bg-slate-50 border border-slate-200 rounded-xl font-medium text-slate-700 focus:outline-none"
              >
                <option value="all">All Departments</option>
                {DEPARTMENTS.map((d) => (
                  <option key={d.id} value={d.id}>
                    {d.name}
                  </option>
                ))}
              </select>

              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="p-1.5 bg-slate-50 border border-slate-200 rounded-xl font-medium text-slate-700 focus:outline-none"
              >
                <option value="all">All Statuses</option>
                <option value="submitted">Submitted</option>
                <option value="received">Received</option>
                <option value="assigned">Assigned</option>
                <option value="in_progress">In Progress</option>
                <option value="resolved">Resolved</option>
                <option value="reopened">Reopened</option>
              </select>
            </div>

            <span className="text-xs text-slate-500 font-semibold">
              Showing <strong>{filteredComplaints.length}</strong> complaints
            </span>
          </div>

          {/* Table */}
          <div className="bg-white rounded-3xl border border-slate-200 shadow-card overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider">
                  <tr>
                    <th className="py-3.5 px-4">Complaint ID</th>
                    <th className="py-3.5 px-4">Title & Category</th>
                    <th className="py-3.5 px-4">Location / Ward</th>
                    <th className="py-3.5 px-4">Status</th>
                    <th className="py-3.5 px-4">Priority & SLA</th>
                    <th className="py-3.5 px-4">Assigned Department / Officer</th>
                    <th className="py-3.5 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700">
                  {filteredComplaints.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="py-12 text-center text-slate-400">
                        No complaints match the specified filter criteria.
                      </td>
                    </tr>
                  ) : (
                    filteredComplaints.map((c) => {
                      const statusInfo = getStatusBadgeInfo(c.status);
                      const priorityInfo = getPriorityBadgeInfo(c.priority);
                      const slaInfo = getSlaDisplayText(c);

                      return (
                        <tr key={c.id} className="hover:bg-slate-50/80 transition-colors">
                          <td className="py-3.5 px-4 font-mono font-bold text-slate-900 whitespace-nowrap">
                            <Link to={`/track/${c.complaintId}`} className="text-civic-700 hover:underline">
                              {c.complaintId}
                            </Link>
                          </td>

                          <td className="py-3.5 px-4 max-w-xs">
                            <p className="font-bold text-slate-900 line-clamp-1">{c.title}</p>
                            <p className="text-[11px] text-slate-500">{c.categoryName}</p>
                          </td>

                          <td className="py-3.5 px-4 whitespace-nowrap">
                            <p className="font-semibold text-slate-800">{c.wardNo}</p>
                            <p className="text-[11px] text-slate-500">{c.city}</p>
                          </td>

                          <td className="py-3.5 px-4 whitespace-nowrap">
                            <span className={`px-2.5 py-0.5 rounded-full font-bold border ${statusInfo.badgeClass}`}>
                              {statusInfo.label}
                            </span>
                          </td>

                          <td className="py-3.5 px-4 whitespace-nowrap space-y-1">
                            <span className={`px-2 py-0.5 rounded block text-[10px] w-max ${priorityInfo.badgeClass}`}>
                              {priorityInfo.label}
                            </span>
                            <span className={`px-2 py-0.5 rounded border block text-[10px] w-max ${slaInfo.badgeClass}`}>
                              {slaInfo.text}
                            </span>
                          </td>

                          <td className="py-3.5 px-4 max-w-xs">
                            <p className="font-semibold text-slate-800 line-clamp-1">
                              {c.departmentName || 'Unassigned'}
                            </p>
                            <p className="text-[11px] text-slate-500 line-clamp-1">
                              {c.assignedOfficerName ? `Officer: ${c.assignedOfficerName}` : 'No officer assigned'}
                            </p>
                          </td>

                          <td className="py-3.5 px-4 text-right whitespace-nowrap space-x-1.5">
                            <button
                              onClick={() => {
                                setReassignModalComplaint(c);
                                setSelectedDeptId(c.departmentId || DEPARTMENTS[0].id);
                                setOfficerNameInput(c.assignedOfficerName || '');
                              }}
                              className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold rounded-lg transition-colors"
                              title="Reassign Department / Officer"
                            >
                              Reassign
                            </button>

                            <Link
                              to={`/track/${c.complaintId}`}
                              className="px-2.5 py-1 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-lg transition-colors inline-block"
                            >
                              Track
                            </Link>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      ) : (
        /* TAB 4: Category SLA Master Rules Editor */
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-card space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-slate-100">
            <div>
              <h3 className="text-base font-extrabold text-slate-900">
                Municipal Category SLA & Resolution Period Configuration
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Define standard allowable resolution days before automated overdue alarms and supervisor escalations fire.
              </p>
            </div>

            <button
              onClick={handleSaveSlaRules}
              className="inline-flex items-center gap-1.5 px-5 py-2.5 bg-civic-600 hover:bg-civic-700 text-white font-bold text-xs rounded-xl shadow-md transition-all active:scale-95"
            >
              <Save className="w-4 h-4" />
              <span>{savedSlaConfig ? '✓ Settings Saved!' : 'Save SLA Policies'}</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {categoriesList.map((cat) => (
              <div
                key={cat.id}
                className="p-4 bg-slate-50 border border-slate-200 rounded-2xl flex items-center justify-between gap-3 text-xs"
              >
                <div>
                  <h4 className="font-bold text-slate-900">{cat.name}</h4>
                  <p className="text-[11px] text-slate-500">
                    Default Priority: <span className="capitalize font-semibold text-slate-700">{cat.defaultPriority}</span>
                  </p>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <label htmlFor={`sla-days-${cat.id}`} className="font-bold text-slate-700 text-[11px]">SLA Days:</label>
                  <input
                    id={`sla-days-${cat.id}`}
                    aria-label={`SLA Days for ${cat.name}`}
                    type="number"
                    min={1}
                    max={30}
                    value={cat.slaDays}
                    onChange={(e) => handleSlaDaysChange(cat.id, Math.max(1, parseInt(e.target.value) || 1))}
                    className="w-16 p-1.5 bg-white border border-slate-300 rounded-lg text-center font-bold text-slate-900 focus:ring-2 focus:ring-civic-500"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Department Reassignment Modal */}
      {reassignModalComplaint && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full overflow-hidden shadow-2xl p-5 space-y-4 animate-in zoom-in-95">
            <h3 className="text-sm font-bold text-slate-900 pb-2 border-b border-slate-100">
              Reassign Complaint #{reassignModalComplaint.complaintId}
            </h3>

            <form onSubmit={handleReassignSubmit} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Target Municipal Department:
                </label>
                <select
                  value={selectedDeptId}
                  onChange={(e) => setSelectedDeptId(e.target.value)}
                  className="w-full p-2.5 border border-slate-300 rounded-xl font-medium focus:ring-2 focus:ring-civic-500"
                >
                  {DEPARTMENTS.map((d) => (
                    <option key={d.id} value={d.id}>
                      {d.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Designated Officer Name (Optional):
                </label>
                <input
                  type="text"
                  value={officerNameInput}
                  onChange={(e) => setOfficerNameInput(e.target.value)}
                  placeholder="e.g. Er. K. V. Subbarao"
                  className="w-full p-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-civic-500"
                />
              </div>

              <div className="pt-3 flex items-center justify-end gap-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setReassignModalComplaint(null)}
                  className="px-4 py-2 font-semibold text-slate-600 hover:text-slate-900"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="px-5 py-2 bg-civic-600 hover:bg-civic-700 text-white font-bold rounded-xl shadow-xs"
                >
                  Save Reassignment
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
