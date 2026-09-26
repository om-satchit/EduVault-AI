import React, { useState, useEffect, useRef } from 'react';
import { 
  Search, 
  Sparkles, 
  ArrowRight, 
  BookOpen, 
  Trophy, 
  Flame, 
  ShieldCheck, 
  Lock, 
  Star, 
  ChevronRight,
  TrendingUp,
  BrainCircuit,
  Compass,
  Layers,
  Zap,
  CornerDownLeft,
  X
} from 'lucide-react';
import { StudentProfile, EducationalResource, AISearchSuggestion } from '../../types';
import { SUBJECT_HIERARCHY } from '../../data/mockData';
import { getTranslation } from '../../utils/i18n';
import { getAISearchSuggestions } from '../../services/aiService';

interface StudentHomeProps {
  studentProfile: StudentProfile;
  resources: EducationalResource[];
  onSelectSubject: (subject: string) => void;
  onSearchSubmit: (query: string) => void;
  onOpenResource: (resource: EducationalResource, initialTab?: 'read' | 'diagram') => void;
  onNavigateToChallenges: () => void;
  currentLanguage?: string;
}

export const StudentHome: React.FC<StudentHomeProps> = ({
  studentProfile,
  resources,
  onSelectSubject,
  onSearchSubmit,
  onOpenResource,
  onNavigateToChallenges,
  currentLanguage = 'en'
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [suggestions, setSuggestions] = useState<AISearchSuggestion[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isLoadingSuggestions, setIsLoadingSuggestions] = useState(false);
  const searchContainerRef = useRef<HTMLDivElement>(null);
  const debounceRef = useRef<any>(null);

  const t = (key: string) => getTranslation(currentLanguage, key);

  const quickExamples = [
    'Linked Lists memory diagram & pointers',
    'Java OOP constructor chaining',
    'Process scheduling Round Robin',
    'DBMS Normalization 1NF to BCNF'
  ];

  // Real-time AI suggestions
  useEffect(() => {
    if (!searchQuery.trim()) {
      setSuggestions([]);
      return;
    }

    if (debounceRef.current) clearTimeout(debounceRef.current);

    debounceRef.current = setTimeout(async () => {
      setIsLoadingSuggestions(true);
      try {
        const results = await getAISearchSuggestions(searchQuery, resources);
        setSuggestions(results);
      } catch (err) {
        console.warn('StudentHome suggestions notice:', err);
      } finally {
        setIsLoadingSuggestions(false);
      }
    }, 120);

    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [searchQuery, resources]);

  // Click outside listener to dismiss suggestions
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (searchContainerRef.current && !searchContainerRef.current.contains(e.target as Node)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setShowSuggestions(false);
      onSearchSubmit(searchQuery);
    }
  };

  const handleExampleClick = (example: string) => {
    setSearchQuery(example);
    setShowSuggestions(false);
    onSearchSubmit(example);
  };

  const handleSelectSuggestion = (sug: AISearchSuggestion) => {
    setShowSuggestions(false);
    if (sug.relatedResourceId) {
      const res = resources.find(r => r.id === sug.relatedResourceId);
      if (res) {
        onOpenResource(res, sug.type === 'diagram' ? 'diagram' : 'read');
        return;
      }
    }
    setSearchQuery(sug.query);
    onSearchSubmit(sug.query);
  };

  // Trending verified resources
  const trendingResources = resources.slice(0, 3);


  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12 animate-in fade-in duration-200">
      
      {/* Hero Greeting & Intelligent Search */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-200/80 text-indigo-700 text-xs font-semibold">
          <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
          <span>EduVault AI Intelligent Academic Search</span>
        </div>

        <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-slate-900 leading-tight">
          Hey, {studentProfile.fullName.split(' ')[0]}! {t('studyPrompt')} 👋
        </h1>

        <p className="text-sm sm:text-base text-slate-600 font-normal">
          {t('askSubtitle')}
        </p>

        {/* Large AI Search Box with Live AI Suggestions */}
        <div ref={searchContainerRef} className="pt-4 max-w-2xl mx-auto relative">
          <form onSubmit={handleSearch} className="relative">
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-indigo-600 transition-colors">
                <Search className="w-5 h-5" />
              </div>
              
              <input
                type="text"
                value={searchQuery}
                onFocus={() => {
                  if (searchQuery.trim().length > 0 || suggestions.length > 0) {
                    setShowSuggestions(true);
                  }
                }}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setShowSuggestions(true);
                }}
                placeholder={t('askInputPlaceholder')}
                className="w-full pl-12 pr-28 py-4 rounded-2xl bg-white border-2 border-slate-200 shadow-lg shadow-indigo-500/5 text-sm sm:text-base text-slate-900 placeholder:text-slate-400 focus:outline-hidden focus:border-indigo-600 focus:ring-4 focus:ring-indigo-500/10 transition-all font-medium"
              />

              {searchQuery && (
                <button
                  type="button"
                  onClick={() => {
                    setSearchQuery('');
                    setSuggestions([]);
                    setShowSuggestions(false);
                  }}
                  className="absolute inset-y-0 right-28 pr-3 flex items-center text-slate-400 hover:text-slate-600"
                >
                  <X className="w-4 h-4" />
                </button>
              )}

              <button
                type="submit"
                className="absolute inset-y-2 right-2 px-4 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 text-white font-bold text-xs shadow-md shadow-indigo-600/20 transition flex items-center gap-1.5 cursor-pointer"
              >
                <span>{t('askAiBtn')}</span>
                <Sparkles className="w-3.5 h-3.5" />
              </button>
            </div>
          </form>

          {/* Real-time Floating AI Suggestions Dropdown */}
          {showSuggestions && suggestions.length > 0 && (
            <div className="absolute left-0 right-0 mt-2 z-40 bg-white rounded-3xl border border-slate-200 shadow-2xl overflow-hidden p-2 text-left animate-in fade-in zoom-in-95 duration-100">
              <div className="px-3 py-1.5 flex items-center justify-between text-[10px] font-extrabold uppercase tracking-wider text-indigo-900/60 border-b border-slate-100 mb-1">
                <span className="flex items-center gap-1.5">
                  <Sparkles className="w-3 h-3 text-indigo-600" />
                  <span>Real-Time AI Suggestions & Concepts</span>
                </span>
                <span className="text-slate-400 font-normal">Click to explore</span>
              </div>

              <div className="space-y-1 max-h-72 overflow-y-auto">
                {suggestions.map((sug) => (
                  <div
                    key={sug.id}
                    onClick={() => handleSelectSuggestion(sug)}
                    className="p-2.5 rounded-2xl hover:bg-indigo-50/80 border border-transparent hover:border-indigo-100 transition cursor-pointer flex items-center justify-between gap-3 text-xs"
                  >
                    <div className="flex items-center gap-2.5 truncate">
                      <div className={`w-7 h-7 rounded-xl flex items-center justify-center shrink-0 ${
                        sug.hasDiagram 
                          ? 'bg-indigo-100 text-indigo-700' 
                          : 'bg-slate-100 text-slate-700'
                      }`}>
                        {sug.hasDiagram ? <Layers className="w-3.5 h-3.5" /> : <BookOpen className="w-3.5 h-3.5" />}
                      </div>

                      <div className="truncate">
                        <div className="flex items-center gap-2">
                          <span className="font-extrabold text-slate-900 truncate">{sug.query}</span>
                          <span className="px-1.5 py-0.2 rounded text-[9px] font-bold bg-slate-100 text-slate-600 shrink-0">
                            {sug.category}
                          </span>
                        </div>
                        <div className="text-[10px] text-slate-500 truncate mt-0.5">
                          {sug.subtitle}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-1 shrink-0">
                      {sug.hasDiagram ? (
                        <span className="px-2 py-0.5 rounded-md bg-indigo-600 text-white font-extrabold text-[9px] flex items-center gap-1 shadow-xs">
                          <span>Diagram</span>
                          <ArrowRight className="w-2.5 h-2.5" />
                        </span>
                      ) : (
                        <span className="text-indigo-600 font-bold text-[11px] flex items-center gap-1">
                          <span>Ask AI</span>
                          <ArrowRight className="w-3 h-3" />
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Preset Example Pills */}
          <div className="mt-3 flex flex-wrap items-center justify-center gap-2">
            <span className="text-[11px] font-semibold text-slate-400">{t('tryAsking')}</span>
            {quickExamples.map((ex) => (
              <button
                key={ex}
                type="button"
                onClick={() => handleExampleClick(ex)}
                className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-indigo-50 text-slate-600 hover:text-indigo-700 text-xs font-medium border border-slate-200/80 transition"
              >
                &ldquo;{ex}&rdquo;
              </button>
            ))}
          </div>
        </div>


      </div>

      {/* Gamification Banner / Learning Streak */}
      <div className="rounded-3xl bg-gradient-to-r from-indigo-900 via-indigo-800 to-slate-900 text-white p-6 sm:p-8 shadow-xl flex flex-col sm:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-amber-500/20 border border-amber-400/30 flex items-center justify-center text-amber-400 text-2xl shadow-inner">
            <Flame className="w-8 h-8 fill-amber-400 text-amber-400" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-xl font-bold">You are on a {studentProfile.streakDays}-day streak!</h3>
              <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-amber-400 text-slate-950">
                {t('streakActive')}
              </span>
            </div>
            <p className="text-xs text-indigo-200 mt-1">
              Earned {studentProfile.xp} XP • {studentProfile.completedChallengesCount} academic challenges completed
            </p>
          </div>
        </div>

        <button
          onClick={onNavigateToChallenges}
          className="flex items-center gap-2 px-5 py-3 rounded-2xl bg-white text-indigo-900 hover:bg-indigo-50 font-bold text-xs shadow-lg transition active:scale-95 shrink-0 cursor-pointer"
        >
          <Trophy className="w-4 h-4 text-amber-500" />
          <span>{t('challengeBannerBtn')}</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>

      {/* What do you want to study? Subject Cards */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">
              {t('studyPrompt')}
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              {t('studySubtitle')}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {Object.entries(SUBJECT_HIERARCHY).map(([name, data]) => (
            <div
              key={name}
              onClick={() => onSelectSubject(name)}
              className="group rounded-3xl bg-white border border-slate-200/80 p-6 shadow-xs hover:shadow-xl hover:border-indigo-300 transition-all duration-300 cursor-pointer flex flex-col justify-between hover:-translate-y-1"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 rounded-2xl bg-slate-50 text-2xl flex items-center justify-center group-hover:scale-110 transition-transform shadow-xs">
                    {data.icon}
                  </div>
                  <span className="text-xs font-semibold text-slate-400 group-hover:text-indigo-600 transition-colors flex items-center gap-1">
                    <span>Explore Units</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </span>
                </div>

                <h3 className="text-xl font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">
                  {name}
                </h3>
                <p className="text-xs text-slate-500 mt-2 line-clamp-2 leading-relaxed">
                  {data.description}
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                <span className="font-semibold text-slate-700">
                  {Object.keys(data.units).length} {t('coreUnits')}
                </span>
                <span className="font-medium text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-md">
                  ✓ {t('aiVerified')}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Trending & Peer-Verified Highlights */}
      <div className="space-y-4 pt-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-indigo-600" />
            <h3 className="text-lg font-bold text-slate-900">
              {t('trendingTitle')}
            </h3>
          </div>
          <span className="text-xs text-slate-400">Based on active campus cohorts</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {trendingResources.map((res) => (
            <div
              key={res.id}
              onClick={() => onOpenResource(res)}
              className="rounded-3xl bg-white border border-slate-200/80 p-6 shadow-xs hover:shadow-lg hover:border-indigo-300 transition cursor-pointer flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-3">
                  <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-slate-100 text-slate-600">
                    {res.type.replace('_', ' ')}
                  </span>
                  <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                    <ShieldCheck className="w-3 h-3 text-emerald-600" />
                    {t('aiVerified')}
                  </span>
                </div>

                <h4 className="font-bold text-slate-900 text-base line-clamp-2 hover:text-indigo-600">
                  {res.title}
                </h4>

                <p className="text-xs text-slate-500 mt-2 line-clamp-2">
                  {res.description}
                </p>

                <div className="mt-4 flex items-center gap-2 text-xs text-slate-400">
                  <span>by <strong className="text-slate-700 font-semibold">{res.teacherName}</strong></span>
                  <span>•</span>
                  <span>{res.difficulty}</span>
                </div>
              </div>

              <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                <div className="flex items-center gap-3">
                  <span className="flex items-center gap-1 font-bold text-slate-800">
                    <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                    {res.rating}
                  </span>
                  <span className="text-slate-400">
                    👥 {res.studentsCount} {t('learnersCount')}
                  </span>
                </div>
                <span className="text-xs font-bold text-indigo-600 hover:text-indigo-700">
                  {t('openResource')}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};
