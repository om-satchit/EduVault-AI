import React, { useState } from 'react';
import { 
  BookOpen, 
  GraduationCap, 
  Building2, 
  ArrowRight, 
  CheckCircle, 
  ShieldCheck, 
  Sparkles, 
  Cpu, 
  Users, 
  FileCheck,
  Star,
  Zap,
  Globe,
  CheckCircle2,
  ChevronDown,
  Key
} from 'lucide-react';
import { UserRole } from '../../types';
import { SUPPORTED_LANGUAGES, getTranslation } from '../../utils/i18n';
import { hasStoredApiKey } from '../../services/geminiKeyService';

interface LandingScreenProps {
  onSelectRole: (role: UserRole) => void;
  onDirectLogin: (role: UserRole) => void;
  onOpenLogin: (role?: UserRole) => void;
  onOpenGeminiKey?: () => void;
  currentLanguage?: string;
  onChangeLanguage?: (lang: string) => void;
}

export const LandingScreen: React.FC<LandingScreenProps> = ({
  onSelectRole,
  onDirectLogin,
  onOpenLogin,
  onOpenGeminiKey,
  currentLanguage = 'en',
  onChangeLanguage
}) => {
  const [langDropdownOpen, setLangDropdownOpen] = useState(false);
  const t = (key: string) => getTranslation(currentLanguage, key);
  const currentLangObj = SUPPORTED_LANGUAGES.find(l => l.code === currentLanguage) || SUPPORTED_LANGUAGES[0];

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 via-indigo-50/30 to-white flex flex-col justify-between selection:bg-indigo-500 selection:text-white">
      {/* Top minimal header */}
      <header className="max-w-7xl mx-auto w-full px-6 py-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-violet-500 flex items-center justify-center text-white shadow-lg shadow-indigo-500/25">
            <Sparkles className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-2xl tracking-tight text-slate-900">
                EduVault
              </span>
              <span className="px-2 py-0.5 text-xs font-bold tracking-wider uppercase bg-gradient-to-r from-indigo-600 to-violet-600 text-white rounded-lg shadow-xs">
                AI
              </span>
            </div>
            <span className="text-xs text-slate-500 font-medium">{t('brandSubtitle')}</span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {/* Gemini AI Key Setup Button */}
          {onOpenGeminiKey && (
            <button
              onClick={onOpenGeminiKey}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-gradient-to-r from-amber-500/10 via-indigo-500/10 to-violet-500/10 hover:from-amber-500/20 hover:to-indigo-500/20 text-slate-800 border border-indigo-200/80 text-xs font-bold shadow-xs transition active:scale-95"
              title="Link Google Gemini API Key"
            >
              <Key className="w-3.5 h-3.5 text-amber-600" />
              <span className="hidden sm:inline">Gemini AI</span>
              <span className={`w-2 h-2 rounded-full ${hasStoredApiKey() ? 'bg-emerald-500 animate-pulse' : 'bg-amber-400'}`} />
            </button>
          )}

          {/* Header Language Selector */}
          {onChangeLanguage && (
            <div className="relative">
              <button
                onClick={() => setLangDropdownOpen(!langDropdownOpen)}
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 text-xs font-bold shadow-xs transition"
                title="Change language"
              >
                <Globe className="w-3.5 h-3.5 text-indigo-600" />
                <span>{currentLangObj.flag}</span>
                <span className="hidden sm:inline">{currentLangObj.nativeLabel}</span>
                <ChevronDown className="w-3 h-3 text-slate-400" />
              </button>

              {langDropdownOpen && (
                <div className="absolute right-0 mt-2 w-52 rounded-2xl bg-white shadow-2xl border border-slate-100 py-1.5 z-50 animate-in fade-in duration-100">
                  <div className="px-3 py-1.5 text-[10px] font-bold text-slate-400 uppercase tracking-wider border-b border-slate-100">
                    Select Language ({SUPPORTED_LANGUAGES.length})
                  </div>
                  <div className="max-h-60 overflow-y-auto py-1">
                    {SUPPORTED_LANGUAGES.map((l) => (
                      <button
                        key={l.code}
                        onClick={() => {
                          onChangeLanguage(l.code);
                          setLangDropdownOpen(false);
                        }}
                        className={`w-full flex items-center justify-between px-3 py-2 text-xs text-left hover:bg-slate-50 transition ${currentLanguage === l.code ? 'font-bold text-indigo-600 bg-indigo-50/50' : 'text-slate-700'}`}
                      >
                        <span className="flex items-center gap-2">
                          <span className="text-base">{l.flag}</span>
                          <div>
                            <span className="font-semibold block">{l.nativeLabel}</span>
                            <span className="text-[10px] text-slate-400">{l.label}</span>
                          </div>
                        </span>
                        {currentLanguage === l.code && <CheckCircle2 className="w-3.5 h-3.5 text-indigo-600 shrink-0" />}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          <span className="text-xs text-slate-400 font-medium hidden sm:inline">{t('alreadyHaveAccount')}</span>
          <button
            onClick={() => onOpenLogin('student')}
            className="text-xs font-semibold px-4 py-2 rounded-xl bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 shadow-xs transition hover:border-indigo-300 cursor-pointer"
          >
            {t('signInOrLogin')}
          </button>
        </div>
      </header>

      {/* Main hero section */}
      <main className="max-w-6xl mx-auto w-full px-6 py-12 flex-1 flex flex-col items-center justify-center text-center">
        
        {/* Subtle pills */}
        <div className="flex flex-wrap items-center justify-center gap-2 mb-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200/70 text-xs font-semibold shadow-xs animate-in fade-in duration-300">
            <Sparkles className="w-3.5 h-3.5 text-indigo-500" />
            <span>Notion + Google Drive + AI for Verified Education</span>
          </div>

          {onOpenGeminiKey && (
            <button
              onClick={onOpenGeminiKey}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-300 text-xs font-bold transition shadow-xs cursor-pointer active:scale-95"
            >
              <Key className="w-3.5 h-3.5 text-amber-600" />
              <span>{hasStoredApiKey() ? '✓ Gemini 3.8 Flash Active' : 'Paste Gemini API Key'}</span>
            </button>
          )}
        </div>

        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-slate-900 max-w-3xl leading-[1.15]">
          {t('landingTitle')}{' '}
          <span className="bg-gradient-to-r from-indigo-600 via-violet-600 to-purple-600 bg-clip-text text-transparent">
            EduVault
          </span>
          ?
        </h1>
        
        <p className="mt-4 text-base sm:text-lg text-slate-600 max-w-2xl font-normal leading-relaxed">
          {t('landingSubtitle')}
        </p>

        {/* The 3 Interactive Cards */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6 w-full text-left">
          
          {/* Card 1: Teacher */}
          <div 
            onClick={() => onOpenLogin('teacher')}
            className="group relative rounded-3xl bg-white border border-slate-200/80 p-8 shadow-sm hover:shadow-2xl hover:shadow-emerald-500/10 hover:border-emerald-300 transition-all duration-300 cursor-pointer flex flex-col justify-between overflow-hidden hover:-translate-y-1.5"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/5 rounded-bl-[80px] -z-0 group-hover:scale-110 transition-transform" />
            
            <div className="relative z-10">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center text-white text-3xl shadow-lg shadow-emerald-500/25 mb-6 group-hover:scale-105 transition-transform">
                👨‍🏫
              </div>
              
              <div className="flex items-center gap-2">
                <h3 className="text-2xl font-bold text-slate-900 group-hover:text-emerald-700 transition-colors">
                  {t('teacherTitle')}
                </h3>
                <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                  {t('teacherBadge')}
                </span>
              </div>

              <p className="mt-3 text-slate-600 text-sm leading-relaxed">
                {t('teacherDesc')}
              </p>

              {/* Feature pills */}
              <div className="mt-6 space-y-2.5">
                <div className="flex items-center gap-2 text-xs text-slate-600 font-medium">
                  <CheckCircle className="w-4 h-4 text-emerald-500 shrink-0" />
                  <span>AI Pre-publishing Verification Pipeline</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-slate-600 font-medium">
                  <CheckCircle className="w-4 h-4 text-emerald-500 shrink-0" />
                  <span>Private Classroom Spaces & Materials</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-slate-600 font-medium">
                  <CheckCircle className="w-4 h-4 text-emerald-500 shrink-0" />
                  <span>Student Reach & Quality Analytics</span>
                </div>
              </div>
            </div>

            <div className="mt-8 pt-6 border-t border-slate-100 flex items-center justify-between">
              <span className="text-xs font-semibold text-emerald-600 group-hover:text-emerald-700">
                {t('teacherCta')}
              </span>
              <div className="w-8 h-8 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center group-hover:bg-emerald-600 group-hover:text-white transition-colors">
                <ArrowRight className="w-4 h-4" />
              </div>
            </div>
          </div>

          {/* Card 2: Student */}
          <div 
            onClick={() => onOpenLogin('student')}
            className="group relative rounded-3xl bg-white border-2 border-indigo-500/60 p-8 shadow-md hover:shadow-2xl hover:shadow-indigo-500/15 hover:border-indigo-600 transition-all duration-300 cursor-pointer flex flex-col justify-between overflow-hidden hover:-translate-y-1.5"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/10 rounded-bl-[80px] -z-0 group-hover:scale-110 transition-transform" />
            <div className="absolute top-4 right-4 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-indigo-600 text-white shadow-xs">
              Popular
            </div>

            <div className="relative z-10">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-600 to-violet-600 flex items-center justify-center text-white text-3xl shadow-lg shadow-indigo-500/25 mb-6 group-hover:scale-105 transition-transform">
                👨‍🎓
              </div>
              
              <div className="flex items-center gap-2">
                <h3 className="text-2xl font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">
                  {t('studentTitle')}
                </h3>
                <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-indigo-100 text-indigo-800">
                  {t('studentBadge')}
                </span>
              </div>

              <p className="mt-3 text-slate-600 text-sm leading-relaxed">
                {t('studentDesc')}
              </p>

              {/* Feature pills */}
              <div className="mt-6 space-y-2.5">
                <div className="flex items-center gap-2 text-xs text-slate-600 font-medium">
                  <CheckCircle className="w-4 h-4 text-indigo-600 shrink-0" />
                  <span>Visual Notes, PPTs, Videos & Question Banks</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-slate-600 font-medium">
                  <CheckCircle className="w-4 h-4 text-indigo-600 shrink-0" />
                  <span>AI Tutor: Explain Simply, Flashcards & Quiz</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-slate-600 font-medium">
                  <CheckCircle className="w-4 h-4 text-indigo-600 shrink-0" />
                  <span>Multi-Language Audio: Listen in Tamil, Hindi, etc.</span>
                </div>
              </div>
            </div>

            <div className="mt-8 pt-6 border-t border-slate-100 flex items-center justify-between">
              <span className="text-xs font-semibold text-indigo-600 group-hover:text-indigo-700">
                {t('studentCta')}
              </span>
              <div className="w-8 h-8 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                <ArrowRight className="w-4 h-4" />
              </div>
            </div>
          </div>

          {/* Card 3: Institution */}
          <div 
            onClick={() => onOpenLogin('institution')}
            className="group relative rounded-3xl bg-white border border-slate-200/80 p-8 shadow-sm hover:shadow-2xl hover:shadow-amber-500/10 hover:border-amber-300 transition-all duration-300 cursor-pointer flex flex-col justify-between overflow-hidden hover:-translate-y-1.5"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/5 rounded-bl-[80px] -z-0 group-hover:scale-110 transition-transform" />
            
            <div className="relative z-10">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center text-white text-3xl shadow-lg shadow-amber-500/25 mb-6 group-hover:scale-105 transition-transform">
                🏫
              </div>
              
              <div className="flex items-center gap-2">
                <h3 className="text-2xl font-bold text-slate-900 group-hover:text-amber-700 transition-colors">
                  {t('institutionTitle')}
                </h3>
                <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-800">
                  {t('institutionBadge')}
                </span>
              </div>

              <p className="mt-3 text-slate-600 text-sm leading-relaxed">
                {t('institutionDesc')}
              </p>

              {/* Feature pills */}
              <div className="mt-6 space-y-2.5">
                <div className="flex items-center gap-2 text-xs text-slate-600 font-medium">
                  <CheckCircle className="w-4 h-4 text-amber-500 shrink-0" />
                  <span>Departments, Courses & Class Hierarchies</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-slate-600 font-medium">
                  <CheckCircle className="w-4 h-4 text-amber-500 shrink-0" />
                  <span>Official Institutional Verification Badges</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-slate-600 font-medium">
                  <CheckCircle className="w-4 h-4 text-amber-500 shrink-0" />
                  <span>Access Codes & Student Enrollment Control</span>
                </div>
              </div>
            </div>

            <div className="mt-8 pt-6 border-t border-slate-100 flex items-center justify-between">
              <span className="text-xs font-semibold text-amber-600 group-hover:text-amber-700">
                {t('institutionCta')}
              </span>
              <div className="w-8 h-8 rounded-full bg-amber-50 text-amber-600 flex items-center justify-center group-hover:bg-amber-600 group-hover:text-white transition-colors">
                <ArrowRight className="w-4 h-4" />
              </div>
            </div>
          </div>

        </div>

        {/* Fast Demo Shortcuts */}
        <div className="mt-12 p-4 rounded-2xl bg-white border border-slate-200/80 shadow-xs flex flex-wrap items-center justify-center gap-4 text-xs text-slate-600">
          <span className="font-semibold text-slate-700 flex items-center gap-1.5">
            <Zap className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
            {t('quickDemoLaunch')}
          </span>
          <button
            onClick={() => onDirectLogin('student')}
            className="px-3 py-1.5 rounded-lg bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-semibold transition"
          >
            Launch as Student (Aarav Patel)
          </button>
          <button
            onClick={() => onDirectLogin('teacher')}
            className="px-3 py-1.5 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-700 font-semibold transition"
          >
            Launch as Teacher (Prof. Rahul)
          </button>
          <button
            onClick={() => onDirectLogin('institution')}
            className="px-3 py-1.5 rounded-lg bg-amber-50 hover:bg-amber-100 text-amber-700 font-semibold transition"
          >
            Launch as Institution Admin (SRM IST)
          </button>
        </div>

      </main>

      {/* Trust & Stats footer */}
      <footer className="border-t border-slate-200/80 bg-white/60 py-6 px-6">
        <div className="max-w-6xl mx-auto space-y-4">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>Multi-tier Verification Pipeline</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Cpu className="w-4 h-4 text-indigo-600" />
                <span>AI Assisted • Human In The Loop</span>
              </div>
              <div className="flex items-center gap-1.5 hidden md:flex">
                <Users className="w-4 h-4 text-slate-600" />
                <span>Institutional Privacy Preserved</span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span>EduVault AI Platform • Built for Higher Education</span>
              <span>•</span>
              <span className="text-indigo-600 font-medium">{t('studiqueCampusCompanion')}</span>
            </div>
          </div>
          <div className="pt-4 border-t border-slate-200/60 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500">
            <div className="flex items-center gap-1.5 font-medium">
              <span>© {new Date().getFullYear()} EduVault AI. All rights reserved.</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="text-slate-500">Created by</span>
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-indigo-50 text-indigo-700 border border-indigo-200/60 shadow-xs">
                ✨ Alchemists
              </span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};
