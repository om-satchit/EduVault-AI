import React, { useState, useEffect, useRef } from 'react';
import { 
  Search, 
  X, 
  BookOpen, 
  Star, 
  ShieldCheck, 
  ArrowRight, 
  Sparkles, 
  Layers, 
  HelpCircle, 
  Zap, 
  CornerDownLeft,
  Activity
} from 'lucide-react';
import { EducationalResource, AISearchSuggestion } from '../../types';
import { getAISearchSuggestions } from '../../services/aiService';

interface GlobalSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  resources: EducationalResource[];
  onOpenResource: (resource: EducationalResource, initialTab?: 'read' | 'diagram') => void;
  onAskAI: (query: string) => void;
}

export const GlobalSearchModal: React.FC<GlobalSearchModalProps> = ({
  isOpen,
  onClose,
  resources,
  onOpenResource,
  onAskAI
}) => {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState<AISearchSuggestion[]>([]);
  const [isLoadingSuggestions, setIsLoadingSuggestions] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState<number>(-1);
  const debounceRef = useRef<any>(null);

  // Fetch AI suggestions in real-time as user types
  useEffect(() => {
    if (!isOpen) return;

    if (debounceRef.current) clearTimeout(debounceRef.current);

    debounceRef.current = setTimeout(async () => {
      setIsLoadingSuggestions(true);
      try {
        const results = await getAISearchSuggestions(query, resources);
        setSuggestions(results);
      } catch (err) {
        console.warn('AI suggestions notice:', err);
      } finally {
        setIsLoadingSuggestions(false);
      }
    }, 120); // Fast 120ms debounce for snappy feel

    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [query, isOpen, resources]);

  if (!isOpen) return null;

  const filtered = resources.filter(r => 
    r.title.toLowerCase().includes(query.toLowerCase()) ||
    r.subject.toLowerCase().includes(query.toLowerCase()) ||
    r.topic.toLowerCase().includes(query.toLowerCase()) ||
    r.description.toLowerCase().includes(query.toLowerCase())
  );

  const handleSelectSuggestion = (sug: AISearchSuggestion) => {
    if (sug.relatedResourceId) {
      const targetRes = resources.find(r => r.id === sug.relatedResourceId);
      if (targetRes) {
        onOpenResource(targetRes, sug.type === 'diagram' ? 'diagram' : 'read');
        onClose();
        return;
      }
    }
    // If it's a general topic / question, trigger AI Tutor
    onAskAI(sug.query);
    onClose();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex(prev => (prev < suggestions.length - 1 ? prev + 1 : 0));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex(prev => (prev > 0 ? prev - 1 : suggestions.length - 1));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (selectedIndex >= 0 && selectedIndex < suggestions.length) {
        handleSelectSuggestion(suggestions[selectedIndex]);
      } else if (query.trim().length > 0) {
        onAskAI(query);
        onClose();
      }
    } else if (e.key === 'Escape') {
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center bg-slate-900/60 backdrop-blur-xs p-4 pt-14 sm:pt-20">
      <div 
        onKeyDown={handleKeyDown}
        className="w-full max-w-2xl bg-white rounded-3xl border border-slate-200 shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150"
      >
        
        {/* Search Input Bar */}
        <div className="p-4 border-b border-slate-200 flex items-center gap-3 bg-slate-50/50">
          <div className="relative">
            <Search className="w-5 h-5 text-indigo-600 shrink-0" />
            {isLoadingSuggestions && (
              <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-indigo-500 animate-ping" />
            )}
          </div>
          
          <input
            type="text"
            autoFocus
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setSelectedIndex(-1);
            }}
            placeholder="Search notes, topics, units, or ask EduVault AI..."
            className="flex-1 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-hidden bg-transparent font-medium"
          />

          {query && (
            <button 
              onClick={() => { setQuery(''); setSelectedIndex(-1); }} 
              className="text-slate-400 hover:text-slate-600 p-1"
            >
              <X className="w-4 h-4" />
            </button>
          )}

          <button
            onClick={onClose}
            className="text-xs font-semibold px-2 py-1 rounded-lg bg-slate-200/80 text-slate-600 hover:bg-slate-300"
          >
            ESC
          </button>
        </div>

        {/* Scrollable Body: AI Suggestions & Matching Resources */}
        <div className="max-h-[460px] overflow-y-auto p-4 space-y-4 text-xs">
          
          {/* Ask AI Direct CTA */}
          {query.trim().length > 0 && (
            <button
              onClick={() => {
                onAskAI(query);
                onClose();
              }}
              className="w-full p-3.5 rounded-2xl bg-gradient-to-r from-indigo-50 to-violet-50 hover:from-indigo-100 hover:to-violet-100 border border-indigo-100 text-indigo-950 flex items-center justify-between text-left transition font-semibold shadow-xs"
            >
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-xl bg-indigo-600 text-white flex items-center justify-center shrink-0 shadow-xs">
                  <Sparkles className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-slate-500 text-[11px] block">EduVault AI Tutor:</span>
                  <span className="font-extrabold text-xs">
                    Explain and solve &ldquo;<strong className="text-indigo-600">{query}</strong>&rdquo;
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-1.5 text-indigo-600 text-[11px] font-bold">
                <span>Ask AI</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </div>
            </button>
          )}

          {/* AI REAL-TIME SUGGESTIONS SECTION */}
          {suggestions.length > 0 && (
            <div className="space-y-1.5">
              <div className="flex items-center justify-between px-2 text-[10px] font-bold uppercase tracking-wider text-indigo-900/60">
                <span className="flex items-center gap-1.5">
                  <Sparkles className="w-3 h-3 text-indigo-600" />
                  <span>AI Real-Time Smart Suggestions & Concepts</span>
                </span>
                <span className="text-slate-400 font-normal">Use ↑↓ keys + Enter</span>
              </div>

              <div className="space-y-1">
                {suggestions.map((sug, idx) => {
                  const isSelected = selectedIndex === idx;
                  return (
                    <div
                      key={sug.id || idx}
                      onClick={() => handleSelectSuggestion(sug)}
                      onMouseEnter={() => setSelectedIndex(idx)}
                      className={`p-3 rounded-2xl border transition cursor-pointer flex items-center justify-between gap-3 ${
                        isSelected
                          ? 'bg-indigo-50/90 border-indigo-300 text-indigo-950 shadow-xs ring-1 ring-indigo-400/40'
                          : 'bg-white border-slate-100 hover:border-slate-200 hover:bg-slate-50 text-slate-800'
                      }`}
                    >
                      <div className="flex items-center gap-3 truncate">
                        <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${
                          sug.hasDiagram 
                            ? 'bg-indigo-100 text-indigo-700' 
                            : sug.type === 'exam_question'
                              ? 'bg-amber-100 text-amber-700'
                              : 'bg-slate-100 text-slate-700'
                        }`}>
                          {sug.hasDiagram ? (
                            <Layers className="w-4 h-4" />
                          ) : sug.type === 'exam_question' ? (
                            <Zap className="w-4 h-4" />
                          ) : (
                            <BookOpen className="w-4 h-4" />
                          )}
                        </div>

                        <div className="truncate">
                          <div className="flex items-center gap-2">
                            <span className="font-extrabold text-xs text-slate-900 truncate">
                              {sug.query}
                            </span>
                            <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-slate-100 text-slate-600 shrink-0">
                              {sug.category}
                            </span>
                            {sug.hasDiagram && (
                              <span className="px-1.5 py-0.5 rounded text-[9px] font-extrabold bg-indigo-100 text-indigo-700 border border-indigo-200 shrink-0 flex items-center gap-1">
                                <Layers className="w-2.5 h-2.5" />
                                <span>Diagram</span>
                              </span>
                            )}
                          </div>
                          <div className="text-[11px] text-slate-500 truncate mt-0.5">
                            {sug.subtitle}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-1.5 shrink-0">
                        {sug.hasDiagram ? (
                          <span className="px-2 py-1 rounded-lg bg-indigo-600 text-white font-extrabold text-[10px] flex items-center gap-1 shadow-xs">
                            <span>Open Diagram</span>
                            <ArrowRight className="w-3 h-3" />
                          </span>
                        ) : (
                          <span className="text-slate-400 text-xs hover:text-indigo-600 font-bold flex items-center gap-1">
                            <CornerDownLeft className="w-3.5 h-3.5" />
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* MATCHING VERIFIED RESOURCES */}
          <div className="space-y-1.5 pt-2">
            <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 px-2">
              Matching Syllabus Notes & Resources ({filtered.length})
            </div>

            {filtered.length === 0 ? (
              <div className="p-4 text-center text-slate-400 text-xs bg-slate-50 rounded-2xl border border-dashed border-slate-200">
                No direct resource title match. Choose an AI suggestion above or ask EduVault AI!
              </div>
            ) : (
              filtered.slice(0, 4).map((res) => (
                <div
                  key={res.id}
                  onClick={() => {
                    onOpenResource(res);
                    onClose();
                  }}
                  className="p-3 rounded-2xl hover:bg-slate-50 border border-slate-100 hover:border-slate-200 transition cursor-pointer flex items-center justify-between"
                >
                  <div className="truncate pr-2">
                    <div className="font-bold text-slate-900 text-xs truncate">{res.title}</div>
                    <div className="text-[11px] text-slate-500 mt-0.5 truncate">
                      {res.subject} → {res.topic} • by {res.teacherName}
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <span className="flex items-center gap-1 font-bold text-slate-700 bg-amber-50 px-2 py-0.5 rounded text-[11px]">
                      <Star className="w-3 h-3 text-amber-500 fill-amber-500" />
                      {res.rating}
                    </span>
                    <span className="text-indigo-600 font-bold text-[11px]">Open →</span>
                  </div>
                </div>
              ))
            )}
          </div>

        </div>

        {/* Modal Footer Keyhints */}
        <div className="px-4 py-2.5 bg-slate-50 border-t border-slate-100 text-[10px] text-slate-400 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span><kbd className="px-1 py-0.5 bg-white border border-slate-200 rounded font-mono">↑</kbd> <kbd className="px-1 py-0.5 bg-white border border-slate-200 rounded font-mono">↓</kbd> Navigate</span>
            <span><kbd className="px-1.5 py-0.5 bg-white border border-slate-200 rounded font-mono">↵</kbd> Select</span>
            <span><kbd className="px-1 py-0.5 bg-white border border-slate-200 rounded font-mono">esc</kbd> Close</span>
          </div>
          <span className="text-indigo-600 font-medium">⚡ Instant AI Suggestion Engine Active</span>
        </div>

      </div>
    </div>
  );
};
