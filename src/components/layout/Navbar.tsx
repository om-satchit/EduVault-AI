import React, { useState } from 'react';
import { 
  Sparkles, 
  BookOpen, 
  GraduationCap, 
  Building2, 
  Search, 
  Globe, 
  Accessibility, 
  Flame, 
  Trophy, 
  CheckCircle2, 
  ChevronDown,
  Layers,
  Award,
  LogOut,
  LogIn,
  User,
  Key
} from 'lucide-react';
import { UserRole, StudentProfile, TeacherProfile } from '../../types';
import { SUPPORTED_LANGUAGES, getTranslation } from '../../utils/i18n';
import { hasStoredApiKey } from '../../services/geminiKeyService';

interface NavbarProps {
  currentRole: UserRole;
  onSelectRole: (role: UserRole) => void;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  studentProfile: StudentProfile;
  teacherProfile: TeacherProfile;
  onOpenAccessibility: () => void;
  onOpenTrustModal: () => void;
  onOpenSearch: () => void;
  currentLanguage: string;
  onChangeLanguage: (lang: string) => void;
  onResetToLanding: () => void;
  onOpenLogin?: (role?: UserRole) => void;
  onOpenGeminiKey?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentRole,
  onSelectRole,
  activeTab,
  setActiveTab,
  studentProfile,
  teacherProfile,
  onOpenAccessibility,
  onOpenTrustModal,
  onOpenSearch,
  currentLanguage,
  onChangeLanguage,
  onResetToLanding,
  onOpenLogin,
  onOpenGeminiKey
}) => {
  const [roleDropdownOpen, setRoleDropdownOpen] = useState(false);
  const [langDropdownOpen, setLangDropdownOpen] = useState(false);
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);

  const t = (key: string) => getTranslation(currentLanguage, key);
  const currentLangObj = SUPPORTED_LANGUAGES.find(l => l.code === currentLanguage) || SUPPORTED_LANGUAGES[0];

  return (
    <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-slate-200/80 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Brand Logo */}
          <div className="flex items-center gap-6">
            <button 
              onClick={onResetToLanding}
              className="flex items-center gap-2.5 group text-left transition-transform active:scale-95"
            >
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-violet-500 flex items-center justify-center text-white shadow-md shadow-indigo-500/25 group-hover:shadow-indigo-500/40 transition-shadow">
                <Layers className="w-5 h-5 transition-transform group-hover:rotate-6" />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="font-extrabold text-xl tracking-tight bg-gradient-to-r from-slate-900 via-slate-800 to-indigo-900 bg-clip-text text-transparent">
                    EduVault
                  </span>
                  <span className="px-1.5 py-0.5 text-[10px] font-bold tracking-wider uppercase bg-gradient-to-r from-indigo-600 to-violet-600 text-white rounded-md shadow-xs">
                    AI
                  </span>
                </div>
                <p className="text-[10px] text-slate-500 font-medium -mt-0.5 hidden sm:block">
                  Verified Academic Ecosystem
                </p>
              </div>
            </button>

            {/* Role Switcher Pill */}
            <div className="relative">
              <button
                onClick={() => setRoleDropdownOpen(!roleDropdownOpen)}
                className="flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold bg-slate-100 hover:bg-slate-200/80 text-slate-700 transition border border-slate-200"
              >
                <span className="flex items-center gap-1.5">
                  {currentRole === 'student' && <GraduationCap className="w-3.5 h-3.5 text-indigo-600" />}
                  {currentRole === 'teacher' && <BookOpen className="w-3.5 h-3.5 text-emerald-600" />}
                  {currentRole === 'institution' && <Building2 className="w-3.5 h-3.5 text-amber-600" />}
                  <span className="capitalize">{currentRole} Mode</span>
                </span>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
              </button>

              {roleDropdownOpen && (
                <div className="absolute left-0 mt-2 w-56 rounded-2xl bg-white shadow-xl border border-slate-100 py-1.5 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                  <div className="px-3 py-1.5 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                    Switch Perspective
                  </div>
                  <button
                    onClick={() => { onSelectRole('student'); setRoleDropdownOpen(false); }}
                    className={`w-full flex items-center gap-3 px-3 py-2 text-xs font-medium text-left hover:bg-slate-50 transition ${currentRole === 'student' ? 'text-indigo-600 bg-indigo-50/60 font-semibold' : 'text-slate-700'}`}
                  >
                    <div className="w-7 h-7 rounded-lg bg-indigo-100 text-indigo-600 flex items-center justify-center">
                      <GraduationCap className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="font-semibold">Student</div>
                      <div className="text-[11px] text-slate-400">Discover, learn, practice</div>
                    </div>
                  </button>
                  <button
                    onClick={() => { onSelectRole('teacher'); setRoleDropdownOpen(false); }}
                    className={`w-full flex items-center gap-3 px-3 py-2 text-xs font-medium text-left hover:bg-slate-50 transition ${currentRole === 'teacher' ? 'text-emerald-600 bg-emerald-50/60 font-semibold' : 'text-slate-700'}`}
                  >
                    <div className="w-7 h-7 rounded-lg bg-emerald-100 text-emerald-600 flex items-center justify-center">
                      <BookOpen className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="font-semibold">Teacher / Educator</div>
                      <div className="text-[11px] text-slate-400">Upload, verify, teach</div>
                    </div>
                  </button>
                  <button
                    onClick={() => { onSelectRole('institution'); setRoleDropdownOpen(false); }}
                    className={`w-full flex items-center gap-3 px-3 py-2 text-xs font-medium text-left hover:bg-slate-50 transition ${currentRole === 'institution' ? 'text-amber-600 bg-amber-50/60 font-semibold' : 'text-slate-700'}`}
                  >
                    <div className="w-7 h-7 rounded-lg bg-amber-100 text-amber-600 flex items-center justify-center">
                      <Building2 className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="font-semibold">Institution Admin</div>
                      <div className="text-[11px] text-slate-400">Campus spaces, governance</div>
                    </div>
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Navigation Links according to persona */}
          <nav className="hidden md:flex items-center gap-1 bg-slate-100/80 p-1 rounded-xl border border-slate-200/60">
            {currentRole === 'student' && (
              <>
                <button
                  onClick={() => setActiveTab('home')}
                  className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition ${activeTab === 'home' ? 'bg-white text-indigo-600 shadow-xs' : 'text-slate-600 hover:text-slate-900'}`}
                >
                  {t('navHome')}
                </button>
                <button
                  onClick={() => setActiveTab('explore')}
                  className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition ${activeTab === 'explore' ? 'bg-white text-indigo-600 shadow-xs' : 'text-slate-600 hover:text-slate-900'}`}
                >
                  {t('navExplore')}
                </button>
                <button
                  onClick={() => setActiveTab('tutor')}
                  className={`flex items-center gap-1 px-3 py-1.5 text-xs font-semibold rounded-lg transition ${activeTab === 'tutor' ? 'bg-white text-indigo-600 shadow-xs' : 'text-slate-600 hover:text-slate-900'}`}
                >
                  <Sparkles className="w-3.5 h-3.5 text-indigo-500" />
                  {t('navTutor')}
                </button>
                <button
                  onClick={() => setActiveTab('challenges')}
                  className={`flex items-center gap-1 px-3 py-1.5 text-xs font-semibold rounded-lg transition ${activeTab === 'challenges' ? 'bg-white text-indigo-600 shadow-xs' : 'text-slate-600 hover:text-slate-900'}`}
                >
                  <Trophy className="w-3.5 h-3.5 text-amber-500" />
                  {t('navChallenges')}
                </button>
                <button
                  onClick={() => setActiveTab('classes')}
                  className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition ${activeTab === 'classes' ? 'bg-white text-indigo-600 shadow-xs' : 'text-slate-600 hover:text-slate-900'}`}
                >
                  {t('navClasses')}
                </button>
              </>
            )}

            {currentRole === 'teacher' && (
              <>
                <button
                  onClick={() => setActiveTab('dashboard')}
                  className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition ${activeTab === 'dashboard' ? 'bg-white text-emerald-600 shadow-xs' : 'text-slate-600 hover:text-slate-900'}`}
                >
                  {t('navDashboard')}
                </button>
                <button
                  onClick={() => setActiveTab('resources')}
                  className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition ${activeTab === 'resources' ? 'bg-white text-emerald-600 shadow-xs' : 'text-slate-600 hover:text-slate-900'}`}
                >
                  {t('navMyResources')}
                </button>
                <button
                  onClick={() => setActiveTab('classrooms')}
                  className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition ${activeTab === 'classrooms' ? 'bg-white text-emerald-600 shadow-xs' : 'text-slate-600 hover:text-slate-900'}`}
                >
                  {t('navClassrooms')}
                </button>
                <button
                  onClick={() => setActiveTab('verification')}
                  className={`flex items-center gap-1 px-3 py-1.5 text-xs font-semibold rounded-lg transition ${activeTab === 'verification' ? 'bg-white text-emerald-600 shadow-xs' : 'text-slate-600 hover:text-slate-900'}`}
                >
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                  {t('navVerificationHub')}
                </button>
              </>
            )}

            {currentRole === 'institution' && (
              <>
                <button
                  onClick={() => setActiveTab('overview')}
                  className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition ${activeTab === 'overview' ? 'bg-white text-amber-600 shadow-xs' : 'text-slate-600 hover:text-slate-900'}`}
                >
                  {t('navOverview')}
                </button>
                <button
                  onClick={() => setActiveTab('departments')}
                  className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition ${activeTab === 'departments' ? 'bg-white text-amber-600 shadow-xs' : 'text-slate-600 hover:text-slate-900'}`}
                >
                  {t('navDepartments')}
                </button>
                <button
                  onClick={() => setActiveTab('faculty')}
                  className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition ${activeTab === 'faculty' ? 'bg-white text-amber-600 shadow-xs' : 'text-slate-600 hover:text-slate-900'}`}
                >
                  {t('navFaculty')}
                </button>
                <button
                  onClick={() => setActiveTab('governance')}
                  className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition ${activeTab === 'governance' ? 'bg-white text-amber-600 shadow-xs' : 'text-slate-600 hover:text-slate-900'}`}
                >
                  {t('navGovernance')}
                </button>
              </>
            )}
          </nav>

          {/* Right Action Icons & Badges */}
          <div className="flex items-center gap-2">
            
            {/* Quick Search */}
            <button
              onClick={onOpenSearch}
              className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200/70 text-slate-500 text-xs font-medium transition"
              title="Search educational resources"
            >
              <Search className="w-3.5 h-3.5 text-slate-500" />
              <span className="hidden lg:inline">{t('searchPlaceholder')}</span>
              <kbd className="hidden lg:inline-block px-1.5 py-0.5 text-[10px] bg-white border border-slate-200 rounded text-slate-400 font-mono">
                ⌘K
              </kbd>
            </button>

            {/* Trust Badges Explainer trigger */}
            <button
              onClick={onOpenTrustModal}
              className="p-2 rounded-xl text-slate-600 hover:text-indigo-600 hover:bg-indigo-50 transition"
              title="How EduVault verifies content"
            >
              <Award className="w-4 h-4 text-indigo-600" />
            </button>

            {/* Accessibility modal trigger */}
            <button
              onClick={onOpenAccessibility}
              className="p-2 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition"
              title="Accessibility & Display settings"
            >
              <Accessibility className="w-4 h-4" />
            </button>

            {/* Gemini AI Key Setup Button */}
            {onOpenGeminiKey && (
              <button
                onClick={onOpenGeminiKey}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-amber-500/10 via-indigo-500/10 to-violet-500/10 hover:from-amber-500/20 hover:to-indigo-500/20 text-slate-800 border border-indigo-200/80 transition active:scale-95 text-xs font-bold shadow-xs"
                title="Link Google Gemini API Key"
              >
                <Key className="w-3.5 h-3.5 text-amber-600" />
                <span className="hidden sm:inline">Gemini AI</span>
                <span className={`w-2 h-2 rounded-full ${hasStoredApiKey() ? 'bg-emerald-500 animate-pulse' : 'bg-amber-400'}`} />
              </button>
            )}

            {/* Language Selector */}
            <div className="relative">
              <button
                onClick={() => setLangDropdownOpen(!langDropdownOpen)}
                className="flex items-center gap-1.5 p-2 rounded-xl text-slate-700 hover:text-slate-900 hover:bg-slate-100 transition font-bold"
                title="Change language"
              >
                <Globe className="w-4 h-4 text-indigo-600" />
                <span className="text-[11px] font-bold uppercase">{currentLangObj.flag} {currentLangObj.code}</span>
              </button>

              {langDropdownOpen && (
                <div className="absolute right-0 mt-2 w-52 rounded-2xl bg-white shadow-2xl border border-slate-100 py-1.5 z-50 animate-in fade-in duration-100">
                  <div className="px-3 py-1.5 text-[10px] font-bold text-slate-400 uppercase tracking-wider border-b border-slate-100">
                    Select Language ({SUPPORTED_LANGUAGES.length})
                  </div>
                  <div className="max-h-64 overflow-y-auto py-1">
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

            {/* Student Gamification pills */}
            {currentRole === 'student' && (
              <div className="hidden sm:flex items-center gap-2 pl-2 border-l border-slate-200">
                <div className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-amber-50 text-amber-700 border border-amber-200/80 text-xs font-semibold" title="Learning streak">
                  <Flame className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                  <span>{studentProfile.streakDays}d</span>
                </div>
                <div className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200/80 text-xs font-semibold" title="EduVault XP">
                  <Trophy className="w-3.5 h-3.5 text-indigo-500" />
                  <span>{studentProfile.xp} XP</span>
                </div>
              </div>
            )}

            {/* Teacher Verification Status Pill */}
            {currentRole === 'teacher' && (
              <div className="hidden sm:flex items-center gap-2 pl-2 border-l border-slate-200">
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Verified Educator</span>
                </span>
              </div>
            )}

            {/* Institution Status Pill */}
            {currentRole === 'institution' && (
              <div className="hidden sm:flex items-center gap-2 pl-2 border-l border-slate-200">
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-50 text-amber-800 border border-amber-200">
                  <Building2 className="w-3.5 h-3.5 text-amber-600" />
                  <span>Campus Admin</span>
                </span>
              </div>
            )}

            {/* Direct Login Page Shortcut Button */}
            {onOpenLogin && (
              <button
                onClick={() => onOpenLogin(currentRole)}
                className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold transition"
                title="Open Category Login Portal"
              >
                <LogIn className="w-3.5 h-3.5" />
                <span>Sign In / Switch</span>
              </button>
            )}

            {/* User Avatar & Profile Dropdown */}
            <div className="relative pl-1">
              <button
                onClick={() => setProfileMenuOpen(!profileMenuOpen)}
                className="w-8 h-8 rounded-full overflow-hidden ring-2 ring-indigo-500/20 shadow-xs hover:ring-indigo-500/40 transition active:scale-95 flex items-center justify-center cursor-pointer"
                title="Account Menu & Switch Category"
              >
                {currentRole === 'teacher' ? (
                  <img src={teacherProfile.avatarUrl} alt={teacherProfile.fullName} className="w-full h-full object-cover" />
                ) : currentRole === 'institution' ? (
                  <div className="w-full h-full bg-gradient-to-tr from-amber-500 to-orange-600 text-white flex items-center justify-center text-xs font-bold">
                    🏫
                  </div>
                ) : (
                  <div className="w-full h-full bg-gradient-to-tr from-indigo-600 to-violet-600 text-white flex items-center justify-center text-xs font-bold">
                    {studentProfile.fullName.charAt(0)}
                  </div>
                )}
              </button>

              {/* Profile Dropdown Menu */}
              {profileMenuOpen && (
                <div className="absolute right-0 mt-2 w-64 rounded-2xl bg-white shadow-2xl border border-slate-100 p-2 z-50 animate-in fade-in zoom-in-95 duration-100 text-xs">
                  <div className="p-3 bg-slate-50 rounded-xl mb-1.5 border border-slate-100">
                    <div className="font-bold text-slate-900 text-sm">
                      {currentRole === 'teacher' ? teacherProfile.fullName : currentRole === 'institution' ? 'SRM IST Administrator' : studentProfile.fullName}
                    </div>
                    <div className="text-[11px] text-slate-500 truncate">
                      {currentRole === 'teacher' ? teacherProfile.email : currentRole === 'institution' ? 'admin@srmist.edu.in' : studentProfile.email}
                    </div>
                    <span className="inline-block mt-1.5 px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider bg-slate-200/80 text-slate-700">
                      {currentRole} Mode
                    </span>
                  </div>

                  <div className="space-y-0.5">
                    {onOpenGeminiKey && (
                      <button
                        onClick={() => {
                          setProfileMenuOpen(false);
                          onOpenGeminiKey();
                        }}
                        className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-left font-semibold text-slate-700 hover:bg-amber-50 hover:text-amber-800 transition"
                      >
                        <Key className="w-4 h-4 text-amber-600" />
                        <span>Link Gemini AI Key</span>
                      </button>
                    )}

                    {onOpenLogin && (
                      <button
                        onClick={() => {
                          setProfileMenuOpen(false);
                          onOpenLogin(currentRole);
                        }}
                        className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-left font-semibold text-slate-700 hover:bg-indigo-50 hover:text-indigo-700 transition"
                      >
                        <LogIn className="w-4 h-4 text-indigo-600" />
                        <span>Category Login Portal</span>
                      </button>
                    )}

                    <button
                      onClick={() => {
                        setProfileMenuOpen(false);
                        onResetToLanding();
                      }}
                      className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-left font-semibold text-slate-700 hover:bg-slate-100 transition"
                    >
                      <Layers className="w-4 h-4 text-slate-500" />
                      <span>Back to Landing Page</span>
                    </button>

                    <div className="my-1 border-t border-slate-100" />

                    <button
                      onClick={() => {
                        setProfileMenuOpen(false);
                        onResetToLanding();
                      }}
                      className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-left font-semibold text-rose-600 hover:bg-rose-50 transition"
                    >
                      <LogOut className="w-4 h-4" />
                      <span>Sign Out</span>
                    </button>
                  </div>
                </div>
              )}
            </div>

          </div>

        </div>
      </div>
    </header>
  );
};
