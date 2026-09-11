import React from 'react';
import { useTranslation } from 'react-i18next';
import {
  BarChart3,
  TrendingUp,
  Award,
  Download,
  Lock,
  Building2
} from 'lucide-react';
import { useComplaints } from '../contexts/ComplaintContext';
import { CategoryBarChart } from '../components/charts/CategoryBarChart';
import { MonthlyTrendChart } from '../components/charts/MonthlyTrendChart';
import { DeptPerformanceChart } from '../components/charts/DeptPerformanceChart';
import { SlaPieChart } from '../components/charts/SlaPieChart';

export const TransparencyPage: React.FC = () => {
  const { t } = useTranslation();
  const { transparencyStats, complaints } = useComplaints();

  const handleExportCsv = () => {
    const headers = 'ComplaintID,Category,Ward,City,Status,Priority,IsOverdue,CreatedAt\n';
    const rows = complaints
      .map(
        (c) =>
          `"${c.complaintId}","${c.categoryName}","${c.wardNo}","${c.city}","${c.status}","${c.priority}",${c.isOverdue},"${c.createdAt}"`
      )
      .join('\n');

    const blob = new Blob([headers + rows], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `NagarSetu_Transparency_Report_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8">
      {/* Top Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-civic-50 border border-civic-200 text-civic-800 text-xs font-bold rounded-full mb-1">
            <BarChart3 className="w-3.5 h-3.5 text-civic-600" /> Citizen-Powered Public Transparency Portal
          </div>
          <h1 className="text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            {t('nav.transparency')}
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Real-time analytics and performance accountability of municipal civic grievance resolution. (Demo Data)
          </p>
        </div>

        <button
          onClick={handleExportCsv}
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-white hover:bg-slate-50 text-slate-800 font-bold text-xs rounded-xl border border-slate-300 shadow-xs transition-colors"
        >
          <Download className="w-4 h-4 text-civic-600" />
          <span>Export Open Data (CSV)</span>
        </button>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-card space-y-1">
          <span className="text-xs text-slate-500 font-bold uppercase tracking-wider">
            Total Complaints
          </span>
          <p className="text-3xl font-black text-slate-900">
            {transparencyStats.totalComplaints.toLocaleString()}
          </p>
          <p className="text-[11px] text-slate-400">All registered municipal grievances</p>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-card space-y-1">
          <span className="text-xs text-emerald-600 font-bold uppercase tracking-wider">
            Resolved & Verified
          </span>
          <p className="text-3xl font-black text-emerald-700">
            {transparencyStats.resolvedCount.toLocaleString()}
          </p>
          <p className="text-[11px] text-emerald-600 font-medium">
            Verified on-ground by citizens
          </p>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-card space-y-1">
          <span className="text-xs text-amber-600 font-bold uppercase tracking-wider">
            Average Resolution Time
          </span>
          <p className="text-3xl font-black text-amber-700">
            {transparencyStats.avgResolutionDays}{' '}
            <span className="text-sm font-semibold">Days</span>
          </p>
          <p className="text-[11px] text-slate-400">From submission to verified fix</p>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-card space-y-1">
          <span className="text-xs text-civic-700 font-bold uppercase tracking-wider">
            SLA Compliance Rate
          </span>
          <p className="text-3xl font-black text-civic-800">
            {transparencyStats.slaComplianceRate}%
          </p>
          <p className="text-[11px] text-civic-600 font-medium">
            Resolved within standard timeframe
          </p>
        </div>
      </div>

      {/* Charts Row 1: Category Distribution & Status Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-8 bg-white rounded-3xl p-6 border border-slate-200/80 shadow-card space-y-4">
          <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
            <BarChart3 className="w-4 h-4 text-civic-600" /> Complaints by Category
          </h3>
          <CategoryBarChart data={transparencyStats.byCategory} />
        </div>

        <div className="lg:col-span-4 bg-white rounded-3xl p-6 border border-slate-200/80 shadow-card space-y-4">
          <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
            Status Breakdown
          </h3>
          <SlaPieChart stats={transparencyStats} />
        </div>
      </div>

      {/* Charts Row 2: Monthly Trend & Department Performance */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-6 bg-white rounded-3xl p-6 border border-slate-200/80 shadow-card space-y-4">
          <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-civic-600" /> Monthly Submissions vs Resolutions
          </h3>
          <MonthlyTrendChart data={transparencyStats.monthlyTrend} />
        </div>

        <div className="lg:col-span-6 bg-white rounded-3xl p-6 border border-slate-200/80 shadow-card space-y-4">
          <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
            <Building2 className="w-4 h-4 text-civic-600" /> Department Performance Breakdown
          </h3>
          <DeptPerformanceChart data={transparencyStats.departmentLeaderboard} />
        </div>
      </div>

      {/* Department Leaderboard Table */}
      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-card overflow-hidden">
        <div className="p-6 border-b border-slate-100 flex items-center justify-between">
          <h3 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
            <Award className="w-5 h-5 text-amber-500" /> Municipal Department Redressal Scorecard
          </h3>
          <span className="text-xs text-slate-400 font-semibold">Live Audited Metrics</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider">
              <tr>
                <th className="py-3.5 px-4">Department</th>
                <th className="py-3.5 px-4 text-center">Total Assigned</th>
                <th className="py-3.5 px-4 text-center">Resolved</th>
                <th className="py-3.5 px-4 text-center">In Progress</th>
                <th className="py-3.5 px-4 text-center">Overdue</th>
                <th className="py-3.5 px-4 text-center">Avg Days</th>
                <th className="py-3.5 px-4 text-center">SLA Compliance</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {transparencyStats.departmentLeaderboard.map((dept) => (
                <tr key={dept.departmentId} className="hover:bg-slate-50/80 transition-colors">
                  <td className="py-3.5 px-4 font-bold text-slate-900">{dept.name}</td>
                  <td className="py-3.5 px-4 text-center font-semibold">{dept.totalAssigned}</td>
                  <td className="py-3.5 px-4 text-center text-emerald-700 font-bold">{dept.resolved}</td>
                  <td className="py-3.5 px-4 text-center text-amber-700 font-semibold">{dept.inProgress}</td>
                  <td className="py-3.5 px-4 text-center text-rose-700 font-bold">{dept.overdue}</td>
                  <td className="py-3.5 px-4 text-center">{dept.avgResolutionDays} d</td>
                  <td className="py-3.5 px-4 text-center">
                    <span
                      className={`px-2 py-0.5 rounded-full font-bold text-[11px] ${
                        dept.slaRate >= 90
                          ? 'bg-emerald-100 text-emerald-800'
                          : dept.slaRate >= 75
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-rose-100 text-rose-800'
                      }`}
                    >
                      {dept.slaRate}%
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Privacy Notice Banner */}
      <div className="bg-slate-900 text-slate-300 rounded-2xl p-4 sm:p-5 flex items-start gap-3 text-xs border border-slate-800">
        <Lock className="w-5 h-5 text-civic-400 shrink-0 mt-0.5" />
        <div>
          <h4 className="font-bold text-white text-sm">Strict Citizen Privacy Guarantees</h4>
          <p className="text-slate-400 mt-1 leading-relaxed">
            All public transparency reports, aggregated graphs, and open data exports are rigorously sanitized. Citizen phone numbers, email addresses, and residential identities are never exposed in public feeds.
          </p>
        </div>
      </div>
    </div>
  );
};
