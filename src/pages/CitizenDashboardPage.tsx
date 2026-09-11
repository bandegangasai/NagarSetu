import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  UserCheck,
  PlusCircle,
  Search,
  FileText
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useComplaints } from '../contexts/ComplaintContext';
import { ComplaintCard } from '../components/complaints/ComplaintCard';

export const CitizenDashboardPage: React.FC = () => {
  const { t } = useTranslation();
  const { currentUser } = useAuth();
  const { complaints } = useComplaints();

  const [activeTab, setActiveTab] = useState<'all' | 'pending' | 'in_progress' | 'resolved' | 'reopened' | 'supported'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Filter complaints filed by or supported by the current citizen
  const myReported = complaints.filter((c) => c.citizenId === currentUser.id);
  const mySupported = complaints.filter((c) => c.supportedByMe);

  const displayedList = (activeTab === 'supported' ? mySupported : myReported).filter((c) => {
    if (activeTab === 'pending') {
      if (c.status !== 'submitted' && c.status !== 'received' && c.status !== 'under_review' && c.status !== 'assigned') return false;
    } else if (activeTab === 'in_progress') {
      if (c.status !== 'in_progress' && c.status !== 'action_taken') return false;
    } else if (activeTab === 'resolved') {
      if (c.status !== 'resolved') return false;
    } else if (activeTab === 'reopened') {
      if (c.status !== 'reopened') return false;
    }

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

  const pendingCount = myReported.filter((c) => c.status === 'submitted' || c.status === 'received' || c.status === 'assigned').length;
  const inProgressCount = myReported.filter((c) => c.status === 'in_progress' || c.status === 'action_taken').length;
  const resolvedCount = myReported.filter((c) => c.status === 'resolved').length;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8">
      {/* Top Welcome Header */}
      <div className="bg-gradient-to-r from-slate-900 to-navy-900 rounded-3xl p-6 sm:p-8 text-white shadow-elevated flex flex-wrap items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-civic-900/80 border border-civic-500/40 text-civic-300 text-xs font-bold rounded-full">
            <UserCheck className="w-3.5 h-3.5 text-civic-400" /> Citizen Portal
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            {t('dashboard.citizenWelcome', { name: currentUser.name })}
          </h1>
          <p className="text-xs sm:text-sm text-slate-300">
            {t('dashboard.citizenSubtitle')}
          </p>
        </div>

        <Link
          to="/submit"
          className="inline-flex items-center gap-2 px-5 py-3 bg-civic-600 hover:bg-civic-500 text-white font-bold text-xs sm:text-sm rounded-xl shadow-lg transition-all active:scale-95"
        >
          <PlusCircle className="w-5 h-5 stroke-[2.5]" />
          <span>Report New Problem</span>
        </Link>
      </div>

      {/* Summary KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 sm:gap-4">
        <button
          onClick={() => setActiveTab('all')}
          className={`p-4 rounded-2xl border text-left transition-all ${
            activeTab === 'all'
              ? 'bg-civic-50 border-civic-500 shadow-sm'
              : 'bg-white border-slate-200 hover:bg-slate-50'
          }`}
        >
          <span className="text-xs text-slate-500 font-bold uppercase">All Filed</span>
          <p className="text-2xl font-black text-slate-900 mt-1">{myReported.length}</p>
        </button>

        <button
          onClick={() => setActiveTab('pending')}
          className={`p-4 rounded-2xl border text-left transition-all ${
            activeTab === 'pending'
              ? 'bg-blue-50 border-blue-500 shadow-sm'
              : 'bg-white border-slate-200 hover:bg-slate-50'
          }`}
        >
          <span className="text-xs text-blue-600 font-bold uppercase">Pending</span>
          <p className="text-2xl font-black text-blue-700 mt-1">{pendingCount}</p>
        </button>

        <button
          onClick={() => setActiveTab('in_progress')}
          className={`p-4 rounded-2xl border text-left transition-all ${
            activeTab === 'in_progress'
              ? 'bg-amber-50 border-amber-500 shadow-sm'
              : 'bg-white border-slate-200 hover:bg-slate-50'
          }`}
        >
          <span className="text-xs text-amber-600 font-bold uppercase">In Progress</span>
          <p className="text-2xl font-black text-amber-700 mt-1">{inProgressCount}</p>
        </button>

        <button
          onClick={() => setActiveTab('resolved')}
          className={`p-4 rounded-2xl border text-left transition-all ${
            activeTab === 'resolved'
              ? 'bg-emerald-50 border-emerald-500 shadow-sm'
              : 'bg-white border-slate-200 hover:bg-slate-50'
          }`}
        >
          <span className="text-xs text-emerald-600 font-bold uppercase">Resolved</span>
          <p className="text-2xl font-black text-emerald-700 mt-1">{resolvedCount}</p>
        </button>

        <button
          onClick={() => setActiveTab('supported')}
          className={`p-4 rounded-2xl border text-left transition-all col-span-2 sm:col-span-1 ${
            activeTab === 'supported'
              ? 'bg-purple-50 border-purple-500 shadow-sm'
              : 'bg-white border-slate-200 hover:bg-slate-50'
          }`}
        >
          <span className="text-xs text-purple-600 font-bold uppercase">Supported (+1)</span>
          <p className="text-2xl font-black text-purple-700 mt-1">{mySupported.length}</p>
        </button>
      </div>

      {/* Filter Tabs & Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
        <div className="flex flex-wrap items-center gap-1.5 p-1 bg-slate-100 rounded-xl w-full sm:w-auto">
          {(['all', 'pending', 'in_progress', 'resolved', 'reopened', 'supported'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold capitalize transition-all ${
                activeTab === tab
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {tab.replace('_', ' ')}
            </button>
          ))}
        </div>

        <div className="w-full sm:w-64 relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search my issues..."
            className="w-full pl-9 pr-3 py-1.5 text-xs bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-civic-500 focus:outline-none"
          />
        </div>
      </div>

      {/* Complaints Grid */}
      {displayedList.length === 0 ? (
        <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center text-slate-400 text-xs space-y-3">
          <FileText className="w-10 h-10 mx-auto text-slate-300" />
          <p className="text-sm font-bold text-slate-700">No complaints found in this category.</p>
          <p>You can file a new grievance anytime or support nearby issues on the city map.</p>
          <Link
            to="/submit"
            className="inline-flex items-center gap-1.5 px-4 py-2 bg-civic-600 text-white font-bold rounded-xl mt-2"
          >
            <PlusCircle className="w-4 h-4" /> Report an Issue
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {displayedList.map((complaint) => (
            <ComplaintCard key={complaint.id} complaint={complaint} />
          ))}
        </div>
      )}
    </div>
  );
};
