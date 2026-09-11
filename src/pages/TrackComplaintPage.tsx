import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Search, FileText } from 'lucide-react';
import { useComplaints } from '../contexts/ComplaintContext';
import { ComplaintDetailPage } from './ComplaintDetailPage';

export const TrackComplaintPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { complaints } = useComplaints();

  const [searchInput, setSearchInput] = useState(id || '');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchInput.trim()) {
      navigate(`/track/${searchInput.trim()}`);
    }
  };

  const sampleIds = complaints.slice(0, 5).map((c) => c.complaintId);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8">
      {/* Search Header */}
      <div className="max-w-3xl mx-auto text-center space-y-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-civic-50 border border-civic-200 text-civic-700 text-xs font-bold rounded-full">
          <FileText className="w-3.5 h-3.5" /> Public Grievance Tracker
        </div>

        <h1 className="text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
          {t('track.pageTitle')}
        </h1>
        <p className="text-xs sm:text-sm text-slate-600 max-w-xl mx-auto leading-relaxed">
          {t('track.searchPrompt')}
        </p>

        <form
          onSubmit={handleSearch}
          className="bg-white p-2 rounded-2xl border-2 border-civic-500/80 shadow-elevated flex items-center gap-2 max-w-xl mx-auto"
        >
          <div className="flex-1 flex items-center gap-2 px-3">
            <Search className="w-5 h-5 text-slate-400" />
            <input
              type="text"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              placeholder="e.g. NAG-2026-000001"
              className="w-full text-slate-800 text-sm font-semibold focus:outline-none placeholder-slate-400"
            />
          </div>
          <button
            type="submit"
            className="px-6 py-2.5 bg-civic-600 hover:bg-civic-700 text-white font-bold text-xs sm:text-sm rounded-xl shadow-md transition-all active:scale-95"
          >
            Track Now
          </button>
        </form>

        {/* Quick Sample Clickers */}
        <div className="flex flex-wrap items-center justify-center gap-2 pt-2 text-xs text-slate-500">
          <span>Try Demo Complaint IDs:</span>
          {sampleIds.map((code) => (
            <button
              key={code}
              type="button"
              onClick={() => {
                setSearchInput(code);
                navigate(`/track/${code}`);
              }}
              className="font-mono text-xs font-bold px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-lg border border-slate-300 transition-colors"
            >
              {code}
            </button>
          ))}
        </div>
      </div>

      {/* Render Detail Page if ID is present */}
      {id ? (
        <ComplaintDetailPage />
      ) : (
        <div className="max-w-2xl mx-auto bg-slate-50 border border-slate-200 rounded-2xl p-8 text-center text-slate-500 text-xs space-y-2">
          <Search className="w-8 h-8 mx-auto text-slate-400 mb-1" />
          <p className="font-semibold text-slate-700">No complaint selected.</p>
          <p>Please enter a Complaint ID above or click one of the demo IDs to view its real-time audit trail.</p>
        </div>
      )}
    </div>
  );
};
