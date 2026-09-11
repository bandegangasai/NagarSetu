import React from 'react';
import { useTranslation } from 'react-i18next';
import { Globe } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

export const LANGUAGES = [
  { code: 'en', label: 'English', native: 'English' },
  { code: 'te', label: 'Telugu', native: 'తెలుగు' },
  { code: 'hi', label: 'Hindi', native: 'हिन्दी' }
];

interface LanguageSelectorProps {
  variant?: 'header' | 'footer' | 'pill';
}

export const LanguageSelector: React.FC<LanguageSelectorProps> = ({ variant = 'header' }) => {
  const { i18n } = useTranslation();
  const { updateLanguagePreference } = useAuth();

  const handleLanguageChange = (code: string) => {
    i18n.changeLanguage(code);
    updateLanguagePreference(code as 'en' | 'te' | 'hi');
  };

  if (variant === 'pill') {
    return (
      <div className="flex items-center gap-1.5 p-1 bg-slate-100 rounded-lg border border-slate-200">
        {LANGUAGES.map((lang) => (
          <button
            key={lang.code}
            onClick={() => handleLanguageChange(lang.code)}
            className={`px-2.5 py-1 text-xs font-medium rounded-md transition-all ${
              i18n.language === lang.code
                ? 'bg-civic-600 text-white shadow-sm'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
            }`}
          >
            {lang.native}
          </button>
        ))}
      </div>
    );
  }

  if (variant === 'footer') {
    return (
      <div className="flex flex-wrap items-center gap-3">
        <span className="text-xs text-slate-400 font-medium flex items-center gap-1.5">
          <Globe className="w-3.5 h-3.5" /> Select Language:
        </span>
        <div className="flex items-center gap-2">
          {LANGUAGES.map((lang) => (
            <button
              key={lang.code}
              onClick={() => handleLanguageChange(lang.code)}
              className={`text-xs px-2 py-1 rounded transition-colors ${
                i18n.language === lang.code
                  ? 'bg-civic-800 text-white font-semibold'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800'
              }`}
            >
              {lang.native} ({lang.label})
            </button>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="relative inline-flex items-center">
      <label htmlFor="language-select" className="sr-only">Choose Language</label>
      <div className="flex items-center gap-1.5 px-2.5 py-1.5 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-lg text-slate-700 text-xs font-semibold cursor-pointer transition-colors shadow-sm">
        <Globe className="w-4 h-4 text-civic-600" />
        <select
          id="language-select"
          value={i18n.language}
          onChange={(e) => handleLanguageChange(e.target.value)}
          className="bg-transparent border-none text-xs font-semibold text-slate-700 focus:outline-none cursor-pointer pr-1"
        >
          {LANGUAGES.map((lang) => (
            <option key={lang.code} value={lang.code} className="text-slate-800 font-medium">
              {lang.native} ({lang.label})
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};
