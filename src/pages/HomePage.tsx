import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  ShieldCheck,
  Search,
  PlusCircle,
  MapPin,
  BarChart3,
  ArrowRight,
  CheckCircle2,
  Clock,
  Camera,
  Sparkles,
  ChevronRight,
  TrendingUp,
  UserCheck,
  FileCheck,
  Building2,
  Info
} from 'lucide-react';
import { COMPLAINT_CATEGORIES } from '../data/categories';
import { CategoryIcon } from '../components/common/CategoryIcon';
import { useComplaints } from '../contexts/ComplaintContext';
import { ComplaintCard } from '../components/complaints/ComplaintCard';
import { RecentlyResolvedSection } from '../components/complaints/RecentlyResolvedSection';
import { CivicAwareness } from '../components/common/CivicAwareness';

export const HomePage: React.FC = () => {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const { complaints, transparencyStats } = useComplaints();

  const [trackInput, setTrackInput] = useState('');

  const handleTrackSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (trackInput.trim()) {
      navigate(`/track/${trackInput.trim()}`);
    }
  };

  // 7-step "What Happened to My Complaint?" process
  const howItWorksSteps = [
    {
      num: '01',
      title: t('howItWorks.step1'),
      desc: t('howItWorks.step1Desc'),
      icon: <Camera className="w-5 h-5 text-civic-600" />
    },
    {
      num: '02',
      title: t('howItWorks.step2'),
      desc: t('howItWorks.step2Desc'),
      icon: <FileCheck className="w-5 h-5 text-blue-600" />
    },
    {
      num: '03',
      title: t('howItWorks.step3'),
      desc: t('howItWorks.step3Desc'),
      icon: <Building2 className="w-5 h-5 text-purple-600" />
    },
    {
      num: '04',
      title: t('howItWorks.step4'),
      desc: t('howItWorks.step4Desc'),
      icon: <TrendingUp className="w-5 h-5 text-amber-600" />
    },
    {
      num: '05',
      title: t('howItWorks.step5'),
      desc: t('howItWorks.step5Desc'),
      icon: <Camera className="w-5 h-5 text-cyan-600" />
    },
    {
      num: '06',
      title: t('howItWorks.step6'),
      desc: t('howItWorks.step6Desc'),
      icon: <CheckCircle2 className="w-5 h-5 text-emerald-600" />
    },
    {
      num: '07',
      title: t('howItWorks.step7'),
      desc: t('howItWorks.step7Desc'),
      icon: <UserCheck className="w-5 h-5 text-rose-600" />
    }
  ];

  const recentComplaints = complaints.slice(0, 3);

  return (
    <div className="space-y-16 pb-16">
      {/* 1. Dark Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-slate-900 via-navy-900 to-slate-950 text-white pt-12 pb-20 px-4 sm:px-6 lg:px-8 shadow-inner">
        {/* Background decorative glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[350px] bg-civic-500/10 blur-[120px] rounded-full pointer-events-none" />
        
        <div className="max-w-5xl mx-auto text-center space-y-8 relative z-10">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-civic-900/80 border border-civic-500/40 text-civic-300 text-xs font-bold tracking-wide backdrop-blur-xs">
            <Sparkles className="w-4 h-4 text-civic-400" />
            <span>{t('hero.badge')}</span>
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-tight">
            {t('hero.title')}
          </h1>

          <p className="text-base sm:text-xl text-slate-300 max-w-3xl mx-auto leading-relaxed">
            {t('hero.subtitle')}
          </p>

          {/* Quick Track Input Bar */}
          <form
            onSubmit={handleTrackSubmit}
            className="max-w-2xl mx-auto bg-white/10 backdrop-blur-md p-2 rounded-2xl border border-white/20 shadow-2xl flex flex-col sm:flex-row items-center gap-2"
          >
            <div className="flex-1 flex items-center gap-2.5 px-3 w-full">
              <Search className="w-5 h-5 text-slate-300 shrink-0" />
              <input
                type="text"
                value={trackInput}
                onChange={(e) => setTrackInput(e.target.value)}
                placeholder={t('hero.quickTrackPlaceholder')}
                className="w-full bg-transparent text-white placeholder-slate-400 text-sm font-medium focus:outline-none py-2"
              />
            </div>
            <button
              type="submit"
              className="w-full sm:w-auto px-6 py-3 bg-civic-500 hover:bg-civic-600 text-white font-bold text-sm rounded-xl shadow-lg transition-all active:scale-95 whitespace-nowrap"
            >
              {t('hero.trackNow')}
            </button>
          </form>

          {/* Action CTAs */}
          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <Link
              to="/submit"
              className="inline-flex items-center gap-2 px-6 py-3.5 bg-civic-600 hover:bg-civic-500 text-white font-extrabold text-sm rounded-xl shadow-xl shadow-civic-600/30 transition-all hover:scale-105 active:scale-95"
            >
              <PlusCircle className="w-5 h-5 stroke-[2.5]" />
              <span>{t('hero.reportButton')}</span>
            </Link>

            <Link
              to="/map"
              className="inline-flex items-center gap-2 px-6 py-3.5 bg-slate-800 hover:bg-slate-700 text-slate-100 font-bold text-sm rounded-xl border border-slate-700 shadow-md transition-all hover:scale-105 active:scale-95"
            >
              <MapPin className="w-5 h-5 text-amber-400" />
              <span>{t('hero.viewMapButton')}</span>
            </Link>

            <Link
              to="/transparency"
              className="inline-flex items-center gap-2 px-6 py-3.5 bg-slate-800 hover:bg-slate-700 text-slate-100 font-bold text-sm rounded-xl border border-slate-700 shadow-md transition-all hover:scale-105 active:scale-95"
            >
              <BarChart3 className="w-5 h-5 text-civic-400" />
              <span>{t('hero.transparencyButton')}</span>
            </Link>
          </div>

          {/* Subtle Prototype Disclaimer */}
          <div className="pt-2">
            <span className="text-[11px] text-slate-400/80 inline-flex items-center gap-1">
              <Info className="w-3 h-3 text-slate-400" />
              Independent civic-tech project. Demo data shown for demonstration purposes.
            </span>
          </div>
        </div>
      </section>

      {/* 2. Key Metrics Bar */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-12 relative z-20">
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-3 sm:gap-4 bg-white rounded-2xl p-4 sm:p-6 shadow-elevated border border-slate-200">
          <div className="p-3 text-center border-r border-slate-100 last:border-none">
            <p className="text-xs text-slate-500 font-semibold uppercase tracking-wider">{t('dashboard.kpiTotal')}</p>
            <p className="text-2xl sm:text-3xl font-black text-slate-900 mt-1">
              {transparencyStats.totalComplaints.toLocaleString()}
            </p>
          </div>

          <div className="p-3 text-center border-r border-slate-100 last:border-none">
            <p className="text-xs text-emerald-600 font-semibold uppercase tracking-wider">{t('dashboard.kpiResolved')}</p>
            <p className="text-2xl sm:text-3xl font-black text-emerald-700 mt-1">
              {transparencyStats.resolvedCount.toLocaleString()}
            </p>
          </div>

          <div className="p-3 text-center border-r border-slate-100 last:border-none">
            <p className="text-xs text-amber-600 font-semibold uppercase tracking-wider">{t('dashboard.kpiInProgress')}</p>
            <p className="text-2xl sm:text-3xl font-black text-amber-700 mt-1">
              {transparencyStats.inProgressCount.toLocaleString()}
            </p>
          </div>

          <div className="p-3 text-center border-r border-slate-100 last:border-none">
            <p className="text-xs text-rose-600 font-semibold uppercase tracking-wider">{t('dashboard.kpiOverdue')}</p>
            <p className="text-2xl sm:text-3xl font-black text-rose-700 mt-1">
              {transparencyStats.overdueCount.toLocaleString()}
            </p>
          </div>

          <div className="p-3 text-center col-span-2 lg:col-span-1">
            <p className="text-xs text-civic-700 font-semibold uppercase tracking-wider">{t('dashboard.kpiAvgDays')}</p>
            <p className="text-2xl sm:text-3xl font-black text-civic-800 mt-1">
              {transparencyStats.avgResolutionDays} <span className="text-xs font-bold">Days</span>
            </p>
          </div>
        </div>
      </section>

      {/* 3. "What happened to your complaint?" Process Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center space-y-2 mb-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-civic-50 border border-civic-200 text-civic-700 text-xs font-bold rounded-full">
            <ShieldCheck className="w-3.5 h-3.5" /> End-to-End Civic Accountability
          </div>
          <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            {t('howItWorks.title')}
          </h2>
          <p className="text-sm sm:text-base text-slate-600 max-w-2xl mx-auto">
            {t('howItWorks.subtitle')}
          </p>
        </div>

        {/* 7-Step Interactive Flow Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-7 gap-3 sm:gap-4">
          {howItWorksSteps.map((step, idx) => (
            <div
              key={idx}
              className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-card hover:shadow-elevated hover:border-civic-500 transition-all duration-200 flex flex-col justify-between group relative"
            >
              <div className="space-y-2.5">
                <div className="flex items-center justify-between">
                  <div className="w-9 h-9 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-center group-hover:scale-110 transition-transform">
                    {step.icon}
                  </div>
                  <span className="font-mono font-black text-slate-300 text-xs sm:text-sm">
                    {step.num}
                  </span>
                </div>

                <h3 className="font-bold text-xs sm:text-sm text-slate-900 group-hover:text-civic-700 transition-colors">
                  {step.title}
                </h3>
                <p className="text-[11px] sm:text-xs text-slate-600 leading-relaxed font-normal">
                  {step.desc}
                </p>
              </div>

              <div className="mt-3 pt-2 border-t border-slate-100 flex items-center text-[10px] font-semibold text-civic-700">
                <CheckCircle2 className="w-3 h-3 mr-1 text-civic-600 shrink-0" />
                <span>Audit Verified</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 4. Recently Resolved Community Issues Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <RecentlyResolvedSection />
      </section>

      {/* 5. Common Civic Problems Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-wrap items-end justify-between gap-4 mb-8">
          <div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
              {t('commonProblems.title')}
            </h2>
            <p className="text-sm text-slate-600 mt-1">
              {t('commonProblems.subtitle')}
            </p>
          </div>
          <Link
            to="/submit"
            className="inline-flex items-center gap-1 text-xs font-bold text-civic-700 hover:text-civic-900"
          >
            <span>{t('commonProblems.viewAll')}</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3.5">
          {COMPLAINT_CATEGORIES.slice(0, 10).map((cat) => {
            const localizedName =
              i18n.language === 'te' ? cat.nameTe : i18n.language === 'hi' ? cat.nameHi : cat.name;

            return (
              <Link
                key={cat.id}
                to={`/submit?category=${cat.id}`}
                className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-card hover:shadow-elevated hover:border-civic-500 transition-all duration-150 flex flex-col justify-between group"
              >
                <div className="space-y-2.5">
                  <div className="w-10 h-10 rounded-xl bg-civic-50 text-civic-700 border border-civic-100 flex items-center justify-center group-hover:bg-civic-600 group-hover:text-white transition-colors">
                    <CategoryIcon name={cat.iconName} className="w-5 h-5" />
                  </div>
                  <h3 className="font-bold text-xs text-slate-900 group-hover:text-civic-700 transition-colors line-clamp-2">
                    {localizedName}
                  </h3>
                </div>

                <div className="mt-3 pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500 font-medium">
                  <span>SLA: {cat.slaDays} {cat.slaDays === 1 ? 'Day' : 'Days'}</span>
                  <span className="text-civic-600 font-bold group-hover:translate-x-0.5 transition-transform">Report →</span>
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      {/* 6. Live Grievances Feed */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-wrap items-end justify-between gap-4 mb-6">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-bold text-civic-700 bg-civic-50 px-2.5 py-1 rounded-full border border-civic-200 mb-2">
              <Clock className="w-3.5 h-3.5" /> Live Civic Redressal Feed
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
              Active & Resolved Grievances
            </h2>
          </div>
          <Link
            to="/map"
            className="inline-flex items-center gap-1.5 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold rounded-xl transition-colors"
          >
            <span>Explore City Map</span>
            <ChevronRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {recentComplaints.map((c) => (
            <ComplaintCard key={c.id} complaint={c} />
          ))}
        </div>
      </section>

      {/* 7. Why NagarSetu? Trust & Accountability Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-slate-900 rounded-3xl p-8 sm:p-12 text-white border border-slate-800 shadow-2xl relative overflow-hidden">
          <div className="max-w-3xl space-y-4 mb-10">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-civic-900 border border-civic-500/40 text-civic-300 text-xs font-bold rounded-full">
              <ShieldCheck className="w-3.5 h-3.5" /> A Bridge Between Citizens & Municipal Services
            </div>
            <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight">
              {t('whyNagarSetu.title')}
            </h2>
            <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
              {t('whyNagarSetu.subtitle')}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="space-y-2 bg-slate-800/80 p-5 rounded-2xl border border-slate-700/80">
              <ShieldCheck className="w-8 h-8 text-civic-400" />
              <h3 className="font-bold text-sm text-white">{t('whyNagarSetu.card1Title')}</h3>
              <p className="text-xs text-slate-400 leading-relaxed">{t('whyNagarSetu.card1Desc')}</p>
            </div>

            <div className="space-y-2 bg-slate-800/80 p-5 rounded-2xl border border-slate-700/80">
              <Clock className="w-8 h-8 text-blue-400" />
              <h3 className="font-bold text-sm text-white">{t('whyNagarSetu.card2Title')}</h3>
              <p className="text-xs text-slate-400 leading-relaxed">{t('whyNagarSetu.card2Desc')}</p>
            </div>

            <div className="space-y-2 bg-slate-800/80 p-5 rounded-2xl border border-slate-700/80">
              <Camera className="w-8 h-8 text-amber-400" />
              <h3 className="font-bold text-sm text-white">{t('whyNagarSetu.card3Title')}</h3>
              <p className="text-xs text-slate-400 leading-relaxed">{t('whyNagarSetu.card3Desc')}</p>
            </div>

            <div className="space-y-2 bg-slate-800/80 p-5 rounded-2xl border border-slate-700/80">
              <UserCheck className="w-8 h-8 text-rose-400" />
              <h3 className="font-bold text-sm text-white">{t('whyNagarSetu.card4Title')}</h3>
              <p className="text-xs text-slate-400 leading-relaxed">{t('whyNagarSetu.card4Desc')}</p>
            </div>
          </div>
        </div>
      </section>

      {/* 8. Know Your Civic Services (Civic Awareness Guide) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <CivicAwareness />
      </section>

      {/* 9. Final CTA Box */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-r from-civic-700 to-emerald-700 rounded-3xl p-8 sm:p-10 text-white text-center space-y-4 shadow-xl">
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            See a Problem in Your Neighborhood?
          </h2>
          <p className="text-xs sm:text-sm text-civic-100 max-w-xl mx-auto leading-relaxed">
            Report in 60 seconds with GPS and photos. Track transparent municipal action from start to finish.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <Link
              to="/submit"
              className="px-6 py-3 bg-white text-civic-800 font-extrabold text-xs sm:text-sm rounded-xl shadow-md hover:bg-slate-50 transition-all hover:scale-105 active:scale-95"
            >
              Report a Problem Now
            </Link>
            <Link
              to="/track"
              className="px-6 py-3 bg-civic-900/60 hover:bg-civic-900 text-white font-bold text-xs sm:text-sm rounded-xl border border-civic-400/40 transition-all hover:scale-105 active:scale-95"
            >
              Track Your Complaint
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};
