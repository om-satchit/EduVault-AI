import React, { useState, useMemo } from 'react';
import { 
  ChevronRight, 
  Layers, 
  Filter, 
  Star, 
  ShieldCheck, 
  Award, 
  CheckCircle2, 
  Clock, 
  Users, 
  FileText, 
  Video, 
  Presentation, 
  BookOpen, 
  HelpCircle, 
  Trophy, 
  Headphones,
  SlidersHorizontal,
  ArrowUpDown,
  Search,
  Check
} from 'lucide-react';
import { EducationalResource, ResourceType, DifficultyLevel } from '../../types';
import { SUBJECT_HIERARCHY } from '../../data/mockData';

interface TopicHierarchyExplorerProps {
  resources: EducationalResource[];
  selectedSubject: string;
  onSelectSubject: (subject: string) => void;
  onOpenResource: (resource: EducationalResource) => void;
  onOpenTrustModal: () => void;
}

export const TopicHierarchyExplorer: React.FC<TopicHierarchyExplorerProps> = ({
  resources,
  selectedSubject,
  onSelectSubject,
  onOpenResource,
  onOpenTrustModal
}) => {
  const currentSubjectData = SUBJECT_HIERARCHY[selectedSubject] || SUBJECT_HIERARCHY['Computer Science'];
  
  const unitsList = Object.keys(currentSubjectData.units);
  const [selectedUnit, setSelectedUnit] = useState<string>(unitsList[0] || 'Unit 2');
  
  const currentUnitData = currentSubjectData.units[selectedUnit] || currentSubjectData.units[unitsList[0]];
  const chaptersList = Object.keys(currentUnitData.chapters);
  const [selectedChapter, setSelectedChapter] = useState<string>(chaptersList[0] || 'Chapter 1');
  
  const currentChapterData = currentUnitData.chapters[selectedChapter] || currentUnitData.chapters[chaptersList[0]];
  const topicsList = currentChapterData.topics;
  const [selectedTopic, setSelectedTopic] = useState<string>(topicsList[0] || 'Linked Lists');

  // Multi-select learning format preferences
  const learningFormats: { type: ResourceType | 'audio' | 'challenge'; label: string; icon: string }[] = [
    { type: 'notes', label: 'Short Notes', icon: '📄' },
    { type: 'video', label: 'Videos', icon: '📹' },
    { type: 'ppt', label: 'PPTs', icon: '📊' },
    { type: 'textbook', label: 'Detailed Notes', icon: '📘' },
    { type: 'question_bank', label: 'Practice Questions', icon: '🧠' },
    { type: 'quiz', label: 'Challenges', icon: '🎯' },
    { type: 'audio', label: 'Audio / Accessible', icon: '🎧' },
  ];

  const [selectedFormats, setSelectedFormats] = useState<string[]>(['notes', 'question_bank', 'ppt', 'video']);
  const [sortBy, setSortBy] = useState<'rating' | 'most_used' | 'recently_verified'>('rating');
  const [difficultyFilter, setDifficultyFilter] = useState<'all' | DifficultyLevel>('all');
  const [languageFilter, setLanguageFilter] = useState<string>('all');

  const toggleFormat = (format: string) => {
    setSelectedFormats(prev => 
      prev.includes(format) ? prev.filter(f => f !== format) : [...prev, format]
    );
  };

  // Filtered & Sorted Resources
  const filteredResources = useMemo(() => {
    return resources.filter(r => {
      // match subject
      if (r.subject !== selectedSubject) return false;
      // match topic if specifically set
      if (selectedTopic && r.topic !== selectedTopic && !r.title.toLowerCase().includes(selectedTopic.toLowerCase().split(' ')[0])) {
        // loose match or strict match
      }
      // difficulty filter
      if (difficultyFilter !== 'all' && r.difficulty !== difficultyFilter) return false;
      // language filter
      if (languageFilter !== 'all' && r.language.toLowerCase() !== languageFilter.toLowerCase()) return false;
      // format filter (if matches type)
      if (selectedFormats.length > 0) {
        const matchesType = selectedFormats.includes(r.type) || 
                            (selectedFormats.includes('audio') && r.estimatedReadMinutes) ||
                            (selectedFormats.includes('challenge') && (r.type === 'quiz' || r.type === 'question_bank'));
        if (!matchesType) return false;
      }
      return true;
    }).sort((a, b) => {
      if (sortBy === 'rating') return b.rating - a.rating;
      if (sortBy === 'most_used') return b.studentsCount - a.studentsCount;
      return b.lastVerifiedDate.localeCompare(a.lastVerifiedDate);
    });
  }, [resources, selectedSubject, selectedTopic, difficultyFilter, languageFilter, selectedFormats, sortBy]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-in fade-in duration-200">
      
      {/* Subject Switching & Breadcrumb */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-2xl bg-white border border-slate-200 shadow-xs">
        <div className="flex items-center gap-2 text-xs font-semibold text-slate-500 overflow-x-auto">
          <span className="text-slate-900 font-bold flex items-center gap-1.5">
            <Layers className="w-4 h-4 text-indigo-600" />
            Curriculum Navigator:
          </span>
          <select 
            value={selectedSubject} 
            onChange={(e) => onSelectSubject(e.target.value)}
            className="font-bold text-indigo-600 bg-indigo-50 px-2 py-1 rounded-lg border border-indigo-200 focus:outline-hidden"
          >
            {Object.keys(SUBJECT_HIERARCHY).map(s => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
          <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
          <span className="text-slate-800 font-medium">{selectedUnit}</span>
          <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
          <span className="text-indigo-600 font-bold">{selectedTopic}</span>
        </div>

        <button
          onClick={onOpenTrustModal}
          className="flex items-center gap-1 text-xs font-semibold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 px-3 py-1.5 rounded-xl border border-emerald-200 transition"
        >
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
          <span>Understanding Verification Badges</span>
        </button>
      </div>

      {/* Step 1: Choose a Topic Drilldown (Subject -> Unit -> Chapter -> Topic) */}
      <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-xs space-y-5">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <span className="w-6 h-6 rounded-lg bg-indigo-100 text-indigo-700 flex items-center justify-center text-xs font-bold">1</span>
            Choose a topic to master
          </h3>
          <span className="text-xs text-slate-400">
            {currentSubjectData.icon} {selectedSubject}
          </span>
        </div>

        {/* Units Tabs */}
        <div className="flex flex-wrap items-center gap-2 border-b border-slate-100 pb-3">
          {unitsList.map((u) => (
            <button
              key={u}
              onClick={() => {
                setSelectedUnit(u);
                const nextChapters = Object.keys(currentSubjectData.units[u].chapters);
                setSelectedChapter(nextChapters[0]);
                setSelectedTopic(currentSubjectData.units[u].chapters[nextChapters[0]].topics[0]);
              }}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition ${
                selectedUnit === u
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'bg-slate-50 text-slate-600 hover:bg-slate-100'
              }`}
            >
              {currentSubjectData.units[u].name}
            </button>
          ))}
        </div>

        {/* Topic Pills */}
        <div className="space-y-2">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
            Available Topics in {selectedUnit}:
          </span>
          <div className="flex flex-wrap items-center gap-2">
            {topicsList.map((top) => (
              <button
                key={top}
                onClick={() => setSelectedTopic(top)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition ${
                  selectedTopic === top
                    ? 'bg-slate-900 text-white shadow-xs ring-2 ring-slate-900/20'
                    : 'bg-white border border-slate-200 text-slate-700 hover:border-slate-400'
                }`}
              >
                {top}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Step 2: "How would you like to learn?" Multi-select Cards */}
      <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <span className="w-6 h-6 rounded-lg bg-indigo-100 text-indigo-700 flex items-center justify-center text-xs font-bold">2</span>
              How would you like to learn?
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">Select one or more modalities to filter your results</p>
          </div>
          <span className="text-[11px] font-semibold text-slate-400">
            {selectedFormats.length} formats active
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2.5">
          {learningFormats.map((fmt) => {
            const isSelected = selectedFormats.includes(fmt.type);
            return (
              <button
                key={fmt.type}
                onClick={() => toggleFormat(fmt.type)}
                className={`p-3 rounded-2xl border text-center transition flex flex-col items-center justify-center relative ${
                  isSelected
                    ? 'bg-indigo-50/80 border-indigo-400 shadow-xs ring-2 ring-indigo-500/20'
                    : 'bg-white border-slate-200 hover:bg-slate-50 opacity-70'
                }`}
              >
                {isSelected && (
                  <span className="absolute top-1.5 right-1.5 w-4 h-4 bg-indigo-600 text-white rounded-full flex items-center justify-center text-[10px]">
                    <Check className="w-2.5 h-2.5 stroke-[3]" />
                  </span>
                )}
                <span className="text-2xl mb-1">{fmt.icon}</span>
                <span className={`text-[11px] font-bold block ${isSelected ? 'text-indigo-950' : 'text-slate-700'}`}>
                  {fmt.label}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Step 3: Filter & Sort Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-4 rounded-2xl bg-white border border-slate-200 shadow-xs text-xs">
        <div className="flex items-center gap-3">
          <span className="font-bold text-slate-700 flex items-center gap-1.5">
            <SlidersHorizontal className="w-3.5 h-3.5 text-slate-500" />
            Filters:
          </span>

          {/* Difficulty */}
          <select
            value={difficultyFilter}
            onChange={(e) => setDifficultyFilter(e.target.value as any)}
            className="px-2.5 py-1.5 rounded-lg border border-slate-200 font-medium text-slate-700 bg-white"
          >
            <option value="all">All Difficulties</option>
            <option value="Beginner">Beginner</option>
            <option value="Intermediate">Intermediate</option>
            <option value="Advanced">Advanced</option>
          </select>

          {/* Language */}
          <select
            value={languageFilter}
            onChange={(e) => setLanguageFilter(e.target.value)}
            className="px-2.5 py-1.5 rounded-lg border border-slate-200 font-medium text-slate-700 bg-white"
          >
            <option value="all">All Languages</option>
            <option value="english">English</option>
            <option value="hindi">Hindi</option>
            <option value="tamil">Tamil</option>
          </select>
        </div>

        {/* Sort by */}
        <div className="flex items-center gap-2">
          <span className="text-slate-400 flex items-center gap-1">
            <ArrowUpDown className="w-3.5 h-3.5" />
            Sort by:
          </span>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="px-2.5 py-1.5 rounded-lg border border-slate-200 font-bold text-slate-800 bg-white"
          >
            <option value="rating">Highest Community Rating</option>
            <option value="most_used">Most Used by Students</option>
            <option value="recently_verified">Recently Verified (2026)</option>
          </select>
        </div>
      </div>

      {/* Step 4: Beautiful Resource Results Grid */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-extrabold text-slate-900 tracking-tight">
            Verified Resources for "{selectedTopic}" ({filteredResources.length})
          </h3>
          <span className="text-xs text-slate-400">
            Ratings reflect community reviews • Not absolute truth
          </span>
        </div>

        {filteredResources.length === 0 ? (
          <div className="p-12 text-center rounded-3xl bg-white border border-slate-200 space-y-3">
            <BookOpen className="w-12 h-12 text-slate-300 mx-auto" />
            <h4 className="text-base font-bold text-slate-800">No resources found matching these filters</h4>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              Try enabling more learning formats or switching the difficulty level to view available verified notes.
            </p>
            <button
              onClick={() => {
                setSelectedFormats(['notes', 'question_bank', 'ppt', 'video', 'textbook']);
                setDifficultyFilter('all');
              }}
              className="px-4 py-2 rounded-xl bg-indigo-50 text-indigo-700 text-xs font-semibold hover:bg-indigo-100"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredResources.map((res) => (
              <div
                key={res.id}
                className="group rounded-3xl bg-white border border-slate-200/90 p-6 shadow-xs hover:shadow-2xl hover:border-indigo-400 transition-all duration-300 flex flex-col justify-between hover:-translate-y-1"
              >
                <div>
                  
                  {/* Top Type & Trust Badges */}
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-slate-100 text-slate-700">
                      {res.type.replace('_', ' ')} • {res.difficulty}
                    </span>

                    {/* Trust Badges */}
                    <div className="flex items-center gap-1">
                      {res.isAiVerified && (
                        <span 
                          onClick={(e) => { e.stopPropagation(); onOpenTrustModal(); }}
                          className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 cursor-pointer hover:bg-emerald-100"
                          title="Verified by AI Audit Pipeline"
                        >
                          <ShieldCheck className="w-3 h-3 text-emerald-600" />
                          AI Verified
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Title */}
                  <h4 
                    onClick={() => onOpenResource(res)}
                    className="font-bold text-slate-900 text-base line-clamp-2 group-hover:text-indigo-600 transition-colors cursor-pointer"
                  >
                    {res.title}
                  </h4>

                  {/* Description */}
                  <p className="text-xs text-slate-500 mt-2 line-clamp-2 leading-relaxed">
                    {res.description}
                  </p>

                  {/* Metadata & Educator */}
                  <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                    <span className="truncate">
                      by <strong className="text-slate-800 font-semibold">{res.teacherName}</strong>
                    </span>
                    <span className="text-[11px] text-slate-400 shrink-0">
                      Last verified: {res.lastVerifiedDate}
                    </span>
                  </div>
                </div>

                {/* Footer with Rating, Learners & CTA */}
                <div className="mt-5 pt-4 border-t border-slate-100 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-3">
                    <span className="flex items-center gap-1 font-bold text-slate-800 bg-amber-50 px-2 py-0.5 rounded-md border border-amber-200/60" title="Community feedback score">
                      <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                      {res.rating}
                    </span>
                    <span className="text-slate-400 font-medium">
                      👥 {res.studentsCount.toLocaleString()} learners
                    </span>
                  </div>

                  <button
                    onClick={() => onOpenResource(res)}
                    className="px-3.5 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-xs transition transform active:scale-95"
                  >
                    Open Resource
                  </button>
                </div>

              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  );
};
