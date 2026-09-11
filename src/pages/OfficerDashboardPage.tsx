import React, { useState } from 'react';
import {
  HardHat,
  CheckCircle2,
  Clock,
  MapPin,
  ChevronRight,
  Search
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useComplaints } from '../contexts/ComplaintContext';
import { Complaint } from '../types';
import { StatusUpdateModal } from '../components/complaints/StatusUpdateModal';
import { getStatusBadgeInfo, getPriorityBadgeInfo, formatDateShort } from '../utils/formatters';
import { getSlaDisplayText } from '../services/slaEngine';
import { Link } from 'react-router-dom';

export const OfficerDashboardPage: React.FC = () => {
  const { currentUser } = useAuth();
  const { complaints } = useComplaints();

  const [activeFilter, setActiveFilter] = useState<'all' | 'assigned' | 'in_progress' | 'overdue' | 'resolved'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedComplaintForUpdate, setSelectedComplaintForUpdate] = useState<Complaint | null>(null);

  // Filter complaints assigned to this officer or matching their department
  const assignedComplaints = complaints.filter(
    (c) =>
      c.assignedOfficerId === currentUser.id ||
      (currentUser.departmentId && c.departmentId === currentUser.departmentId)
  );

  const displayedList = assignedComplaints.filter((c) => {
    if (activeFilter === 'assigned' && c.status !== 'assigned' && c.status !== 'submitted' && c.status !== 'received') return false;
    if (activeFilter === 'in_progress' && c.status !== 'in_progress' && c.status !== 'action_taken') return false;
    if (activeFilter === 'overdue' && (!c.isOverdue || c.status === 'resolved')) return false;
    if (activeFilter === 'resolved' && c.status !== 'resolved') return false;

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        c.complaintId.toLowerCase().includes(q) ||
        c.title.toLowerCase().includes(q) ||
        c.locationAddress.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const totalAssigned = assignedComplaints.length;
  const inProgress = assignedComplaints.filter((c) => c.status === 'in_progress' || c.status === 'action_taken').length;
  const overdueCount = assignedComplaints.filter((c) => c.isOverdue && c.status !== 'resolved').length;
  const resolvedCount = assignedComplaints.filter((c) => c.status === 'resolved').length;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8">
      {/* Top Officer Header */}
      <div className="bg-slate-900 rounded-3xl p-6 sm:p-8 text-white shadow-elevated flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-amber-500 text-slate-950 flex items-center justify-center font-bold text-xl shadow-lg">
            <HardHat className="w-8 h-8" />
          </div>
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-amber-400 bg-slate-800 px-2.5 py-0.5 rounded-full border border-slate-700">
                Field Officer Workspace
              </span>
              {currentUser.employeeCode && (
                <span className="text-xs font-mono text-slate-400">ID: {currentUser.employeeCode}</span>
              )}
            </div>
            <h1 className="text-xl sm:text-2xl font-extrabold text-white">
              {currentUser.name}
            </h1>
            <p className="text-xs text-slate-400">
              {currentUser.designation || 'Municipal Field Engineer'} • {currentUser.departmentName || 'Operations Wing'}
            </p>
          </div>
        </div>
      </div>

      {/* KPI Counters */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-card space-y-1">
          <span className="text-xs text-slate-500 font-bold uppercase tracking-wider">Total Tasks Assigned</span>
          <p className="text-3xl font-black text-slate-900 mt-1">{totalAssigned}</p>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-card space-y-1">
          <span className="text-xs text-amber-600 font-bold uppercase tracking-wider">Active In Progress</span>
          <p className="text-3xl font-black text-amber-700 mt-1">{inProgress}</p>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-card space-y-1">
          <span className="text-xs text-rose-600 font-bold uppercase tracking-wider">⚠️ SLA Overdue Alert</span>
          <p className="text-3xl font-black text-rose-700 mt-1">{overdueCount}</p>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-card space-y-1">
          <span className="text-xs text-emerald-600 font-bold uppercase tracking-wider">Completed Fixes</span>
          <p className="text-3xl font-black text-emerald-700 mt-1">{resolvedCount}</p>
        </div>
      </div>

      {/* Filters & Search */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
        <div className="flex flex-wrap items-center gap-1.5 p-1 bg-slate-100 rounded-xl w-full sm:w-auto">
          {(['all', 'assigned', 'in_progress', 'overdue', 'resolved'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveFilter(tab)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold capitalize transition-all ${
                activeFilter === tab
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {tab === 'overdue' ? '⚠️ Overdue' : tab.replace('_', ' ')}
            </button>
          ))}
        </div>

        <div className="w-full sm:w-72 relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search assigned tickets..."
            className="w-full pl-9 pr-3 py-1.5 text-xs bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-civic-500 focus:outline-none"
          />
        </div>
      </div>

      {/* Task Queue Cards */}
      <div className="space-y-4">
        {displayedList.length === 0 ? (
          <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center text-slate-400 text-xs">
            <CheckCircle2 className="w-10 h-10 mx-auto text-emerald-500 mb-2" />
            <p className="text-sm font-bold text-slate-700">No active tasks in this filter view.</p>
            <p>All grievances in this view are up to date.</p>
          </div>
        ) : (
          displayedList.map((complaint) => {
            const statusInfo = getStatusBadgeInfo(complaint.status);
            const priorityInfo = getPriorityBadgeInfo(complaint.priority);
            const slaInfo = getSlaDisplayText(complaint);

            return (
              <div
                key={complaint.id}
                className="bg-white rounded-2xl border border-slate-200 p-5 shadow-card hover:shadow-elevated transition-all flex flex-col md:flex-row items-start md:items-center justify-between gap-4"
              >
                <div className="space-y-2 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-mono text-xs font-bold bg-slate-100 text-slate-800 px-2.5 py-1 rounded-md border border-slate-300">
                      {complaint.complaintId}
                    </span>
                    <span className={`text-xs px-2.5 py-0.5 rounded-full font-bold border ${statusInfo.badgeClass}`}>
                      {statusInfo.label}
                    </span>
                    <span className={`text-xs px-2 py-0.5 rounded ${priorityInfo.badgeClass}`}>
                      {priorityInfo.label}
                    </span>
                    <span className={`text-xs px-2 py-0.5 rounded border ${slaInfo.badgeClass}`}>
                      {slaInfo.text}
                    </span>
                  </div>

                  <h3 className="text-sm font-bold text-slate-900">
                    {complaint.title}
                  </h3>
                  <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                    {complaint.description}
                  </p>

                  <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500 pt-1">
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-civic-600" /> {complaint.locationAddress}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5" /> Filed {formatDateShort(complaint.createdAt)}
                    </span>
                    {complaint.supportersCount > 1 && (
                      <span className="font-semibold text-civic-700">
                        {complaint.supportersCount} Citizens Affected
                      </span>
                    )}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2 w-full md:w-auto shrink-0 pt-3 md:pt-0 border-t md:border-t-0 border-slate-100">
                  <button
                    onClick={() => setSelectedComplaintForUpdate(complaint)}
                    className="flex-1 md:flex-initial inline-flex items-center justify-center gap-1.5 px-4 py-2.5 bg-civic-600 hover:bg-civic-700 text-white font-bold text-xs rounded-xl shadow-xs transition-all active:scale-95"
                  >
                    <HardHat className="w-4 h-4" />
                    <span>Update Status & Proof</span>
                  </button>

                  <Link
                    to={`/track/${complaint.complaintId}`}
                    className="px-3 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold"
                    title="View Full Dossier"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Status Update Modal */}
      {selectedComplaintForUpdate && (
        <StatusUpdateModal
          complaint={selectedComplaintForUpdate}
          onClose={() => setSelectedComplaintForUpdate(null)}
        />
      )}
    </div>
  );
};
