import React, { useState } from 'react';
import { 
  Trophy, 
  Flame, 
  Target, 
  Sparkles, 
  HelpCircle, 
  Eye, 
  CheckCircle2, 
  ArrowRight, 
  RefreshCw, 
  Play, 
  Check,
  Award,
  Zap,
  Code2
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { ChallengeQuestion, StudentProfile } from '../../types';
import { sampleChallenges } from '../../data/mockData';

interface ChallengeMePageProps {
  studentProfile: StudentProfile;
  onUpdateProfile: (updated: Partial<StudentProfile>) => void;
  presetTopic?: string;
}

export const ChallengeMePage: React.FC<ChallengeMePageProps> = ({
  studentProfile,
  onUpdateProfile,
  presetTopic
}) => {
  const [topic, setTopic] = useState(presetTopic || 'Linked Lists');
  const [difficulty, setDifficulty] = useState<'Easy' | 'Medium' | 'Hard'>('Easy');
  const [challenges, setChallenges] = useState<ChallengeQuestion[]>(sampleChallenges);
  const [currentChallengeIndex, setCurrentChallengeIndex] = useState(0);

  // Challenge states
  const [activeHintIndex, setActiveHintIndex] = useState<number>(-1);
  const [showExplanation, setShowExplanation] = useState(false);
  const [userCode, setUserCode] = useState('');
  const [selectedQuizOption, setSelectedQuizOption] = useState<number | null>(null);
  const [isCompleted, setIsCompleted] = useState(false);

  const currentChallenge = challenges[currentChallengeIndex] || challenges[0];

  const handleNextChallenge = () => {
    setActiveHintIndex(-1);
    setShowExplanation(false);
    setSelectedQuizOption(null);
    setIsCompleted(false);
    setUserCode('');
    setCurrentChallengeIndex((prev) => (prev + 1) % challenges.length);
  };

  const handleGiveHint = () => {
    if (activeHintIndex < currentChallenge.hints.length - 1) {
      setActiveHintIndex(prev => prev + 1);
    }
  };

  const handleCompleteChallenge = () => {
    confetti({
      particleCount: 75,
      spread: 70,
      origin: { y: 0.6 }
    });
    setIsCompleted(true);
    onUpdateProfile({
      xp: studentProfile.xp + currentChallenge.xpReward,
      completedChallengesCount: studentProfile.completedChallengesCount + 1
    });
  };

  const handleGenerateCustomTopic = () => {
    // Generate fresh challenge
    setActiveHintIndex(-1);
    setShowExplanation(false);
    setSelectedQuizOption(null);
    setIsCompleted(false);
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-in fade-in duration-200">
      
      {/* Educational Progress Header */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white shadow-xl flex flex-col md:flex-row items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-8 h-8 rounded-xl bg-amber-400 text-slate-950 flex items-center justify-center font-bold text-sm">
              🎯
            </span>
            <h1 className="text-2xl font-extrabold tracking-tight">
              Challenge Me — Active Recall Practice
            </h1>
          </div>
          <p className="text-xs text-slate-300 mt-1">
            Strengthen your conceptual mental model with curriculum-aligned bite-sized challenges.
          </p>
        </div>

        {/* Clean Educational Metrics */}
        <div className="flex items-center gap-4 bg-white/10 px-5 py-3 rounded-2xl border border-white/15">
          <div className="flex items-center gap-1.5 text-xs font-bold text-amber-300">
            <Flame className="w-4 h-4 fill-amber-400 text-amber-400" />
            <span>{studentProfile.streakDays} day streak</span>
          </div>
          <div className="h-4 w-px bg-white/20" />
          <div className="flex items-center gap-1.5 text-xs font-bold text-indigo-200">
            <Trophy className="w-4 h-4 text-amber-400" />
            <span>{studentProfile.xp} XP</span>
          </div>
          <div className="h-4 w-px bg-white/20" />
          <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-300">
            <Target className="w-4 h-4 text-emerald-400" />
            <span>{studentProfile.completedChallengesCount} solved</span>
          </div>
        </div>
      </div>

      {/* Difficulty & Topic Config Bar */}
      <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-slate-700">Topic:</span>
          <select
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            className="px-3 py-1.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-800 bg-white"
          >
            <option value="Linked Lists">Linked Lists</option>
            <option value="Arrays">Arrays & Vectors</option>
            <option value="Operating Systems — Processes">OS Process Scheduling</option>
            <option value="Java OOP — Constructors">Java Constructors</option>
            <option value="DBMS Normalization">DBMS Normalization</option>
          </select>
        </div>

        {/* Difficulty Selector */}
        <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-xl">
          {(['Easy', 'Medium', 'Hard'] as const).map((diff) => (
            <button
              key={diff}
              onClick={() => setDifficulty(diff)}
              className={`px-3 py-1 rounded-lg text-xs font-bold transition ${
                difficulty === diff
                  ? diff === 'Easy'
                    ? 'bg-emerald-600 text-white shadow-xs'
                    : diff === 'Medium'
                      ? 'bg-amber-600 text-white shadow-xs'
                      : 'bg-rose-600 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {diff === 'Easy' ? '🟢 Easy' : diff === 'Medium' ? '🟡 Medium' : '🔴 Hard'}
            </button>
          ))}
        </div>

        <button
          onClick={handleNextChallenge}
          className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold transition"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Next Problem</span>
        </button>
      </div>

      {/* Main Challenge Card */}
      <div className="rounded-3xl bg-white border border-slate-200/90 shadow-sm p-6 sm:p-8 space-y-6">
        
        {/* Challenge Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider ${
                currentChallenge.difficulty === 'Easy'
                  ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                  : currentChallenge.difficulty === 'Medium'
                    ? 'bg-amber-50 text-amber-800 border border-amber-200'
                    : 'bg-rose-50 text-rose-800 border border-rose-200'
              }`}>
                {currentChallenge.difficulty}
              </span>
              <span className="text-xs font-semibold text-slate-400">
                {currentChallenge.subject} • {currentChallenge.topic}
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900">
              {currentChallenge.title}
            </h2>
          </div>

          <div className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-indigo-50 border border-indigo-200 text-indigo-700 text-xs font-bold shrink-0">
            <Zap className="w-3.5 h-3.5 text-indigo-600" />
            <span>+{currentChallenge.xpReward} XP Reward</span>
          </div>
        </div>

        {/* Challenge Prompt */}
        <div className="text-sm text-slate-700 leading-relaxed font-medium">
          {currentChallenge.description}
        </div>

        {/* Code Starter or Quiz Options */}
        {currentChallenge.starterCode ? (
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs text-slate-500 font-mono">
              <span className="flex items-center gap-1.5">
                <Code2 className="w-4 h-4 text-indigo-600" />
                Solution Editor ({currentChallenge.language || 'java'})
              </span>
              <span>Single pass O(N) constraint</span>
            </div>
            <textarea
              rows={6}
              value={userCode || currentChallenge.starterCode}
              onChange={(e) => setUserCode(e.target.value)}
              className="w-full p-4 rounded-2xl bg-slate-900 text-indigo-300 font-mono text-xs focus:outline-hidden focus:ring-2 focus:ring-indigo-500 shadow-inner"
            />
          </div>
        ) : currentChallenge.quizOptions ? (
          <div className="space-y-2.5">
            <span className="text-xs font-bold text-slate-700">Choose the correct answer:</span>
            <div className="space-y-2">
              {currentChallenge.quizOptions.map((opt, idx) => {
                const isSelected = selectedQuizOption === idx;
                const isCorrect = currentChallenge.correctOptionIndex === idx;
                return (
                  <button
                    key={idx}
                    onClick={() => setSelectedQuizOption(idx)}
                    className={`w-full text-left p-3.5 rounded-2xl border text-xs font-medium transition ${
                      selectedQuizOption !== null
                        ? isCorrect
                          ? 'bg-emerald-50 border-emerald-400 text-emerald-950 font-bold'
                          : isSelected
                            ? 'bg-rose-50 border-rose-400 text-rose-950 font-bold'
                            : 'bg-white border-slate-200 text-slate-400'
                        : 'bg-white border-slate-200 hover:border-indigo-400 hover:bg-indigo-50/40 text-slate-800'
                    }`}
                  >
                    <span className="font-bold mr-2">{String.fromCharCode(65 + idx)}.</span>
                    {opt}
                  </button>
                );
              })}
            </div>
          </div>
        ) : null}

        {/* Hints Reveal */}
        {activeHintIndex >= 0 && (
          <div className="p-4 rounded-2xl bg-amber-50/80 border border-amber-200 space-y-2 text-xs animate-in fade-in duration-150">
            <span className="font-bold text-amber-900 flex items-center gap-1.5">
              💡 Hint {activeHintIndex + 1} of {currentChallenge.hints.length}:
            </span>
            <p className="text-amber-800">
              {currentChallenge.hints[activeHintIndex]}
            </p>
          </div>
        )}

        {/* Full Explanation Reveal */}
        {showExplanation && (
          <div className="p-4 rounded-2xl bg-indigo-50/80 border border-indigo-200 space-y-2 text-xs animate-in fade-in duration-150">
            <span className="font-bold text-indigo-950 flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-indigo-600" />
              Complete Theoretical Solution:
            </span>
            <p className="text-indigo-900 leading-relaxed">
              {currentChallenge.explanation}
            </p>
          </div>
        )}

        {/* Footer Actions: Try Challenge, Give Hint, Show Explanation */}
        <div className="pt-4 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <button
              onClick={handleGiveHint}
              disabled={activeHintIndex >= currentChallenge.hints.length - 1}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold transition disabled:opacity-50"
            >
              <HelpCircle className="w-4 h-4 text-amber-500" />
              <span>Give Hint ({activeHintIndex + 1}/{currentChallenge.hints.length})</span>
            </button>

            <button
              onClick={() => setShowExplanation(!showExplanation)}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold transition"
            >
              <Eye className="w-4 h-4 text-slate-500" />
              <span>{showExplanation ? 'Hide Explanation' : 'Show Explanation'}</span>
            </button>
          </div>

          <div className="flex items-center gap-2">
            {!isCompleted ? (
              <button
                onClick={handleCompleteChallenge}
                className="flex items-center gap-1.5 px-6 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-bold text-xs shadow-md shadow-emerald-600/20 transition transform active:scale-95"
              >
                <Check className="w-4 h-4 stroke-[3]" />
                <span>Submit & Earn XP</span>
              </button>
            ) : (
              <button
                onClick={handleNextChallenge}
                className="flex items-center gap-1.5 px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-md shadow-indigo-600/20 transition"
              >
                <span>Solved! Next Challenge</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

      </div>

    </div>
  );
};
